// Demo guides for AEs/SEs to skim before presenting.
//
// Each entry is keyed by the demo `id` (matches galleryItems.js + each demo's
// config.js `app_id`). Two audiences:
//   - `highlights`: at-a-glance list of Tableau capabilities you can show off.
//     Keep these short — one capability + one line on why it matters.
//   - `clickPath`: an ordered, persona-driven walkthrough. Slightly more depth,
//     but still focused on the specific Tableau capability each step demonstrates.
//
// Personas represent the external end user who logs into the embedded product
// (a partner, provider, advisor, client, etc.) — not an internal employee.
//
// To add/adjust a demo, edit the object below — both the card modal and the
// full guide page (/demos/<id>/guide) read from here.
//
// Some entries carry an inline `icon` (a React node) so AEs/SEs can tell the two
// floating agents apart at a glance — they look different in the app:
//   - MCP assistant      → uses the demo's circular avatar image (bottom-right)
//   - Concierge (Tab Next) → the blue Bot button (<BlueBot/> below)

import { Bot } from 'lucide-react';

// The Concierge agent's actual on-screen icon: a Bot glyph in a blue button.
const BlueBot = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
    <Bot className="h-3 w-3" />
  </span>
);

export const demoGuides = {
  'superstore': {
    title: 'Superstore Analytics',
    tagline: 'The flagship demo — the broadest tour of embedded analytics + AI.',
    persona: {
      title: 'Retail Partner / Reseller',
      context: 'A merchant logging into the Superstore portal to manage their own business',
      scenario: 'Logs into the portal to track their performance, drill into product and customer trends, and ask the AI assistant questions in plain language — all without leaving the app the vendor provides them.',
    },
    highlights: [
      { capability: 'Embedded dashboards (Embedding API v3)', blurb: 'Live Tableau Cloud vizzes embedded directly in a custom web app, not iframes to Tableau.' },
      { capability: 'Conversational AI assistant', blurb: 'Floating assistant answers natural-language questions against live data via MCP — the headline AI moment.' },
      { capability: 'MCP passthrough auth', docUrl: 'https://tableau.github.io/tableau-mcp/docs/configuration/mcp-config/authentication/passthrough', blurb: 'On login the app obtains a Tableau REST credentials token (Connected App JWT → REST sign-in) and forwards it to the MCP server in the X-Tableau-Auth header on every tool call — no service account, no second set of credentials. The MCP server acts in that exact session, so VizQL Data Service queries run as the user and inherit their permissions and UAF row-level security automatically.' },
      { capability: 'Embedded Concierge agent (Tableau Next)', icon: <BlueBot />, blurb: 'The blue Bot button (bottom-right) — the Tableau Next conversational analytics agent (Concierge), embedded via the Tableau Next / analytics SDK. Distinct from the MCP assistant, which uses the circular Superstore avatar.' },
      { capability: 'Fully tooled Agent', blurb: 'Dedicated Agent page shows an agent that can query data sources and reason over results.' },
      { capability: 'Pulse Discover', blurb: 'Embedded Tableau Pulse metrics for proactive, KPI-first monitoring.' },
      { capability: 'Row-level security (UAF)', blurb: 'Each user is scoped to their Region(s) via UAF claims in the embed token — the dashboards and the AI assistant both honor it.' },
      { capability: 'Custom controls driving the viz', blurb: 'Native app buttons take action inside the dashboard via the Embedding API — a "Select States" button applies/clears a filter, the Translation dropdown changes a parameter. The dashboard reacts to your app\'s UI, not just its own.' },
      { capability: 'Runtime-populated filter values', blurb: 'The "Select States" filter list isn\'t hardcoded — it\'s read live from the viz at load (getSummaryDataAsync), so the custom control always matches the data the user is allowed to see.' },
      { capability: 'Mark-click event listeners', blurb: 'Clicking a mark in the dashboard fires a MarkSelectionChanged event the app listens to — selecting marks surfaces a "Share Selection" button that pushes the picked data to Slack. The dashboard drives behavior outside itself.' },
      { capability: 'Web authoring (Explorer license)', blurb: 'Explorer-licensed users create and publish their own dashboards right inside the embedded app. Built in: Tableau Agent (AI-assisted authoring) and Dashboard Narratives (auto-generated plain-language summaries); Data QA is coming.' },
      { capability: 'Role-based content', blurb: 'Products and Customers pages unlock by user role — same app, different access.' },
      { capability: 'Localization via parameters', blurb: 'Translation page swaps dashboard language using parameter controls.' },
      { capability: 'Tableau Next embed (experimental)', blurb: 'tabNext page previews the next-gen Tableau embedding surface.' },
    ],
    clickPath: [
      { action: 'Land on Home', shows: 'Embedded dashboards rendering inside a branded custom app — set the "this is your product, not Tableau" frame. Note the data is already scoped to this user\'s Region via row-level security (UAF).' },
      { action: 'Open the floating assistant (bottom-right) and use a suggested (canned) question — "What are the total sales across each region?"', shows: 'Use the built-in suggested prompts rather than improvising — they\'re tuned to return cleanly. Natural-language Q&A against live data through MCP — the AI hook. Returns only the user\'s authorized Region(s), proving RLS carries into AI.' },
      { action: 'Follow up with the next suggested question — "What\'s our profit margin by category?"', shows: 'Multi-turn conversation keeping context — not one-shot search.' },
      { action: 'Open the blue Bot agent (bottom-right) and ask a question', icon: <BlueBot />, shows: 'The embedded Tableau Next Concierge agent — the blue Bot button, distinct from the circular-avatar MCP assistant. A different, embedded conversational analytics experience.' },
      { action: 'Go to the Agent page', shows: 'A fully tooled agent that can list data sources and reason over them — deeper than the chat widget.' },
      { action: 'Open Pulse Discover', shows: 'Embedded Pulse metrics for proactive KPI monitoring.' },
      { action: 'Click the "Select States" button and pick a few states', shows: 'A custom app control driving the dashboard — applies a filter inside the viz via the Embedding API. Point out the state list is populated live from the viz at runtime, not hardcoded.' },
      { action: 'Click a mark in the dashboard, then hit "Share Selection"', shows: 'Clicking inside the viz fires a MarkSelectionChanged event the app listens to; the surrounding app reacts — here, pushing the selected data to Slack.' },
      { action: 'Visit Products, then Customers', shows: 'Role-gated content — call out that Customers requires a higher role.' },
      { action: 'As an Explorer-licensed user, create a new dashboard and publish it', shows: 'In-app web authoring — end users build and publish their own dashboards without leaving the embedded product. Lean on Tableau Agent to help build it and add a Dashboard Narrative for a plain-language summary (Data QA is coming).' },
      { action: 'Open Translation and switch language', shows: 'Parameter-driven localization of the same dashboard.' },
      { action: 'Finish on tabNext Embed', shows: 'Forward-looking Tableau Next embedding — tee up "where this is going".' },
    ],
  },

  'ubl-superstore': {
    title: 'Superstore — UBL Site',
    tagline: 'The security & multi-site story: same app, locked down per user.',
    persona: {
      title: 'Retail Partner (Governed Access)',
      context: 'A merchant on a separate, locked-down tenant of the Superstore portal',
      scenario: 'Logs in and sees only their own data — the same portal as other partners, but each one isolated to their authorized rows on a dedicated Tableau site.',
    },
    highlights: [
      { capability: 'Separate-site Connected App auth', blurb: 'Authenticates against the UBL Tableau site via its own Connected App — a different site than the default Superstore demo.' },
      { capability: 'REST-driven dynamic navigation', blurb: 'The sidebar isn\'t hardcoded — it\'s built at runtime from the Tableau REST API (/sites/{site}/views, filtered to dashboards via Metadata GraphQL), so each user sees a searchable list of only the dashboards their permissions allow.' },
      { capability: 'Per-user UAF row-level security', blurb: 'Each user is scoped to their Region(s) via UAF claims — they see only their authorized rows. The core governance proof point.' },
      { capability: 'Multi-site / multi-tenant', blurb: 'Identical Superstore experience served from a different Tableau site than the default demo.' },
      { capability: 'Embedded dashboards + Pulse', blurb: 'Same rich embedding surface as Superstore, on locked-down data.' },
      { capability: 'MCP-backed AI assistant (passthrough auth)', docUrl: 'https://tableau.github.io/tableau-mcp/docs/configuration/mcp-config/authentication/passthrough', blurb: 'The user\'s own Tableau REST credentials token (minted via the UBL Connected App at sign-in) is forwarded to the MCP server in the X-Tableau-Auth header per request — no service account. The server runs as that user, so queries return only their authorized Region(s): UAF row-level security carries straight into the AI.' },
      { capability: 'Custom controls + mark-click event listeners', blurb: 'Same as Superstore: a "Select States" button filters the viz and the Translation dropdown changes a parameter, while clicking a mark fires an event the app listens to ("Share Selection" → Slack). Note these honor RLS — the filter values are read live from each user\'s own slice of data.' },
      { capability: 'Runtime-populated filter values', blurb: 'The "Select States" list is read from the viz at load (getSummaryDataAsync), so on this governed tenant each user only ever sees — and can filter on — their authorized states.' },
      { capability: 'Web authoring (Explorer license)', blurb: 'Explorer-licensed users author and publish their own dashboards in-app — and anything they build still respects their per-user RLS. Includes Tableau Agent and Dashboard Narratives; Data QA is coming.' },
    ],
    clickPath: [
      { action: 'Start at the auth screen and sign in', shows: 'Authenticates against the UBL site via its own dedicated Connected App — call out it\'s a different site than Superstore.' },
      { action: 'Land on Home and note the data shown', shows: 'Per-user UAF row-level security — this user only sees their authorized rows.' },
      { action: 'Point out the dashboard list in the sidebar (try the search box)', shows: 'The nav is built at runtime from the Tableau REST API — it lists only the dashboards this user can access, not a hardcoded menu. Sign in as a different user to show the list change.' },
      { action: 'Browse Orders / Products', shows: 'The same embedded dashboards as Superstore, now governed by RLS.' },
      { action: 'Click "Select States" (note the list), filter, then click a mark and "Share Selection"', shows: 'Custom controls drive the viz and mark-clicks drive the app — and the runtime-populated state list reflects only this user\'s authorized rows.' },
      { action: 'Open the floating assistant and use a suggested (canned) question — e.g. "What are the total sales across each region?" or "What\'s our profit margin by category?"', shows: 'Use the built-in suggested prompts rather than improvising — they\'re tuned to return cleanly. The assistant answers within the user\'s security context, so results cover only their authorized Region(s) — governance carries into AI.' },
      { action: 'As an Explorer-licensed user, create and publish a dashboard', shows: 'In-app web authoring on a governed tenant — what the user builds still honors their RLS. Use Tableau Agent to assist and add a Dashboard Narrative (Data QA is coming).' },
      { action: 'Open Pulse Discover', shows: 'Pulse metrics sourced from the UBL server.' },
      { action: '(Optional) Contrast with the default Superstore demo', shows: 'Same app code, different site + security — the multi-tenant story.' },
    ],
  },

  'makana': {
    title: 'Makana | Health Payer Portal',
    tagline: 'Embedded analytics + AI in a regulated healthcare workflow.',
    persona: {
      title: 'Network Provider / Practice Administrator',
      context: 'A contracted clinic logging into the payer portal to manage their patients',
      scenario: 'Logs into the payer portal to investigate claim denials, member utilization, and quality measures for their practice — using AI to surface the "why" behind denial trends without writing queries.',
    },
    highlights: [
      { capability: 'Industry-tailored embedding', blurb: 'A healthcare payer portal — shows the look-and-feel flexes to any vertical.' },
      { capability: 'AI assistant for complex questions', blurb: 'Answers nuanced denial / utilization questions in natural language via MCP.' },
      { capability: 'MCP passthrough auth', docUrl: 'https://tableau.github.io/tableau-mcp/docs/configuration/mcp-config/authentication/passthrough', blurb: 'The logged-in user\'s Tableau REST credentials token is forwarded to the MCP server in the X-Tableau-Auth header per request — no shared service account. The server acts in that session, so the AI inherits the user\'s exact permissions and RLS. The governance point that matters most for sensitive healthcare data: there\'s no separate AI identity to secure.' },
      { capability: 'Fully tooled Agent', blurb: 'Agent page reasons over claims data across multiple dimensions.' },
      { capability: 'Operational dashboards', blurb: 'Claims, Members, and Mother Baby pages embed domain-specific analytics.' },
      { capability: 'Mark-click event listeners', blurb: 'Clicking a mark in a dashboard fires a MarkSelectionChanged event the app listens to — selected data drives a "Share Selection" action out to Slack. The dashboard triggers behavior in the surrounding portal.' },
      { capability: 'Custom controls driving the viz', blurb: 'The Translation dropdown is a native app control that changes a dashboard parameter via the Embedding API.' },
      { capability: 'Web authoring (Explorer license)', blurb: 'Explorer-licensed users create and publish their own dashboards in-app — e.g. a provider builds a view of their own denial trends. Includes Tableau Agent and Dashboard Narratives; Data QA is coming.' },
      { capability: 'Role-based access', blurb: 'Members and Mother Baby unlock at higher roles — fits sensitive healthcare data.' },
      { capability: 'Localization via parameters', blurb: 'Translation page localizes dashboards for multilingual member bases.' },
    ],
    clickPath: [
      { action: 'Land on Home', shows: 'A fully themed healthcare payer portal — embedding adapts to the industry.' },
      { action: 'Open the assistant and use a suggested (canned) question — "What are the top three reasons for claim denials, and how do they vary by provider?"', shows: 'Use the built-in suggested prompts rather than improvising — they\'re tuned to return cleanly. AI answering a genuinely complex, multi-dimensional question against live data.' },
      { action: 'Follow up with the next suggested question — "How does the average processing time for claims correlate with the type of plan and denial rates?"', shows: 'Multi-turn analytical reasoning, not keyword search.' },
      { action: 'Open the Agent page', shows: 'A tooled agent that can pull claims data and correlate factors.' },
      { action: 'Click a mark in a dashboard, then "Share Selection"', shows: 'Clicking inside the viz fires a MarkSelectionChanged event; the app reacts by pushing the selected data to Slack — interaction flowing from dashboard out to the portal.' },
      { action: 'As an Explorer-licensed user, build and publish a dashboard', shows: 'In-app web authoring — a provider creates their own view without leaving the portal. Use Tableau Agent to assist and add a Dashboard Narrative (Data QA is coming).' },
      { action: 'Visit Claims, then Members', shows: 'Operational embedded dashboards; note Members is role-gated.' },
      { action: 'Open Mother Baby (higher role)', shows: 'Sensitive cohort analytics behind elevated access.' },
      { action: 'Open Translation and switch language', shows: 'Parameter-driven localization for multilingual populations.' },
    ],
  },

  'cumulus': {
    title: 'Cumulus | Wealth Management',
    tagline: 'Client-facing financial analytics with an AI advisor assistant.',
    persona: {
      title: 'Wealth Advisor / Affiliate',
      context: 'An advisor logging into the wealth platform to manage their book of business',
      scenario: 'Logs into the platform to review AUM, performance, and client satisfaction across their segments, then asks the assistant for fast answers between client meetings.',
    },
    highlights: [
      { capability: 'Financial-services embedding', blurb: 'A polished wealth-management portal — embedding tuned for finance.' },
      { capability: 'Client portfolio analytics', blurb: 'Client Portfolio page embeds performance and net-worth dashboards.' },
      { capability: 'AI assistant for advisors', blurb: 'Natural-language answers on AUM, retention, and NPS via MCP.' },
      { capability: 'MCP passthrough auth', docUrl: 'https://tableau.github.io/tableau-mcp/docs/configuration/mcp-config/authentication/passthrough', blurb: 'The logged-in advisor\'s Tableau REST credentials token is forwarded to the MCP server in the X-Tableau-Auth header per request — no shared service account. The server runs queries as that advisor, so the AI inherits their permissions and RLS with no separate AI identity to govern.' },
      { capability: 'Fully tooled Agent', blurb: 'Agent page reasons over portfolio and client data.' },
      { capability: 'Mark-click event listeners', blurb: 'Clicking a mark in a dashboard fires a MarkSelectionChanged event the app listens to — selected data drives a "Share Selection" action out to Slack. Interaction flows from the viz into the surrounding app.' },
      { capability: 'Custom controls driving the viz', blurb: 'The Translation dropdown is a native app control that changes a dashboard parameter via the Embedding API.' },
      { capability: 'Web authoring (Explorer license)', blurb: 'Explorer-licensed advisors create and publish their own dashboards in-app — e.g. a custom view of their book of business. Includes Tableau Agent and Dashboard Narratives; Data QA is coming.' },
      { capability: 'Localization via parameters', blurb: 'Translation page localizes dashboards for global client bases.' },
    ],
    clickPath: [
      { action: 'Land on Home', shows: 'A branded wealth-management experience — embedding fits financial services.' },
      { action: 'Open Client Portfolio', shows: 'Embedded portfolio-performance dashboards in a client context.' },
      { action: 'Open the assistant and use a suggested (canned) question — "What\'s the AUM by client segment?"', shows: 'Use the built-in suggested prompts rather than improvising — they\'re tuned to return cleanly. Plain-language analytics for a busy advisor.' },
      { action: 'Follow up with the next suggested question — "Which advisors have the highest client retention rates?"', shows: 'Multi-turn reasoning over advisor performance.' },
      { action: 'Use the last suggested question — "What are the NPS scores by market segment?"', shows: 'Mixing financial and satisfaction metrics in one conversation.' },
      { action: 'Open the Agent page', shows: 'A tooled agent reasoning across portfolio data.' },
      { action: 'Click a mark on Home or Client Portfolio, then "Share Selection"', shows: 'Clicking inside the viz fires a MarkSelectionChanged event; the app reacts by pushing the selected data to Slack — dashboard interaction driving the surrounding app.' },
      { action: 'As an Explorer-licensed user, create and publish a dashboard', shows: 'In-app web authoring — an advisor builds their own view of their book of business. Use Tableau Agent to assist and add a Dashboard Narrative (Data QA is coming).' },
      { action: 'Open Translation and switch language', shows: 'Parameter-driven localization for global clients.' },
    ],
  },

  'servicedesk': {
    title: 'Service Desk | Customer Support Portal',
    tagline: 'A no-AI, dashboard-first demo — clean embedding on Tableau Public.',
    persona: {
      title: 'Client Account Contact',
      context: 'A customer logging into the support portal to track their own service',
      scenario: 'Logs into the support portal to monitor their case volume, response times, renewals, and training completion — a self-service view of the service they receive, no AI involved.',
    },
    highlights: [
      { capability: 'Embedded dashboards on Tableau Public', blurb: 'Shows embedding works against Tableau Public sources, not just Tableau Cloud.' },
      { capability: 'KPI-driven support analytics', blurb: 'Home and Cases pages embed response-time and case-volume vizzes.' },
      { capability: 'Customer success insights', blurb: 'Success page covers renewals and customer health (role-gated).' },
      { capability: 'Training effectiveness', blurb: 'Training page tracks completion and effectiveness.' },
      { capability: 'Custom branding', blurb: 'Distinct color system — embedding inherits your brand.' },
      { capability: 'Custom controls driving the viz', blurb: 'A native "Case Priority" button bar filters the embedded dashboards via the Embedding API, and the Translation dropdown changes a parameter — your app\'s UI controlling the viz, even on Tableau Public sources.' },
      { capability: 'Mark-click event listeners', blurb: 'Clicking a mark fires a MarkSelectionChanged event the app listens to — selecting a case/customer/training mark surfaces a "Share Update" action out to Slack. No AI needed for the dashboard to drive the surrounding app.' },
      { capability: 'Localization via parameters', blurb: 'Translation page localizes dashboards.' },
      { capability: 'No AI assistant (by design)', blurb: 'AI chat is intentionally off — Tableau Public sources aren\'t MCP-queryable. Good for "embedding without AI" conversations.' },
    ],
    clickPath: [
      { action: 'Land on Home', shows: 'Branded support portal with embedded KPI dashboards (Tableau Public sources).' },
      { action: 'Click a "Case Priority" button (Urgent/High/etc.)', shows: 'A custom app control filtering the embedded dashboards via the Embedding API — your UI driving the viz.' },
      { action: 'Click a mark in a dashboard, then "Share Update"', shows: 'Clicking inside the viz fires a MarkSelectionChanged event; the app reacts by pushing the selection to Slack — dashboard driving the app, no AI involved.' },
      { action: 'Open Cases', shows: 'Open-case and case-creation analytics — the daily operational view.' },
      { action: 'Open Customer Success (higher role)', shows: 'Renewals and customer-health insights behind elevated access.' },
      { action: 'Open Training', shows: 'Training completion and effectiveness dashboards.' },
      { action: 'Open Translation and switch language', shows: 'Parameter-driven localization.' },
      { action: 'Note: no floating assistant', shows: 'AI is intentionally disabled here — frame the embedding-only use case.' },
    ],
  },
};
