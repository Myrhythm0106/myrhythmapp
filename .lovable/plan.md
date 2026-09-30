# Add the "Your Pocket PA" tagline to the landing page

## What you'll see

On the landing page (/start), directly beneath the large **MyRhythm** name, a new tagline line:

> **Your Pocket PA — it remembers, so you don't have to.**

It appears on the landing page only. Nothing else in the app changes.

## How it will look

- Set in the same elegant serif style as the rest of the page, smaller than the MyRhythm name, in the warm ivory tone with a touch of gold on "it remembers" so the promise catches the eye.
- Sits between the MyRhythm name and the existing italic line ("Four minutes to see how MyRhythm keeps your plan going..."), so the header reads: name → promise → what to expect.
- Sized and spaced for phones first — it must wrap cleanly on a small screen without pushing the story cards down.

## Technical details

- One file touched: `src/pages/launch/LaunchStart.tsx` (the brand header block, lines ~44–53).
- Uses the existing prestige/ivory/gold styling tokens — no new colours, no hardcoded values.
- No wording with "cognitive" or clinical terms; no practitioner names; no changes to routes, flows, or any other page.

## Check before done

- Typecheck passes.
- Phone-size preview (393px) of /start: tagline wraps cleanly, header still fits above the fold with the story cards visible.
