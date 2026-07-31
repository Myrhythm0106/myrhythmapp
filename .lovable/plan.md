# The 90-day pack already exists — it just isn't in your hands yet

Confirmed on disk:

```text
launch_v2_3/founder_pack/myrhythm/
├── MyRhythm_M1_MVP_90_Day_Plan.md              (narrative)
├── MyRhythm_M2_MVP_90_Day_Action_Plan.xlsx     (6 tabs: README, 90_Day_Actions (57 actions),
│                                                IP_Register, Success_Metrics, Dashboard, Assumptions)
└── MyRhythm_M3_Five_Year_Action_Plan.xlsx
launch_v2_3/founder_pack/fit_collective/  (FIT mirrors of all three)
```

Nothing needs rebuilding. What's missing is a downloadable handoff and a Google-Sheets-clean version.

---

## Deliverable 1 — 90-day plan, ready for Google Sheets today

1. Re-surface `MyRhythm_M2_MVP_90_Day_Action_Plan.xlsx` and `MyRhythm_M1_MVP_90_Day_Plan.md` as downloadable artefacts in chat (plus FIT mirrors) so you can grab them immediately.
2. Produce a **Google-Sheets-safe** variant, `MyRhythm_M2_MVP_90_Day_Action_Plan_GSHEETS.xlsx`:
   - Formulas rewritten to functions Sheets supports natively (no volatile/Excel-only constructs), so the Dashboard still computes after import.
   - Data-validation dropdowns on **Status** (Not started / In progress / Blocked / Done) and **Owner** — these survive the import and make it usable as a live tracker.
   - Conditional formatting on Status and on overdue Finish dates versus today.
   - Frozen header row, filter view on `90_Day_Actions`, dates as real dates (not text).
3. Also export `90_Day_Actions.csv` as a fallback — a single-tab import that can never break.
4. A one-page `HOW_TO_IMPORT.md`: File → Import → Upload → Replace spreadsheet, then how to share it, and which cells are yours to edit (blue) versus computed (black).

Start date currently in the workbook is 3 Aug 2026; today is 31 Jul 2026, so the schedule still lands. Say the word if you want it re-anchored to Mon 3 Aug explicitly.

---

## Deliverable 2 — Friends & Family £8/month for life

My honest read: **yes, but bound it.** A lifetime price is a permanent liability on your margin and it appears in every investor model you've already built. £8 versus the £10 Founding Member rate is only a 20% discount — too small to feel special, big enough to muddy the ladder. Two things fix it:

- **Cap it at 50 seats, invite-only, code-gated.** Scarcity makes it a gift rather than a discount tier, and it keeps the F1 financial model honest.
- **Make it a distinct badge, not a cheaper Founding Member.** "Friends & Family — Founding Circle" with the expectation of feedback attached. People pay £8 for belonging, not for the £2.

Alternative worth a thought: £8/month for life *or* £80/year for life, same cap. The annual version front-loads cash you need in the next 90 days.

Implementation:
- Add a `friendsFamily` tier to `src/config/pricing.ts` (£8/mo, £80/yr, 50-seat cap, `lifetime: true`).
- Redeemed via the existing `founding_access_codes` gate — a new code batch tagged `friends_family` rather than a new payment path.
- Payment screen shows the F&F price and badge when a valid code is held; otherwise unchanged.
- Add the tier and its 50-seat cap as a line in the M2 Assumptions tab and the F1 financial model so the numbers stay consistent.

---

## Technical notes

- Workbook generation uses the existing Python/openpyxl scripts; every output recalculated headless to zero formula errors and each page rendered to image and inspected before delivery.
- No database changes for the plan files. The F&F tier touches `src/config/pricing.ts`, the payment screen, and the access-code batch only.

## Your decisions before I build

- F&F: 50-seat cap, or a number you prefer?
- Monthly £8 only, or offer £80/year for life alongside it?
