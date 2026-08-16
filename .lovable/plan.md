# Prestige entry screen — "Academic Prestige" rebuild

Rebuild `/start` (the first screen a new tester sees) in the direction you chose: deep emerald ground, gold hairlines, Instrument Serif headings, a bento grid of the four steps, plus the two refinements you asked for — a thin gold vertical rule between bento sections and a subtle film-grain texture over the emerald.

## What the screen becomes

```text
  FOUNDING EDITION V0.1
  MyRhythm                          "Four minutes to see how
  (Instrument Serif, oversized)      MyRhythm keeps a plan going."

  +---------------------------+ | +--------------------------+
  |  01                       | | |  02                      |
  |  Record or upload         | | |  See actions & decisions |
  |  (tall hero tile)         | | +--------------------------+
  |                           | | +------------+ +-----------+
  |                           | | | 03 Mile-   | | 04 Loop   |
  |                           | | | stones     | | in circle |
  +---------------------------+ | +------------+ +-----------+
                          gold hairline rule

              [  Start a capture now  ]   (ivory pill, 56px+)
                    Open MyRhythm Home

              SECURE BY DESIGN
     Private by default · 30-day retention · Not a medical device
```

Behaviour is unchanged: the primary button still goes to the quick capture, the text link still opens Home.

## Copy

Structure matches the chosen direction exactly, but two lines from the prototype get replaced so we stay inside the no-medical-claims rule:

- Standfirst: "Four minutes to see how MyRhythm keeps your plan going after the conversation ends." (replaces "a four-minute commitment to your future brain health")
- Tile 01 body: "Speak it, or upload audio you already have. Nothing is lost between the conversation and the plan." (replaces the "cognitive rhythm" line)
- Tile 02 body stays a short, plain line: "Owners, dates and the exact words they were said in."
- Trust block keeps "Private by default · 30-day recording retention · Not a medical device."; the small caps line above it reads "SECURE BY DESIGN".

## The two refinements

- **Gold vertical rule** — a 1px `#c9a84c` hairline at ~35% opacity dividing the hero tile column from the right-hand tile stack on desktop; it becomes a horizontal hairline on mobile so nothing crushes.
- **Film grain** — a fixed, non-interactive overlay at very low opacity over the emerald ground, generated as an inline SVG fractal-noise data URI so no image asset is needed. Sits below content, above background.

## Accessibility and mobile

- Ivory `#f5f0e0` on emerald `#064e3b` and gold `#c9a84c` on emerald both clear WCAG AA at the sizes used; gold is never used for body-size text.
- Body text floor 16px; primary button 56px minimum on mobile, 64px on desktop.
- Grid collapses to a single column under `md`; the bento hierarchy is preserved by keeping tile 01 first and taller.
- Safe-area padding retained for installed-PWA use.

## Technical notes

- `index.html` — add Instrument Serif and Work Sans to the existing Google Fonts link.
- `tailwind.config.ts` — add `instrument` and `worksans` font families (new keys, so no existing screen changes typeface).
- `src/index.css` — add a scoped `.prestige-*` token block: emerald ground, panel tint, gold hairline, ivory text tiers, grain overlay, and the CTA style. Kept scoped so nothing else in the app is restyled.
- `src/pages/launch/LaunchStart.tsx` — rewritten to the bento structure above, reusing `LaunchButton` only where it fits; otherwise plain elements styled with the new tokens. Same imports for navigation and icons.
- `src/components/launch/EditionBadge.tsx` — add an optional `tone="onDark"` variant (gold outline on emerald) so the badge reads correctly on the new ground; the default light variant used elsewhere is untouched.
- Motion: a short staggered rise on the tiles with framer-motion, respecting `prefers-reduced-motion`. No pulsing or bouncing.

## Out of scope

No route, data or logic changes. The day-open welcome screen and the rest of the app keep their current styling; if you like this register we can extend it screen by screen afterwards.
