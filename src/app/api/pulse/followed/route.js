export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
const PULSE = `${domain}/api/-/pulse`;

const pulseGet = async (path, restKey) => {
  const res = await fetch(`${PULSE}${path}`, {
    headers: { 'X-Tableau-Auth': restKey, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pulse GET ${path.split('?')[0]} -> ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
};

// Returns the Pulse metrics the signed-in user follows, as embed-ready src URLs.
// Rendering is done client-side by the <tableau-pulse> web component; this route
// only answers "which metrics", which the web component has no API for.
export async function GET(req) {
  const token = await getToken({ req });
  const restKey = token?.tableau?.rest_key;
  const userId = token?.tableau?.user_id;
  if (!restKey || !userId) {
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }

  try {
    // 1. followed metric IDs (paged)
    const metricIds = [];
    let pageToken = '';
    do {
      const qs = new URLSearchParams({ user_id: userId, page_size: '100' });
      if (pageToken) qs.set('page_token', pageToken);
      const page = await pulseGet(`/subscriptions?${qs}`, restKey);
      for (const s of page.subscriptions ?? []) metricIds.push(s.metric_id);
      pageToken = page.next_page_token || '';
    } while (pageToken);

    // The subscriptions list can contain the same metric more than once; show each metric once.
    const uniqueIds = [...new Set(metricIds)];
    metricIds.length = 0;
    metricIds.push(...uniqueIds);

    if (metricIds.length === 0) return NextResponse.json({ metrics: [] });

    // 2. names: metric -> definition -> definition name
    const { metrics = [] } = await pulseGet(`/metrics:batchGet?metric_ids=${metricIds.join(',')}`, restKey);
    const defIds = [...new Set(metrics.map((m) => m.definition_id).filter(Boolean))];
    const { definitions = [] } = defIds.length
      ? await pulseGet(`/definitions:batchGet?definition_ids=${defIds.join(',')}`, restKey)
      : {};
    const defName = Object.fromEntries(definitions.map((d) => [d.metadata.id, d.metadata.name]));
    const metricById = Object.fromEntries(metrics.map((m) => [m.id, m]));

    const payload = metricIds.map((id) => ({
      id,
      name: defName[metricById[id]?.definition_id] ?? 'Pulse metric',
      src: `${domain}/pulse/site/${site}/metrics/${id}`,
    }));
    return NextResponse.json({ metrics: payload });
  } catch (err) {
    console.error('[pulse/followed]', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
