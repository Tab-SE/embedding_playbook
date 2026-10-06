import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

const DASHBOARDS_QUERY = `
query GetDashboards {
  dashboards {
    luid
  }
}
`;

export async function GET(req: Request) {
  const token = await getToken({ req } as any);

  if (!token?.tableau) {
    return NextResponse.json({ error: '401: Unauthorized (no tableau session)' }, { status: 401 });
  }

  const { rest_key, site_id } = token.tableau as { rest_key: string; site_id: string };
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const api = process.env.TABLEAU_API;

  if (!domain) {
    return NextResponse.json({ error: '500: NEXT_PUBLIC_ANALYTICS_DOMAIN not configured' }, { status: 500 });
  }

  const viewsUrl = `${domain}/api/${api}/sites/${site_id}/views?pageSize=1000`;
  const metadataUrl = `${domain}/api/metadata/graphql`;

  const [viewsRes, metadataRes] = await Promise.all([
    fetch(viewsUrl, {
      headers: { 'X-Tableau-Auth': rest_key, 'Accept': 'application/json' },
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
    console.error(`[/api/views] views fetch failed ${viewsRes.status}:`, text);
    return NextResponse.json({ error: text }, { status: viewsRes.status });
  }

  const viewsData = await viewsRes.json();
  const rawCount = viewsData.views?.view?.length ?? 0;

  let dashboardLuids: Set<string> | null = null;
  if (metadataRes.ok) {
    try {
      const metadataData = await metadataRes.json();
      if (!metadataData.errors) {
        const luids: string[] = (metadataData.data?.dashboards ?? [])
          .map((d: any) => d?.luid)
          .filter((luid: unknown): luid is string => typeof luid === 'string' && luid.length > 0);
        dashboardLuids = new Set(luids);
      }
    } catch (e) {
      console.error('[/api/views] metadata graphql parse error:', e);
    }
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

  console.log(`[/api/views] site_id=${site_id} rest=${rawCount} dashboards=${views.length}`);

  return NextResponse.json(views, { status: 200 });
}
