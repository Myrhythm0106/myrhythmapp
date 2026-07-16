
## Current state
The 8 letter bars already sit adjacent to the /100 score in the dark hero. Tapping a bar opens a full detail dialog that reveals band meaning, personalized wording, and 3 "ways to raise / protect" suggestions. That is too generous — it gives away the entire personalized report before payment.

## What to change

### 1. Split the reveal into Free (teaser) vs Premium (locked)
Rework `MyRhythmLetterBar`'s dialog into a two-tier layout:

**Free tier — always visible on tap/hover:**
- Letter + word (e.g. "M · Mindset") and the /3 band score.
- One-line lens label (already have it).
- **One sentence** band summary (generic band copy, not personalized).
- A small horizontal mini-bar showing where this facet sits vs. the other 7 (context, not new data).

**Premium tier — behind a soft paywall inside the same dialog:**
- Blur/frost the "What your score means (personalized)" paragraph and the numbered "Ways to raise / protect this" list.
- Overlay a gold lock chip + single CTA button "Unlock your full plan — £{foundingPrice}/mo" → `/launch/payment`.
- Small secondary link "See what's included".

This keeps the tap-to-reveal delight, proves depth exists, and converts curiosity into signup — the SaaS-standard pattern (Calm, Noom, Fabulous, Whoop onboarding all lock the personalized report behind payment while showing a legible teaser).

### 2. Make the bar cluster read as a "chart", not just decoration
Small hero refinements so the grid feels like a real snapshot chart:
- Add a faint 3-tick horizontal guide line across the bar grid (1/3, 2/3, top) in `GOLD` at 12% opacity so scores are readable at a glance.
- Add a tiny `/3` label under each letter next to the letter glyph.
- Add a subtle pulse ring on the highest and lowest bars on load (one-time) so the user's eye lands on the strongest and weakest facet — the "insight bait" that makes them click.

### 3. Hover affordance upgrade
On desktop hover (not click), show a compact popover with just the Free tier content (word + band sentence + "Tap for your personal read →"). On click, open the full dialog with the paywall block. Mobile: tap opens dialog directly.

### 4. Copy & framing tweaks
- Rename the hero eyebrow "Your starting MYRHYTHM snapshot" → keep, but add a small gold pill under the score reading **"8 facets · tap to explore"** so users immediately know the bars are interactive.
- Replace the current "Tap any letter — reveal what it means & how to raise it" line under the bars with **"Tap a letter for your personal read →"** (shorter, more inviting, matches the paywall framing).

## Market suggestions worth considering (optional, flag which to include)
These are patterns competitors use that would land well here — happy to fold any in:

- **A. Percentile / cohort context** (Whoop, Oura style): under each bar's dialog, show "Your Mindset score is in the top 40% of Pathfinders this month." Requires no real data yet — can be seeded from a small anonymized baseline, and is a very strong retention hook. Recommend including once we have >100 assessments; skip for v0.1.
- **B. Radar/spider chart toggle** (Noom, Lumosity): a small icon top-right of the bar cluster to switch bars ↔ radar. Radar communicates "whole rhythm" better than 8 bars. Recommend **yes** — it's a distinctive visual for a wellness product and increases perceived depth. ~120 LOC with `recharts` (already in project).
- **C. "One thing to focus on this week"** teaser card below the hero (Fabulous, Headspace): auto-picks the lowest facet, shows 1 locked personalized action with paywall. Recommend **yes** — this is the single highest-converting element on similar onboarding flows.
- **D. Score band label next to /100** (e.g. "Building"/"Steady"/"Strong"): humanises the number. Recommend **yes**, trivially small.

## Files touched
- `src/components/launch/MyRhythmLetterBar.tsx` — split dialog into Free teaser + blurred Premium block with paywall CTA; refine hover popover copy.
- `src/pages/launch/LaunchWelcome.tsx` — add tick guides + pulse rings on hero grid, "8 facets · tap to explore" pill, band label next to /100, optional radar toggle and "One thing to focus on" card depending on choices below.

## Out of scope
- Real percentile data (no cohort table yet).
- Any change to `/launch/payment` itself.
- Business logic — pricing display continues to read from `foundingMemberConfig`.

## Please confirm
1. Approve the core Free-teaser / Premium-lock split as described?
2. Include suggestion **B** (radar toggle), **C** ("one thing to focus on" locked card), and **D** (score band label)? A is deferred until we have cohort data.
