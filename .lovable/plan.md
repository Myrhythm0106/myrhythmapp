
# MVP 90-Day Document + Trackable Action Plans (90-Day & 5-Year) + IP Track

Three new files in `/mnt/documents/launch_v2_3/founder_pack/`, in both **MYRHYTHM** and **FIT_COLLECTIVE** versions, sitting on top of the existing Founder Pack (F1 financials, G1 growth plan, C1/C2 curriculum).

Anchor date: **30 July 2026**. 90-day window: **3 Aug 2026 → 31 Oct 2026** (Founding cohort live → public paid launch).

---

## Deliverable 1 — MVP 90-Day Document

**File:** `M1_MVP_90_Day_Plan.md` (+ FIT version)

1. **What the MVP is** — locked v0.1 scope: 9 `/launch/*` Founding Core routes, 4C loop, Memory Bridge, Calendar/PA layer, Discharge Bridge Kit. Explicit out-of-scope (v0.2: discharge-summary ingestion, Bring a Witness, clinical taxonomy).
2. **Problem & wedge** — one page from `docs/MyRhythm_Problem-Fit_and_Market_v2.md`.
3. **Definition of MVP success** — day-90 pass/fail bar: Founding Members, activation (assessment → first Commit), 7/30-day retention, weekly Memory Bridge captures, clinical LOIs, NPS.
4. **The 90 days in 3 sprints** — Days 1–30 Harden & Gate; 31–60 Cohort Live; 61–90 Evidence & Paid Launch Readiness, each with entry/exit criteria.
5. **IP & legal readiness** (new) — summary of what must be filed or secured before external circulation.
6. **Risk register** — top 8 risks, mitigation, owner.
7. **Investor readiness checklist** — what must be true at day 90; data room contents (now includes an IP schedule).
8. **Human actions outside the app** — legal, entity, IP, counsel, forward-looking-statement disclaimer.

---

## Deliverable 2 — 90-Day Action Plan (Google Sheets ready)

**File:** `M2_MVP_90_Day_Action_Plan.xlsx` (+ FIT version)

Columns: ID · Title · Definition of Success · Start Date · Finish Date · Status · Workstream · Owner · % Complete · Completed On · Notes · Human Action? (Y/N)

Status dropdown: Not Started / In Progress / Blocked / Done / Deferred.
Workstreams: Product · **IP & Legal** · Entity & Finance · Marketing · Clinical · Founder.

Tabs:
1. **README** — usage, Google Sheets upload, status conventions.
2. **90_Day_Actions** — ~65–80 rows across the 3 sprints.
3. **IP_Register** (new) — one row per asset: asset, type (trademark / copyright / patent / trade secret / domain), jurisdiction (UK, US, EU/Madrid), current status, filing target date, cost estimate, owner, evidence/notes.
4. **Dashboard** — formula-driven: % complete by workstream, overdue count, days remaining.
5. **Success_Metrics** — day-90 bar, target vs actual.
6. **Assumptions** — drives the FIT version's neutralised figures.

Data validation on dropdowns (survives Sheets import) and conditional formatting for overdue/blocked.

### IP scope covered (drafted for counsel review, not legal advice)
- **Trademarks** — `MYRHYTHM`, `Memory-First Design™`, `Discharge Bridge Kit`, `MyRHYTHM-G`, logo mark. UK IPO + USPTO (intent-to-use) with Madrid Protocol extension. Actions include clearance search → file → monitor, with the ™ → ® transition point flagged.
- **Copyright** — source code, assessment instrument, curriculum, handbook, deck, infographics. Automatic on creation; actions cover authorship/ownership evidence, contributor IP-assignment agreements, US Copyright Office registration for the highest-value written works (needed to sue for statutory damages in the US), and a copyright notice standard across all artefacts.
- **Patent — honest assessment.** Most of MyRhythm is software workflow and brand, which is weak patent territory in the UK/EU and expensive in the US. My recommendation is **not to file a full patent in the 90 days**. Instead the plan includes: a documented invention-disclosure log for the two candidate mechanisms (assessment-score-driven smart scheduling; discharge-summary → clinician-approved plan materialisation), a one-hour patent-attorney triage call to get a file/don't-file opinion, and an optional **US provisional patent** (~$150–$3,000) as a low-cost 12-month placeholder if the attorney says the mechanism is defensible. Non-provisional and any PCT decision sit in Year 2 of the 5-year plan.
- **Trade secrets & defensive** — prompt/scoring logic kept unpublished, NDA template for cohort and clinical partners, domain and social-handle defensive registrations.
- **Costs** are itemised per row so they roll into the existing F1 financial model.

---

## Deliverable 3 — 5-Year Action Plan (Google Sheets ready)

**File:** `M3_Five_Year_Action_Plan.xlsx` (+ FIT version)

Same column schema as the 90-day sheet, quarterly across Y1–Y5, mapped to the five G1 growth phases (Founders Wedge → Clinical Beachhead → Category Ownership → Geographic Expansion → Platform).

Tabs:
1. **README**
2. **Five_Year_Actions** — ~110–130 rows, quarter-bucketed.
3. **IP_Roadmap** (new) — multi-year: ™ → ® registration completion, Madrid/EU extensions as markets open, non-provisional/PCT decision gate in Y2, renewal calendar (UK/US 10-year cycles, US §8/§15 declarations at years 5–6), enforcement/watch service, and IP schedule maintenance for due diligence.
4. **Phase_Gates** — go/no-go criteria to exit each year.
5. **Milestone_Timeline** — quarter-by-quarter grid.
6. **Dashboard**
7. **Assumptions**

The 90-day sheet's final rows roll into Y1Q3/Q4, giving one continuous chain from day 1 to year 5.

---

## Technical notes
- openpyxl; every calculated cell is an Excel formula, never a hardcoded Python result.
- Recalculated with the xlsx skill script; delivered with zero formula errors, and every sheet visually QA'd.
- Arial; blue = input, black = formula, green = cross-sheet link, yellow fill = needs your input.
- Confidentiality footer per project standard.
- FIT_COLLECTIVE versions neutralise MyRhythm-specific figures and IP asset names into Assumptions-driven fields.
- Google Sheets: `.xlsx` upload preserves formulas, validation and conditional formatting. To push directly into your Drive the Sheets connector needs a reconnect (it 403'd on scopes last time).

## Human actions flagged (not part of the build)
- Confirm the 90-day dates against your actual availability before I lock them.
- Engage a UK/US trademark attorney for clearance searches before filing — the IP_Register rows are drafts, not legal advice.
- One-hour patent-attorney triage before spending anything on a provisional.
- US counsel/CPA review of figures; forward-looking-statements disclaimer on the 5-year sheet.
- Signed IP-assignment agreements from any contractor or contributor, past and future.

Reply **approve** and I'll generate all 6 files (3 pairs) in one pass.
