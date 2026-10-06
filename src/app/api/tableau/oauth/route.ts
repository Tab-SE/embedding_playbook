import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { MCP_OAUTH_SCOPES } from '../../chat/agent/tableau-oauth';

const AUTH_ENDPOINT = 'https://sso.online.tableau.com/oauth2/authorize';

function getPublicOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const cimdBase = process.env.TABLEAU_MCP_CIMD_BASE_URL ?? origin;
  const clientId = (isLocalhost && process.env.TABLEAU_MCP_OAUTH_CLIENT_ID)
    ? process.env.TABLEAU_MCP_OAUTH_CLIENT_ID
    : `${cimdBase}/api/tableau/oauth/client-metadata.json`;
  // redirect_uri must match what's in the CIMD document exactly.
  // When CIMD_BASE_URL is set, the doc lists that base's callback, so use it here too.
  const redirectUri = process.env.TABLEAU_MCP_OAUTH_CLIENT_ID
    ? `${origin}/api/tableau/oauth/callback`   // pre-registered client: use local callback
    : `${cimdBase}/api/tableau/oauth/callback`; // CIMD: must match the doc

  if (isLocalhost && !process.env.TABLEAU_MCP_OAUTH_CLIENT_ID && !process.env.TABLEAU_MCP_CIMD_BASE_URL) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:system-ui;padding:2rem;max-width:600px">
      <h2>⚙️ Local OAuth setup</h2>
      <p>CIMD requires a publicly accessible URL — localhost can't be fetched by Tableau's servers.</p>
      <p><strong>Option A</strong>: Set <code>TABLEAU_MCP_CIMD_BASE_URL</code> to your Railway URL:</p>
      <code style="display:block;background:#f0f0f0;padding:8px;margin:8px 0">TABLEAU_MCP_CIMD_BASE_URL=https://your-app.up.railway.app</code>
      <p><strong>Option B</strong>: Register a Tableau OAuth 2.0 Connected App with redirect URI <code>${redirectUri}</code> and set <code>TABLEAU_MCP_OAUTH_CLIENT_ID</code>.</p>
      <p><strong>Option C</strong>: Complete OAuth on Railway, save the refresh token as <code>TABLEAU_MCP_OAUTH_REFRESH_TOKEN</code> locally.</p>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const codeVerifier = crypto.randomBytes(64).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state = crypto.randomBytes(16).toString('hex');
  const returnTo = new URL(req.url).searchParams.get('return_to') ?? '/';

  const cookieStore = await cookies();
  cookieStore.set('tableau_oauth_verifier', codeVerifier, { httpOnly: true, maxAge: 600, path: '/' });
  cookieStore.set('tableau_oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' });
  cookieStore.set('tableau_oauth_return_to', returnTo, { httpOnly: true, maxAge: 600, path: '/' });
  cookieStore.set('tableau_oauth_redirect_uri', redirectUri, { httpOnly: true, maxAge: 600, path: '/' });
  cookieStore.set('tableau_oauth_client_id', clientId, { httpOnly: true, maxAge: 600, path: '/' });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: MCP_OAUTH_SCOPES,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    resource: 'https://mcp.tableau.com',
  });

  return NextResponse.redirect(`${AUTH_ENDPOINT}?${params.toString()}`);
}
