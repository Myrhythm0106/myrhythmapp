

## Three updates to Slides 2, 3 in `src/components/investor/InvestorSlides.tsx`

### 1. Slide 2 — Add ABI scale alongside TBI (lines 60–86)

Update headline to show both:
- **New headline**: `"Every year, 69 million people sustain a TBI. 12 million more suffer a stroke or acquired brain injury."`
- Add a 4th stat: `"12M"` / `"new strokes annually (Feigin et al., Lancet Neurology 2021)"`
- Reorder stats: `69M` TBI (Dewan 2019), `12M` strokes/ABI (Feigin 2021), `53M` caregivers (AARP 2020), `85%` daily cognitive struggles

### 2. Slide 3 — Complete rewrite for emotional + factual impact (lines 89–128)

**New headline**: `"The ABI & TBI patient goes home. The system moves on. The real damage begins."`

Replace the current two-column layout with a structure that hits harder:

**Top row** — "What happens after discharge" (the current gap, compressed):
- `"Clinical rehab: 6–12 weeks post-ABI/TBI. Then: a pamphlet and a follow-up in 6 months."`

**Impact grid** — 6 cards showing the verified human cost:

| Card | Stat | Detail | Source |
|------|------|--------|--------|
| Marriages | 49% | of pre-injury relationships break down within 5–8 years | Wood & Yurdakul, Brain Injury 1997 |
| Careers | 60% | of moderate-severe TBI survivors unable to return to prior employment | Shames et al., NeuroRehabilitation 2007 |
| Readmission | 1 in 3 | TBI patients readmitted to hospital within 5 years | CDC/NIDILRR Model Systems |
| Economic | $40B+ | annual direct US healthcare costs for TBI alone | Miller et al., Medical Care 2021 |
| Caregivers | 40% | of brain injury caregivers report clinical depression | National Academies 2022 |
| Children | 68% | of families report children's wellbeing significantly affected | UKABIF Family Survey 2019 |

**Footer**: `"Sources: Wood 1997; Shames 2007; CDC/NIDILRR; Miller 2021; National Academies 2022; UKABIF 2019"`

**Bottom line** (italic, large): `"No app. No system. No continuity. Just a person trying to remember who they were."`

### 3. Update References slide (Slide 19) — add new sources

Append:
- **7.** Miller GF et al. "Costs of non-fatal traumatic brain injury in the United States, 2016." *Medical Care*, 2021; 59(5): 451–455.
- **8.** Wood RL, Yurdakul LK. "Change in relationship status following traumatic brain injury." *Brain Injury*, 1997; 11(7): 491–501.
- **9.** National Academies of Sciences. "Traumatic Brain Injury: A Roadmap for Accelerating Progress." 2022.
- **10.** Shames J et al. "Return to work following traumatic brain injury." *NeuroRehabilitation*, 2007; 22(3): 205–213.
- **11.** GBD 2021 / Feigin VL et al. "Global burden of stroke, 1990–2021." *Lancet Neurology*, 2024; 23(10): 973–1003.

### File changed
- `src/components/investor/InvestorSlides.tsx`

