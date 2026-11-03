import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

// Returns the server-side half of "Data Details" for an embedded view:
//   REST API      -> view LUID, total view count
//   Metadata API  -> workbook/project/owner/last modified, data sources, certification,
//                    data quality warnings, lineage (tables/databases), fields + formulas,
//                    fields used in the view
// Each Metadata query runs independently so one unsupported field (or a site without
// Data Management) doesn't blank the whole panel. Failures are returned in `errors`.

type Session = { rest_key: string; site_id: string; site?: string };
type StepError = { step: string; message: string };

const SESSIONS = [
  { key: 'tableau_ubl', domain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_UBL },
  { key: 'tableau_eacanada', domain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN_EACANADA },
  { key: 'tableau', domain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN },
];

const WARNING_FIELDS = `id isActive isElevated value category message createdAt updatedAt`;

// "https://host/t/site/views/Workbook/View?:embed=y" -> { origin, site, workbook, view }
function parseViewUrl(src: string) {
  const url = new URL(src);
  const parts = url.pathname.split('/').filter(Boolean);
  let site = '';
  if (parts[0] === 't') { site = parts[1]; parts.splice(0, 2); }
  if (parts[0] !== 'views' || parts.length < 3) return null;
  return { origin: url.origin, site, workbook: parts[1], view: parts[2] };
}

function pickSession(token: any, origin: string, site: string) {
  const candidates = SESSIONS
    .filter((s) => s.domain && safeOrigin(s.domain) === origin && token?.[s.key]?.rest_key)
    .map((s) => ({ key: s.key, domain: s.domain as string, session: token[s.key] as Session }));
  return candidates.find((c) => c.session.site === site) ?? candidates[0] ?? null;
}

function safeOrigin(u: string) {
  try { return new URL(u).origin; } catch { return null; }
}

async function gql(domain: string, restKey: string, query: string) {
  const res = await fetch(`${domain}/api/metadata/graphql`, {
    method: 'POST',
    headers: { 'X-Tableau-Auth': restKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: null }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  if (json.errors?.length) throw new Error(json.errors.map((e: any) => e.message).join('; '));
  return json.data;
}

// runs a step, records the failure instead of throwing
async function step<T>(name: string, errors: StepError[], fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e: any) {
    const message = e?.message || String(e);
    console.error(`[/api/data-details] ${name} failed:`, message);
    errors.push({ step: name, message });
    return null;
  }
}

const list = (ids: string[]) => JSON.stringify([...new Set(ids)]);

export async function GET(req: Request) {
  const src = new URL(req.url).searchParams.get('src');
  if (!src) return NextResponse.json({ error: 'Missing ?src=' }, { status: 400 });

  const parsed = (() => { try { return parseViewUrl(src); } catch { return null; } })();
  if (!parsed) return NextResponse.json({ error: `Unrecognized view URL: ${src}` }, { status: 400 });

  const token = await getToken({ req } as any);
  const match = pickSession(token, parsed.origin, parsed.site);
  if (!match) {
    return NextResponse.json({ error: `401: no Tableau session for ${parsed.origin}` }, { status: 401 });
  }

  const { domain } = match;
  const { rest_key, site_id } = match.session;
  const api = process.env.TABLEAU_API;
  const errors: StepError[] = [];

  // 1. REST: resolve view LUID + usage
  const contentUrl = `${parsed.workbook}/sheets/${parsed.view}`;
  const restView = await step('rest:view', errors, async () => {
    const headers = { 'X-Tableau-Auth': rest_key, Accept: 'application/json' };
    const base = `${domain}/api/${api}/sites/${site_id}/views?includeUsageStatistics=true`;
    let res = await fetch(`${base}&pageSize=100&filter=viewUrlName:eq:${encodeURIComponent(parsed.view)}`, { headers });
    if (!res.ok) res = await fetch(`${base}&pageSize=1000`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const views = (await res.json()).views?.view ?? [];
    const v = views.find((x: any) => x.contentUrl === contentUrl);
    if (!v) throw new Error(`View ${contentUrl} not found for this user`);
    return v;
  });

  if (!restView) {
    return NextResponse.json({ view: null, workbook: null, dataSources: [], errors }, { status: 200 });
  }
  const luid = JSON.stringify(restView.id);

  // 2. Metadata: view, workbook, sheets and the data sources they use
  const core = await step('metadata:core', errors, () => gql(domain, rest_key, `
    query {
      dashboards(filter: { luid: ${luid} }) {
        id name updatedAt
        workbook { id name description projectName createdAt updatedAt owner { name username } }
        sheets { id name upstreamDatasources { __typename id name } }
      }
      sheets(filter: { luid: ${luid} }) {
        id name updatedAt
        workbook { id name description projectName createdAt updatedAt owner { name username } }
        upstreamDatasources { __typename id name }
      }
    }`));

  const dash = core?.dashboards?.[0];
  const sheet = core?.sheets?.[0];
  const viewNode = dash ?? sheet ?? null;
  const sheetNodes: any[] = dash ? dash.sheets ?? [] : sheet ? [sheet] : [];
  const sheetIds = sheetNodes.map((s) => s.id);

  const dsRefs = new Map<string, { id: string; name: string; type: string }>();
  for (const s of sheetNodes) {
    for (const ds of s.upstreamDatasources ?? []) dsRefs.set(ds.id, { id: ds.id, name: ds.name, type: ds.__typename });
  }
  const embeddedIds = [...dsRefs.values()].filter((d) => d.type === 'EmbeddedDatasource').map((d) => d.id);
  const directPublishedIds = [...dsRefs.values()].filter((d) => d.type === 'PublishedDatasource').map((d) => d.id);

  // 3. Embedded data sources: extract info + which published source they point at
  const embedded = embeddedIds.length ? await step('metadata:embedded', errors, () => gql(domain, rest_key, `
    query {
      embeddedDatasources(filter: { idWithin: ${list(embeddedIds)} }) {
        id name hasExtracts extractLastRefreshTime
        upstreamDatasources { id name }
      }
    }`)) : null;

  const publishedIds = [
    ...directPublishedIds,
    ...(embedded?.embeddedDatasources ?? []).flatMap((e: any) => (e.upstreamDatasources ?? []).map((p: any) => p.id)),
  ];
  const allDsIds = [...embeddedIds, ...publishedIds];

  // 4-7 run in parallel
  const [published, lineage, fields, usedFields] = await Promise.all([
    publishedIds.length ? step('metadata:published', errors, () => gql(domain, rest_key, `
      query {
        publishedDatasources(filter: { idWithin: ${list(publishedIds)} }) {
          id name description hasExtracts extractLastRefreshTime
          isCertified
          dataQualityCertifications { isActive message authorDisplayName updatedAt }
          hasActiveWarning
          dataQualityWarnings { ${WARNING_FIELDS} }
        }
      }`)) : null,

    allDsIds.length ? step('metadata:lineage', errors, () => gql(domain, rest_key, `
      query {
        embeddedDatasources(filter: { idWithin: ${list(embeddedIds)} }) {
          id
          upstreamTables { id name fullName schema database { id name connectionType } }
          upstreamDatabases { id name connectionType }
        }
        publishedDatasources(filter: { idWithin: ${list(publishedIds)} }) {
          id
          upstreamTables { id name fullName schema database { id name connectionType } }
          upstreamDatabases { id name connectionType }
        }
      }`)) : null,

    allDsIds.length ? step('metadata:fields', errors, () => gql(domain, rest_key, `
      query {
        embeddedDatasources(filter: { idWithin: ${list(embeddedIds)} }) { id fields { ...F } }
        publishedDatasources(filter: { idWithin: ${list(publishedIds)} }) { id fields { ...F } }
      }
      fragment F on Field {
        __typename id name description isHidden
        ... on ColumnField { dataType role }
        ... on CalculatedField { dataType role formula }
      }`)) : null,

    sheetIds.length ? step('metadata:fieldsInView', errors, () => gql(domain, rest_key, `
      query {
        sheets(filter: { idWithin: ${list(sheetIds)} }) { id datasourceFields { id name } }
      }`)) : null,
  ]);

  // 8. Data quality warnings on upstream tables / databases (needs lineage ids)
  const allTables = [
    ...(lineage?.embeddedDatasources ?? []),
    ...(lineage?.publishedDatasources ?? []),
  ].flatMap((d: any) => d.upstreamTables ?? []);
  const allDbs = [
    ...(lineage?.embeddedDatasources ?? []),
    ...(lineage?.publishedDatasources ?? []),
  ].flatMap((d: any) => d.upstreamDatabases ?? []);

  const upstreamWarnings = (allTables.length || allDbs.length) ? await step('metadata:upstreamWarnings', errors, () => gql(domain, rest_key, `
    query {
      databaseTables(filter: { idWithin: ${list(allTables.map((t: any) => t.id))} }) { id dataQualityWarnings { ${WARNING_FIELDS} } }
      databases(filter: { idWithin: ${list(allDbs.map((d: any) => d.id))} }) { id dataQualityWarnings { ${WARNING_FIELDS} } }
    }`)) : null;

  // ---- assemble ----
  const byId = (arr: any[] | undefined) => new Map((arr ?? []).map((x: any) => [x.id, x]));
  const embeddedMap = byId(embedded?.embeddedDatasources);
  const publishedMap = byId(published?.publishedDatasources);
  const lineageMap = byId([...(lineage?.embeddedDatasources ?? []), ...(lineage?.publishedDatasources ?? [])]);
  const fieldsMap = byId([...(fields?.embeddedDatasources ?? []), ...(fields?.publishedDatasources ?? [])]);
  const warnMap = byId([...(upstreamWarnings?.databaseTables ?? []), ...(upstreamWarnings?.databases ?? [])]);
  const activeWarnings = (w: any[] | undefined) => (w ?? []).filter((x) => x.isActive);

  const usedFieldNames = new Set(
    (usedFields?.sheets ?? []).flatMap((s: any) => (s.datasourceFields ?? []).map((f: any) => f.name))
  );

  const shapeFields = (dsId: string) => (fieldsMap.get(dsId)?.fields ?? [])
    .filter((f: any) => !f.isHidden)
    .map((f: any) => ({
      name: f.name,
      description: f.description || null,
      formula: f.formula || null,
      dataType: f.dataType || null,
      role: f.role || null,
      isCalculated: f.__typename === 'CalculatedField',
      usedInView: usedFieldNames.has(f.name),
    }));

  const shapeLineage = (dsId: string) => {
    const l = lineageMap.get(dsId);
    return {
      tables: (l?.upstreamTables ?? []).map((t: any) => ({
        name: t.name,
        fullName: t.fullName,
        schema: t.schema,
        database: t.database?.name ?? null,
        connectionType: t.database?.connectionType ?? null,
        warnings: activeWarnings(warnMap.get(t.id)?.dataQualityWarnings),
      })),
      databases: (l?.upstreamDatabases ?? []).map((d: any) => ({
        name: d.name,
        connectionType: d.connectionType,
        warnings: activeWarnings(warnMap.get(d.id)?.dataQualityWarnings),
      })),
    };
  };

  const shapePublished = (id: string) => {
    const p = publishedMap.get(id);
    if (!p) return null;
    const cert = (p.dataQualityCertifications ?? []).find((c: any) => c.isActive);
    return {
      name: p.name,
      description: p.description || null,
      isCertified: !!p.isCertified,
      certificationNote: cert?.message || null,
      certifierDisplayName: cert?.authorDisplayName || null,
      hasExtracts: p.hasExtracts,
      extractLastRefreshTime: p.extractLastRefreshTime,
      warnings: activeWarnings(p.dataQualityWarnings),
    };
  };

  const dataSources = [...dsRefs.values()].map((ref) => {
    const e = embeddedMap.get(ref.id);
    const upstreamPublishedId = ref.type === 'PublishedDatasource'
      ? ref.id
      : e?.upstreamDatasources?.[0]?.id;
    // fields/lineage live on the published source when the workbook connects to one
    const sourceId = upstreamPublishedId && fieldsMap.has(upstreamPublishedId) ? upstreamPublishedId : ref.id;
    const lineageId = upstreamPublishedId && lineageMap.has(upstreamPublishedId) ? upstreamPublishedId : ref.id;
    const embeddedFields = shapeFields(ref.id);
    const publishedFields = upstreamPublishedId ? shapeFields(upstreamPublishedId) : [];
    return {
      id: ref.id,
      name: ref.name,
      type: ref.type,
      hasExtracts: e?.hasExtracts ?? null,
      extractLastRefreshTime: e?.extractLastRefreshTime ?? null,
      published: upstreamPublishedId ? shapePublished(upstreamPublishedId) : null,
      ...shapeLineage(lineageId),
      fields: mergeFields(embeddedFields, publishedFields, sourceId === ref.id),
    };
  });

  return NextResponse.json({
    view: {
      name: viewNode?.name ?? restView.name,
      type: dash ? 'dashboard' : 'sheet',
      totalViewCount: restView.usage?.totalViewCount != null ? Number(restView.usage.totalViewCount) : null,
      updatedAt: viewNode?.updatedAt ?? restView.updatedAt ?? null,
    },
    workbook: viewNode?.workbook
      ? {
          name: viewNode.workbook.name,
          description: viewNode.workbook.description || null,
          projectName: viewNode.workbook.projectName,
          owner: viewNode.workbook.owner?.name ?? viewNode.workbook.owner?.username ?? null,
          createdAt: viewNode.workbook.createdAt,
          updatedAt: viewNode.workbook.updatedAt,
        }
      : null,
    dataSources,
    errors,
  }, { status: 200 });
}

// Embedded fields win for names (that's what the viz shows); published fields
// fill in descriptions/formulas the embedded copy doesn't carry.
function mergeFields(embedded: any[], published: any[], preferEmbedded: boolean) {
  const out = new Map<string, any>();
  const primary = preferEmbedded || !published.length ? embedded : published;
  const secondary = primary === embedded ? published : embedded;
  for (const f of primary) out.set(f.name, { ...f });
  for (const f of secondary) {
    const existing = out.get(f.name);
    if (!existing) { out.set(f.name, { ...f }); continue; }
    existing.description ??= f.description;
    existing.formula ??= f.formula;
    existing.dataType ??= f.dataType;
    existing.role ??= f.role;
    existing.isCalculated ||= f.isCalculated;
    existing.usedInView ||= f.usedInView;
  }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
}
