

## Updated Investor Deck — Corrections Applied

Two changes incorporated:

### 1. Slide 11 (Universal Utility) — Use Cases Row
Updated to include Brain Injury explicitly:
- **Brain injury survivors**, students, professionals, aging parents, anyone with ADHD, post-surgery recovery
- Brain injury listed first — it is the origin, the credibility anchor

### 2. All Financial References — Dec 2026
Every mention of the revenue target date updated from 2025 to 2026:
- Slide 16 (Business Model): "£500K target by December 2026"
- Slide 18 (The Ask): Milestones timeline shifted to 2026
- Slide 12 (Market Size): Growth projections reference 2026

### Implementation

No change to file structure or slide count. Same 18 slides, same 3 files:

| File | Action |
|------|--------|
| `src/pages/InvestorDeckPage.tsx` | CREATE — presentation shell |
| `src/components/investor/InvestorSlides.tsx` | CREATE — all 18 slides with corrected data |
| `src/App.tsx` | MODIFY — add `/investor-deck` route |

Ready to build the full deck now with these corrections baked in.

