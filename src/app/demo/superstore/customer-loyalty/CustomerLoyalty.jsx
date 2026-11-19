"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeartHandshake, Filter, MessageSquare, Download, X, Info } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Popover, PopoverTrigger, PopoverContent,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "components/ui";
import { TableauEmbed } from "components";

// Tableau data app (viz extension) published to embeddingplaybook > superstore > Superstore Data Apps.
// It queries the published "Superstore" datasource live and computes loyalty tiers in the browser.
const DATA_APP_URL =
  'https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/SuperstoreCustomerLoyalty/SuperstoreCustomerLoyalty';

// Must match BRIDGE_SOURCE / HOST_SOURCE in the data app's app.js.
const BRIDGE_SOURCE = 'superstore-loyalty-data-app';
const HOST_SOURCE = 'superstore-loyalty-host';

// Values confirmed against the live Superstore datasource.
const FILTERS = [
  { field: 'Segment', options: ['Consumer', 'Corporate', 'Home Office'] },
  { field: 'Region', options: ['Central', 'East', 'South', 'West'] },
  { field: 'Category', options: ['Furniture', 'Office Supplies', 'Technology'] },
];

const ALL = '__all__';

// Tall enough for the data app's KPI strip, tiers, retention and a 10-row list without inner scroll.
const EMBED_HEIGHT = 1750;

// Only accept well-formed selection payloads; the data is displayed, never executed.
const sanitizeCustomers = (list) => {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 100).filter((c) => c && typeof c === 'object').map((c) => {
    const out = {};
    Object.keys(c).slice(0, 16).forEach((k) => { out[String(k)] = String(c[k] ?? '').slice(0, 400); });
    return out;
  });
};

// Side-by-side explainer for demo audiences: how this data app's interactivity differs from a
// regular embedded viz. Kept factual to what this page and app.js actually do.
const COMPARISON = [
  {
    topic: 'What renders',
    embed: 'Tableau draws marks from the sheet\'s shelves (Rows, Columns, Marks card).',
    app: 'Custom HTML/JS inside a viz extension queries the published datasource live and draws its own UI.',
  },
  {
    topic: 'Filters',
    embed: 'applyFilterAsync filters the marks directly.',
    app: 'Same applyFilterAsync call, but the filter lands on the app\'s sheet; the app reads it (getFiltersAsync) and re-runs its own query. Aggregate and Top-N filters are not translated.',
  },
  {
    topic: 'Selections',
    embed: 'Clicking marks fires markselectionchanged; the page reads them with getMarksAsync.',
    app: 'Its rows are HTML, not Tableau marks, so no markselectionchanged event. Ticked customers are posted to this page with window.postMessage.',
  },
  {
    topic: 'Taking action',
    embed: 'Actions use the mark fields of the selection.',
    app: 'Actions use the app\'s computed fields (loyalty tier, days quiet, lifetime sales), which do not exist in the datasource.',
  },
  {
    topic: 'Editing',
    embed: 'Web edit changes shelves, marks and calculations.',
    app: 'Web edit shows an Editor settings panel (focus tier, breakdowns, thresholds) saved with the workbook; the layout itself changes only by republishing the app.',
  },
];

const HowItWorks = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        className="flex h-[1.2rem] w-[1.2rem] items-center justify-center rounded-full text-blue-600 hover:text-blue-700 motion-safe:animate-soft-halo dark:text-blue-400"
        aria-label="How this data app differs from a regular embed"
        title="How this data app differs from a regular embed"
      >
        <Info className="h-[1.2rem] w-[1.2rem]" />
      </button>
    </PopoverTrigger>
    <PopoverContent align="end" className="w-[min(92vw,720px)] p-0">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-semibold">Data app vs. a regular embedded viz</p>
        <p className="text-xs text-muted-foreground">
          The page talks to both the same way (Embedding API), but what happens inside differs.
        </p>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-2 font-medium w-28"></th>
              <th className="px-2 py-2 font-medium">Regular embed (Orders, Products)</th>
              <th className="px-4 py-2 font-medium">This data app</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((r) => (
              <tr key={r.topic} className="border-t align-top">
                <td className="px-4 py-2 font-medium">{r.topic}</td>
                <td className="px-2 py-2 text-muted-foreground">{r.embed}</td>
                <td className="px-4 py-2">{r.app}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t px-4 py-2 text-[11px] text-muted-foreground">
        Try it: change a filter above, then tick customers in the list to send them to the account team or export them.
      </p>
    </PopoverContent>
  </Popover>
);

const toCsv = (rows) => {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [cols.map(esc).join(','), ...rows.map((r) => cols.map((c) => esc(r[c] ?? '')).join(','))].join('\n');
};

export const CustomerLoyalty = () => {
  const vizRef = useRef(null);
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(FILTERS.map((f) => [f.field, ALL]))
  );
  const [selected, setSelected] = useState([]);
  const [appReady, setAppReady] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const appWindowRef = useRef(null);
  const embedBoxRef = useRef(null);
  const [embedWidth, setEmbedWidth] = useState(null);

  useEffect(() => {
    const box = embedBoxRef.current;
    if (!box) return undefined;
    const measure = () => {
      const w = Math.floor(box.getBoundingClientRect().width);
      // Ignore small jitters so the viz isn't resized on every pixel of a window drag.
      setEmbedWidth((prev) => (prev && Math.abs(prev - w) < 40 ? prev : w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  const actionsRef = useRef({});

  const sendToApp = (type) => {
    const target = appWindowRef.current;
    if (!target) return;
    try {
      target.postMessage({ source: HOST_SOURCE, version: 1, type }, '*');
    } catch (err) {
      console.error('[CustomerLoyalty] could not message the data app:', err);
    }
  };

  // Receive selections, status and action clicks from the data app inside the embedded viz.
  useEffect(() => {
    const onMessage = (event) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object' || msg.source !== BRIDGE_SOURCE) return;
      if (event.source) appWindowRef.current = event.source;
      if (msg.type === 'selection') {
        setSelected(sanitizeCustomers(msg.data && msg.data.customers));
      } else if (msg.type === 'ready') {
        console.log('[CustomerLoyalty] data app ready, origin:', event.origin, msg.data);
        setAppReady(msg.data || {});
        // Tell the app a host that handles actions is present, so it shows its in-list buttons.
        sendToApp('hello');
      } else if (msg.type === 'action') {
        const action = msg.data && msg.data.action;
        if (action === 'winback') actionsRef.current.openWinBack?.();
        if (action === 'export') actionsRef.current.exportCsv?.();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Host-page filters go through the Embedding API onto the data app's worksheet; the app listens
  // for FilterChanged and re-runs its live query with the same filters.
  const applyFilter = useCallback(async (field, value) => {
    setFilterValues((prev) => ({ ...prev, [field]: value }));
    const sheet = vizRef.current?.workbook?.activeSheet;
    if (!sheet) {
      console.warn(`[CustomerLoyalty] ${field} filter skipped: viz not interactive yet`);
      return;
    }
    try {
      if (value === ALL) {
        await sheet.clearFilterAsync(field);
      } else {
        await sheet.applyFilterAsync(field, [value], 'replace');
      }
    } catch (err) {
      console.error(`[CustomerLoyalty] ${field} filter failed:`, err);
    }
  }, []);

  const resetFilters = async () => {
    for (const f of FILTERS) {
      if (filterValues[f.field] !== ALL) {
        // eslint-disable-next-line no-await-in-loop
        await applyFilter(f.field, ALL);
      }
    }
  };

  const openWinBack = () => {
    // Each customer carries the same details the app shows when its row is expanded.
    const lines = selected.map((c, i) => {
      const detail = [
        c['Customer Since'] && `   Customer since ${c['Customer Since']} · ${c['Orders']} orders · profit ${c['Profit']}`,
        c['Category Mix'] && `   Buys: ${c['Category Mix']}`,
        c['Sales by Year'] && `   Sales by year: ${c['Sales by Year']}`,
        c['Recent Orders'] && `   Recent orders: ${c['Recent Orders']}`,
        c['Preferred Ship Mode'] && `   Prefers ${c['Preferred Ship Mode']}`,
      ].filter(Boolean);
      return [
        `${i + 1}. ${c['Customer Name']} (${c['Loyalty Tier']}, ${c['Segment']}, ${c['Primary Region']}): ` +
        `${c['Lifetime Sales']} lifetime, last order ${c['Last Order']} (${c['Days Quiet']} days quiet)`,
        ...detail,
      ].join('\n');
    });
    setMessage(
      `Win-back request: please reach out to ${selected.length === 1 ? 'this customer' : `these ${selected.length} customers`} before they lapse.\n\n` +
      lines.join('\n\n')
    );
    setShowModal(true);
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(selected)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superstore-customer-selection.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearSelection = () => {
    setSelected([]);
    sendToApp('clear');
  };

  actionsRef.current = { openWinBack, exportCsv };

  const activeFilterCount = Object.values(filterValues).filter((v) => v !== ALL).length;

  // Rendered inside the shared embed toolbar row, right after File / View / Export / Data Details.
  const filterControls = (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="mx-1 hidden h-6 w-px bg-stone-200 sm:block dark:bg-stone-700" />
      <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      {FILTERS.map((f) => {
        const active = filterValues[f.field] !== ALL;
        return (
          <Select
            key={f.field}
            value={filterValues[f.field]}
            onValueChange={(v) => applyFilter(f.field, v)}
          >
            <SelectTrigger
              aria-label={`${f.field} filter`}
              className={`h-9 w-auto min-w-[140px] gap-3 rounded-md bg-white pl-3 pr-2.5 text-sm shadow-sm dark:bg-stone-900 ${
                active ? 'border-orange-300 bg-orange-50 text-orange-900' : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">{f.field}</span>
                <span className="font-medium"><SelectValue /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        );
      })}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <main className="flex-1 items-start gap-3 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-6">
        <Card className="dark:bg-stone-900 shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-6 w-6 text-orange-500" />
                <div>
                  <CardTitle>Customer Loyalty</CardTitle>
                  <CardDescription>
                    A Tableau data app: loyalty tiers, retention and at-risk customers, live from Superstore
                  </CardDescription>
                </div>
              </div>
              <HowItWorks />
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-0">
            <div ref={embedBoxRef} className="w-full">
              {embedWidth ? (
                <TableauEmbed
                  ref={vizRef}
                  id="customerLoyaltyDataApp"
                  src={DATA_APP_URL}
                  hideTabs={true}
                  toolbar="hidden"
                  toolbarExtras={filterControls}
                  className="w-full"
                  layouts={Object.fromEntries(
                    ['xs', 'sm', 'md', 'lg', 'xl', 'xl2'].map((bp) => [
                      bp,
                      { device: 'default', width: embedWidth, height: EMBED_HEIGHT },
                    ])
                  )}
                />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {selected.length > 0 && !showModal && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-stone-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom-4 dark:border-stone-700 dark:bg-stone-900/95">
            <button
              onClick={clearSelection}
              aria-label="Clear selection"
              title="Clear selection"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-stone-100 hover:text-foreground dark:hover:bg-stone-800"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={exportCsv}
              className="flex h-9 items-center gap-2 rounded-full border bg-white px-4 text-sm font-medium hover:bg-stone-100 dark:bg-stone-900"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={openWinBack}
              title="Opens a pre-filled message to the account team listing these customers. You can edit it before sending."
              className="flex h-9 items-center gap-2 rounded-full bg-orange-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
            >
              <MessageSquare className="h-4 w-4" />
              Send {selected.length} to account team
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-[2px] animate-in fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-team-title"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl animate-in zoom-in-95 dark:border-stone-700 dark:bg-stone-900"
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 id="send-team-title" className="text-base font-semibold text-stone-900 dark:text-stone-50">
                    Send to account team
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Asks the account team to reach out to {selected.length === 1 ? 'this customer' : `these ${selected.length} customers`}.
                    Review or edit the message before sending.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground hover:bg-stone-100 hover:text-foreground dark:hover:bg-stone-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {selected.slice(0, 6).map((c) => (
                  <span
                    key={c['Customer Name']}
                    className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                  >
                    {c['Customer Name']}
                    <span className="ml-1 text-muted-foreground">· {c['Lifetime Sales']}</span>
                  </span>
                ))}
                {selected.length > 6 && (
                  <span className="px-1 py-0.5 text-xs text-muted-foreground">+{selected.length - 6} more</span>
                )}
              </div>
              <label htmlFor="send-team-message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Message
              </label>
              <textarea
                id="send-team-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-72 w-full resize-none rounded-lg border border-stone-200 bg-white p-3 text-sm leading-relaxed text-stone-800 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50 px-6 py-3 dark:border-stone-800 dark:bg-stone-900">
              <button
                onClick={() => setShowModal(false)}
                className="h-9 rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!message.trim()) {
                    alert('Please enter a message before sending.');
                    return;
                  }
                  alert(`Demo: message sent to the account team.\n\n${message}`);
                  setShowModal(false);
                }}
                className="flex h-9 items-center gap-2 rounded-full bg-orange-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
              >
                <MessageSquare className="h-4 w-4" />
                Send to account team
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
