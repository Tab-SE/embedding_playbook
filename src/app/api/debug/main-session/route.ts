import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// TEMP DIAGNOSTIC — delete when done.
// Same probe shape as /api/debug/ubl-session but pointed at the main
// (embeddingplaybook) site. Use to compare what works on the main site vs
// what's failing on UBL — anything that returns differently is a site-level
// config difference between the two Tableau sites.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = await getToken({ req } as any);
  if (!token?.tableau) {
    return NextResponse.json(
      { error: 'no main-site session on NextAuth token' },
      { status: 401 },
    );
  }

  const { rest_key, site_id, user_id, site } = token.tableau as {
    rest_key: string;
    site_id: string;
    user_id: string;
    site: string;
  };
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const api = process.env.TABLEAU_API;

  const endpoints = [
    { label: 'sessions/current', path: `/api/${api}/sessions/current` },
    { label: 'site (current)', path: `/api/${api}/sites/${site_id}` },
    { label: 'workbooks (top 1)', path: `/api/${api}/sites/${site_id}/workbooks?pageSize=1` },
    { label: 'datasources (top 1)', path: `/api/${api}/sites/${site_id}/datasources?pageSize=1` },
    { label: 'users/current', path: `/api/${api}/sites/${site_id}/users/${user_id}` },
  ];

  const probes = await Promise.all(
    endpoints.map(async (e) => {
      const url = `${domain}${e.path}`;
      try {
        const res = await fetch(url, {
          headers: {
            'X-Tableau-Auth': rest_key,
            'Accept': 'application/json',
          },
        });
        let body: unknown;
        try {
          body = await res.json();
        } catch {
          body = (await res.text()).slice(0, 300);
        }
        return { label: e.label, url, status: res.status, body };
      } catch (err: any) {
        return { label: e.label, url, status: 'fetch_error', body: err?.message };
      }
    }),
  );

  return NextResponse.json(
    {
      probes,
      session_meta: {
        site_id_from_session: site_id,
        user_id_from_session: user_id,
        site_contentUrl_from_session: site,
        rest_key_prefix: rest_key.slice(0, 8),
        rest_key_suffix: rest_key.slice(-8),
        rest_key_len: rest_key.length,
        rest_key_pipes: (rest_key.match(/\|/g) || []).length,
      },
    },
    { status: 200 },
  );
}
