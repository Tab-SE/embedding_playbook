import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SessionModel } from "@/models";

export const dynamic = 'force-dynamic';

const getJwtExp = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).exp ?? 0;
  } catch {
    return 0;
  }
};

// EP (embeddingplaybook) connected app
export async function POST(req) {
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  const token = await getToken({ req });

  if (token?.tableau_ep) {
    const { name, demo, email, picture, role, vectors, uaf, tableau_ep } = token;

    const now = Math.floor(Date.now() / 1000);
    const expiresMs = tableau_ep.expires ? new Date(tableau_ep.expires).getTime() : 0;
    const expiresSec = Number.isFinite(expiresMs) ? Math.floor(expiresMs / 1000) : 0;
    const embedJwtExp = getJwtExp(tableau_ep.embed_token ?? '');
    const shouldRefresh = (embedJwtExp > 0 && (embedJwtExp - now) < 120) || (expiresSec > 0 && (expiresSec - now) < 240);

    let refreshedTableau = tableau_ep;

    if (shouldRefresh) {
      console.log(`[/api/user/ep] ${new Date().toISOString()} - Token expiring soon (${tableau_ep.expires}), refreshing for ${email}`);

      const ep_jwt_client_id = process.env.EP_JWT_CLIENT_ID;
      const ep_embed_secret = process.env.EP_EMBED_JWT_SECRET;
      const ep_embed_secret_id = process.env.EP_EMBED_JWT_SECRET_ID;
      const ep_rest_secret = process.env.EP_REST_JWT_SECRET;
      const ep_rest_secret_id = process.env.EP_REST_JWT_SECRET_ID;

      if (ep_jwt_client_id && ep_embed_secret && ep_rest_secret) {
        const embed_scopes = [
          "tableau:views:embed",
          "tableau:views:embed_authoring",
          "tableau:insights:embed",
        ];
        const ep_embed_options = {
          jwt_secret: ep_embed_secret,
          jwt_secret_id: ep_embed_secret_id,
          jwt_client_id: ep_jwt_client_id
        };
        const rest_scopes = [
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
        const ep_rest_options = {
          jwt_secret: ep_rest_secret,
          jwt_secret_id: ep_rest_secret_id,
          jwt_client_id: ep_jwt_client_id
        };

        try {
          const ep_session = new SessionModel(name);
          await ep_session.jwtEP(email, ep_embed_options, embed_scopes, ep_rest_options, rest_scopes, uaf);

          if (ep_session.authorized) {
            const {
              user_id: ep_user_id,
              embed_token: ep_embed_token,
              rest_token: ep_rest_token,
              rest_key: ep_rest_key,
              site_id: ep_site_id,
              site: ep_site,
              created: ep_created,
              expires: ep_expires
            } = ep_session;

            refreshedTableau = {
              username: tableau_ep.username,
              user_id: ep_user_id,
              embed_token: ep_embed_token,
              rest_token: ep_rest_token,
              rest_key: ep_rest_key,
              site_id: ep_site_id,
              site: ep_site,
              created: ep_created,
              expires: ep_expires
            };
            console.log(`[/api/user/ep] ${new Date().toISOString()} - Successfully refreshed token, new expiry: ${ep_expires}`);
          } else {
            console.error(`[/api/user/ep] ${new Date().toISOString()} - Session not authorized after refresh`);
          }
        } catch (error) {
          console.error(`[/api/user/ep] ${new Date().toISOString()} - Error refreshing token:`, error);
        }
      }
    } else {
      console.log(`[/api/user/ep] ${new Date().toISOString()} - Token still valid (expires: ${tableau_ep.expires}, current: ${now}, diff: ${expiresSec - now}s)`);
    }

    const clientSafeUser = {
      name,
      demo,
      email,
      picture,
      role,
      vectors,
      uaf,
      embed_token: refreshedTableau.embed_token,
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
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}
