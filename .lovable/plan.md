# Refine the You-Are-Here dial — "Precision chronometer wayfinder"

## Goal
Upgrade the compact circular wayfinder and the map it opens into the approved **Direction A (chronometer)** style: finer gold craft on the trigger, a more professional radial map, and better use of the space — while keeping every behaviour an 85-year-old or brain-injured user relies on.

## What changes

### 1. The compact dial trigger
- Keep the 56px circular button in its fixed header position.
- Refined craft: a champagne-gold gradient ring, deep-ink centre with a fine dashed inner ring, the current page's icon in gold, and the small teal "you are here" dot at the top.
- Keep the "Where to?" label beneath it.

### 2. The open map — chronometer layout
- Header: gold "YOU ARE HERE" eyebrow, the current page name in the app's serif style, and its purpose line; the 56px close button stays top-right.
- The radial circle becomes a chronometer: a double champagne-gold outer ring plus a fine dashed inner ring.
- The centre medallion (dark ink, gold border, teal dot) shows the current place.
- The four ring places become circular chips with a label and a short hint underneath:
  - Memory Bridge — "Record or upload"
  - My Compass — "My focus"
  - My Calendar — "My plans"
  - My Diary — "In date order"
- My Compass moves into the ring as a fourth landmark (it was buried in "More places"). Home is always reachable through the medallion context and the "Take me home" action instead of a ring slot.
- The current place's chip fills teal with "You are here".
- Hints are short factual labels only — no invented data, no scores.

### 3. Unchanged behaviour (guardrails)
- Same destinations, same "More places" list (Assessment, Support Circle, Settings, Help, What's New), same "Take me home", same close actions (X, Close map, tap outside, Escape).
- No changes to routes, onboarding logic, header, bottom nav, or other pages.
- 56px+ tap targets, Light Linen tokens only (no hardcoded colours), plain labels.

## Files
- `src/components/launch/LaunchYouAreHereDial.tsx` — restyle trigger and map; move Compass into the ring.

## Verification
- Typecheck.
- Phone-size (393×822) signed-in check: dial on Home, map open (no horizontal overflow), More places, and the map from a non-Home page (Take me home visible, current chip teal).
