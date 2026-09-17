import { NextRequest, NextResponse } from 'next/server';

function getPublicOrigin(req: NextRequest): string {
  // Behind Railway's reverse proxy, req.url has the internal address (0.0.0.0:8080).
  // X-Forwarded-Host + X-Forwarded-Proto give the real public hostname.
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);
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
