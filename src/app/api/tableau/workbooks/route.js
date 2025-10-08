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
    const pageSize = searchParams.get('pageSize') || '100';
    const pageNumber = searchParams.get('page') || '1';

        // Extract Tableau data from JWT token
        const { tableau } = token;
        const siteId = tableau.site_id;
        const userId = tableau.user_id;
        const jwtToken = tableau.rest_token; // This is the JWT REST token

        console.log('➡️ Backend: Received request for workbooks:', {
          siteId,
          userId,
          hasJWT: !!jwtToken,
          pageSize,
          pageNumber,
          userEmail: token.email
        });

        if (!siteId || !userId || !jwtToken) {
          return NextResponse.json({
            error: 'Missing authentication data from JWT token',
            details: { hasSiteId: !!siteId, hasUserId: !!userId, hasJWT: !!jwtToken }
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

    // Use general workbooks endpoint with filter for Veriforce project only
    const url = `${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}/api/3.26/sites/${siteId}/workbooks`;

    const params = new URLSearchParams({
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString(),
      // filter: 'projectName:eq:Veriforce'  // Only get workbooks from Veriforce project
    });

    console.log('📡 Backend: Making API call to:', `${url}?${params}`);

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'X-Tableau-Auth': sessionToken,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      }
    });

    if (!response.ok) {
      console.error('❌ Backend: Tableau API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      const errorText = await response.text();
      console.error('❌ Backend: Error response:', errorText);

      return NextResponse.json(
        {
          error: `Tableau API Error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const xmlText = await response.text();
    console.log('✅ Backend: Got XML response:', xmlText.substring(0, 500) + '...');

    // Parse XML and extract workbooks - use a simple XML parser for Node.js
    const parseXML = (xmlString) => {
      const workbooks = [];

      // Extract workbook elements using regex (simple approach for server-side)
      const workbookMatches = xmlString.match(/<workbook[^>]*>.*?<\/workbook>/gs) || [];

      workbookMatches.forEach(workbookXml => {
        // Extract attributes using regex
        const getAttr = (name) => {
          const match = workbookXml.match(new RegExp(`${name}="([^"]*)"`, 'i'));
          return match ? match[1] : '';
        };

        // Extract project info
        const projectMatch = workbookXml.match(/<project[^>]*>/i);
        const projectId = projectMatch ? projectMatch[0].match(/id="([^"]*)"/)?.[1] || '' : '';
        const projectName = projectMatch ? projectMatch[0].match(/name="([^"]*)"/)?.[1] || '' : '';

        const workbook = {
          id: getAttr('id'),
          name: getAttr('name'),
          description: getAttr('description'),
          contentUrl: getAttr('contentUrl'),
          webPageUrl: getAttr('webpageUrl'),
          showTabs: getAttr('showTabs') === 'true',
          size: parseInt(getAttr('size') || '0'),
          createdAt: getAttr('createdAt'),
          updatedAt: getAttr('updatedAt'),
          encryptExtracts: getAttr('encryptExtracts') === 'true',
          defaultViewId: getAttr('defaultViewId'),
          projectId: projectId,
          projectName: projectName
        };

        workbooks.push(workbook);
      });

      return workbooks;
    };

    const workbooks = parseXML(xmlText);

    // Get pagination info using regex
    const paginationMatch = xmlText.match(/<pagination[^>]*>/i);
    let totalAvailable = 0;
    let pageSizeAttr = 0;
    let pageNumberAttr = 0;

    if (paginationMatch) {
      const paginationXml = paginationMatch[0];
      totalAvailable = parseInt(paginationXml.match(/totalAvailable="([^"]*)"/)?.[1] || '0');
      pageSizeAttr = parseInt(paginationXml.match(/pageSize="([^"]*)"/)?.[1] || '0');
      pageNumberAttr = parseInt(paginationXml.match(/pageNumber="([^"]*)"/)?.[1] || '0');
    }

    console.log('✅ Backend: Returning workbooks:', {
      count: workbooks.length,
      totalAvailable,
      pageSize: pageSizeAttr,
      pageNumber: pageNumberAttr,
      hasMore: parseInt(pageNumber) * parseInt(pageSize) < totalAvailable
    });

    return NextResponse.json({
      workbooks,
      pagination: {
        totalAvailable,
        pageSize: pageSizeAttr,
        pageNumber: pageNumberAttr,
        hasMore: parseInt(pageNumber) * parseInt(pageSize) < totalAvailable
      }
    });

  } catch (error) {
    console.error('❌ Backend: Error in workbooks API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
