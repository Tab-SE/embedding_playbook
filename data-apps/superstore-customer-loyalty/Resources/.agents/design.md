# Design

Datasource: published "Superstore" (contentUrl Superstore_17474334665220, project superstore).
One live query at Customer Name x Segment x Region x Category x Order ID x Order Date grain with
SUM(Sales), SUM(Profit). All loyalty logic is derived in app.js.

Tiers: recency / order count / lifetime sales each scored 1-3 by terciles. Recency is measured
against the latest Order Date in the data (Superstore ends 2020-12-30), not today.
- Champions: R=3 and F=3
- Loyal: R>=2 and F>=2
- Needs Attention: R>=2 (low frequency)
- At Risk: R=1 and (F>=2 or M>=2)
- Lost: everything else

Retention: customers with an order in (maxYear-1) who also ordered in maxYear.
Primary region = region with the customer's highest sales (customers ship to several regions).
Color: grey bars, one orange accent for At Risk / current year. No external origins.

## v2: editable in web edit
- Editor settings panel renders only when tableau.extensions.environment.mode === 'authoring'.
  Options: headline focus tier, two retention breakdowns (segment / primary region / primary category /
  preferred ship mode), list size (10/25/50), "quiet after" days (auto terciles or fixed 60-365).
  Stored as JSON under settings key `loyaltyConfig` via settings.set + saveAsync; persists on publish.
- Sheet filters: worksheet.getFiltersAsync() is translated into VDS query filters on every
  FilterChanged event. Supported: categorical lists (incl. exclude) on row-level fields, YEAR/QUARTER/
  MONTH/WEEK/DAY(date) lists, numeric/date ranges, relative dates. Aggregate/measure filters, top-N and
  conditional filters are shown as "Ignored" chips. VDS allows only one filter per field.
- Ship Mode added to the wired fields (rescaffolded, since the wiring script can't add to a wired .twb).

## v3: host-page interactivity
- Customer list has checkboxes (plus select-all). Ticked customers are posted to window.top with
  postMessage({source:'superstore-loyalty-data-app', version:1, type:'selection'|'ready', data}).
  Payload is display fields only (name, tier, segment, region, sales, profit, orders, last order,
  days quiet), capped at 100. The demo page (customer-loyalty/CustomerLoyalty.jsx) filters on
  `source` and sanitizes before showing actions (win-back message, CSV export).
- Why postMessage: the app renders HTML, not Tableau marks, so the Embedding API's
  markselectionchanged never fires for it.
- Host filters use the normal Embedding API (sheet.applyFilterAsync) on this worksheet; the app's
  FilterChanged handler re-queries with them (see v2).

## v4: visual redesign
- Flat KPI strip, stacked tier composition bar with clickable legend, retention as a dot plot vs. overall (blue above / orange below, with pt deltas), customer table with inline sales bars and inline drill-in row, "show more" paging (default 10).
- Palette aligned to the Superstore demo theme: slate ink, white cards, orange accent for at-risk.

## v5: actions next to the selection
- Host replies to `ready` with {source:"superstore-loyalty-host", type:"hello"}; only then does the list header show "Send to account team" / "Export CSV" buttons, which post {type:"action", data:{action:"winback"|"export"}}. Host can send {type:"clear"} to clear ticks.

## v6: full-width layout, row expand affordance, richer selection
- #app no longer max-width capped; the demo sizes the embed to the card width.
- Each row has a chevron button (rotates when open) plus whole-row click to expand; no "click a row" copy.
- Selection payload adds Customer Since, Preferred Ship Mode, Category Mix, Sales by Year, Recent Orders (the expanded-row details) so the host message/CSV include them.

## v7: no layout shift on filter change
- Removed the "Live from … as of" label, the viewer-facing filter chip row and the "Updating for new filters…" line.
- While a filtered query runs the existing content fades to 55% opacity (#app.is-updating) instead of inserting/removing rows.
- Ignored-filter warnings still show, but only inside the editor panel in web edit.

## v8: dashboard wrapper (enables Tableau Agent)
- Added dashboard "Customer Loyalty Dashboard" holding the data app sheet full-canvas (automatic size, title hidden). Tableau Agent (launchAnalyticsAssistantAsync) reports available on the dashboard but not on the bare viz-extension sheet.
- The demo embeds the dashboard view and sizes the frame to the window so the agent side panel (which matches the frame height) fits; html/body scroll inside the frame.
- The worksheet view stays published so older embeds of the sheet URL keep working.
