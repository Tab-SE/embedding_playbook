import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SessionModel } from '@/models';

export async function POST(request: NextRequest) {
  try {
    // Get the current JWT token from the session
    const token = await getToken({ req: request });

    if (!token?.tableau) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { tableau } = token;
    const userEmail = token.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    console.log('🔄 Refreshing tokens for user:', userEmail);

    // Get the JWT configuration from environment variables
    const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID;
    const embed_secret = process.env.TABLEAU_EMBED_JWT_SECRET;
    const embed_secret_id = process.env.TABLEAU_EMBED_JWT_SECRET_ID;
    const rest_secret = process.env.TABLEAU_REST_JWT_SECRET;
    const rest_secret_id = process.env.TABLEAU_REST_JWT_SECRET_ID;

    if (!jwt_client_id || !embed_secret || !embed_secret_id || !rest_secret || !rest_secret_id) {
      return NextResponse.json({ error: 'JWT configuration missing' }, { status: 500 });
    }

    // Client-safe Connected App scopes
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

    // Backend secured Connected App scopes
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

    // Create a new session with fresh tokens
    const session = new SessionModel(userEmail);
    await session.jwt(userEmail, embed_options, embed_scopes, rest_options, rest_scopes, tableau.uaf || {});

    if (!session.authorized) {
      return NextResponse.json({ error: 'Failed to refresh tokens' }, { status: 500 });
    }

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

    // Return the refreshed token data
    const refreshedTokens = {
      tableau: {
        username,
        user_id,
        embed_token,
        rest_token,
        rest_key,
        site_id,
        site,
        created,
        expires
      }
    };

    console.log('✅ Tokens refreshed successfully for user:', userEmail);

    return NextResponse.json(refreshedTokens);

  } catch (error) {
    console.error('❌ Error refreshing tokens:', error);
    return NextResponse.json({
      error: 'Failed to refresh tokens',
      details: error.message
    }, { status: 500 });
  }
}
