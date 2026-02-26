

## Add ABI alongside TBI across both decks

Simple find-and-replace style updates — wherever TBI appears alone, add ABI alongside it.

### Clinical Deck (`src/components/investor/InvestorSlides.tsx`)

| Line | Current | Updated |
|------|---------|---------|
| 72 | `"of TBI survivors report daily cognitive struggles"` | `"of ABI & TBI survivors report daily cognitive struggles"` |
| 321 | `"TBI Survivors"` | `"ABI & TBI Survivors"` |
| 335 | `"We begin with TBI survivors — the most underserved"` | `"We begin with ABI & TBI survivors — the most underserved"` |
| 369 | `"Built for TBI. Useful for Every Brain."` | `"Built for ABI & TBI. Useful for Every Brain."` |
| 396 | `"help a TBI survivor keep promises"` | `"help an ABI & TBI survivor keep promises"` |
| 530 | `"TBI survivor networks"` | `"ABI & TBI survivor networks"` |
| 559 | `"Built by a TBI survivor"` | `"Built by an ABI survivor"` |
| 632 | `"Built by a TBI survivor who"` | `"Built by an ABI survivor who"` |

### Productivity Deck (`src/components/investor/ProductivityInvestorSlides.tsx`)

| Line | Current | Updated |
|------|---------|---------|
| 154 | `"Post-Surgery / Brain Injury", size: "70M annual TBI"` | `"Acquired Brain Injury (ABI & TBI)", size: "80M+ annually"` |
| 343 | `"for TBI survivors"` | `"for ABI & TBI survivors"` |
| 368 | `"Post-Surgery / TBI"` | `"ABI & TBI Survivors"` |
| 493 | `"post-surgery, TBI, and cognitive rehab"` | `"post-surgery, ABI, TBI, and cognitive rehab"` |

### Files changed
- `src/components/investor/InvestorSlides.tsx` — ~8 line edits
- `src/components/investor/ProductivityInvestorSlides.tsx` — ~4 line edits

