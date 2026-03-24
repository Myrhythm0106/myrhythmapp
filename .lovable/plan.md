

# Add Memory & Confidence Pain Points to Investor Decks

## What

Add two new evidence-based pain points to the "System Gap" slide in the ABI investor deck, and reinforce these themes in the Productivity deck.

## Changes

### 1. `src/components/investor/InvestorSlides.tsx` — Slide 03 (The System Gap)

Add two new cards to the `impactCards` array:

| Icon | Label | Stat | Detail | Source |
|------|-------|------|--------|--------|
| 🧠 | Memory | 54% | of moderate-severe TBI survivors report persistent memory difficulties affecting daily life | Dikmen et al., Archives of Physical Medicine 2009 |
| 😞 | Confidence | 57% | of ABI survivors report clinically significant loss of self-confidence and identity | Gracey et al., Neuropsychological Rehabilitation 2008 |

Adjust the grid from `grid-cols-3` (6 cards) to accommodate 8 cards — either keep `grid-cols-3` with a partial last row, or switch to `grid-cols-4` with 2 rows of 4. Given the card sizes, `grid-cols-4` at 2×4 will be cleaner.

### 2. `src/components/investor/ProductivityInvestorSlides.tsx` — Slide 02 (The Cascade)

Add a 5th step to the cascade to reference memory and confidence:

```
{ step: "05", title: "Confidence collapses", desc: "Repeated memory failures erode self-trust. You stop committing because you've stopped believing you'll follow through." }
```

## Files Modified
- `src/components/investor/InvestorSlides.tsx` — add 2 pain point cards, adjust grid
- `src/components/investor/ProductivityInvestorSlides.tsx` — add confidence/memory step to cascade

