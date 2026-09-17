import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCode, getCurrentRefreshToken } from '../../../chat/agent/tableau-oauth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) return NextResponse.json({ error, description: searchParams.get('error_description') }, { status: 400 });
  if (!code) return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });

  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin;
  const cookieStore = await cookies();
  const savedState = cookieStore.get('tableau_oauth_state')?.value;
  const codeVerifier = cookieStore.get('tableau_oauth_verifier')?.value;
  const returnTo = cookieStore.get('tableau_oauth_return_to')?.value ?? '/';
  const redirectUri = cookieStore.get('tableau_oauth_redirect_uri')?.value ?? `${origin}/api/tableau/oauth/callback`;
  const clientId = cookieStore.get('tableau_oauth_client_id')?.value ?? `${origin}/api/tableau/oauth/client-metadata.json`;

  if (!savedState || state !== savedState) return NextResponse.json({ error: 'State mismatch — restart the OAuth flow.' }, { status: 400 });
  if (!codeVerifier) return NextResponse.json({ error: 'Missing code verifier — restart the OAuth flow.' }, { status: 400 });

  cookieStore.delete('tableau_oauth_state');
  cookieStore.delete('tableau_oauth_verifier');
  cookieStore.delete('tableau_oauth_return_to');
  cookieStore.delete('tableau_oauth_redirect_uri');
  cookieStore.delete('tableau_oauth_client_id');

  try {
    await exchangeCode(code, codeVerifier, clientId, redirectUri);
    const refreshToken = getCurrentRefreshToken();
    const destination = new URL(returnTo, req.url);
    destination.searchParams.set('tableau_oauth_setup', 'done');
    destination.searchParams.set('refresh_token_hint', refreshToken ?? '');
    return NextResponse.redirect(destination);
  } catch (err: any) {
    return NextResponse.json({ error: 'Token exchange failed', detail: err.message }, { status: 500 });
  }
}
