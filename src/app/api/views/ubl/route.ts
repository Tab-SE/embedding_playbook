import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

// GraphQL: minimal query — we only need the LUID of every dashboard so we can
// intersect with the REST /views response and drop worksheets.
const DASHBOARDS_QUERY = `
query GetDashboards {
  dashboards {
    luid
  }
}
`;

export async function GET(req: Request) {
  const token = await getToken({ req } as any);

  if (!token?.tableau_ubl) {
    return NextResponse.json({ error: '401: Unauthorized (no ubl session)' }, { status: 401 });
  }

  const { rest_key, site_id } = token.tableau_ubl as { rest_key: string; site_id: string };
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL;
  const api = process.env.TABLEAU_API;

  if (!domain) {
    return NextResponse.json({ error: '500: NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL not configured' }, { status: 500 });
  }

  const viewsUrl = `${domain}/api/${api}/sites/${site_id}/views?pageSize=1000`;
  const metadataUrl = `${domain}/api/metadata/graphql`;

  // Fan out: REST views (permission-filtered for the user) and Metadata API
  // dashboard LUIDs (site-wide, not permission-filtered — but we only use it
  // as a type filter, so the REST permission scope still wins).
  const [viewsRes, metadataRes] = await Promise.all([
    fetch(viewsUrl, {
      headers: {
        'X-Tableau-Auth': rest_key,
        'Accept': 'application/json',
      },
    }),
    fetch(metadataUrl, {
      method: 'POST',
      headers: {
        'X-Tableau-Auth': rest_key,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query: DASHBOARDS_QUERY, variables: null }),
    }),
  ]);

  if (!viewsRes.ok) {
    const text = await viewsRes.text();
    console.error(`[/api/views/ubl] views fetch failed ${viewsRes.status}:`, text);
    return NextResponse.json({ error: text }, { status: viewsRes.status });
  }

  const viewsData = await viewsRes.json();
  const rawCount = viewsData.views?.view?.length ?? 0;
  const totalAvailable = viewsData.pagination?.totalAvailable;

  // Build the dashboard-LUID set. If the Metadata API call fails we fall back
  // to returning every view (worksheets included) and log loudly — better to
  // show too much than to show nothing if metadata is temporarily down.
  let dashboardLuids: Set<string> | null = null;
  if (metadataRes.ok) {
    try {
      const metadataData = await metadataRes.json();
      if (metadataData.errors) {
        console.error('[/api/views/ubl] metadata graphql errors:', metadataData.errors);
      } else {
        const luids: string[] = (metadataData.data?.dashboards ?? [])
          .map((d: any) => d?.luid)
          .filter((luid: unknown): luid is string => typeof luid === 'string' && luid.length > 0);
        dashboardLuids = new Set(luids);
        console.log(`[/api/views/ubl] metadata returned dashboards=${dashboardLuids.size}`);
      }
    } catch (e) {
      console.error('[/api/views/ubl] metadata graphql parse error:', e);
    }
  } else {
    const text = await metadataRes.text().catch(() => '');
    console.error(`[/api/views/ubl] metadata fetch failed ${metadataRes.status}:`, text);
  }

  const allViews = (viewsData.views?.view ?? []).map((v: any) => ({
    id: v.id,
    name: v.name,
    contentUrl: v.contentUrl,
    workbookName: v.owner?.name ?? v.contentUrl?.split('/')[0] ?? '',
  }));

  const views = dashboardLuids
    ? allViews.filter((v: any) => dashboardLuids!.has(v.id))
    : allViews;

  console.log(`[/api/views/ubl] site_id=${site_id} rest=${rawCount} totalAvailable=${totalAvailable ?? 'unknown'} dashboards=${views.length}`);

  if (rawCount === 0) {
    // also try listing workbooks to see if the user can see anything at all on this site
    try {
      const wbRes = await fetch(`${domain}/api/${api}/sites/${site_id}/workbooks?pageSize=10`, {
        headers: { 'X-Tableau-Auth': rest_key, 'Accept': 'application/json' },
      });
      if (wbRes.ok) {
        const wbData = await wbRes.json();
        const wbCount = wbData.workbooks?.workbook?.length ?? 0;
        const wbNames = (wbData.workbooks?.workbook ?? []).map((w: any) => w.name);
        console.log(`[/api/views/ubl] diagnostic workbooks=${wbCount} names=${JSON.stringify(wbNames)}`);
      } else {
        console.log(`[/api/views/ubl] diagnostic workbooks fetch failed ${wbRes.status}`);
      }
    } catch (e) {
      console.log('[/api/views/ubl] diagnostic workbooks fetch threw', e);
    }
  }

  return NextResponse.json(views, { status: 200 });
}
