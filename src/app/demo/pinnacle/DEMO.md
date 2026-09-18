# Pinnacle Group — Workforce Intelligence Portal Demo

## Overview

This demo showcases Tableau embedded analytics inside a simulated supplier portal for **Pinnacle Group**, a global workforce solutions and MSP provider. The portal gives Pinnacle's internal team and their 1,300+ supplier partners real-time access to performance data — scoped automatically to each user's authorized footprint.

**Live demo:** [pinnacle.up.railway.app/demo/pinnacle/auth](https://pinnacle.up.railway.app/demo/pinnacle/auth)

---

## The Business Problem

Pinnacle manages contingent workforce programs for large enterprise clients. They have 1,300+ staffing suppliers who need access to their own performance scorecards — bill rates, fill rates, compliance status, open requisitions.

The portal also needs to be intelligent — Shannon Carpenter (Supplier Portal contact) specifically asked about AI and natural language Q&A on scorecards.

---

## Portal Users

Three users demonstrate three distinct experiences inside the same portal.

### Marcus Webb — Pinnacle Partner Manager
**Role:** Internal Pinnacle employee. Owns supplier relationships day-to-day.
**Data scope:** All regions, all suppliers.
**Key capabilities:**
- Full program overview: Total Spend, Program Savings, Active Assignments, Avg Fill Time, Active Suppliers, Open Requisitions
- Filter by Supplier — scopes every chart and metric to a single supplier instantly
- Supplier Scorecard — all 5 suppliers ranked by efficiency (50%), quality (30%), and risk (20%)
- Requisitions — open work orders, candidate funnel, SLA tracking, aging positions
- Compliance — certifications, background checks, expiry dates across all suppliers
- AI assistant with program-management questions (underperforming suppliers, spend trends, aging SLAs)

### Priya Okonkwo — Atlas Workforce Solutions
**Role:** External supplier contact. Staffing firm covering the Southeast US.
**Data scope:** East + South regions only (enforced via Tableau Connected App JWT + RLS).
**Key capabilities:**
- Auto-scoped on login — no filter needed, no configuration. Data is locked to her footprint.
- Filter by Event — Gulf Coast Career Fair, Carolinas Talent Summit, Mid-Atlantic Hiring Expo (each mapped to underlying states)
- Supplier Scorecard — Atlas's efficiency, quality, and risk scores with quartile ranking vs peer group
- Requisitions — open work orders scoped to Atlas's placements
- Compliance — Atlas workers' certification and background check status
- AI assistant with supplier-specific questions (fill rate comparison, compliance rates, event performance)

### Christine Nakamura — Apex Talent Partners
**Role:** External supplier contact. Staffing firm covering the Midwest and Great Lakes.
**Data scope:** West + Central regions only (enforced via Tableau Connected App JWT + RLS).
**Key capabilities:**
- Same experience as Priya — auto-scoped, no setup required
- Filter by Event — Great Lakes Staffing Summit, Midwest Placement Drive
- Supplier Scorecard — Apex's quartile ranking, separate from Atlas
- Same AI assistant, scoped to Apex's data only

---

## Data Security Architecture

Data scoping is enforced at two layers:

**1. Tableau RLS (Row Level Security)**
Each user's JWT contains a `Region` UAF claim (`{"Region": ["East","South"]}` for Priya). When the JWT is redeemed, Tableau creates a session that carries those claims. The Superstore workbook's RLS rules filter on `USERATTRIBUTE("Region")`, scoping every query — including MCP tool calls — to the authorized regions. Priya cannot see West or Central data regardless of what she queries.

**2. Application-level filter (`applyFilterAsync`)**
On page load, the portal also applies a `State/Province` filter to the embedded viz based on the user's UAF regions and (for suppliers) their event selection. This keeps the dashboard view consistent with the RLS scope.

**MCP / AI chat scoping**
The AI assistant uses the user's Tableau REST session token as a passthrough to the MCP server (`X-Tableau-Auth`). Because that session was created from the same scoped JWT, the MCP server's data queries respect the same RLS rules. Priya's AI answers only reflect East+South data.

---

## Navigation & Filters

| Page | Marcus | Priya / Christine |
|---|---|---|
| Home | All data + Filter by Supplier | Auto-scoped + Filter by Event |
| Supplier Scorecard | All suppliers ranked | Own scorecard + quartile rank |
| Requisitions | All open work orders | Scoped work orders |
| Compliance | All supplier compliance | Own workers only |
| Settings | ✓ | ✓ |

---

## Pulse Metrics (from Pinnacle's actual supplier portal)

| Metric | Type | Pulse Use Case |
|---|---|---|
| Active Avg. Bill Rate | Currency | Trend vs benchmark; flag rate creep |
| Avg Markup (Non Tech) | Percentage | Target-driven; alert on deviation |
| PreID Fill % | Percentage | Key performance target; drop = immediate flag |
| Active Work Orders | Count | Volume trend; spike or drop detection |
| Active Tenure (In Months) | Number | Trend over time |
| Efficiency Score | Percentage (50% weight) | Quartile movement; anomaly on drop |
| Quality Score | Percentage (30% weight) | Quartile movement |
| Risk Score | Percentage (20% weight) | Threshold alert |
| Composite Score | Percentage | The 81% → 73% drop is the demo moment |

---

## AI Sample Questions

**Marcus (Program Manager)**
- Which suppliers are underperforming?
- How is spend trending by supplier?
- Which requisitions are aging past SLA?
- What data sources power this portal?

**Priya / Christine (Supplier)**
- How does my fill rate compare to other suppliers?
- Which of my roles have the lowest fill rate?
- What is my compliance rate this quarter?
- Which events have the highest placements?

---

## Talk Track

---

### Step 1 — Marcus Webb: The Pinnacle View

"Start here to establish what Pinnacle manages. This is the internal operator view — not what suppliers see.

Marcus logs in and sees the full program: Total Spend, Program Savings, Active Assignments, Avg Fill Time, Active Suppliers, Open Requisitions — across every client and every supplier Pinnacle manages. Live, every time.

He goes to **Supplier Scorecard**. Every supplier ranked side by side on efficiency, quality, and risk. One is sliding. He knows before his client calls.

He hits **Filter by Supplier**, selects Atlas Workforce Solutions. Every metric, every chart scopes instantly to just Atlas. He can see the score is sliding — now he wants to know why.

He clicks **Data Q&A** and asks: *'What is driving the decline in Atlas's score?'* — real data, real answer, no analyst involved.

Set the context and move on. This view is for Pinnacle's team. Now show what suppliers actually experience."

---

### Step 2 — Priya Okonkwo: The Supplier Experience

**Login and security**

"Log in as Priya. She works for Atlas Workforce Solutions.

The moment she lands: *Welcome, Priya. Atlas Workforce Solutions · Q3 2026 · Data refreshed today.*

Her data is already scoped. No supplier selector — that option doesn't exist for her. Access control is enforced at the JWT level, server-side, before the page loads. She can't see another supplier's numbers even if she tried."

**Pulse — the alert finds her**

"She sees her KPIs immediately: Active Avg. Bill Rate, Avg Markup, Active Work Orders, Active Tenure, PreID Fill %, Open Requisitions.

But more importantly — Tableau Pulse has already flagged something. Her overall supplier score declined from 73% to 63% this quarter. Ready-to-Start Rate and Offer Acceptance Rate are the largest contributors.

She didn't have to go looking. The alert found her. And the stakes are clear: *this decline could affect the number of new opportunities Atlas receives from Pinnacle.* That's what makes suppliers act.

Today Pinnacle emails this scorecard once a quarter, by hand. With Pulse, the moment the score moves, the supplier knows."

**Investigating the cause**

"She opens the **Supplier Scorecard**. Score breakdown by component — Quality contribution, Efficiency contribution, Risk contribution — trend over time, current versus target, peer benchmark.

She hits **Filter by Client** and selects Meridian Financial. Everything narrows to just that program. She can see exactly which client relationship is driving the decline.

She found the problem herself. Nobody had to pull a report for her."

**Ask your performance data**

"She clicks **Ask your performance data** and types: *'Why did my score drop this quarter?'*

This is querying her actual performance data — scoped to Atlas, scoped to East and South regions, same access control as the dashboard. She can't accidentally surface another supplier's data here either.

She asks: *'Which client program is driving the decline?'* Direct answer. *'How does my offer acceptance rate compare to last quarter?'* Same — real data, in seconds.

No email to Marcus. No waiting. She diagnosed her own performance gap and knows what to fix before the quarterly review."

---

### Step 3 — Christine Nakamura: Proving Security

"One more. Log in as Christine — Apex Talent Partners, West and Central regions.

Her welcome header reads Apex Talent Partners. Different numbers. Different scorecard. Different quartile. Her **Filter by Client** shows Nexus Retail Group and Summit Healthcare — not Meridian Financial, because Apex doesn't serve that program.

She asks **Ask your performance data** the exact same question Priya just asked. Completely different answer. Because it's her data.

Same portal. Same AI. 1,300 suppliers. Every one sees only their world."

---

### The Close

"Today Pinnacle manually downloads and emails supplier scorecards every quarter. Any off-cycle request means someone stops what they're doing to pull a report by hand — Shannon said it herself: *'a very heavy manual lift each quarter.'*

What you just saw replaces that entirely. Suppliers self-serve, in real time. Pulse alerts them the moment something changes. The AI answers the why. And every single interaction is locked to exactly what that supplier is authorized to see.

That's the efficiency gain. That's why suppliers adopt the portal instead of waiting for a quarterly email. And that's what scales to 1,300 users without scaling the team."

---

## Technical Configuration

| Setting | Value |
|---|---|
| App ID | `pinnacle` |
| Tableau Site | `embeddingplaybook` (main) |
| MCP Auth | Passthrough (`X-Tableau-Auth`) |
| Datasource | Superstore |
| UAF Field | `Region` |
| AI Chat | Enabled |

### Supplier Mapping
| Supplier | Regions (UAF) | Client Programs |
|---|---|---|
| Atlas Workforce Solutions | East, South | Meridian Financial · Nexus Retail Group |
| Apex Talent Partners | West, Central | Nexus Retail Group · Summit Healthcare |
| Meridian Staffing Group | East | Meridian Financial |
| Vertex Workforce | South, Central | Nexus Retail Group |
| Summit Staffing | West | Summit Healthcare |
