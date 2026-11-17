"use client";
import { useEffect, useMemo, useState } from "react";
import {
  IconDatabase, IconRefresh, IconSearch, IconAlertTriangle, IconDiscountCheck,
  IconChevronDown, IconChevronRight, IconTable,
} from '@tabler/icons-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Badge,
  Input,
} from "components/ui";

// ---------------------------------------------------------------------------
// 1. Browser half: Tableau Embedding API v3
// ---------------------------------------------------------------------------

// getDataSourcesAsync() only exists on worksheets, so resolve them first
const getWorksheets = (activeSheet) => {
  if (!activeSheet) return [];
  switch (activeSheet.sheetType) {
    case 'dashboard':
      return activeSheet.worksheets;
    case 'story': {
      const contained = activeSheet.activeStoryPoint?.containedSheet;
      return contained ? getWorksheets(contained) : [];
    }
    default:
      return [activeSheet];
  }
};

export const loadEmbeddingDetails = async (viz) => {
  const workbook = viz?.workbook;
  const activeSheet = workbook?.activeSheet;
  if (!activeSheet) throw new Error('Viz is not interactive yet.');

  const byId = new Map();
  for (const ws of getWorksheets(activeSheet)) {
    for (const ds of await ws.getDataSourcesAsync()) {
      if (!byId.has(ds.id)) byId.set(ds.id, { ds, sheets: [] });
      byId.get(ds.id).sheets.push(ws.name);
    }
  }

  const dataSources = await Promise.all([...byId.values()].map(async ({ ds, sheets }) => {
    const [connections, tables] = await Promise.allSettled([
      ds.getConnectionSummariesAsync(),
      ds.getLogicalTablesAsync(),
    ]);
    return {
      name: ds.name,
      isExtract: ds.isExtract,
      isPublished: ds.isPublished,
      extractUpdateTime: ds.extractUpdateTime,
      sheets,
      connections: connections.status === 'fulfilled' ? connections.value.map((c) => ({ name: c.name, type: c.type })) : [],
      tables: tables.status === 'fulfilled' ? tables.value.map((t) => t.caption) : [],
      fields: ds.fields
        .filter((f) => !f.isHidden && !f.isGenerated)
        .map((f) => ({
          name: f.name,
          description: f.description || null,
          role: f.role,
          aggregation: f.aggregation,
          isCalculated: f.isCalculatedField,
          isCombined: f.isCombinedField,
        })),
    };
  }));

  return { workbookName: workbook.name, sheetName: activeSheet.name, dataSources };
};

// ---------------------------------------------------------------------------
// 2. Server half: /api/data-details (Metadata API + REST API)
// ---------------------------------------------------------------------------

const loadServerDetails = async (src) => {
  const res = await fetch(`/api/data-details?src=${encodeURIComponent(src)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  return body;
};

// ---------------------------------------------------------------------------
// 3. Merge: match data sources and fields by name
// ---------------------------------------------------------------------------

const norm = (s) => (s || '').trim().toLowerCase();

const mergeDetails = (emb, srv) => {
  const srvSources = srv?.dataSources ?? [];
  const used = new Set();

  const merged = emb.dataSources.map((e) => {
    const s = srvSources.find((x) => !used.has(x.id) && (norm(x.name) === norm(e.name) || norm(x.published?.name) === norm(e.name)));
    if (s) used.add(s.id);
    const srvFields = new Map((s?.fields ?? []).map((f) => [norm(f.name), f]));
    const fields = e.fields.map((f) => {
      const m = srvFields.get(norm(f.name));
      return {
        ...f,
        description: f.description || m?.description || null,
        formula: m?.formula || null,
        dataType: m?.dataType || null,
        usedInView: m?.usedInView ?? false,
      };
    });
    return { ...e, server: s ?? null, fields };
  });

  // server-only sources (e.g. Embedding API returned nothing for them)
  for (const s of srvSources) {
    if (used.has(s.id)) continue;
    merged.push({
      name: s.name, isExtract: s.hasExtracts, isPublished: s.type === 'PublishedDatasource' || !!s.published,
      extractUpdateTime: s.extractLastRefreshTime, sheets: [], connections: [], tables: [],
      server: s, fields: s.fields.map((f) => ({ ...f, aggregation: null, isCombined: false })),
    });
  }

  return merged.map((ds) => ({
    ...ds,
    fields: ds.fields.sort((a, b) => Number(b.usedInView) - Number(a.usedInView) || a.name.localeCompare(b.name)),
  }));
};

const collectWarnings = (dataSources) => dataSources.flatMap((ds) => [
  ...(ds.server?.published?.warnings ?? []).map((w) => ({ ...w, on: ds.server.published.name })),
  ...(ds.server?.tables ?? []).flatMap((t) => t.warnings.map((w) => ({ ...w, on: t.name }))),
  ...(ds.server?.databases ?? []).flatMap((d) => d.warnings.map((w) => ({ ...w, on: d.name }))),
]);

// ---------------------------------------------------------------------------
// 4. UI
// ---------------------------------------------------------------------------

export const DataDetails = ({ viz, src, open, onOpenChange }) => {
  const [emb, setEmb] = useState(null);
  const [srv, setSrv] = useState(null);
  const [embError, setEmbError] = useState(null);
  const [srvError, setSrvError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setEmbError(null);
    setSrvError(null);
    const vizSrc = viz?.src || src;
    const [e, s] = await Promise.allSettled([
      loadEmbeddingDetails(viz),
      vizSrc ? loadServerDetails(vizSrc) : Promise.reject(new Error('No view URL available')),
    ]);
    if (e.status === 'fulfilled') setEmb(e.value);
    else { console.error('DataDetails: Embedding API failed', e.reason); setEmbError(e.reason?.message || String(e.reason)); }
    if (s.status === 'fulfilled') {
      setSrv(s.value);
      if (s.value.errors?.length) console.warn('DataDetails: server steps failed', s.value.errors);
    } else { console.error('DataDetails: /api/data-details failed', s.reason); setSrvError(s.reason?.message || String(s.reason)); }
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dataSources = useMemo(
    () => mergeDetails(emb ?? { dataSources: [] }, srv),
    [emb, srv]
  );
  const warnings = useMemo(() => collectWarnings(dataSources), [dataSources]);
  const wb = srv?.workbook;
  const view = srv?.view;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <IconDatabase stroke={1.5} size={20} /> Data Details
          </SheetTitle>
          <SheetDescription>
            {view?.name || emb?.sheetName || 'Data used by this view'}
          </SheetDescription>
        </SheetHeader>

        {/* ---- View / workbook summary ---- */}
        {(wb || view) && (
          <dl className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
            {view?.totalViewCount != null && <Row label="Total views" value={view.totalViewCount.toLocaleString()} />}
            {wb?.name && <Row label="Workbook" value={wb.name} />}
            {wb?.projectName && <Row label="Project" value={wb.projectName} />}
            {wb?.owner && <Row label="Owner" value={wb.owner} />}
            {(view?.updatedAt || wb?.updatedAt) && <Row label="Last modified" value={formatTime(view?.updatedAt || wb.updatedAt)} />}
            {wb?.description && <Row label="Description" value={wb.description} />}
          </dl>
        )}

        {/* ---- Data quality warnings ---- */}
        {warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            {warnings.map((w, i) => <Warning key={`${w.id}-${i}`} w={w} />)}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <IconSearch size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
            <Input placeholder="Search fields" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-7 h-8" />
          </div>
          <button onClick={load} disabled={loading} title="Reload"
            className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-50">
            <IconRefresh size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {embError && <p className="mt-3 text-xs text-red-600">Embedding API: {embError}</p>}
        {srvError && <p className="mt-3 text-xs text-red-600">Server details unavailable: {srvError}</p>}
        {srv?.errors?.length > 0 && (
          <p className="mt-3 text-xs text-amber-600">
            Some details could not be loaded ({srv.errors.map((e) => e.step).join(', ')}). See browser console.
          </p>
        )}
        {loading && !emb && !srv && <p className="mt-4 text-sm text-stone-500">Loading…</p>}
        {!loading && (emb || srv) && dataSources.length === 0 && (
          <p className="mt-4 text-sm text-stone-500">No data sources found for this view.</p>
        )}

        <div className="mt-4 space-y-4">
          {dataSources.map((ds, i) => <DataSourceSection key={`${ds.name}-${i}`} ds={ds} query={query} />)}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ label, value }) => (
  <><dt className="text-stone-500">{label}</dt><dd className="break-words">{value}</dd></>
);

const Warning = ({ w }) => (
  <div className={`flex gap-2 rounded-md border p-2 text-xs ${w.isElevated
    ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
    : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200'}`}>
    <IconAlertTriangle size={16} className="shrink-0" />
    <div>
      <div className="font-semibold">{w.value || w.category || 'Data quality warning'}{w.on ? ` · ${w.on}` : ''}</div>
      {w.message && <div className="mt-0.5">{w.message}</div>}
      {w.updatedAt && <div className="mt-0.5 opacity-70">Updated {formatTime(w.updatedAt)}</div>}
    </div>
  </div>
);

const DataSourceSection = ({ ds, query }) => {
  const q = query.trim().toLowerCase();
  const fields = useMemo(() => q
    ? ds.fields.filter((f) => [f.name, f.description, f.formula].some((v) => v?.toLowerCase().includes(q)))
    : ds.fields, [ds.fields, q]);

  const pub = ds.server?.published;
  const isExtract = ds.isExtract ?? ds.server?.hasExtracts;
  const refreshed = ds.extractUpdateTime || ds.server?.extractLastRefreshTime || pub?.extractLastRefreshTime;
  const usedCount = ds.fields.filter((f) => f.usedInView).length;

  return (
    <section className="rounded-md border p-3 dark:border-stone-800">
      <h3 className="font-semibold flex items-center gap-1.5">
        {ds.name}
        {pub?.isCertified && <IconDiscountCheck size={16} className="text-sky-600" title="Certified" />}
      </h3>
      <div className="mt-1 flex flex-wrap gap-1">
        <Badge variant="secondary">{isExtract ? 'Extract' : 'Live'}</Badge>
        {(ds.isPublished || pub) && <Badge variant="secondary">Published</Badge>}
        {pub?.isCertified && <Badge variant="secondary">Certified</Badge>}
      </div>

      <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
        {pub?.description && <Row label="Description" value={pub.description} />}
        {pub?.isCertified && (pub.certifierDisplayName || pub.certificationNote) && (
          <Row label="Certified by" value={[pub.certifierDisplayName, pub.certificationNote].filter(Boolean).join(' — ')} />
        )}
        {isExtract && refreshed && <Row label="Extract refreshed" value={formatTime(refreshed)} />}
        {ds.connections.length > 0 && (
          <Row label="Connections" value={ds.connections.map((c) => `${c.name}${c.type ? ` (${c.type})` : ''}`).join(', ')} />
        )}
        {ds.sheets.length > 0 && <Row label="Used by" value={ds.sheets.join(', ')} />}
      </dl>

      <Lineage ds={ds} />

      <FieldGroup title="Fields used in this view" fields={fields.filter((f) => f.usedInView)} defaultOpen />
      <FieldGroup
        title={usedCount ? 'Other fields' : 'Fields'}
        fields={fields.filter((f) => !f.usedInView)}
        defaultOpen={!usedCount || !!q}
      />
      {fields.length === 0 && <p className="mt-3 text-xs text-stone-500">No matching fields.</p>}
    </section>
  );
};

const Lineage = ({ ds }) => {
  const tables = ds.server?.tables ?? [];
  const databases = ds.server?.databases ?? [];
  // fall back to Embedding API logical tables if Catalog lineage isn't available
  if (!tables.length && !databases.length && !ds.tables.length) return null;
  return (
    <div className="mt-3">
      <h4 className="text-xs font-medium uppercase tracking-wide text-stone-500">Lineage</h4>
      <ul className="mt-1 space-y-1 text-xs">
        {databases.map((d, i) => (
          <li key={`db-${i}`} className="flex items-center gap-1.5">
            <IconDatabase size={13} className="opacity-60" /> {d.name}
            {d.connectionType && <span className="text-stone-500">({d.connectionType})</span>}
            {d.warnings.length > 0 && <IconAlertTriangle size={13} className="text-amber-600" />}
          </li>
        ))}
        {tables.map((t, i) => (
          <li key={`t-${i}`} className="flex items-center gap-1.5 pl-4">
            <IconTable size={13} className="opacity-60" /> {t.fullName || t.name}
            {t.warnings.length > 0 && <IconAlertTriangle size={13} className="text-amber-600" />}
          </li>
        ))}
        {!tables.length && ds.tables.map((t, i) => (
          <li key={`lt-${i}`} className="flex items-center gap-1.5 pl-4">
            <IconTable size={13} className="opacity-60" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FieldGroup = ({ title, fields, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => setOpen(defaultOpen), [defaultOpen]);
  if (fields.length === 0) return null;
  return (
    <div className="mt-3">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-stone-500">
        {open ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
        {title} ({fields.length})
      </button>
      {open && (
        <ul className="mt-1 divide-y text-sm dark:divide-stone-800">
          {fields.map((f) => <FieldRow key={f.name} f={f} />)}
        </ul>
      )}
    </div>
  );
};

const FieldRow = ({ f }) => {
  const [open, setOpen] = useState(false);
  const hasMore = f.description || f.formula || f.dataType;
  return (
    <li className="py-1.5">
      <button onClick={() => hasMore && setOpen(!open)} className="flex w-full items-center gap-2 text-left">
        {hasMore
          ? (open ? <IconChevronDown size={12} className="opacity-50" /> : <IconChevronRight size={12} className="opacity-50" />)
          : <span className="w-3" />}
        <span className={f.role === 'measure' || f.role === 'MEASURE' ? 'text-emerald-700 dark:text-emerald-400' : 'text-sky-700 dark:text-sky-400'}>
          {f.name}
        </span>
        {f.isCalculated && <Badge variant="outline" className="text-[10px] px-1 py-0">Calc</Badge>}
        {f.isCombined && <Badge variant="outline" className="text-[10px] px-1 py-0">Combined</Badge>}
        {f.aggregation && f.aggregation !== 'none' && (f.role === 'measure') && (
          <span className="ml-auto text-[10px] uppercase text-stone-500">{f.aggregation}</span>
        )}
      </button>
      {open && (
        <div className="ml-5 mt-1 space-y-1 text-xs text-stone-600 dark:text-stone-400">
          <p>{f.description || <span className="italic">No description available</span>}</p>
          {f.dataType && <p><span className="text-stone-500">Type:</span> {f.dataType.toLowerCase()}</p>}
          {f.formula && (
            <pre className="whitespace-pre-wrap rounded bg-stone-100 p-1.5 font-mono text-[11px] dark:bg-stone-900">{f.formula}</pre>
          )}
        </div>
      )}
    </li>
  );
};

const formatTime = (value) => {
  const d = new Date(value);
  return isNaN(d) ? String(value) : d.toLocaleString();
};
