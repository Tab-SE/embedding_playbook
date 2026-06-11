import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import type { JWT } from "next-auth/jwt";

import { jwtSign } from "@/libs/crypto";

// Maps each demo to the Tableau site whose MCP server it routes to.
// All demos except ubl-superstore live on the embeddingplaybook (main) site.
// EACanada has its own MCP server but no demo currently routes chat through it;
// kept here so wiring up an EACanada-backed demo only requires this map.
type SiteKey = "main" | "eacanada" | "ubl";

const DEMO_SITE: Record<string, SiteKey> = {
  documentation: "main",
  superstore: "main",
  makana: "main",
  cumulus: "main",
  servicedesk: "main",
  "ubl-superstore": "ubl",
};

// Two MCP auth modes are supported here, picked per-site:
//
// - "passthrough" — sends the user's existing Tableau REST credentials token
//   in `X-Tableau-Auth`. Simple, but the MCP server validates by calling
//   `/sessions/current`, which Tableau Cloud returns HTTP 500 on for any user
//   that isn't a site admin. Workable on sites where the demo users are admins
//   (e.g. main embeddingplaybook).
//
// - "direct-trust" — Next.js mints a per-request Connected App JWT with the
//   user's identity in `sub`, sends it as `Authorization: Bearer <jwt>`. The
//   MCP server, which holds the same Connected App secret, redeems that JWT
//   via Tableau's `/auth/signin` per request — bypassing the broken
//   `/sessions/current` validation entirely. Works for any user role.
type AuthMode = "passthrough" | "direct-trust";

interface SiteWiring {
  url: string | undefined;
  authMode: AuthMode;
  // Where this site's REST credentials token / per-site claims live on the
  // NextAuth JWT. Used by passthrough to source the rest_key, and by
  // direct-trust to source UAF/groups for the Bearer JWT.
  tokenKey: "tableau" | "tableau_eacanada" | "tableau_ubl";
  // Connected App credentials for direct-trust. Unused for passthrough.
  connectedApp?: {
    clientId: string | undefined;
    secretId: string | undefined;
    secretValue: string | undefined;
  };
}

const siteWiring = (site: SiteKey): SiteWiring => {
  switch (site) {
    case "main":
      return {
        url: process.env.TABLEAU_MCP_URL,
        authMode: "passthrough",
        tokenKey: "tableau",
      };
    case "eacanada":
      return {
        url: process.env.TABLEAU_MCP_URL_EACANADA,
        authMode: "passthrough",
        tokenKey: "tableau_eacanada",
      };
    case "ubl":
      return {
        url: process.env.TABLEAU_MCP_URL_UBL,
        authMode: "passthrough",
        tokenKey: "tableau_ubl",
      };
  }
};

// Broad superset of REST scopes the MCP tools may need. Mirrors the rest_scopes
// list used in NextAuth signin so per-user JWT-issued sessions stay equivalent
// across the passthrough and direct-trust paths.
const MCP_REST_SCOPES = [
  "tableau:*:*",
  "tableau:content:read",
  "tableau:datasources:read",
  "tableau:workbooks:read",
  "tableau:projects:read",
  "tableau:insights:read",
  "tableau:metric_subscriptions:read",
  "tableau:insight_definitions_metrics:read",
  "tableau:insight_metrics:read",
  "tableau:metrics:download",
  "tableau:viz_data_service:read",
  "tableau:mcp_site_settings:read",
  "tableau:insight_brief:create",
];

export class McpAuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = "McpAuthError";
  }
}

// Build LangChain tools backed by the Tableau MCP server. Auth depends on
// the site's wiring above:
//   - passthrough → forward the user's rest_key as X-Tableau-Auth
//   - direct-trust → mint a Connected App JWT with the user as `sub` and send
//     it as Authorization: Bearer <jwt>; MCP redeems it server-side
//
// Fails fast (throws McpAuthError) if any required input is missing rather
// than falling back to a different identity / site.
export const getTableauMcpTools = async (demo: string, token: JWT) => {
  const site = DEMO_SITE[demo];
  if (!site) {
    throw new McpAuthError(`Unknown demo "${demo}" — no MCP server is configured for it.`);
  }

  const wiring = siteWiring(site);
  const { url, authMode, tokenKey } = wiring;
  if (!url) {
    throw new McpAuthError(
      `MCP URL for site "${site}" is not configured (missing env var).`,
      500,
    );
  }

  const siteSession = (token as any)[tokenKey] as
    | { rest_key?: string; expires?: unknown }
    | undefined;
  const userEmail = (token.email as string | undefined) ?? null;

  // Build the auth header per mode.
  const headers: Record<string, string> = {};
  let logTokenSummary: string;

  if (authMode === "passthrough") {
    const restKey = siteSession?.rest_key;
    if (!restKey) {
      throw new McpAuthError(
        `No Tableau rest_key on session for site "${site}" — cannot authenticate to MCP.`,
      );
    }

    headers["X-Tableau-Auth"] = restKey;

    const expiresMs = siteSession?.expires ? new Date(siteSession.expires as any).getTime() : 0;
    const expiresInSec = expiresMs ? Math.floor((expiresMs - Date.now()) / 1000) : "unknown";
    const pipeParts = restKey.split("|").map((p) => p.length).join(",");
    const tokenSiteLuid = restKey.split("|")[2] ?? "(none)";
    logTokenSummary =
      `mode=passthrough token=${restKey.slice(0, 6)}…${restKey.slice(-4)} ` +
      `len=${restKey.length} parts=[${pipeParts}] ` +
      `tokenSiteLuid=${tokenSiteLuid} expiresInSec=${expiresInSec}`;
  } else {
    // direct-trust: mint a Connected App JWT with the user as sub.
    if (!userEmail) {
      throw new McpAuthError(
        `No user email on session — cannot mint direct-trust JWT for site "${site}".`,
      );
    }
    const ca = wiring.connectedApp;
    if (!ca?.clientId || !ca?.secretId || !ca?.secretValue) {
      throw new McpAuthError(
        `Connected App credentials for site "${site}" are not configured in env.`,
        500,
      );
    }

    // Forward UAF claims so RLS via USERATTRIBUTE/USERATTRIBUTEINCLUDES still
    // works for the MCP-minted session.
    //
    // ODA (On-Demand Access) claims are TEMPORARILY DISABLED. Tableau Cloud has
    // an undocumented bug where ODA-ephemeral sessions return HTTP 500 from
    // `/sessions/current` (which the MCP server's passthrough/OAuth validators
    // call). Without ODA, signin resolves to the real provisioned user and the
    // session works end-to-end. Re-enable once Tableau fixes the upstream bug.
    const uaf = (token.uaf as Record<string, unknown> | undefined) ?? {};
    // const groups = (token.groups as string[] | undefined) ?? [];
    const extraClaims: Record<string, unknown> = {
      ...uaf,
      // 'https://tableau.com/oda': 'true',
      // 'https://tableau.com/groups': groups,
    };

    const jwtOptions = {
      jwt_secret: ca.secretValue,
      jwt_secret_id: ca.secretId,
      jwt_client_id: ca.clientId,
    };
    const bearerJwt = jwtSign(userEmail, jwtOptions, MCP_REST_SCOPES, extraClaims);
    headers["Authorization"] = `Bearer ${bearerJwt}`;

    logTokenSummary = `mode=direct-trust sub=${userEmail} jwtLen=${bearerJwt.length}`;
  }

  console.log(`[mcp] demo=${demo} site=${site} url=${url} ${logTokenSummary}`);

  const client = new MultiServerMCPClient({
    mcpServers: {
      tableau: {
        url,
        transport: "http",
        headers,
      },
    },
  });

  const tools = await client.getTools();
  return { tools, client };
};
