import { NextRequest, NextResponse } from 'next/server';

// Exchanges an authorization code + PKCE verifier for an access token and returns a frontdoor URL or credential
export async function POST(req: NextRequest) {
  try {
    const {
      code,
      code_verifier,
      client_id,
      redirect_uri,
      instance_url,
    } = await req.json();

    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
    }

    const salesforceLoginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    const sfClientId = client_id || process.env.SALESFORCE_CLIENT_ID;
    const sfClientSecret = process.env.SALESFORCE_CLIENT_SECRET; // kept server-side
    const sfRedirectUri = redirect_uri || process.env.SALESFORCE_REDIRECT_URI;

    if (!sfClientId || !sfClientSecret || !sfRedirectUri) {
      return NextResponse.json({ error: 'Server is missing Salesforce env configuration' }, { status: 500 });
    }

    const tokenUrl = `${salesforceLoginUrl}/services/oauth2/token`;
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', sfClientId);
    params.set('client_secret', sfClientSecret);
    params.set('code', code);
    params.set('code_verifier', code_verifier);
    params.set('redirect_uri', sfRedirectUri);

    const tokenResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      return NextResponse.json({ error: 'Token exchange failed', detail: text }, { status: 502 });
    }

    const tokenData = await tokenResp.json();
    const access_token: string | undefined = tokenData.access_token;
    const issued_instance_url: string | undefined = tokenData.instance_url;

    if (!access_token || !issued_instance_url) {
      return NextResponse.json({ error: 'Missing access_token or instance_url' }, { status: 502 });
    }

    // Option A: Return access token as a backend-only credential surrogate for SDK init (never expose real secret)
    // Option B: Generate a frontdoor URL for cookie-less login to host org if needed by the SDK usage
    // Here we provide both patterns as fields the UI can choose from.

    // Frontdoor URL endpoint (may differ per org/config). This is illustrative and may need adjustment.
    const frontdoorServiceUrl = `${issued_instance_url}/services/oauth2/singleaccess`;
    let frontdoor_url: string | null = null;
    try {
      const fdResp = await fetch(frontdoorServiceUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (fdResp.ok) {
        const fdData = await fdResp.json();
        frontdoor_url = fdData.frontdoor_uri || null;
      }
    } catch {}

    return NextResponse.json({
      authCredential: access_token, // treat as server-issued credential for SDK init
      instance_url: issued_instance_url,
      frontdoor_url,
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Unexpected error', detail: e?.message || String(e) }, { status: 500 });
  }
}


