# /start copy refinements — sentence order + "No one walks alone" in chapter 04

Two small, high-value copy changes on the /start landing page (`src/components/mvp/MVPCore4C.tsx`).

## 1. Swap the headline order in the "Made for real cognitive load" section

Current (line 407):

> Useful when life is full. Reassuring when memory or energy is harder.

New order:

> **Reassuring when memory or energy is harder. Useful when life is full.**

Why this order works: it leads with the primary audience (memory/energy difficulty — the people MyRhythm exists for) and lands on the inclusive "life is full" promise second, so the wider-professional reader feels invited rather than addressed first.

## 2. Add "No one walks alone." to story chapter 04

Chapter 04 ("THE PERSON — The right person can stay connected") is the Support Circle story, and "No one walks alone" is the locked brand line for exactly that feature — so yes, it makes sense there and nowhere better.

Placement: a standalone emphasis line directly after the chapter description paragraph, before the "What I can expect" collapsible:

> **No one walks alone.**

Styling recommendation (my call): **bold and in launch-teal** — both, not either/or. Teal is already chapter 04's accent (its number marker and promise line use it), so the line reads as the chapter's emotional signature without introducing a new colour. Bold alone would disappear into the ink-deep body text; a new colour would break the disciplined three-accent palette. Exclamation mark softened to a full stop to match the page's calm, premium tone (same reasoning as the earlier "You stay in control." decision). Easy to change back to "!" if you prefer.

## Files touched

- `src/components/mvp/MVPCore4C.tsx` only — two edits:
  1. Line 407: swap the two sentences.
  2. Chapter 04 data/render: add the "No one walks alone." emphasis line after the description. Cleanest implementation: render an optional `signature` field on the chapter type, set only for chapter 04, styled `font-worksans text-lg font-bold text-launch-teal` with a small top margin — this keeps the StoryChapter component generic.

## Verification

- Typecheck (`bunx tsgo --noEmit`).
- Playwright screenshot of the dark section and chapter 04 at desktop (1280) and phone (390) to confirm wrapping and that the teal line is visible and legible.

No other pages use either sentence, so nothing else changes.
