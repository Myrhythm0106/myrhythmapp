# Compact My Vision in ACTion block: easier to scan on phones

## What changes (what you will see)
- Three clearly separated lines, each with its own breathing space:
  1. Title row (compass + "My Vision in ACTion")
  2. My vision, in larger warm type, up to two lines
  3. Today's step, on its own soft panel with the gold star, up to two lines
- A thin gold divider between the vision and today's step so the eye lands on each in turn.
- The whole block stays one tap target, at least 72px tall even when empty, with more padding on phones.
- "Open my full vision and goals" becomes a full-width bar at the bottom (at least 56px tall) with the arrow on the right, so it is obvious where to tap.
- Text sizes never drop below 16px; long words wrap instead of spilling off small screens (320px upwards).
- Nothing else changes: opening, folding and the remembered open/closed choice work as now.

## Checks
- View the folded block at 320, 393 and 837px widths: no overflow, lines clearly spaced, tap bar full width.
- Tap the block and the bar: both open the full view; "Fold to a glance" returns to the glance.

## Technical details
- File: `src/components/launch/calendar/LaunchCommitmentBanner.tsx`, compact branch only (`!open && !expanded`).
- Use `space-y-4` stacking, `px-5 py-6` on mobile, `min-h-[72px]` on the button, step in `rounded-xl bg-launch-cream/10 p-3`, divider `border-t border-launch-gold/30`, open bar `flex w-full justify-between min-h-14 rounded-xl bg-launch-cream/10 px-4`.
- Semantic tokens only; no logic or data changes.

# Part 2: Whole-app pass for confidence, reliability, independence, trust and control

Every main screen gets checked against five questions. Anything that fails gets a small, focused fix. Nothing gets redesigned from scratch.

| Feeling | Question for each screen |
| --- | --- |
| Confident | Can I tell in 3 seconds where I am, what to do and what happens next? |
| Reliable | Does every action confirm what happened, with Undo where it makes sense? |
| Independent | Am I offered a choice instead of being told, and are suggestions left unselected until I accept them? |
| Trustworthy | Is the wording honest, with no promises the app cannot keep and no clinical claims? |
| In control | Can I close, fold, move or let go of anything, and does the app remember how I like it? |

## Screens, in order
1. Home (priorities, Next line, first loop card)
2. Record and conversation review
3. Diary (day, week, month) including the vision block and evening wrap-up
4. Circle (sharing levels, what members see)
5. Vision
6. Sign in, register and card step
7. Settings and Help

## What gets fixed
- Wording that is vague, apologetic, childish or mixes "you" and "I" on one screen
- Buttons with no confirmation, or confirmations with no Undo
- Screens with more than three main choices, or tap targets smaller than 56px
- Dead ends with no clear next step

## What you get
- A short scorecard with each screen rated against the five feelings and a note of what was fixed
- The fixes applied, then checked on phone, iPad and desktop widths

## Technical details
- Fixes stay on screens and wording only, with no changes to data, reminders or scheduling rules.
- The existing tests are run after the changes. The scorecard is saved at `docs/five-feelings-scorecard.md`.
- The new task goes on roadmap.md once building starts.
