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
