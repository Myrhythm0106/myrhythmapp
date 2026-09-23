# Tagline placement — "Captures it. Plans it. Keeps it. And follows it through."

One addition on `/launch/landingpage` (`src/components/mvp/MVPCore4C.tsx`). No other pages, CTA, colour or layout changes.

## Recommendation

Place the tagline in the **hero, directly beneath the main headline**, reading:

> **Captures it. Plans it. Keeps it. And follows it through. You're in control.**

Why the hero: the headline carries the full promise; this line is its punchy echo, and the first viewport is where a tagline earns its place. The four beats mirror the page's own story sequence (capture → plan → keep → follow through), so it reads as true, not decorative.

Punctuation note: the closing line ends with a full stop rather than an exclamation mark — calmer and more premium, in keeping with the Apple/consultancy tone. (Happy to restore the "!" if preferred.)

## Change

In `MVPCore4C.tsx`, insert one line between the `<h1>` and the supporting paragraph in the hero section (around line 296):

- Text: "Captures it. Plans it. Keeps it. And follows it through. You're in control."
- Style: bold Work Sans, slightly smaller than the supporting paragraph, ink-deep with "You're in control." set in launch-teal for a quiet accent.
- Compact on mobile so the founding CTA stays within the first viewport.
- Existing headline, paragraph, CTA and price note are untouched.

## Verification

- Typecheck via `tsgo`.
- Playwright screenshots of the hero at desktop and mobile widths to confirm the line sits cleanly and the CTA is not pushed below the fold.
