import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SessionModel } from "@/models";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

// eacanada connected app
export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau_eacanada) {
    const { name, demo, email, picture, role, vectors, uaf, tableau_eacanada } = token;

    // Check if token needs refresh (expires in less than 4 minutes)
    const now = Math.floor(Date.now() / 1000);
    const shouldRefresh = tableau_eacanada.expires && (tableau_eacanada.expires - now) < 240;

    let refreshedTableau = tableau_eacanada;

    if (shouldRefresh) {
      console.log(`[/api/user/eacanada] ${new Date().toISOString()} - Token expiring soon (${tableau_eacanada.expires}), refreshing for ${email}`);

      const eacanada_jwt_client_id = process.env.EACANADA_JWT_CLIENT_ID;
      const eacanada_embed_secret = process.env.EACANADA_EMBED_JWT_SECRET;
      const eacanada_embed_secret_id = process.env.EACANADA_EMBED_JWT_SECRET_ID;
      const eacanada_rest_secret = process.env.EACANADA_REST_JWT_SECRET;
      const eacanada_rest_secret_id = process.env.EACANADA_REST_JWT_SECRET_ID;

      if (eacanada_jwt_client_id && eacanada_embed_secret && eacanada_rest_secret) {
        const embed_scopes = [
          "tableau:views:embed",
          "tableau:views:embed_authoring",
          "tableau:insights:embed",
        ];
        const eacanada_embed_options = {
          jwt_secret: eacanada_embed_secret,
          jwt_secret_id: eacanada_embed_secret_id,
          jwt_client_id: eacanada_jwt_client_id
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
        const eacanada_rest_options = {
          jwt_secret: eacanada_rest_secret,
          jwt_secret_id: eacanada_rest_secret_id,
          jwt_client_id: eacanada_jwt_client_id
        };

        try {
          const eacanada_session = new SessionModel(name);
          await eacanada_session.jwtEACanada(email, eacanada_embed_options, embed_scopes, eacanada_rest_options, rest_scopes, uaf);

          if (eacanada_session.authorized) {
            const {
              user_id: eacanada_user_id,
              embed_token: eacanada_embed_token,
              rest_token: eacanada_rest_token,
              rest_key: eacanada_rest_key,
              site_id: eacanada_site_id,
              site: eacanada_site,
              created: eacanada_created,
              expires: eacanada_expires
            } = eacanada_session;

            refreshedTableau = {
              username: tableau_eacanada.username,
              user_id: eacanada_user_id,
              embed_token: eacanada_embed_token,
              rest_token: eacanada_rest_token,
              rest_key: eacanada_rest_key,
              site_id: eacanada_site_id,
              site: eacanada_site,
              created: eacanada_created,
              expires: eacanada_expires
            };
            console.log(`[/api/user/eacanada] ${new Date().toISOString()} - Successfully refreshed token, new expiry: ${eacanada_expires}`);
          } else {
            console.error(`[/api/user/eacanada] ${new Date().toISOString()} - Session not authorized after refresh`);
          }
        } catch (error) {
          console.error(`[/api/user/eacanada] ${new Date().toISOString()} - Error refreshing token:`, error);
          // Fall back to existing token if refresh fails
        }
      }
    } else {
      console.log(`[/api/user/eacanada] ${new Date().toISOString()} - Token still valid (expires: ${tableau_eacanada.expires}, current: ${now}, diff: ${tableau_eacanada.expires - now}s)`);
    }

    // form a payload to safely represent the user on the client
    const clientSafeUser = {
      name,
      demo,
      email,
      picture,
      role,
      vectors,
      uaf,
      embed_token: refreshedTableau.embed_token,
      // rest_token: refreshedTableau.rest_token, // only for debugging the JWT on the client
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

