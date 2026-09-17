import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const cimdBase = process.env.TABLEAU_MCP_CIMD_BASE_URL ?? origin;
  const clientId = `${cimdBase}/api/tableau/oauth/client-metadata.json`;
  const redirectUris = [`${cimdBase}/api/tableau/oauth/callback`];
  if (origin !== cimdBase) redirectUris.push(`${origin}/api/tableau/oauth/callback`);

  return NextResponse.json({
    client_id: clientId,
    client_name: 'Tableau Embedded Analytics Demo',
    client_uri: cimdBase,
    redirect_uris: redirectUris,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    scope: 'openid',
  }, { headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } });
}
