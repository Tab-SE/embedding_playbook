// Production entrypoint: runs the Tableau MCP server(s) as loopback-only
// sidecars inside this dyno, then starts Next.js pointed at them.
//
// Why: the standalone MCP apps sit behind Heroku's internal-routing SSO proxy
// (auth.herokuapp-internal.com), which 302s server-to-server calls to a
// browser login. Running MCP in-process-group on 127.0.0.1 avoids the network
// hop entirely. Auth is unchanged: mcp.ts still forwards each user's Tableau
// rest_key as X-Tableau-Auth (passthrough), so per-user identity/RLS holds.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Package "exports" maps "." to build/index.js (the server entrypoint).
const mcpEntry = require.resolve("@tableau/mcp-server");

// One sidecar per Tableau site. Skipped if that site's domain/site vars are unset.
const SITES = [
  { key: "main", urlVar: "TABLEAU_MCP_URL", port: 39271,
    server: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN, site: process.env.NEXT_PUBLIC_ANALYTICS_SITE },
  { key: "eacanada", urlVar: "TABLEAU_MCP_URL_EACANADA", port: 39272,
    server: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_EACANADA, site: process.env.NEXT_PUBLIC_ANALYTICS_SITE_EACANADA },
  { key: "ubl", urlVar: "TABLEAU_MCP_URL_UBL", port: 39273,
    server: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL, site: process.env.NEXT_PUBLIC_ANALYTICS_SITE_UBL },
];

const children = [];
let shuttingDown = false;

const shutdown = (code) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) if (c.exitCode === null) c.kill("SIGTERM");
  setTimeout(() => process.exit(code), 3000).unref();
};

// If any process dies, take the whole dyno down so Heroku restarts it cleanly
// rather than leaving Next.js running with a dead MCP backend.
const track = (name, child) => {
  children.push(child);
  child.on("exit", (code, signal) => {
    console.error(`[start] ${name} exited code=${code} signal=${signal}`);
    shutdown(code ?? 1);
  });
  return child;
};

const nextEnv = { ...process.env };

// Opt-in so other deployments of this repo keep using their TABLEAU_MCP_URL* as-is.
const useLocalMcp = process.env.LOCAL_MCP === "true";
if (!useLocalMcp) console.log("[start] LOCAL_MCP!=true: no MCP sidecars, using TABLEAU_MCP_URL* as configured");

for (const s of useLocalMcp ? SITES : []) {
  if (!s.server || !s.site) {
    console.log(`[start] mcp-${s.key}: skipped (domain/site env not set)`);
    delete nextEnv[s.urlVar];
    continue;
  }
  const env = {
    // Inherit PATH etc., but don't leak this app's PORT (MCP reads PORT).
    ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== "PORT")),
    TRANSPORT: "http",
    AUTH: "passthrough",
    SERVER: s.server,
    SITE_NAME: s.site,
    HTTP_HOST: "127.0.0.1",
    PORT: String(s.port),
  };
  track(`mcp-${s.key}`, spawn(process.execPath, [mcpEntry], { env, stdio: "inherit" }));
  nextEnv[s.urlVar] = `http://127.0.0.1:${s.port}/tableau-mcp`;
  console.log(`[start] mcp-${s.key}: ${s.server} site=${s.site} -> ${nextEnv[s.urlVar]}`);
}

const nextBin = require.resolve("next/dist/bin/next");
track("next", spawn(process.execPath, [nextBin, "start"], { env: nextEnv, stdio: "inherit" }));

for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => shutdown(0));
