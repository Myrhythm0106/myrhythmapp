

# Fix: Update All Dates to 2026 + Regenerate Attractive CCM Investor Deck

## Problem
The investor deck and multiple sample data files throughout the app use **2023 dates** — three years out of date. Today is **24 March 2026**.

## Plan

### 1. Regenerate CCM Investor Deck (high priority)
Using the `pptxgenjs` approach from the PPTX skill for a visually striking deck:

- **Color palette**: Deep midnight navy (`#0a0a1a`) with luminous brand accents — teal (`#028090`), emerald (`#00A896`), warm orange (`#F96167`)
- **Dark backgrounds throughout** for premium feel
- **Bold stat callouts** (60-72pt numbers), icon grids, comparison columns
- **Varied layouts** per slide — no two slides look the same
- **All dates reflect 2026**: Q2 2026 launch, £500K target by Dec 2026, 5-year roadmap to 2031
- **10 slides**: Title, Discharge Cliff, CCM Solution, Market ($40B+), LEAP Platform, Revenue Model, Traction/Milestones, Competition/Moats, Funding Ask, CTA
- Full visual QA cycle with slide-by-slide image inspection

### 2. Update hardcoded 2023 dates across the app (7 files)
All sample/placeholder dates updated from `2023-05-xx` to `2026-03-xx` or contextually appropriate 2026 dates:

| File | Change |
|------|--------|
| `calendar/data/actionsData.ts` | All dates → March/April 2026 |
| `calendar/data/sampleGoalsData.ts` | All dates → 2026 |
| `calendar/types/calendarTypes.ts` | All dates → 2026 |
| `tracking/SymptomHistory.tsx` | All dates → March 2026 |
| `community/ExpertQA.tsx` | All dates → March/April 2026 |
| `investor/InvestorSlides.tsx` | Research citations stay as-is (publication years are real) |
| `investor/ProductivityInvestorSlides.tsx` | Same — citation years unchanged |

### Technical approach
- Use `pptxgenjs` (Node.js) to create the PPTX from scratch with embedded design
- Convert to PDF via LibreOffice for QA
- Output to `/mnt/documents/` as `MyRhythm_CCM_Investor_Deck_v2.pptx` and `.pdf`
- Line-replace all 2023 sample dates in the 5 data files

