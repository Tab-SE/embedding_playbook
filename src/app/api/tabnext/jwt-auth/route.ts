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
    let privateKey: string;
    if (sfPrivateKeyPath) {
      try {
        const keyPath = join(process.cwd(), sfPrivateKeyPath);
        console.log('[JWT Auth] Reading private key from file:', keyPath);
        privateKey = readFileSync(keyPath, 'utf8');
        console.log('[JWT Auth] Private key loaded successfully, length:', privateKey.length);
      } catch (e: any) {
        console.error('[JWT Auth] Failed to read private key file:', e.message);
        return NextResponse.json({ error: 'Failed to read private key file', detail: e.message }, { status: 500 });
      }
    } else if (sfPrivateKey) {
      console.log('[JWT Auth] Using private key from environment variable');
      privateKey = sfPrivateKey.replace(/\\n/g, '\n'); // Handle escaped newlines in env var
      console.log('[JWT Auth] Private key loaded from env, length:', privateKey.length);
    } else {
      console.error('[JWT Auth] Missing SALESFORCE_PRIVATE_KEY or SALESFORCE_PRIVATE_KEY_PATH');
      return NextResponse.json({ error: 'Missing SALESFORCE_PRIVATE_KEY or SALESFORCE_PRIVATE_KEY_PATH' }, { status: 500 });
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

    // Generate frontdoor URL if needed
    // Remove trailing slashes from instance URL
    const cleanInstanceUrl = issued_instance_url.replace(/\/+$/, '');
    
    // Try multiple methods to get frontdoor URL
    let frontdoor_url: string | null = null;
    
    // Method 1: Try the singleaccess endpoint (may require specific scopes)
    const frontdoorServiceUrl = `${cleanInstanceUrl}/services/oauth2/singleaccess`;
    console.log('[JWT Auth] Attempting to generate frontdoor URL at:', frontdoorServiceUrl);
    
    try {
      const fdResp = await fetch(frontdoorServiceUrl, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('[JWT Auth] Frontdoor URL response status:', fdResp.status);

      if (fdResp.ok) {
        const fdData = await fdResp.json();
        frontdoor_url = fdData.frontdoor_uri || fdData.url || null;
        console.log('[JWT Auth] Frontdoor URL generated successfully:', frontdoor_url ? 'Yes' : 'No');
      } else {
        const errorText = await fdResp.text();
        console.warn('[JWT Auth] Frontdoor URL generation failed:', errorText);
        console.warn('[JWT Auth] This is often due to missing scopes. The SDK may still work with access_token.');
      }
    } catch (e: any) {
      console.warn('[JWT Auth] Frontdoor URL generation error:', e.message);
    }
    
    // Method 2: If singleaccess fails, try constructing frontdoor URL manually
    // Frontdoor URLs typically follow this pattern:
    // https://<instance>/secur/frontdoor.jsp?sid=<access_token>
    if (!frontdoor_url) {
      console.log('[JWT Auth] Attempting to construct frontdoor URL manually...');
      try {
        // Convert to Lightning domain if needed
        const lightningUrl = cleanInstanceUrl.replace(/\.my\.salesforce\.com/, '.lightning.force.com');
        frontdoor_url = `${lightningUrl}/secur/frontdoor.jsp?sid=${access_token}`;
        console.log('[JWT Auth] Constructed frontdoor URL manually');
      } catch (e: any) {
        console.warn('[JWT Auth] Failed to construct frontdoor URL:', e.message);
      }
    }

    // Try frontdoor URL first (SDK may require it), fallback to access token
    // The SDK documentation suggests using frontdoor URL for better compatibility
    const authCredential = frontdoor_url || access_token;
    if (frontdoor_url) {
      console.log('[JWT Auth] Using frontdoor_url as authCredential (SDK preferred)');
      console.log('[JWT Auth] Frontdoor URL format:', frontdoor_url.substring(0, 100) + '...');
    } else {
      console.log('[JWT Auth] Using access_token as authCredential (frontdoor URL not available)');
      console.warn('[JWT Auth] ⚠️  Frontdoor URL generation failed - SDK may not work with access token alone');
    }
    console.log('[JWT Auth] Success! Auth credential length:', authCredential.length);

    // Return frontdoor URL as authCredential (preferred for SDK) or access token as fallback
    return NextResponse.json({
      authCredential: authCredential, // Frontdoor URL preferred for SDK
      access_token: access_token, // Also return raw token for reference
      instance_url: issued_instance_url,
      frontdoor_url: frontdoor_url,
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

