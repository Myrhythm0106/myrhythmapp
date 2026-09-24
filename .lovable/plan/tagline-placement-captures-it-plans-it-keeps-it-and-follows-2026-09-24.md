# Tagline placement — "Captures it. Plans it. Keeps it. And follows it through."

One addition on `/launch/landingpage` (`src/components/mvp/MVPCore4C.tsx`). No other pages, CTA, colour or layout changes.

## Recommendation

Place the tagline in the **hero, directly beneath the main headline**, reading:

> **Captures it. Plans it. Keeps it. And follows it through. You stay in control.**

Why the hero: the headline carries the full promise; this line is its punchy echo, and the first viewport is where a tagline earns its place. The four beats mirror the page's own story sequence (capture → plan → keep → follow through), so it reads as true, not decorative.

Closing line: **"You stay in control."** over "You're in control." — "stay" promises control that continues over time, which is exactly the app's follow-through promise, and it echoes the page's "My control — I review, edit, share and retain on my terms" pillar. "You're in control" states a single moment; "you stay in control" matches the rhythm of the four beats before it, all of which are verbs that keep going.

## Change

In `MVPCore4C.tsx`, insert one line between the `<h1>` and the supporting paragraph in the hero section (around line 296):

- Text: "Captures it. Plans it. Keeps it. And follows it through. You stay in control."
- Style: bold Work Sans, slightly smaller than the supporting paragraph, ink-deep with "You stay in control." set in launch-teal for a quiet accent.
- Compact on mobile so the founding CTA stays within the first viewport.
- Existing headline, paragraph, CTA and price note are untouched.

## Verification

- Typecheck via `tsgo`.
- Playwright screenshots of the hero at desktop and mobile widths to confirm the line sits cleanly and the CTA is not pushed below the fold.
