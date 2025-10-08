import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  try {
    // Get JWT token which contains the Tableau authentication data
    const token = await getToken({ req: request });

    if (!token?.tableau) {
      return NextResponse.json({ error: 'Not authenticated or missing Tableau data' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workbookId = searchParams.get('workbookId');

    // Extract Tableau data from JWT token
    const { tableau } = token;
    const siteId = tableau.site_id;
    const jwtToken = tableau.rest_token; // This is the JWT REST token

    console.log('➡️ Backend: Received request for views:', {
      siteId,
      workbookId,
      hasJWT: !!jwtToken,
      userEmail: token.email
    });

    if (!siteId || !workbookId || !jwtToken) {
      return NextResponse.json({
        error: 'Missing authentication data from JWT token or workbookId',
        details: { hasSiteId: !!siteId, hasWorkbookId: !!workbookId, hasJWT: !!jwtToken }
      }, { status: 400 });
    }

    // First, authenticate with Tableau using the JWT token
    console.log('🔐 Authenticating with Tableau using JWT...');

    const authUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}/api/3.26/auth/signin`;
    const authBody = `
      <tsRequest>
        <credentials jwt="${jwtToken}">
          <site contentUrl="${tableau.site || ''}" />
        </credentials>
      </tsRequest>
    `;

    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: authBody
    });

    if (!authResponse.ok) {
      const authErrorText = await authResponse.text();
      console.error('❌ Tableau Auth Error:', {
        status: authResponse.status,
        statusText: authResponse.statusText,
        url: authResponse.url,
        errorDetails: authErrorText
      });
      return NextResponse.json({
        error: `Tableau Authentication Error: ${authResponse.status} ${authResponse.statusText}`,
        details: authErrorText
      }, { status: authResponse.status });
    }

    const authXml = await authResponse.text();
    console.log('✅ Tableau auth response:', authXml.substring(0, 500) + '...');

    // Extract session token from auth response
    const sessionTokenMatch = authXml.match(/<credentials[^>]*token="([^"]*)"[^>]*>/);
    if (!sessionTokenMatch || !sessionTokenMatch[1]) {
      console.error('❌ Could not extract session token from auth response');
      return NextResponse.json({
        error: 'Failed to extract session token from Tableau auth response'
      }, { status: 500 });
    }

    const sessionToken = sessionTokenMatch[1];
    console.log('🎯 Got Tableau session token:', sessionToken.substring(0, 20) + '...');

    const tableauApiUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}/api/3.19/sites/${siteId}/workbooks/${workbookId}/views`;

    console.log('📡 Backend: Calling Tableau REST API for views:', tableauApiUrl);

    const response = await fetch(tableauApiUrl, {
      headers: {
        'X-Tableau-Auth': sessionToken,
        'Content-Type': 'application/xml'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend: Tableau Views API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorDetails: errorText
      });
      return NextResponse.json({ error: `Tableau Views API Error: ${response.status} ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const xmlText = await response.text();
    console.log('✅ Backend: Got views XML response:', xmlText.substring(0, 500) + '...');

    // Parse XML and extract views - use regex for server-side parsing
    const parseViewsXML = (xmlString) => {
      const views = [];

      // Extract view elements using regex
      const viewMatches = xmlString.match(/<view[^>]*\/?>|<view[^>]*>.*?<\/view>/gs) || [];

      viewMatches.forEach(viewXml => {
        // Extract attributes using regex
        const getAttr = (name) => {
          const match = viewXml.match(new RegExp(`${name}="([^"]*)"`, 'i'));
          return match ? match[1] : '';
        };

        const viewData = {
          id: getAttr('id'),
          name: getAttr('name'),
          contentUrl: getAttr('contentUrl'),
          workbookId: workbookId,
          createdAt: getAttr('createdAt'),
          updatedAt: getAttr('updatedAt'),
          viewUrlName: getAttr('viewUrlName')
        };

        views.push(viewData);
      });

      return views;
    };

    const views = parseViewsXML(xmlText);

    console.log('✅ Backend: Returning views:', {
      count: views.length,
      workbookId
    });

    return NextResponse.json({ views });

  } catch (error) {
    console.error('❌ Backend: Error fetching views:', error);
    return NextResponse.json({ error: 'Failed to fetch views', details: error.message }, { status: 500 });
  }
}
