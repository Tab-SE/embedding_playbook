import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * JWT Bearer Flow for Salesforce External Client Apps
 * This allows dynamic authentication without user redirect
 * Requires:
 * - ECA configured with JWT Bearer Flow
 * - Public certificate uploaded to Salesforce
 * - Private key stored server-side
 * - Users pre-authorized with permission set
 */
export async function POST(req: NextRequest) {
  console.log('[JWT Auth] Request received');
  try {
    const { salesforce_username } = await req.json();
    console.log('[JWT Auth] Salesforce username:', salesforce_username);

    if (!salesforce_username) {
      console.error('[JWT Auth] Missing salesforce_username');
      return NextResponse.json({ error: 'Missing salesforce_username' }, { status: 400 });
    }

    // Use org URL instead of login URL for JWT Bearer Flow
    const salesforceOrgUrl = process.env.SALESFORCE_ORG_URL || process.env.NEXT_PUBLIC_SALESFORCE_ORG_URL;
    const salesforceLoginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    const sfClientId = process.env.SALESFORCE_CLIENT_ID;
    const sfPrivateKeyPath = process.env.SALESFORCE_PRIVATE_KEY_PATH;
    const sfPrivateKey = process.env.SALESFORCE_PRIVATE_KEY;

    // For JWT Bearer Flow, use org URL if available, otherwise fall back to login URL
    // Remove trailing slashes to avoid double slashes in URLs
    const cleanOrgUrl = salesforceOrgUrl?.replace(/\/+$/, '');
    const cleanLoginUrl = salesforceLoginUrl?.replace(/\/+$/, '');
    const tokenAudience = cleanOrgUrl || cleanLoginUrl;
    const tokenExchangeUrl = cleanOrgUrl
      ? `${cleanOrgUrl}/services/oauth2/token`
      : `${cleanLoginUrl}/services/oauth2/token`;

    console.log('[JWT Auth] Environment check:');
    console.log('  - SALESFORCE_ORG_URL:', salesforceOrgUrl || 'not set');
    console.log('  - SALESFORCE_LOGIN_URL:', salesforceLoginUrl);
    console.log('  - Token Audience (aud):', tokenAudience);
    console.log('  - Token Exchange URL:', tokenExchangeUrl);
    console.log('  - SALESFORCE_CLIENT_ID:', sfClientId ? `${sfClientId.substring(0, 10)}...` : 'MISSING');
    console.log('  - SALESFORCE_PRIVATE_KEY_PATH:', sfPrivateKeyPath || 'not set');
    console.log('  - SALESFORCE_PRIVATE_KEY:', sfPrivateKey ? 'set (from env)' : 'not set');

    if (!sfClientId) {
      console.error('[JWT Auth] Missing SALESFORCE_CLIENT_ID');
      return NextResponse.json({ error: 'Missing SALESFORCE_CLIENT_ID' }, { status: 500 });
    }

    // Get private key from file or environment variable
    // In production (Railway, etc.), prefer environment variable since files may not be available
    let privateKey: string;
    if (sfPrivateKey) {
      // Prefer environment variable (works in production)
      console.log('[JWT Auth] Using private key from SALESFORCE_PRIVATE_KEY environment variable');
      privateKey = sfPrivateKey.replace(/\\n/g, '\n'); // Handle escaped newlines in env var
      console.log('[JWT Auth] Private key loaded from env, length:', privateKey.length);
    } else if (sfPrivateKeyPath) {
      // Fall back to file if env var not set (for local development)
      try {
        const keyPath = join(process.cwd(), sfPrivateKeyPath);
        console.log('[JWT Auth] Reading private key from file:', keyPath);
        privateKey = readFileSync(keyPath, 'utf8');
        console.log('[JWT Auth] Private key loaded successfully from file, length:', privateKey.length);
      } catch (e: any) {
        console.error('[JWT Auth] Failed to read private key file:', e.message);
        console.error('[JWT Auth] File path attempted:', join(process.cwd(), sfPrivateKeyPath));
        console.error('[JWT Auth] In production, use SALESFORCE_PRIVATE_KEY environment variable instead');
        return NextResponse.json({
          error: 'Failed to read private key file',
          detail: e.message,
          hint: 'In production, set SALESFORCE_PRIVATE_KEY environment variable instead of SALESFORCE_PRIVATE_KEY_PATH'
        }, { status: 500 });
      }
    } else {
      console.error('[JWT Auth] Missing SALESFORCE_PRIVATE_KEY or SALESFORCE_PRIVATE_KEY_PATH');
      return NextResponse.json({
        error: 'Missing SALESFORCE_PRIVATE_KEY or SALESFORCE_PRIVATE_KEY_PATH',
        hint: 'Set SALESFORCE_PRIVATE_KEY environment variable with the full private key content (including -----BEGIN/END----- lines)'
      }, { status: 500 });
    }

    // Generate JWT for Salesforce JWT Bearer Flow
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: sfClientId, // Consumer Key from ECA
      sub: salesforce_username, // Salesforce username of the user to authenticate
      aud: tokenAudience, // Use org URL or login URL as audience
      exp: now + 300, // Expires in 5 minutes
      iat: now, // Issued at
    };

    console.log('[JWT Auth] JWT Payload:', {
      iss: jwtPayload.iss.substring(0, 10) + '...',
      sub: jwtPayload.sub,
      aud: jwtPayload.aud,
      exp: new Date(jwtPayload.exp * 1000).toISOString(),
      iat: new Date(jwtPayload.iat * 1000).toISOString(),
    });

    // Sign JWT with RS256 algorithm (required for Salesforce)
    console.log('[JWT Auth] Signing JWT with RS256...');
    const assertion = jwt.sign(jwtPayload, privateKey, {
      algorithm: 'RS256',
    });
    console.log('[JWT Auth] JWT signed successfully, length:', assertion.length);
    console.log('[JWT Auth] ========================================');
    console.log('[JWT Auth] 🔑 JWT Token (for decoding):');
    console.log('[JWT Auth]', assertion);
    console.log('[JWT Auth] ========================================');
    console.log('[JWT Auth] 💡 Decode at: https://jwt.io/');

    // Exchange JWT for access token
    console.log('[JWT Auth] Exchanging JWT for access token at:', tokenExchangeUrl);
    const params = new URLSearchParams();
    params.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.set('assertion', assertion);

    const tokenResp = await fetch(tokenExchangeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    console.log('[JWT Auth] Token exchange response status:', tokenResp.status, tokenResp.statusText);

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      console.error('[JWT Auth] Token exchange failed:', text);
      return NextResponse.json({
        error: 'JWT token exchange failed',
        detail: text
      }, { status: 502 });
    }

    const tokenData = await tokenResp.json();
    const access_token: string | undefined = tokenData.access_token;
    const issued_instance_url: string | undefined = tokenData.instance_url;

    console.log('[JWT Auth] Token exchange successful:');
    console.log('  - Access token:', access_token ? `${access_token.substring(0, 20)}...` : 'MISSING');
    console.log('  - Instance URL:', issued_instance_url || 'MISSING');

    if (!access_token || !issued_instance_url) {
      console.error('[JWT Auth] Missing access_token or instance_url in response');
      return NextResponse.json({ error: 'Missing access_token or instance_url' }, { status: 502 });
    }

    // Generate frontdoor URL using the singleaccess endpoint (as per documentation)
    // Reference: https://developer.salesforce.com/docs/analytics/sdk/guide/sdk-access-token.html
    const cleanInstanceUrl = issued_instance_url.replace(/\/+$/, '');
    const frontdoorServiceUrl = `${cleanInstanceUrl}/services/oauth2/singleaccess`;

    let frontdoor_url: string | null = null;

    try {
      const myHeaders = new Headers();
      myHeaders.append('accept', 'application/json');
      myHeaders.append('authorization', `Bearer ${access_token}`);
      myHeaders.append('content-type', 'application/x-www-form-urlencoded');

      const urlencoded = new URLSearchParams();

      const response = await fetch(frontdoorServiceUrl, {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded
      });

      if (!response.ok) {
        console.warn(`[JWT Auth] Salesforce API responded with ${response.status}`);
      } else {
        const responseData = await response.json();
        frontdoor_url = responseData.frontdoor_uri || null;
        console.log('[JWT Auth] Frontdoor URL generated successfully');
      }
    } catch (error: any) {
      console.error('[JWT Auth] Error in getFrontdoorUrl:', error);
    }

    // Use frontdoor URL as authCredential (as per documentation)
    // If frontdoor URL generation fails, fallback to access token
    const authCredential = frontdoor_url || access_token;
    if (!frontdoor_url) {
      console.warn('[JWT Auth] Frontdoor URL generation failed, using access token as fallback');
    }

    // Return frontdoor URL as authCredential (preferred for SDK) or access token as fallback
    return NextResponse.json({
      authCredential: authCredential, // Frontdoor URL preferred for SDK
      access_token: access_token, // Also return raw token for reference
      instance_url: issued_instance_url,
      frontdoor_url: frontdoor_url,
      jwt_token: assertion, // JWT token for debugging (can be decoded at jwt.io)
    });
  } catch (e: any) {
    console.error('[JWT Auth] Unexpected error:', e.message);
    console.error('[JWT Auth] Stack:', e.stack);
    return NextResponse.json({
      error: 'Unexpected error',
      detail: e?.message || String(e)
    }, { status: 500 });
  }
}

