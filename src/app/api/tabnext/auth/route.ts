import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Unified TabNext Authentication Route
 * Handles three authentication methods:
 * 1. Authorization Code + PKCE Flow (method: 'auth-code' or 'pkce')
 * 2. Client Credentials Flow (method: 'client-credentials')
 * 3. JWT Bearer Flow (method: 'jwt')
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const method = body.method || 'jwt'; // Default to JWT if not specified

    // Route to appropriate authentication method
    switch (method) {
      case 'auth-code':
      case 'pkce':
        return handleAuthCodeFlow(req, body);
      case 'client-credentials':
        return handleClientCredentialsFlow(body);
      case 'jwt':
        return handleJWTBearerFlow(body);
      default:
        return NextResponse.json({
          error: `Unknown authentication method: ${method}`,
          supportedMethods: ['auth-code', 'pkce', 'client-credentials', 'jwt']
        }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      detail: e?.message || String(e)
    }, { status: 500 });
  }
}

/**
 * Authorization Code + PKCE Flow
 * Exchanges an authorization code + PKCE verifier for an access token
 */
async function handleAuthCodeFlow(req: NextRequest, body: any) {
  const {
    code,
    code_verifier,
    client_id,
    redirect_uri,
    instance_url,
  } = body;

  if (!code || !code_verifier) {
    return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
  }

  const salesforceLoginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  const sfClientId = client_id || process.env.SALESFORCE_CLIENT_ID;
  const sfClientSecret = process.env.SALESFORCE_CLIENT_SECRET;
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

  // Generate frontdoor URL
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
    authCredential: access_token,
    instance_url: issued_instance_url,
    frontdoor_url,
  });
}

/**
 * Client Credentials Flow
 * Uses client_id and client_secret to get an access token
 */
async function handleClientCredentialsFlow(body: any) {
  const salesforceOrgUrl = process.env.SALESFORCE_ORG_URL || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;
  const sfClientId = process.env.SALESFORCE_CLIENT_ID;
  const sfClientSecret = process.env.SALESFORCE_CLIENT_SECRET;

  if (!sfClientId || !sfClientSecret) {
    return NextResponse.json({
      error: 'Missing SALESFORCE_CLIENT_ID or SALESFORCE_CLIENT_SECRET'
    }, { status: 500 });
  }

  if (!salesforceOrgUrl) {
    return NextResponse.json({
      error: 'Missing SALESFORCE_ORG_URL'
    }, { status: 500 });
  }

  // Get access token using Client Credentials flow
  const tokenUrl = `${salesforceOrgUrl}/services/oauth2/token`;
  const params = new URLSearchParams();
  params.set('grant_type', 'client_credentials');
  params.set('client_id', sfClientId);
  params.set('client_secret', sfClientSecret);

  const tokenResp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!tokenResp.ok) {
    const text = await tokenResp.text();
    return NextResponse.json({
      error: 'Token request failed',
      detail: text
    }, { status: 502 });
  }

  const tokenData = await tokenResp.json();
  const access_token: string | undefined = tokenData.access_token;
  const instance_url: string | undefined = tokenData.instance_url || salesforceOrgUrl;

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access_token in response' }, { status: 502 });
  }

  // Generate frontdoor URL
  const frontdoorServiceUrl = `${instance_url}/services/oauth2/singleaccess`;
  let frontdoor_url: string | null = null;

  try {
    const fdResp = await fetch(frontdoorServiceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
    });

    if (fdResp.ok) {
      const fdData = await fdResp.json();
      frontdoor_url = fdData.frontdoor_uri || fdData.url || null;
    }
  } catch (e) {
    // Continue without frontdoor URL
  }

  return NextResponse.json({
    authCredential: frontdoor_url || access_token,
    access_token: access_token,
    instance_url: instance_url,
    frontdoor_url: frontdoor_url,
  });
}

/**
 * JWT Bearer Flow
 * Allows dynamic authentication without user redirect
 */
async function handleJWTBearerFlow(body: any) {
  const { salesforce_username } = body;

  if (!salesforce_username) {
    return NextResponse.json({ error: 'Missing salesforce_username' }, { status: 400 });
  }

  const salesforceOrgUrl = process.env.SALESFORCE_ORG_URL || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;
  const salesforceLoginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  const sfClientId = process.env.SALESFORCE_CLIENT_ID;
  const sfPrivateKeyPath = process.env.SALESFORCE_PRIVATE_KEY_PATH;
  const sfPrivateKey = process.env.SALESFORCE_PRIVATE_KEY;

  // Use org URL if available, otherwise fall back to login URL
  const cleanOrgUrl = salesforceOrgUrl?.replace(/\/+$/, '');
  const cleanLoginUrl = salesforceLoginUrl?.replace(/\/+$/, '');
  const tokenAudience = cleanOrgUrl || cleanLoginUrl;
  const tokenExchangeUrl = cleanOrgUrl
    ? `${cleanOrgUrl}/services/oauth2/token`
    : `${cleanLoginUrl}/services/oauth2/token`;

  if (!sfClientId) {
    return NextResponse.json({ error: 'Missing SALESFORCE_CLIENT_ID' }, { status: 500 });
  }

  // Get private key from file or environment variable
  let privateKey: string;
  if (sfPrivateKey) {
    privateKey = sfPrivateKey.replace(/\\n/g, '\n');
  } else if (sfPrivateKeyPath) {
    try {
      const keyPath = join(process.cwd(), sfPrivateKeyPath);
      privateKey = readFileSync(keyPath, 'utf8');
    } catch (e: any) {
      return NextResponse.json({
        error: 'Failed to read private key file',
        detail: e.message,
        hint: 'In production, set SALESFORCE_PRIVATE_KEY environment variable instead of SALESFORCE_PRIVATE_KEY_PATH'
      }, { status: 500 });
    }
  } else {
    return NextResponse.json({
      error: 'Missing SALESFORCE_PRIVATE_KEY or SALESFORCE_PRIVATE_KEY_PATH',
      hint: 'Set SALESFORCE_PRIVATE_KEY environment variable with the full private key content'
    }, { status: 500 });
  }

  // Generate JWT for Salesforce JWT Bearer Flow
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iss: sfClientId,
    sub: salesforce_username,
    aud: tokenAudience,
    exp: now + 300,
    iat: now,
  };

  // Sign JWT with RS256 algorithm
  const assertion = jwt.sign(jwtPayload, privateKey, {
    algorithm: 'RS256',
  });

  // Exchange JWT for access token
  const params = new URLSearchParams();
  params.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.set('assertion', assertion);

  const tokenResp = await fetch(tokenExchangeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!tokenResp.ok) {
    const text = await tokenResp.text();
    return NextResponse.json({
      error: 'JWT token exchange failed',
      detail: text
    }, { status: 502 });
  }

  const tokenData = await tokenResp.json();
  const access_token: string | undefined = tokenData.access_token;
  const issued_instance_url: string | undefined = tokenData.instance_url;

  if (!access_token || !issued_instance_url) {
    return NextResponse.json({ error: 'Missing access_token or instance_url' }, { status: 502 });
  }

  // Generate frontdoor URL
  const cleanInstanceUrl = issued_instance_url.replace(/\/+$/, '');
  let frontdoor_url: string | null = null;

  // Method 1: Try the singleaccess endpoint
  const frontdoorServiceUrl = `${cleanInstanceUrl}/services/oauth2/singleaccess`;

  try {
    const fdResp = await fetch(frontdoorServiceUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
    });

    if (fdResp.ok) {
      const fdData = await fdResp.json();
      frontdoor_url = fdData.frontdoor_uri || fdData.url || null;
    }
  } catch (e) {
    // Continue without frontdoor URL
  }

  // Method 2: If singleaccess fails, construct frontdoor URL manually
  if (!frontdoor_url) {
    try {
      const lightningUrl = cleanInstanceUrl.replace(/\.my\.salesforce\.com/, '.lightning.force.com');
      frontdoor_url = `${lightningUrl}/secur/frontdoor.jsp?sid=${access_token}`;
    } catch (e) {
      // Continue without frontdoor URL
    }
  }

  const authCredential = frontdoor_url || access_token;

  return NextResponse.json({
    authCredential: authCredential,
    access_token: access_token,
    instance_url: issued_instance_url,
    frontdoor_url: frontdoor_url,
    jwt_token: assertion,
  });
}
