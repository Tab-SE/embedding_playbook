(function () {
  'use strict';

  var root = document.getElementById('app');
  var DATASOURCE_CAPTION = 'Superstore';
  var SETTINGS_KEY = 'loyaltyConfig';
  var DAY = 86400000;

  // ---------- Editor-configurable options (saved in workbook settings) ----------
  var DEFAULT_CONFIG = { focusTier: 'At Risk', breakdownA: 'segment', breakdownB: 'region', listSize: 10, quietDays: 0 };

  var BREAKDOWNS = {
    segment: { label: 'Segment', key: function (c) { return c.segment; } },
    region: { label: 'Primary region', key: function (c) { return c.primaryRegion; } },
    category: { label: 'Primary category', key: function (c) { return c.primaryCategory; } },
    shipMode: { label: 'Preferred ship mode', key: function (c) { return c.primaryShipMode; } }
  };
  var LIST_SIZES = [10, 25, 50];
  var QUIET_OPTIONS = [0, 60, 90, 120, 180, 365];

  var TIERS = [
    { key: 'Champions', desc: 'Recent, frequent buyers',
      headline: function (d, pctAll) { return d.count + ' champions drive ' + money(d.sales) + ', ' + pctAll + ' of all customer sales'; },
      action: function () { return 'Protect and reward them: they ordered recently and often.'; } },
    { key: 'Loyal', desc: 'Steady repeat buyers',
      headline: function (d) { return d.count + ' loyal customers account for ' + money(d.sales) + ' in lifetime sales'; },
      action: function () { return 'Nudge them toward Champion with timely, relevant offers.'; } },
    { key: 'Needs Attention', desc: 'Recent but infrequent',
      headline: function (d) { return d.count + ' recent but infrequent customers could become regulars (' + money(d.sales) + ' so far)'; },
      action: function () { return 'Turn a recent purchase into a habit before they drift.'; } },
    { key: 'At Risk', desc: 'Valuable but gone quiet',
      headline: function (d) { return money(d.sales) + ' in lifetime sales sits with ' + d.count + ' at-risk customers who have gone quiet'; },
      action: function (quiet) { return 'Win them back first: they buy often or spend big, but have not ordered in ' + quiet + '+ days.'; } },
    { key: 'Lost', desc: 'Quiet, infrequent, low spend',
      headline: function (d) { return d.count + ' customers have lapsed, taking ' + money(d.sales) + ' in past sales with them'; },
      action: function () { return 'Keep reactivation low-cost; focus spend on higher tiers.'; } }
  ];
  function tierByKey(k) { return TIERS.filter(function (t) { return t.key === k; })[0]; }

  // ---------- Extensions API plumbing ----------
  function extractData(result) {
    return result && Array.isArray(result.data) ? result.data : [];
  }
  function getDataSources() {
    var wb = tableau.extensions.workbook;
    if (wb && typeof wb.getAllDataSourcesAsync === 'function') { return wb.getAllDataSourcesAsync(); }
    var ws = hostWorksheet();
    if (ws && typeof ws.getDataSourcesAsync === 'function') { return ws.getDataSourcesAsync(); }
    return Promise.resolve([]);
  }
  function findDataSource(list) {
    var found = null;
    (list || []).forEach(function (ds) { if (ds && ds.name === DATASOURCE_CAPTION) { found = ds; } });
    if (!found && list && list.length) { found = list[0]; }
    return found;
  }
  function hostWorksheet() {
    var wc = tableau.extensions.worksheetContent;
    return wc && wc.worksheet;
  }
  function isAuthoring() {
    var env = tableau.extensions.environment;
    return !!(env && String(env.mode || '').toLowerCase() === 'authoring');
  }
  function settingsApi() { return tableau.extensions.settings; }

  // ---------- Host-page bridge ----------
  // The app's marks are HTML, not Tableau marks, so selections can't raise Embedding API
  // markselectionchanged events. Instead the app posts them to the top-level page that embeds
  // the viz. Payload is display data only (no tokens); the host must check `source`.
  var BRIDGE_SOURCE = 'superstore-loyalty-data-app';
  var MAX_SELECTION = 100;
  function postToHost(type, data) {
    var target = null;
    try { target = window.top; } catch (e) { target = null; }
    if (!target || target === window) { return; }
    try {
      target.postMessage({ source: BRIDGE_SOURCE, version: 1, type: type, data: data }, '*');
    } catch (e) { /* host unreachable; app still works standalone */ }
  }
  function selectionPayload() {
    var m = state.model;
    if (!m) { return []; }
    return m.customers.filter(function (c) { return state.picked[c.name]; })
      .sort(function (a, b) { return b.sales - a.sales; })
      .slice(0, MAX_SELECTION)
      .map(function (c) {
        return {
          'Customer Name': c.name,
          'Loyalty Tier': c.tier,
          'Segment': c.segment,
          'Primary Region': c.primaryRegion,
          'Lifetime Sales': money(c.sales),
          'Profit': money(c.profit),
          'Orders': String(c.orderCount),
          'Last Order': fmtDate(c.last),
          'Days Quiet': String(c.recency),
          'Customer Since': fmtDate(c.first),
          'Preferred Ship Mode': c.primaryShipMode,
          'Category Mix': Object.keys(c.catSales)
            .sort(function (a, b) { return c.catSales[b] - c.catSales[a]; })
            .map(function (k) { return k + ' ' + pct(c.sales ? c.catSales[k] / c.sales : 0); }).join(', '),
          'Sales by Year': Object.keys(c.yearSales).sort()
            .map(function (y) { return y + ' ' + money(c.yearSales[y]); }).join(', '),
          'Recent Orders': c.orderList.slice(0, 3)
            .map(function (o) { return fmtDate(o.day) + ' ' + money(o.sales); }).join('; ')
        };
      });
  }
  function postSelection() {
    postToHost('selection', { customers: selectionPayload(), count: pickedCount() });
  }
  function pickedCount() { return Object.keys(state.picked).length; }

  // The demo page replies to 'ready' with 'hello' (via event.source), so action buttons only show
  // when a host that handles them is present. Messages are matched on `source` and carry no code.
  var HOST_SOURCE = 'superstore-loyalty-host';
  window.addEventListener('message', function (e) {
    var msg = e && e.data;
    if (!msg || typeof msg !== 'object' || msg.source !== HOST_SOURCE) { return; }
    if (msg.type === 'hello') {
      if (!state.hostConnected) { state.hostConnected = true; render(); }
    } else if (msg.type === 'clear') {
      state.picked = {};
      postSelection();
      render();
    }
  });
  function actionButton(label, action, primary) {
    var b = el('button', 'act-btn' + (primary ? ' primary' : ''), label);
    b.type = 'button';
    b.addEventListener('click', function () { postToHost('action', { action: action }); });
    return b;
  }
  function togglePick(name, on) {
    if (on) { state.picked[name] = true; } else { delete state.picked[name]; }
    postSelection();
    render();
  }
  function prunePicked() {
    var names = {};
    (state.model ? state.model.customers : []).forEach(function (c) { names[c.name] = true; });
    Object.keys(state.picked).forEach(function (n) { if (!names[n]) { delete state.picked[n]; } });
  }

  // ---------- Small safe-DOM + format helpers ----------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text !== undefined && text !== null) { n.textContent = String(text); }
    return n;
  }
  function money(v) {
    var a = Math.abs(v);
    var s = a >= 1e6 ? (a / 1e6).toFixed(2) + 'M' : a >= 1e3 ? (a / 1e3).toFixed(1) + 'K' : a.toFixed(0);
    return (v < 0 ? '-$' : '$') + s;
  }
  function pct(v) { return (v * 100).toFixed(0) + '%'; }
  function fmtDate(t) {
    return new Date(t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function pick(row, names) {
    for (var i = 0; i < names.length; i++) { if (row[names[i]] !== undefined) { return row[names[i]]; } }
    return undefined;
  }
  function parseDay(v) {
    if (v instanceof Date) { return Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), v.getUTCDate()); }
    var p = String(v || '').slice(0, 10).split('-');
    if (p.length !== 3) { return NaN; }
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }
  function topKey(obj) {
    return Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; })[0];
  }
  function renderError(msg) {
    root.textContent = '';
    var p = el('p', 'error', 'Live query unavailable: ' + msg);
    root.appendChild(p);
    if (state.filters.applied.length) {
      root.appendChild(el('p', 'hint', 'Sheet filters in use: ' + state.filters.applied.join(' · ')));
    }
  }

  // ---------- Config ----------
  function readConfig() {
    var raw = null;
    try { raw = settingsApi() && settingsApi().get(SETTINGS_KEY); } catch (e) { raw = null; }
    var c = {};
    try { c = raw ? JSON.parse(raw) : {}; } catch (e) { c = {}; }
    var cfg = {};
    Object.keys(DEFAULT_CONFIG).forEach(function (k) { cfg[k] = c[k] !== undefined ? c[k] : DEFAULT_CONFIG[k]; });
    if (!tierByKey(cfg.focusTier)) { cfg.focusTier = DEFAULT_CONFIG.focusTier; }
    if (!BREAKDOWNS[cfg.breakdownA]) { cfg.breakdownA = DEFAULT_CONFIG.breakdownA; }
    if (!BREAKDOWNS[cfg.breakdownB]) { cfg.breakdownB = DEFAULT_CONFIG.breakdownB; }
    cfg.listSize = LIST_SIZES.indexOf(Number(cfg.listSize)) >= 0 ? Number(cfg.listSize) : DEFAULT_CONFIG.listSize;
    cfg.quietDays = QUIET_OPTIONS.indexOf(Number(cfg.quietDays)) >= 0 ? Number(cfg.quietDays) : 0;
    return cfg;
  }
  function saveConfig() {
    var api = settingsApi();
    if (!api || typeof api.set !== 'function') { state.saveStatus = 'Settings API unavailable'; return; }
    try {
      api.set(SETTINGS_KEY, JSON.stringify(state.config));
    } catch (e) {
      state.saveStatus = 'Could not store settings: ' + (e.message || e);
      return;
    }
    if (typeof api.saveAsync !== 'function') { state.saveStatus = 'Stored (no saveAsync)'; return; }
    state.saveStatus = 'Saving…';
    api.saveAsync().then(function () {
      state.saveStatus = 'Saved to workbook. Publish to keep it.';
      render();
    }).catch(function (err) {
      state.saveStatus = 'Save failed: ' + ((err && (err.message || err.errorCode)) || String(err));
      render();
    });
  }

  // ---------- Sheet filters -> VDS filters ----------
  var DATE_PARTS = { YEAR: 'YEAR', QUARTER: 'QUARTER', MONTH: 'MONTH', WEEK: 'WEEK', DAY: 'DAY' };
  var PERIODS = { years: 'YEARS', quarters: 'QUARTERS', months: 'MONTHS', weeks: 'WEEKS', days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES' };
  var RANGES = { last: 'LAST', lastn: 'LASTN', next: 'NEXT', nextn: 'NEXTN', curr: 'CURRENT', current: 'CURRENT', todate: 'TODATE' };

  function rawValue(v) {
    if (v && typeof v === 'object' && !(v instanceof Date)) {
      if (v.value !== undefined && v.value !== null) { return v.value; }
      if (v.nativeValue !== undefined) { return v.nativeValue; }
      return null;
    }
    return v;
  }
  function labelOf(v) {
    if (v && typeof v === 'object' && v.formattedValue !== undefined) { return String(v.formattedValue); }
    return String(rawValue(v));
  }
  function isoDay(v) {
    var r = rawValue(v);
    if (r instanceof Date) {
      return r.getFullYear() + '-' + String(r.getMonth() + 1).padStart(2, '0') + '-' + String(r.getDate()).padStart(2, '0');
    }
    var m = String(r).match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : null;
  }
  function looksDate(v) {
    var r = rawValue(v);
    return r instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(r));
  }
  function summarize(labels) {
    return labels.length <= 3 ? labels.join(', ') : labels.slice(0, 3).join(', ') + ' +' + (labels.length - 3) + ' more';
  }

  function translateFilters(list) {
    var out = { vds: [], applied: [], skipped: [], noMatch: false };
    var used = {};
    (list || []).forEach(function (f) {
      var name = String(f.fieldName || '');
      var type = String(f.filterType || '').toLowerCase().replace(/[^a-z]/g, '');
      var base = name;
      var fn = null;
      var m = name.match(/^([A-Z]+)\((.+)\)$/);
      if (m) {
        if (DATE_PARTS[m[1]] && type === 'categorical') { fn = DATE_PARTS[m[1]]; base = m[2]; }
        else { out.skipped.push(name + ': only YEAR/QUARTER/MONTH/WEEK/DAY lists and row-level filters are supported'); return; }
      }
      if (!base || base === 'Measure Names' || base === 'Measure Values') { return; }
      if (used[base]) { out.skipped.push(name + ': only one filter per field is supported'); return; }
      var field = fn ? { fieldCaption: base, function: fn } : { fieldCaption: base };
      var vf = null;
      var label = null;

      if (type === 'categorical') {
        if (f.isAllSelected) { return; }
        var applied = f.appliedValues || [];
        var vals = applied.map(function (v) { return rawValue(v); })
          .filter(function (v) { return v !== null && v !== undefined && v !== ''; })
          .map(function (v) { return fn ? Number(v) : (typeof v === 'number' || typeof v === 'boolean' ? v : String(v)); })
          .filter(function (v) { return !(typeof v === 'number' && isNaN(v)); });
        if (!vals.length) {
          if (f.isExcludeMode) { return; }
          out.noMatch = true;
          out.applied.push(name + ': nothing selected');
          used[base] = true;
          return;
        }
        vf = { field: field, filterType: 'SET', values: vals, exclude: !!f.isExcludeMode };
        label = name + (f.isExcludeMode ? ' excludes ' : ': ') + summarize(applied.map(labelOf));
      } else if (type === 'range') {
        var lo = f.minValue;
        var hi = f.maxValue;
        if (looksDate(lo) || looksDate(hi)) {
          var a = isoDay(lo);
          var b = isoDay(hi);
          if (!a || !b) { out.skipped.push(name + ': could not read the date range'); return; }
          vf = { field: field, filterType: 'QUANTITATIVE_DATE', quantitativeFilterType: 'RANGE', minDate: a, maxDate: b, includeNulls: !!f.includeNullValues };
          label = name + ': ' + a + ' to ' + b;
        } else {
          var x = Number(rawValue(lo));
          var y = Number(rawValue(hi));
          if (isNaN(x) || isNaN(y)) { out.skipped.push(name + ': could not read the range'); return; }
          vf = { field: field, filterType: 'QUANTITATIVE_NUMERICAL', quantitativeFilterType: 'RANGE', min: x, max: y, includeNulls: !!f.includeNullValues };
          label = name + ': ' + labelOf(lo) + ' to ' + labelOf(hi);
        }
      } else if (type === 'relativedate') {
        var p = PERIODS[String(f.periodType || '').toLowerCase()];
        var r = RANGES[String(f.rangeType || '').toLowerCase()];
        if (!p || !r) { out.skipped.push(name + ': unsupported relative date setting'); return; }
        vf = { field: field, filterType: 'DATE', periodType: p, dateRangeType: r };
        if (r === 'LASTN' || r === 'NEXTN') { vf.rangeN = Number(f.rangeN) || 1; }
        var anchor = f.anchorDate ? isoDay(f.anchorDate) : null;
        if (anchor) { vf.anchorDate = anchor; }
        label = name + ': ' + r.toLowerCase() + (vf.rangeN ? ' ' + vf.rangeN : '') + ' ' + p.toLowerCase();
      } else {
        out.skipped.push(name + ': ' + (f.filterType || 'this') + ' filters are not supported');
        return;
      }
      used[base] = true;
      out.vds.push(vf);
      out.applied.push(label);
    });
    return out;
  }

  // ---------- Data model ----------
  var BASE_FIELDS = [
    { fieldCaption: 'Customer Name' },
    { fieldCaption: 'Segment' },
    { fieldCaption: 'Region' },
    { fieldCaption: 'Category' },
    { fieldCaption: 'Ship Mode' },
    { fieldCaption: 'Order ID' },
    { fieldCaption: 'Order Date' },
    { fieldCaption: 'Sales', function: 'SUM', fieldAlias: 'Sales' },
    { fieldCaption: 'Profit', function: 'SUM', fieldAlias: 'Profit' }
  ];

  function tercileCuts(values) {
    var s = values.slice().sort(function (a, b) { return a - b; });
    var q = function (p) { return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; };
    return [q(1 / 3), q(2 / 3)];
  }
  function scoreHigh(v, cuts) { return v > cuts[1] ? 3 : v > cuts[0] ? 2 : 1; }

  function buildModel(rows, cfg) {
    var customers = {};
    var maxDay = 0;
    var minDay = Infinity;
    rows.forEach(function (r) {
      var name = pick(r, ['Customer Name']);
      if (!name) { return; }
      var day = parseDay(pick(r, ['Order Date']));
      var sales = num(pick(r, ['Sales', 'SUM(Sales)']));
      var profit = num(pick(r, ['Profit', 'SUM(Profit)']));
      var region = pick(r, ['Region']);
      var cat = pick(r, ['Category']);
      var ship = pick(r, ['Ship Mode']);
      var oid = pick(r, ['Order ID']);
      var c = customers[name];
      if (!c) {
        c = customers[name] = {
          name: name, segment: pick(r, ['Segment']), orders: {}, sales: 0, profit: 0,
          regionSales: {}, catSales: {}, shipSales: {}, yearSales: {}, years: {}, first: Infinity, last: 0
        };
      }
      c.sales += sales;
      c.profit += profit;
      c.regionSales[region] = (c.regionSales[region] || 0) + sales;
      c.catSales[cat] = (c.catSales[cat] || 0) + sales;
      c.shipSales[ship] = (c.shipSales[ship] || 0) + sales;
      if (!isNaN(day)) {
        var y = new Date(day).getUTCFullYear();
        c.years[y] = true;
        c.yearSales[y] = (c.yearSales[y] || 0) + sales;
        var o = c.orders[oid] || (c.orders[oid] = { id: oid, day: day, sales: 0 });
        o.sales += sales;
        if (day < c.first) { c.first = day; }
        if (day > c.last) { c.last = day; }
        if (day > maxDay) { maxDay = day; }
        if (day < minDay) { minDay = day; }
      }
    });

    var list = Object.keys(customers).map(function (k) {
      var c = customers[k];
      c.orderList = Object.keys(c.orders).map(function (id) { return c.orders[id]; })
        .sort(function (a, b) { return b.day - a.day; });
      c.orderCount = c.orderList.length;
      c.recency = Math.round((maxDay - c.last) / DAY);
      c.primaryRegion = topKey(c.regionSales);
      c.primaryCategory = topKey(c.catSales);
      c.primaryShipMode = topKey(c.shipSales);
      return c;
    });
    if (!list.length) { return null; }

    var quiet;
    var rScore;
    if (cfg.quietDays > 0) {
      var T = cfg.quietDays;
      quiet = T;
      rScore = function (c) { return c.recency >= T ? 1 : c.recency <= T / 3 ? 3 : 2; };
    } else {
      var rCuts = tercileCuts(list.map(function (c) { return -c.recency; }));
      quiet = -rCuts[0];
      rScore = function (c) { return scoreHigh(-c.recency, rCuts); };
    }
    var fCuts = tercileCuts(list.map(function (c) { return c.orderCount; }));
    var mCuts = tercileCuts(list.map(function (c) { return c.sales; }));
    list.forEach(function (c) {
      var r = rScore(c);
      var f = scoreHigh(c.orderCount, fCuts);
      var m = scoreHigh(c.sales, mCuts);
      if (r === 3 && f === 3) { c.tier = 'Champions'; }
      else if (r >= 2 && f >= 2) { c.tier = 'Loyal'; }
      else if (r >= 2) { c.tier = 'Needs Attention'; }
      else if (f >= 2 || m >= 2) { c.tier = 'At Risk'; }
      else { c.tier = 'Lost'; }
    });

    return {
      customers: list,
      maxDay: maxDay,
      maxYear: new Date(maxDay).getUTCFullYear(),
      firstYear: new Date(minDay).getUTCFullYear(),
      quietDays: quiet,
      quietMode: cfg.quietDays > 0 ? 'fixed' : 'auto'
    };
  }

  function retention(list, keyFn, maxYear) {
    var groups = {};
    list.forEach(function (c) {
      if (!c.years[maxYear - 1]) { return; }
      var k = keyFn(c);
      var g = groups[k] || (groups[k] = { key: k, base: 0, kept: 0 });
      g.base += 1;
      if (c.years[maxYear]) { g.kept += 1; }
    });
    return Object.keys(groups).map(function (k) {
      var g = groups[k];
      g.rate = g.base ? g.kept / g.base : 0;
      return g;
    }).sort(function (a, b) { return b.rate - a.rate; });
  }

  // ---------- State ----------
  var state = {
    ds: null, rows: null, model: null, config: DEFAULT_CONFIG, tierFilter: DEFAULT_CONFIG.focusTier,
    selected: null, picked: {}, extra: 0, hostConnected: false, loadedAt: null, loading: false, filterKey: null, saveStatus: '',
    filters: { vds: [], applied: [], skipped: [], noMatch: false }
  };

  function rebuild() {
    state.model = state.rows && state.rows.length ? buildModel(state.rows, state.config) : null;
  }

  // ---------- Render ----------
  function selectControl(label, options, current, onChange) {
    var wrap = el('label', 'ctl');
    wrap.appendChild(el('span', 'ctl-label', label));
    var s = el('select');
    options.forEach(function (o) {
      var op = el('option', null, o[1]);
      op.value = String(o[0]);
      if (String(o[0]) === String(current)) { op.selected = true; }
      s.appendChild(op);
    });
    s.addEventListener('change', function () {
      onChange(s.value);
      saveConfig();
      rebuild();
      render();
    });
    wrap.appendChild(s);
    return wrap;
  }

  function renderEditorPanel() {
    var cfg = state.config;
    var p = el('section', 'editor');
    var head = el('div', 'editor-head');
    head.appendChild(el('strong', null, 'Editor settings'));
    head.appendChild(el('span', 'editor-note',
      'Only visible while editing. Saved with the workbook when you publish. Drag fields to the Filters shelf to filter this app.'));
    p.appendChild(head);
    var row = el('div', 'editor-row');
    var bOpts = Object.keys(BREAKDOWNS).map(function (k) { return [k, BREAKDOWNS[k].label]; });
    row.appendChild(selectControl('Headline focus', TIERS.map(function (t) { return [t.key, t.key]; }), cfg.focusTier,
      function (v) { cfg.focusTier = v; state.tierFilter = v; state.selected = null; }));
    row.appendChild(selectControl('Retention breakdown 1', bOpts, cfg.breakdownA, function (v) { cfg.breakdownA = v; }));
    row.appendChild(selectControl('Retention breakdown 2', bOpts, cfg.breakdownB, function (v) { cfg.breakdownB = v; }));
    row.appendChild(selectControl('Customers listed', LIST_SIZES.map(function (n) { return [n, String(n)]; }), cfg.listSize,
      function (v) { cfg.listSize = Number(v); }));
    row.appendChild(selectControl('Quiet after', QUIET_OPTIONS.map(function (n) { return [n, n ? n + ' days' : 'Auto (bottom third)']; }),
      cfg.quietDays, function (v) { cfg.quietDays = Number(v); }));
    var btn = el('button', 'editor-btn', 'Re-read sheet filters');
    btn.type = 'button';
    btn.addEventListener('click', function () { load(true); });
    row.appendChild(btn);
    p.appendChild(row);
    if (state.saveStatus) { p.appendChild(el('div', 'editor-status', state.saveStatus)); }
    return p;
  }

  function renderFilterChips() {
    var f = state.filters;
    if (!f.applied.length && !f.skipped.length) { return null; }
    var bar = el('div', 'chips');
    bar.appendChild(el('span', 'chips-label', 'Sheet filters'));
    f.applied.forEach(function (t) { bar.appendChild(el('span', 'chip', t)); });
    f.skipped.forEach(function (t) { bar.appendChild(el('span', 'chip skip', 'Ignored: ' + t)); });
    return bar;
  }

  function barRow(name, frac, value, accent, extraCls) {
    var row = el('div', 'bar-row static' + (extraCls ? ' ' + extraCls : ''));
    row.appendChild(el('span', 'bar-name', name));
    var track = el('div', 'bar-track');
    var fill = el('div', 'bar-fill ' + (accent ? 'accent' : 'base'));
    fill.style.width = (Math.max(0, Math.min(1, frac)) * 100) + '%';
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el('span', 'bar-value', value));
    return { row: row, track: track };
  }

  function tierSlug(k) { return k.toLowerCase().replace(/[^a-z]+/g, '-'); }
  function pts(d) { var v = Math.round(d * 100); return (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v) + ' pts'; }

  function render() {
    if (!root) { return; }
    if (!state.model && !state.loading && !state.rows) { return; }
    root.textContent = '';
    var authoring = isAuthoring();
    if (authoring) {
      var panel = renderEditorPanel();
      var chips = renderFilterChips();
      if (chips) { panel.appendChild(chips); }
      root.appendChild(panel);
    }
    // While a filtered query runs, keep the current layout and just soften it, so nothing moves.
    root.className = state.loading && state.model ? 'is-updating' : '';

    var m = state.model;
    if (!m) {
      root.appendChild(el('p', 'empty', state.loading ? 'Loading live customer data…' : 'No customers match the current filters.'));
      return;
    }

    var cfg = state.config;
    var list = m.customers;
    var focus = tierByKey(cfg.focusTier);
    var totalSales = list.reduce(function (s, c) { return s + c.sales; }, 0);
    var byTier = {};
    TIERS.forEach(function (t) { byTier[t.key] = { count: 0, sales: 0 }; });
    list.forEach(function (c) { byTier[c.tier].count += 1; byTier[c.tier].sales += c.sales; });
    var overall = retention(list, function () { return 'All'; }, m.maxYear)[0] || { rate: 0, base: 0, kept: 0 };
    var hasRetention = overall.base > 0;
    var fd = byTier[focus.key];
    var fShare = totalSales ? fd.sales / totalSales : 0;

    // ---- Header: the answer first ----
    var header = el('header', 'hdr');
    header.appendChild(el('h1', null, focus.headline(fd, pct(fShare))));
    var retText = hasRetention
      ? pct(overall.rate) + ' of ' + (m.maxYear - 1) + ' buyers came back in ' + m.maxYear + '.'
      : 'Retention needs orders in both ' + (m.maxYear - 1) + ' and ' + m.maxYear + '.';
    header.appendChild(el('p', 'sub', retText + ' ' + focus.action(m.quietDays)));
    root.appendChild(header);

    // ---- KPI strip ----
    var third = focus.key === 'Champions' ? 'At Risk' : 'Champions';
    var kpis = el('section', 'kpis');
    [
      ['Customers', String(list.length), 'with at least one order', false],
      ['Year-over-year retention', hasRetention ? pct(overall.rate) : 'n/a',
        hasRetention ? overall.kept + ' of ' + overall.base + ' returned' : 'not enough years in view', false],
      [third, String(byTier[third].count), money(byTier[third].sales) + ' lifetime sales', false],
      [focus.key + ' sales', money(fd.sales), pct(fShare) + ' of customer sales', true]
    ].forEach(function (k) {
      var card = el('div', 'kpi' + (k[3] ? ' kpi-focus tier-' + tierSlug(focus.key) : ''));
      card.appendChild(el('div', 'kpi-label', k[0]));
      card.appendChild(el('div', 'kpi-value', k[1]));
      card.appendChild(el('div', 'kpi-note', k[2]));
      kpis.appendChild(card);
    });
    root.appendChild(kpis);

    // ---- Tier composition: one stacked bar + clickable legend ----
    var comp = el('section', 'panel');
    var compHead = el('div', 'panel-head');
    compHead.appendChild(el('h2', null, 'Where customers sit today'));
    compHead.appendChild(el('span', 'hint', 'Click a tier to list its customers'));
    comp.appendChild(compHead);
    var stack = el('div', 'stack');
    TIERS.forEach(function (t) {
      var d = byTier[t.key];
      if (!d.count) { return; }
      var seg = el('button', 'seg tier-' + tierSlug(t.key) + (state.tierFilter === t.key ? ' active' : ''));
      seg.type = 'button';
      seg.style.flex = d.count + ' 1 0';
      seg.title = t.key + ': ' + d.count + ' customers';
      seg.setAttribute && seg.setAttribute('aria-label', t.key + ', ' + d.count + ' customers');
      seg.addEventListener('click', function () { state.tierFilter = t.key; state.selected = null; state.extra = 0; render(); });
      stack.appendChild(seg);
    });
    comp.appendChild(stack);
    var legend = el('div', 'legend');
    TIERS.forEach(function (t) {
      var d = byTier[t.key];
      var item = el('button', 'legend-item' + (state.tierFilter === t.key ? ' active' : ''));
      item.type = 'button';
      var top = el('div', 'legend-top');
      top.appendChild(el('span', 'swatch tier-' + tierSlug(t.key)));
      top.appendChild(el('span', 'legend-name', t.key));
      item.appendChild(top);
      item.appendChild(el('div', 'legend-count', String(d.count)));
      item.appendChild(el('div', 'legend-meta', pct(list.length ? d.count / list.length : 0) + ' of customers · ' + money(d.sales)));
      item.appendChild(el('div', 'legend-desc', t.desc));
      item.addEventListener('click', function () { state.tierFilter = t.key; state.selected = null; state.extra = 0; render(); });
      legend.appendChild(item);
    });
    comp.appendChild(legend);
    root.appendChild(comp);

    // ---- Retention: dot plot against the overall rate ----
    var ret = el('section', 'panel');
    var retHead = el('div', 'panel-head');
    retHead.appendChild(el('h2', null, 'Who comes back, ' + (m.maxYear - 1) + ' → ' + m.maxYear));
    retHead.appendChild(el('span', 'hint', hasRetention
      ? 'Share of ' + (m.maxYear - 1) + ' buyers who ordered again. Line = overall ' + pct(overall.rate) + '.'
      : 'No ' + (m.maxYear - 1) + ' buyers in the current filters.'));
    ret.appendChild(retHead);
    if (hasRetention) {
      var keys = cfg.breakdownA === cfg.breakdownB ? [cfg.breakdownA] : [cfg.breakdownA, cfg.breakdownB];
      var groups = keys.map(function (k) { return { key: k, rows: retention(list, BREAKDOWNS[k].key, m.maxYear) }; });
      var rates = [overall.rate];
      groups.forEach(function (g) { g.rows.forEach(function (r) { rates.push(r.rate); }); });
      var lo = Math.max(0, Math.floor((Math.min.apply(null, rates) - 0.03) * 20) / 20);
      var hi = Math.min(1, Math.ceil((Math.max.apply(null, rates) + 0.03) * 20) / 20);
      if (hi - lo < 0.1) { hi = Math.min(1, lo + 0.1); }
      var xpos = function (v) { return ((v - lo) / (hi - lo) * 100) + '%'; };
      var cols = el('div', 'ret-cols');
      groups.forEach(function (g) {
        var col = el('div', 'ret-col');
        col.appendChild(el('h3', null, 'By ' + BREAKDOWNS[g.key].label.toLowerCase()));
        g.rows.forEach(function (r) {
          var row = el('div', 'dot-row');
          row.appendChild(el('span', 'dot-name', r.key));
          var track = el('div', 'dot-track');
          var ref = el('div', 'dot-ref');
          ref.style.left = xpos(overall.rate);
          track.appendChild(ref);
          var diff = r.rate - overall.rate;
          var dir = Math.round(diff * 100) > 0 ? 'up' : Math.round(diff * 100) < 0 ? 'down' : 'flat';
          var dot = el('div', 'dot ' + dir);
          dot.style.left = xpos(r.rate);
          track.appendChild(dot);
          row.appendChild(track);
          var val = el('span', 'dot-val');
          val.appendChild(el('strong', null, pct(r.rate)));
          val.appendChild(el('span', 'delta ' + dir, pts(diff)));
          val.appendChild(el('span', 'n', r.kept + '/' + r.base));
          row.appendChild(val);
          col.appendChild(row);
        });
        var axis = el('div', 'dot-axis');
        var ticks = el('div', 'ticks');
        ticks.appendChild(el('span', null, pct(lo)));
        ticks.appendChild(el('span', null, pct(hi)));
        axis.appendChild(ticks);
        col.appendChild(axis);
        cols.appendChild(col);
      });
      ret.appendChild(cols);
    }
    root.appendChild(ret);

    // ---- Customer list ----
    var listPanel = el('section', 'panel');
    var tierInfo = tierByKey(state.tierFilter) || focus;
    var all = list.filter(function (c) { return c.tier === tierInfo.key; })
      .sort(function (a, b) { return b.sales - a.sales; });
    var shown = all.slice(0, cfg.listSize + (state.extra || 0));
    var listHead = el('div', 'panel-head');
    var titleWrap = el('div', 'title-wrap');
    titleWrap.appendChild(el('span', 'pill tier-' + tierSlug(tierInfo.key), tierInfo.key));
    titleWrap.appendChild(el('h2', null, all.length + ' customers, highest lifetime sales first'));
    listHead.appendChild(titleWrap);
    var nPicked = pickedCount();
    if (nPicked) {
      var selBar = el('div', 'selbar');
      selBar.appendChild(el('span', 'sel-count', nPicked + ' selected'));
      if (state.hostConnected) {
        selBar.appendChild(actionButton('Send to account team', 'winback', true));
        selBar.appendChild(actionButton('Export CSV', 'export', false));
      }
      var clearBtn = el('button', 'link-btn', 'Clear');
      clearBtn.type = 'button';
      clearBtn.addEventListener('click', function () { state.picked = {}; postSelection(); render(); });
      selBar.appendChild(clearBtn);
      listHead.appendChild(selBar);
    } else {
      listHead.appendChild(el('span', 'hint', 'Tick customers to send or export them'));
    }
    listPanel.appendChild(listHead);

    var maxSales = shown.length ? shown[0].sales : 1;
    var table = el('table', 'tbl');
    var thead = el('thead');
    var hr = el('tr');
    var allTh = el('th', 'chk');
    var allBox = el('input');
    allBox.type = 'checkbox';
    allBox.title = 'Select all customers shown';
    allBox.checked = shown.length > 0 && shown.every(function (c) { return state.picked[c.name]; });
    allBox.addEventListener('change', function () {
      var on = allBox.checked;
      shown.forEach(function (c) { if (on) { state.picked[c.name] = true; } else { delete state.picked[c.name]; } });
      postSelection();
      render();
    });
    allTh.appendChild(allBox);
    hr.appendChild(allTh);
    [['Customer', ''], ['Region', ''], ['Last order', ''], ['Days quiet', 'num'], ['Orders', 'num'],
      ['Lifetime sales', 'sales'], ['Profit', 'num']].forEach(function (h) { hr.appendChild(el('th', h[1] || null, h[0])); });
    var expTh = el('th', 'exp');
    expTh.appendChild(el('span', 'sr-only', 'Details'));
    hr.appendChild(expTh);
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = el('tbody');
    shown.forEach(function (c) {
      var tr = el('tr', (state.selected === c.name ? 'sel' : '') + (state.picked[c.name] ? ' picked' : ''));
      var td = el('td', 'chk');
      var box = el('input');
      box.type = 'checkbox';
      box.checked = !!state.picked[c.name];
      box.addEventListener('click', function (e) { if (e && e.stopPropagation) { e.stopPropagation(); } });
      box.addEventListener('change', function () { togglePick(c.name, box.checked); });
      td.appendChild(box);
      tr.appendChild(td);
      var nameTd = el('td', 'cust');
      nameTd.appendChild(el('div', 'cust-name', c.name));
      nameTd.appendChild(el('div', 'cust-seg', c.segment));
      tr.appendChild(nameTd);
      tr.appendChild(el('td', null, c.primaryRegion));
      tr.appendChild(el('td', null, fmtDate(c.last)));
      tr.appendChild(el('td', 'num', String(c.recency)));
      tr.appendChild(el('td', 'num', String(c.orderCount)));
      var salesTd = el('td', 'sales');
      var sw = el('div', 'sales-cell');
      var sb = el('div', 'sales-bar');
      var sf = el('div', 'sales-fill');
      sf.style.width = (c.sales / maxSales * 100) + '%';
      sb.appendChild(sf);
      sw.appendChild(sb);
      sw.appendChild(el('span', null, money(c.sales)));
      salesTd.appendChild(sw);
      tr.appendChild(salesTd);
      tr.appendChild(el('td', 'num' + (c.profit < 0 ? ' neg' : ''), money(c.profit)));
      var open = state.selected === c.name;
      var expTd = el('td', 'exp');
      var expBtn = el('button', 'exp-btn' + (open ? ' open' : ''));
      expBtn.type = 'button';
      expBtn.title = open ? 'Hide details' : 'Show order history and category mix';
      expBtn.setAttribute && expBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      expBtn.setAttribute && expBtn.setAttribute('aria-label', (open ? 'Hide' : 'Show') + ' details for ' + c.name);
      expBtn.appendChild(el('span', 'chev'));
      expTd.appendChild(expBtn);
      tr.appendChild(expTd);
      if (open) { tr.className += ' open'; }
      tr.addEventListener('click', function () { state.selected = state.selected === c.name ? null : c.name; render(); });
      tbody.appendChild(tr);
      if (state.selected === c.name) {
        var dtr = el('tr', 'detail-row');
        var dtd = el('td');
        dtd.colSpan = 9;
        dtd.setAttribute && dtd.setAttribute('colspan', '9');
        dtd.appendChild(renderDetail(c, m));
        dtr.appendChild(dtd);
        tbody.appendChild(dtr);
      }
    });
    table.appendChild(tbody);
    listPanel.appendChild(table);
    if (!all.length) { listPanel.appendChild(el('p', 'hint pad', 'No customers in this tier.')); }
    if (all.length > shown.length) {
      var more = el('button', 'more-btn', 'Show ' + Math.min(15, all.length - shown.length) + ' more of ' + (all.length - shown.length));
      more.type = 'button';
      more.addEventListener('click', function () { state.extra = (state.extra || 0) + 15; render(); });
      listPanel.appendChild(more);
    }
    root.appendChild(listPanel);

    var quietNote = m.quietMode === 'fixed'
      ? 'At risk after ' + m.quietDays + ' quiet days'
      : 'Recency, order count and spend scored in thirds';
    root.appendChild(el('footer', 'foot',
      quietNote + ', measured against the latest order on ' + fmtDate(m.maxDay) +
      (state.loadedAt ? ' · loaded ' + state.loadedAt.toLocaleTimeString() : '')));
  }

  function renderDetail(c, m) {
    var p = el('div', 'detail');
    var sub = el('div', 'detail-sub');
    sub.appendChild(el('span', null, c.tier + ' · ' + c.segment + ' · mostly ' + c.primaryRegion +
      ' · prefers ' + c.primaryShipMode + ' · customer since ' + fmtDate(c.first)));
    if (state.hostConnected) {
      sub.appendChild(el('span', 'detail-note', state.picked[c.name]
        ? '✓ Included when you send or export'
        : 'Tick this customer to include these details when you send or export'));
    }
    p.appendChild(sub);
    var cols = el('div', 'detail-cols');

    var yrs = el('div');
    yrs.appendChild(el('h3', null, 'Sales by year'));
    var years = [];
    for (var y = m.firstYear; y <= m.maxYear; y++) { years.push(y); }
    var maxY = Math.max.apply(null, years.map(function (yy) { return c.yearSales[yy] || 0; })) || 1;
    years.forEach(function (yy) {
      var v = c.yearSales[yy] || 0;
      yrs.appendChild(barRow(String(yy), v / maxY, v ? money(v) : '—', yy === m.maxYear).row);
    });
    cols.appendChild(yrs);

    var cats = el('div');
    cats.appendChild(el('h3', null, 'Category mix'));
    var catKeys = Object.keys(c.catSales).sort(function (a, b) { return c.catSales[b] - c.catSales[a]; });
    var maxC = c.catSales[catKeys[0]] || 1;
    catKeys.forEach(function (k) {
      cats.appendChild(barRow(k, c.catSales[k] / maxC, pct(c.sales ? c.catSales[k] / c.sales : 0), false).row);
    });
    cols.appendChild(cats);

    var ords = el('div');
    ords.appendChild(el('h3', null, 'Recent orders · ' + c.orderCount + ' total'));
    c.orderList.slice(0, 5).forEach(function (o) {
      var r = el('div', 'order-row');
      r.appendChild(el('span', null, fmtDate(o.day)));
      r.appendChild(el('span', 'muted', o.id));
      r.appendChild(el('span', 'num', money(o.sales)));
      ords.appendChild(r);
    });
    cols.appendChild(ords);

    p.appendChild(cols);
    return p;
  }

  // ---------- Load + events ----------
  function readSheetFilters() {
    var ws = hostWorksheet();
    if (!ws || typeof ws.getFiltersAsync !== 'function') { return Promise.resolve([]); }
    return ws.getFiltersAsync();
  }

  function load(force) {
    return readSheetFilters().then(function (ext) {
      var t = translateFilters(ext);
      var key = JSON.stringify(t.vds) + (t.noMatch ? '|none' : '');
      state.filters = t;
      if (!force && key === state.filterKey && state.rows) { render(); return null; }
      state.filterKey = key;
      if (t.noMatch) { state.rows = []; rebuild(); render(); return null; }
      state.loading = true;
      render();
      var query = { fields: BASE_FIELDS };
      if (t.vds.length) { query.filters = t.vds; }
      return state.ds.queryAsync(query).then(function (result) {
        if (state.filterKey !== key) { return; } // a newer filter change superseded this query
        state.rows = extractData(result);
        state.loadedAt = new Date();
        state.loading = false;
        rebuild();
        prunePicked();
        render();
        postToHost('ready', { customers: state.model ? state.model.customers.length : 0, filters: state.filters.applied });
        postSelection();
      });
    }).catch(function (err) {
      state.loading = false;
      renderError((err && (err.message || err.errorCode)) || String(err));
    });
  }

  function debounce(fn, ms) {
    var timer = null;
    return function () { clearTimeout(timer); timer = setTimeout(fn, ms); };
  }

  function subscribe() {
    var ET = tableau.TableauEventType || {};
    var reload = debounce(function () { load(false); }, 250);
    var ws = hostWorksheet();
    if (ws && typeof ws.addEventListener === 'function') {
      [ET.FilterChanged, ET.SummaryDataChanged].forEach(function (evt) {
        if (!evt) { return; }
        try { ws.addEventListener(evt, reload); } catch (e) { /* event not supported here */ }
      });
    }
    var api = settingsApi();
    if (api && typeof api.addEventListener === 'function' && ET.SettingsChanged) {
      try {
        api.addEventListener(ET.SettingsChanged, function () {
          state.config = readConfig();
          rebuild();
          render();
        });
      } catch (e) { /* ignore */ }
    }
  }

  function boot() {
    if (!window.tableau || !tableau.extensions) { renderError('Extensions API not loaded'); return; }
    if (!root) { return; }
    root.textContent = '';
    root.appendChild(el('p', 'empty', 'Loading live customer data…'));

    tableau.extensions.initializeAsync().then(function () {
      state.config = readConfig();
      state.tierFilter = state.config.focusTier;
      return getDataSources();
    }).then(function (list) {
      var ds = findDataSource(list);
      if (!ds) { renderError('no data source found in the workbook'); return null; }
      state.ds = ds;
      subscribe();
      return load(true);
    }).catch(function (err) {
      renderError((err && (err.message || err.errorCode)) || String(err));
    });
  }

  boot();
})();
