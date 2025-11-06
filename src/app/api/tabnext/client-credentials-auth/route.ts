import { NextRequest, NextResponse } from 'next/server';

/**
 * Client Credentials Flow for Salesforce External Client Apps
 * This is a simpler flow that doesn't require user-specific authentication
 * Uses client_id and client_secret to get an access token
 * Then generates a frontdoor URL for Tableau Next SDK
 */
export async function POST(req: NextRequest) {
  try {
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

    // Step 1: Get access token using Client Credentials flow
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

    // Step 2: Generate frontdoor URL for Tableau Next SDK
    // The frontdoor URL is used as the authCredential for the SDK
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
      } else {
        const errorText = await fdResp.text();
        console.warn('Frontdoor URL generation failed:', errorText);
        // Continue without frontdoor URL - access token can be used directly
      }
    } catch (e) {
      console.warn('Frontdoor URL generation error:', e);
      // Continue without frontdoor URL
    }

    // Return the frontdoor URL as authCredential (preferred) or access token as fallback
    return NextResponse.json({
      authCredential: frontdoor_url || access_token, // Frontdoor URL preferred for SDK
      access_token: access_token, // Also return raw token for reference
      instance_url: instance_url,
      frontdoor_url: frontdoor_url,
    });
  } catch (e: any) {
    return NextResponse.json({ 
      error: 'Unexpected error', 
      detail: e?.message || String(e) 
    }, { status: 500 });
  }
}

