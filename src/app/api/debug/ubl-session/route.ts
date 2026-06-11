import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// TEMP DIAGNOSTIC — delete when done.
// Calls Tableau's /sessions/current directly with the user's tableau_ubl.rest_key
// to see what Tableau returns for a token that the MCP server is rejecting.
// Bypasses MCP entirely — isolates whether the 500000 is from Tableau or MCP.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = await getToken({ req } as any);
  if (!token?.tableau_ubl) {
    return NextResponse.json({ error: 'no UBL session on NextAuth token' }, { status: 401 });
  }

  const { rest_key, site_id, user_id, site } = token.tableau_ubl as {
    rest_key: string;
    site_id: string;
    user_id: string;
    site: string;
  };
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL;
  const api = process.env.TABLEAU_API;

  // Probe REST endpoints to enumerate what slopez can actually access on UBL.
  // Goal: confirm whether published datasources exist for her, what workbooks
  // and views she sees, and whether MCP's list-datasources should be returning
  // anything.
  const endpoints = [
    { label: 'datasources (all)', path: `/api/${api}/sites/${site_id}/datasources?pageSize=1000` },
    { label: 'workbooks (all)', path: `/api/${api}/sites/${site_id}/workbooks?pageSize=1000` },
    { label: 'views (all)', path: `/api/${api}/sites/${site_id}/views?pageSize=1000` },
    { label: 'projects (all)', path: `/api/${api}/sites/${site_id}/projects?pageSize=1000` },
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
