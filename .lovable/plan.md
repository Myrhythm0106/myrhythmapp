# Business Plan consolidation + founder benchmarking + 90-day plan re-baseline

Pricing is locked as agreed: **£15 regular / £10 Founding Member (500 seats, for life) / £7.50 Friends & Family (50 seats, invite-only, for life, £75 a year alongside)**. Everything below assumes that ladder.

## 1. The single Business Plan document

One master document — `MyRhythm_Business_Plan_v1` — delivered as `.docx` (editable in Word and Google Docs) and `.pdf` (send-ready), with a mirrored FIT Collective version. It absorbs the material currently spread across F1, G1, B1, M1, M2, M3, the market-evidence and problem-fit docs, the marketing plan and the data room index. Nothing is invented; existing content is edited into one voice and one numbering scheme.

Structure:

```text
0   Cover, confidentiality footer, version control
1   Executive summary (2 pages, investor-readable alone)
2   The problem            <- problem-fit-and-market, market-evidence
3   Market and opportunity <- market sizing, six cohorts, 5W+H table
4   The product            <- v0.1 features, 4C loop, Memory Bridge, Discharge Bridge
5   Why now / why us       <- founder story, Collaborative Cognitive Continuity layer
6   Competitive landscape  <- B1 narrative + matrix summary + why our GTM differs
7   Business model         <- the £15/£10/£7.50 ladder + rationale
8   Go-to-market           <- founders-market marketing plan, dual on-ramps
9   Five-year growth plan  <- G1 narrative + milestones
10  Financial plan         <- F1: P&L, cash, unit economics, £250K pre-seed ask
11  Operations and team    <- single-founder capacity, first hires, ops stack
12  Legal, IP and entity   <- Delaware C-Corp, O-3 status, copyright/trademark, patent view
13  Risk register          <- incl. the "where we are genuinely weaker" section, honest
14  90-day execution plan  <- M2 summary, full detail in the workbook
15  Appendices             <- assumptions, data room index, evidence citations
```

Rules applied throughout: no medical claims, "app" not "OS", Memory-First Design™ external / Collaborative Cognitive Continuity layer internal, 3pt confidentiality footer on every page.

Every page is rendered to an image and inspected before delivery — no clipped tables, no broken pagination.

## 2. Founder and app-builder benchmarks

A new section (and a matching set of 90-day actions) covering operators worth studying, deliberately outside brain health. Selection is verified by live search before it goes in the document — recency matters, and a stale list is worse than none. The shortlist is drawn from three groups:

- **Solo and small-team app builders shipping at speed** — people whose build-in-public cadence, pricing experiments and launch mechanics can be copied directly.
- **Consumer-subscription operators** — founders and growth leads who have written publicly about trial design, price anchoring, annual conversion and churn.
- **Care, health and accessibility adjacent** — a small number who overlap on trust, safeguarding and clinician channels.

For each entry: who, why relevant to MyRhythm, the single specific thing to copy, where to follow them (podcast, newsletter, YouTube), and a time cost per week. Podcasts are listed as sources, not as a reading list — the point is one transferable mechanic per person.

This becomes:
- Section 5b in the Business Plan ("Who we learn from, and what we take").
- A `Benchmarks` tab in the 90-day workbook.
- Roughly 10 to 12 dated actions in the plan (one study block a week, each ending in a written "what I changed" note), so learning produces a product or GTM change rather than consumption.

## 3. 90-day plan re-baselined to 1 August 2026

The M2 workbook is rebuilt with:

- **Day 1 = Saturday 1 August 2026**, Day 90 = 29 October 2026. Every action gets recalculated start and end dates against that anchor, keeping the existing sequencing.
- Existing tabs preserved: Actions, IP Register, Success Metrics, Assumptions, Dashboard.
- New: `Benchmarks` tab (section 2 above) and the F&F 50-seat line in Assumptions.
- Columns per action, as specified previously: Title, Definition of success, Start, Finish, Owner, Status, Notes.
- **Google Sheets safe**: only functions Sheets supports, dropdown data validation on Status and Owner that survives import, no volatile array formulas, dashboard built on COUNTIFS rather than pivot caches.
- Delivered as `MyRhythm_M2_90_Day_Plan_v2_GSHEETS.xlsx` plus `90_Day_Actions.csv` as a single-tab failsafe, and `HOW_TO_IMPORT.md` with Google Workspace steps.

FIT Collective versions of the workbook and CSV are produced in the same pass.

## 4. Code changes (small, contained)

- `src/config/pricing.ts` — add the `friendsFamily` tier: 750 pence monthly, 7500 pence yearly, `lifetime: true`, `maxSeats: 50`, own badge and tagline. `basePricing` and `foundingMemberConfig` numbers stay as they are.
- `LaunchPayment.tsx` — when a valid F&F access code is held, show £7.50 / £75, the "Friends & Family, Founding Circle" badge and seats remaining. Screen otherwise unchanged.
- Redemption uses the existing `founding_access_codes` gate with a `friends_family` code batch — no new payment path.
- `src/founder/dataRoom.ts` — add the pricing ladder and the 50-seat cap to the assumptions so the in-app data room matches the plan.
- `docs/pricing-rationale.md` — the competitor pricing table and the reasoning, so the ladder can be defended without re-deriving it.

## Deliverables

| File | Format | Location |
|---|---|---|
| MyRhythm_Business_Plan_v1 | .docx + .pdf | founder_pack/myrhythm |
| FIT_Collective_Business_Plan_v1 | .docx + .pdf | founder_pack/fit_collective |
| MyRhythm_M2_90_Day_Plan_v2_GSHEETS | .xlsx | founder_pack/myrhythm |
| 90_Day_Actions.csv | .csv | founder_pack/myrhythm |
| FIT equivalents of both | .xlsx + .csv | founder_pack/fit_collective |
| HOW_TO_IMPORT.md | .md | founder_pack |
| Founder_Pack_Index.md | updated to v4 | founder_pack |

## One caution

Consolidating into a single master document means the source docs become reference material rather than living files. To avoid two sources of truth drifting apart, the Business Plan becomes canonical and the F1/G1/B1/M-series stay as the working models it cites. The index will say so explicitly.
