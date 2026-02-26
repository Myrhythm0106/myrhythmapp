

## Update TAM Segments to Include ABI — Both Decks

### Goal
Show ABI and TBI as distinct but complementary segments that can be viewed individually, compared side-by-side, and understood as a combined total.

### Clinical Deck (`InvestorSlides.tsx`) — Slide 12

Replace the current 3-row TAM/SAM/SOM table with a richer layout:

**Top section: "The Combined Opportunity"**
- One bold combined figure: e.g. "TAM: $4.2B — Global ABI + TBI cognitive support market"

**Middle section: Two-column breakdown**

| | ABI (non-traumatic) | TBI (traumatic) |
|---|---|---|
| **Annual cases** | 12.2M strokes + 2M+ other (tumour, anoxia, infection) | 69M globally |
| **Key populations** | Stroke survivors, post-surgery, encephalitis | Falls, accidents, sport, military |
| **Market size** | $2.4B | $1.8B |
| **Combined** | colspan → **$4.2B TAM** |

This lets investors see each segment individually, compare them, and grasp the full picture.

**Bottom section: SAM + SOM rows unchanged** (updated labels to say "ABI + TBI" instead of just "TBI")

### Productivity Deck (`ProductivityInvestorSlides.tsx`) — Slide 13

Same structural change — two-column ABI vs TBI breakdown within the broader $22B TAM, showing the clinical populations as the beachhead within the larger productivity market.

### Files

| File | Lines | Change |
|------|-------|--------|
| `src/components/investor/InvestorSlides.tsx` | ~403-433 | Rewrite Slide12 with two-column ABI/TBI breakdown + combined total |
| `src/components/investor/ProductivityInvestorSlides.tsx` | ~415-445 | Rewrite Slide13 with same ABI/TBI breakdown within productivity TAM |

