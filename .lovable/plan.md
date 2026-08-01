# Rehab Partner Readiness — Bridge Mode, Co-Sign, and the Standards Pack

Goal: make MyRhythm demo-able and adoptable by a rehab service inside August, without adding a single new member feature. Three workstreams, in priority order.

## 1 · Bridge Mode (simplicity fix)

The member app currently exposes 23 routes in the You-Are-Here dial. For the first 30 days post-discharge that reads as complexity, not capability.

- Add a `bridge_mode` preference (default **on** for new members, off after 30 days or on explicit opt-out).
- When on, the dial and navigation show only five doors: Home, Capture, Commit, Calibrate, Support Circle.
- Everything else stays routable by direct link — nothing is deleted, nothing is archived.
- A single "Show everything" control in Settings, plus a gentle prompt at day 30.
- Move Brain Games from the middle ring to the outer ring so it stops reading as the headline.

## 2 · Clinician co-sign artefact

Today the plan is patient-authored. For rehab standards it needs to be *agreed*.

- New route `/launch/plan-agreement`: the member's Vision, top three Goals, and this week's committed actions rendered as a read-only summary.
- Generates a PDF with a clinician sign-off block (name, role, service, date, signature line) and the "Prepared by the patient. Not a clinical record." label already used in the discharge handover.
- Email or share the PDF to the discharge nurse; record the send in a `plan_agreements` table (member, sent date, recipient, status: sent / acknowledged) with RLS scoped to the member plus service_role.
- Acknowledgement in v0.1 is manual: the member marks it acknowledged when the clinician replies. No clinician login, no portal — that is a v0.2 conversation.

## 3 · 30-day continuity report

The artefact a service can put in a patient file.

- Extends the existing `clinicalExport.ts` with a `buildContinuityReport()` variant covering days 1–30: goals set, actions committed, actions completed, Support Circle size, check-in streak, and a Goal Attainment Scaling-shaped table (committed / partially met / met).
- Behaviour and quality-of-life language only. No scores, no clinical outcome verbs — validated against `docs/claims-policy.md`.

## 4 · Event instrumentation (unblocks everything)

The founder funnel reads empty because most surfaces don't emit. Wire `recordAction` into: assessment complete, capture saved, commit created, calibrate check-in, celebrate logged, calendar event created, Support Circle member added, plan agreement sent. No new schema — the tracking layer already exists.

## 5 · Rehab Partner Pack (documents)

A new `docs/rehab-partner-pack.md` plus a generated PDF in both MyRhythm and FIT Collective brands:

- One-page service description ("the discharge follow-through instrument")
- Standards mapping table: UKROC, CARF, CQC Responsive/Effective, NICE NG211, GAS
- Explicit boundary statement: what MyRhythm supports and evidences, and what it never claims
- DPIA-lite: data captured, lawful basis, retention, deletion, the k=20 research floor
- The £0 Bridge Partner pilot terms: they distribute the handout, we supply the artefacts, they sign an LOI and review anonymised continuity data at 90 days
- A pre-meeting checklist and the approved outreach script from the claims policy

## What is explicitly out of scope

- Clinician logins, a provider portal, or any multi-tenant service account — v0.2
- Discharge summary ingestion and AI plan drafting — already deferred to v0.2
- Any new member-facing feature
- Any claim of standards certification, compliance, or clinical validation

## Technical notes

- Bridge Mode is a filter over `src/launch/routes.ts` consumed by the dial and step locator; no route removals.
- `plan_agreements` follows the existing pattern: create table, GRANT to authenticated and service_role, enable RLS, policies scoped to `auth.uid()`.
- PDF generation reuses `src/utils/clinicalExport.ts` and the standard 3pt confidentiality footer.
- Both new PDFs go through the six-point pre-publish checklist in `docs/claims-policy.md` before they ship.

## Suggested order

Bridge Mode and instrumentation first (both cheap, both change what a demo looks like), then the co-sign artefact, then the continuity report, then the partner pack once there is real data to point at.
