import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

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

  const url = `${domain}/api/${api}/sites/${site_id}/views?pageSize=1000`;

  const res = await fetch(url, {
    headers: {
      'X-Tableau-Auth': rest_key,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[/api/views/ubl] views fetch failed ${res.status}:`, text);
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  const rawCount = data.views?.view?.length ?? 0;
  const totalAvailable = data.pagination?.totalAvailable;
  const views = (data.views?.view ?? []).map((v: any) => ({
    id: v.id,
    name: v.name,
    contentUrl: v.contentUrl,
    workbookName: v.owner?.name ?? v.contentUrl?.split('/')[0] ?? '',
  }));

  console.log(`[/api/views/ubl] site_id=${site_id} returned views=${rawCount} totalAvailable=${totalAvailable ?? 'unknown'}`);
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
