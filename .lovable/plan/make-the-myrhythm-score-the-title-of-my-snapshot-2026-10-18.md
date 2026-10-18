# Make the MYRHYTHM score the title of my snapshot

## What changes
- The dark MYRHYTHM panel (big score out of 100, band label, the 8 letter bars) moves to the very top of the report and becomes its title block, headed "My MYRHYTHM snapshot".
- Directly under it sits the Executive summary, then the "See the detail behind my summary" drop-down, Prove it now, and the honest choice — same order as now.
- The "My full picture" drop-down no longer hides the score. It keeps only the deeper extras (letter-by-letter read and 3-week YES plan card), still closed by default.
- "A snapshot only — not a test or a diagnosis" stays visible right under the score.

## Colour fix
Right now two dark emerald blocks sit back to back (score panel and Executive summary), which feels heavy. New balance:
- Title block: deep emerald with gold contour lines, cream score, gold label — the one bold colour moment on the page.
- Executive summary: switches to warm linen with emerald text, white finding cards with thin gold edges; Strong = teal, Building = emerald, Needs support = burnt orange (each also written in words).
- Biggest opportunity and 3-week outcomes: white cards with a gold / teal left stripe.
- Removes the hard-coded hex colours in this section so it follows the app's theme tokens.
- Checked for readable contrast at 834px (your screen) and 393px phone.

## Technical
- `src/pages/launch/LaunchWelcome.tsx`: move the hero snapshot block (score + `MyRhythmLetterBar` grid) out of the `<details>` to sit above `ConsultingReport`; replace `#064e3b`/`#f5f0e0` with `launch-ink`/`launch-cream` tokens; keep `LivingCompassReport` and `YesPlanCard` inside the collapsed "My full picture".
- `src/components/launch/report/ConsultingReport.tsx`: exec section from `bg-launch-ink` to `bg-launch-cream`, text to `text-launch-ink`, inner cards to `bg-launch-ivory` with gold borders; drop the duplicate "My snapshot" eyebrow (now "Executive summary").
- Verify with Playwright screenshots at 834x822 and 393 wide.
