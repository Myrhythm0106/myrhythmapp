# Founder Evidence System — see the data, decide with it

Right now the app records usage events (`analytics_events` — 63 page views, 87 assessment answers, 11 completed assessments, 3 package selections and so on) and founding feedback, but **you cannot see any of it**. Both tables are locked to "each user sees only their own rows", and there is no admin read policy. There is no funnel view, no retention view, and no written rule for when a number should change the product.

This plan gives you three things: access to the data, a place to read it, and a repeatable decision loop.

## 1. Access — admin read on your own data

Add admin-only read policies (using the existing `has_role(auth.uid(), 'admin')` function) to the tables that carry product evidence: analytics events, founding feedback, assessment results, and anonymous counts from the core loop tables (captures, commits, calibrations, celebrations).

Nothing becomes public. Only accounts with the `admin` role can read across users, exactly like the existing `/founder/*` pages.

## 2. A place to read it — `/founder/evidence`

A new admin-gated page, same style as the existing data room, with four panels:

**Funnel** — Landing → Assessment start → Assessment complete → Payment page → Trial started → First capture. Counts and drop-off percentage at each step, for a selectable window (7 / 30 / 90 days).

**Feature usage** — one row per core surface (Memory Bridge, Calendar, 4C Capture/Commit/Calibrate/Celebrate, Support Circle, Discharge Bridge, Document Import, MyRHYTHM-G). For each: users who touched it, times used, and share of active users. This is the "is this feature earning its place?" table.

**Return behaviour** — day-1 / day-7 / day-30 return rate, plus median days between sessions. The continuity claim lives or dies here.

**Voice of the cohort** — founding feedback entries and assessment "none of these fit me" free-text answers in one scrollable list, tagged by which surface they mention.

Every panel has a CSV export so the same numbers can go straight into the 90-day workbook and investor pack.

## 3. The system — how a number becomes a decision

A written rule set, stored as `docs/evidence-decision-system.md` and summarised on the page itself, so decisions are consistent rather than mood-driven:

**Cadence**
- Weekly (Monday, 20 min): read Funnel + Return. Log one line in the Founder Usage Log.
- Monthly: read Feature usage + Voice. Produce a Keep / Fix / Cut call for each feature.

**Thresholds** (v0.1 founding cohort, judged only once a feature has been live 21 days and seen by 20+ people)
- **Keep** — used by 40%+ of active users, or explicitly praised by 3+ people.
- **Fix** — 15–40% usage, or high starts with low completion (people want it, the surface is wrong).
- **Cut / defer to v0.2** — under 15% usage and no qualitative pull.
- **Add** — only when the same unmet need appears in 3+ independent feedback entries *and* maps to one of the three defined problems (Discharge Cliff, Clinical-vs-Life-Ready Gap, Ideal-Brain Assumption). Anything that fails the problem test goes to a parked list, not the build.

**Guardrail** — accessibility, calm-load and no-medical-claims rules are never overridden by a usage number. A feature is never added just because engagement would rise.

**Trail** — each Keep / Fix / Cut / Add decision is written to a decision log table with the date, the number that triggered it, and the outcome, so the investor pack can show that roadmap changes were evidence-led.

## Technical notes

- Migration: admin `SELECT` policies via `has_role(auth.uid(), 'admin')` on `analytics_events`, `founding_feedback`, `assessment_results`; new `product_decisions` table (feature, verdict, evidence, decided_at) with the standard GRANT + RLS block, admin-only.
- Aggregation runs as security-definer SQL functions returning pre-aggregated rows (funnel counts, feature usage, retention cohorts) so no raw per-user data is shipped to the browser.
- New page `src/pages/FounderEvidencePage.tsx` at `/founder/evidence`, wrapped in the existing `AdminRoute`, reusing the data-room card styling.
- Event coverage gap: several core surfaces do not emit events yet. Add `trackEvent` calls to Memory Bridge save/extract, calendar event create, each 4C step, Support Circle invite, and document import approval — without this, the feature table is blank.
- CSV export client-side from the aggregated rows; no new dependency.
