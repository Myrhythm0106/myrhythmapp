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

## 4. Anonymous research layer — build the foundation now, publish later

Two audiences want data, and they must never share a pipe:

- **You (founder)** — identified-but-aggregated product usage, to keep the app relevant (sections 1–3 above).
- **The neuro community (clinicians, researchers, funders, the cohort itself)** — de-identified, aggregate-only patterns, because the continuity data MyRhythm collects does not exist anywhere else.

The 5-year prize is a research asset. The part that must be done **now**, in v0.1, is the part that cannot be retrofitted: consent and de-identification at the point of collection. You cannot ethically anonymise data later that people never agreed to contribute.

### Now (v0.1) — the foundation

**Consent, explicit and reversible.** A "Contribute to research (anonymous)" toggle in Launch Settings and in the onboarding flow, default **off**, with plain-language copy: what is shared (patterns, never words), what is never shared (transcripts, names, notes, voice, documents), and one-tap withdrawal. Consent state, version of the wording agreed, and timestamp are stored per user.

**A research event stream separate from the product one.** When consent is on, a de-identified row is written to a `research_events` table containing: a per-user pseudonymous ID (a salted hash, not the auth user ID), a coarse cohort band (persona, stage, age band, months-since-event band), the metric, and a rounded value. No free text ever enters this table. Content stays where it is; only shape and rhythm travel.

**Aggregation floor.** Nothing is readable below a k-anonymity threshold of 20 — any cohort slice with fewer than 20 contributors returns "not enough data yet" rather than a number. This is enforced in the SQL function, not in the UI, so it cannot be bypassed.

**Governance written down** in `docs/research-data-charter.md`: what is collected, lawful basis (explicit consent, UK GDPR Art. 9 special-category caution), retention, withdrawal, the k=20 floor, and the standing rule that MyRhythm does not sell data and does not make medical claims from it. This document is also an investor and clinician asset — it is what a rehab unit will ask for before recommending the app.

### Later (v0.2 → 5-year) — the asset

- **Cohort Insights page** for consenting users: "people in your stage typically…" — reciprocity, so contributors get something back.
- **Public research snapshot**, a quarterly de-identified summary (continuity rates, discharge-to-routine timelines) published as a PDF — the single strongest credibility artefact for the neuro audience.
- **Research partnership pack**: data dictionary, methodology note, and an application route for academic collaborators. Ethics/IRB involvement, a named data protection lead, and possible ISO 27001 / DTAC alignment sit here, not in v0.1.
- **Longitudinal outcome linkage** (self-reported outcome measures over 6–12 months) — the thing that turns usage data into evidence.

This is added to the 5-year plan as a distinct track (Research & Evidence), with the v0.1 consent and de-identification work pulled forward into the 90-day window as its first two items.

## Technical notes

- Migration: admin `SELECT` policies via `has_role(auth.uid(), 'admin')` on `analytics_events`, `founding_feedback`, `assessment_results`; new `product_decisions` table (feature, verdict, evidence, decided_at) with the standard GRANT + RLS block, admin-only.
- Aggregation runs as security-definer SQL functions returning pre-aggregated rows (funnel counts, feature usage, retention cohorts) so no raw per-user data is shipped to the browser.
- New page `src/pages/FounderEvidencePage.tsx` at `/founder/evidence`, wrapped in the existing `AdminRoute`, reusing the data-room card styling.
- Event coverage gap: several core surfaces do not emit events yet. Add `trackEvent` calls to Memory Bridge save/extract, calendar event create, each 4C step, Support Circle invite, and document import approval — without this, the feature table is blank.
- CSV export client-side from the aggregated rows; no new dependency.
- Research layer: `research_consent` (user_id, granted, consent_version, granted_at, withdrawn_at) and `research_events` (pseudonym_id, cohort bands, metric, numeric value, occurred_on — no user_id, no text). Pseudonym derived in a security-definer function from user_id + a server-side salt held as a secret, so the browser never sees the mapping. `research_events` has no per-user read policy at all; access is only via a security-definer aggregate function that enforces the k=20 floor.
- Withdrawal deletes the consent row and purges that pseudonym's research rows in the same transaction.

