import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SessionModel } from "@/models";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

// ubl connected app
export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau_ubl) {
    const { name, demo, email, picture, role, vectors, uaf, groups, tableau_ubl } = token;

    // Always log the currently cached UBL JWT so it's easy to inspect on every page load,
    // not just at sign-in / refresh time. Cmd+click the URL to open jwt.io with the token.
    if (tableau_ubl?.embed_token) {
      console.log(`[/api/user/ubl] cached embed jwt: https://jwt.io/?token=${tableau_ubl.embed_token}`);
    }
    if (tableau_ubl?.rest_token) {
      console.log(`[/api/user/ubl] cached rest  jwt: https://jwt.io/?token=${tableau_ubl.rest_token}`);
    }

    // Check if token needs refresh (expires in less than 4 minutes).
    // `expires` round-trips through the NextAuth cookie as an ISO string
    // (Date.toJSON), so coerce via `new Date(...)` before comparing.
    const now = Math.floor(Date.now() / 1000);
    const expiresMs = tableau_ubl.expires ? new Date(tableau_ubl.expires).getTime() : 0;
    const expiresSec = Number.isFinite(expiresMs) ? Math.floor(expiresMs / 1000) : 0;
    const shouldRefresh = expiresSec > 0 && (expiresSec - now) < 240;

    let refreshedTableau = tableau_ubl;

    if (shouldRefresh) {
      console.log(`[/api/user/ubl] ${new Date().toISOString()} - Token expiring soon (${tableau_ubl.expires}), refreshing for ${email}`);

      const ubl_jwt_client_id = process.env.UBL_JWT_CLIENT_ID;
      const ubl_embed_secret = process.env.UBL_EMBED_JWT_SECRET;
      const ubl_embed_secret_id = process.env.UBL_EMBED_JWT_SECRET_ID;
      const ubl_rest_secret = process.env.UBL_REST_JWT_SECRET;
      const ubl_rest_secret_id = process.env.UBL_REST_JWT_SECRET_ID;

      if (ubl_jwt_client_id && ubl_embed_secret && ubl_rest_secret) {
        // UBL/ODA: narrow embed scopes to the documented supported set.
        // `tableau:insights:embed` is NOT in ODA's supported scopes and including it
        // can cause Tableau to silently drop custom JWT claims (UAF / groups).
        const embed_scopes = [
          "tableau:views:embed",
          "tableau:views:embed_authoring",
        ];
        const ubl_embed_options = {
          jwt_secret: ubl_embed_secret,
          jwt_secret_id: ubl_embed_secret_id,
          jwt_client_id: ubl_jwt_client_id
        };
        const rest_scopes = [
          "tableau:content:read",
          "tableau:datasources:read",
          "tableau:workbooks:read",
          "tableau:projects:read",
          "tableau:insights:read",
          "tableau:metric_subscriptions:read",
          "tableau:insight_definitions_metrics:read",
          "tableau:insight_metrics:read",
          "tableau:metrics:download",
        ];
        const ubl_rest_options = {
          jwt_secret: ubl_rest_secret,
          jwt_secret_id: ubl_rest_secret_id,
          jwt_client_id: ubl_jwt_client_id
        };

        // TEMP DISABLED for UAF debugging.
        const ubl_extra_claims = {
          'https://tableau.com/oda':"true",
          'https://tableau.com/groups': groups ?? [],
        };

        try {
          const ubl_session = new SessionModel(name);
          await ubl_session.jwtUBL(email, ubl_embed_options, embed_scopes, ubl_rest_options, rest_scopes, uaf, ubl_extra_claims);

          if (ubl_session.authorized) {
            const {
              user_id: ubl_user_id,
              embed_token: ubl_embed_token,
              rest_token: ubl_rest_token,
              rest_key: ubl_rest_key,
              site_id: ubl_site_id,
              site: ubl_site,
              created: ubl_created,
              expires: ubl_expires
            } = ubl_session;

            refreshedTableau = {
              username: tableau_ubl.username,
              user_id: ubl_user_id,
              embed_token: ubl_embed_token,
              rest_token: ubl_rest_token,
              rest_key: ubl_rest_key,
              site_id: ubl_site_id,
              site: ubl_site,
              created: ubl_created,
              expires: ubl_expires
            };
            console.log(`[/api/user/ubl] ${new Date().toISOString()} - Successfully refreshed token, new expiry: ${ubl_expires}`);
          } else {
            console.error(`[/api/user/ubl] ${new Date().toISOString()} - Session not authorized after refresh`);
          }
        } catch (error) {
          console.error(`[/api/user/ubl] ${new Date().toISOString()} - Error refreshing token:`, error);
          // Fall back to existing token if refresh fails
        }
      }
    } else {
      console.log(`[/api/user/ubl] ${new Date().toISOString()} - Token still valid (expires: ${tableau_ubl.expires}, current: ${now}, diff: ${expiresSec - now}s)`);
    }

    // form a payload to safely represent the user on the client
    // NOTE: rest_token included for local debugging — see useTableauSessionUBL hook,
    // which logs both tokens to the browser console with jwt.io URLs. Strip before deploy.
    const clientSafeUser = {
      name,
      demo,
      email,
      picture,
      role,
      vectors,
      uaf,
      embed_token: refreshedTableau.embed_token,
      rest_token: refreshedTableau.rest_token,
      user_id: refreshedTableau.user_id,
      site: refreshedTableau.site,
      created: refreshedTableau.created,
      expires: refreshedTableau.expires
    };

    if (clientSafeUser) {
      return NextResponse.json(clientSafeUser, { status: 200 });
    } else {
      return NextResponse.json({ error: '500: Internal error: cannot generate payload' }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}
