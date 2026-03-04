import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SessionModel } from "@/models";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

// local connected app
export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const { name, demo, email, picture, role, vectors, uaf, tableau } = token;

    // Check if token needs refresh (expires in less than 4 minutes)
    const now = Math.floor(Date.now() / 1000);
    const shouldRefresh = tableau.expires && (tableau.expires - now) < 240;

    let refreshedTableau = tableau;

    if (shouldRefresh) {
      console.log(`[/api/user] ${new Date().toISOString()} - Token expiring soon (${tableau.expires}), refreshing for ${email}`);

      const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID;
      const embed_secret = process.env.TABLEAU_EMBED_JWT_SECRET;
      const embed_secret_id = process.env.TABLEAU_EMBED_JWT_SECRET_ID;
      const rest_secret = process.env.TABLEAU_REST_JWT_SECRET;
      const rest_secret_id = process.env.TABLEAU_REST_JWT_SECRET_ID;

      const embed_scopes = [
        "tableau:views:embed",
        "tableau:views:embed_authoring",
        "tableau:insights:embed",
      ];
      const embed_options = {
        jwt_secret: embed_secret,
        jwt_secret_id: embed_secret_id,
        jwt_client_id
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
      const rest_options = {
        jwt_secret: rest_secret,
        jwt_secret_id: rest_secret_id,
        jwt_client_id
      };

      try {
        const session = new SessionModel(name);
        await session.jwt(email, embed_options, embed_scopes, rest_options, rest_scopes, uaf);

        if (session.authorized) {
          const {
            username,
            user_id,
            embed_token,
            rest_token,
            rest_key,
            site_id,
            site,
            created,
            expires
          } = session;

          refreshedTableau = {
            username,
            user_id,
            embed_token,
            rest_token,
            rest_key,
            site_id,
            site,
            created,
            expires
          };
          console.log(`[/api/user] ${new Date().toISOString()} - Successfully refreshed token, new expiry: ${expires}`);
        } else {
          console.error(`[/api/user] ${new Date().toISOString()} - Session not authorized after refresh`);
        }
      } catch (error) {
        console.error(`[/api/user] ${new Date().toISOString()} - Error refreshing token:`, error);
        // Fall back to existing token if refresh fails
      }
    } else {
      console.log(`[/api/user] ${new Date().toISOString()} - Token still valid (expires: ${tableau.expires}, current: ${now}, diff: ${tableau.expires - now}s)`);
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
