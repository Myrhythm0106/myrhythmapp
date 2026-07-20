## Reveal-on-demand definitions for Low / Steady / Strong

Keep the three feeling buttons visually clean (just the words), but add a small, obvious "What do these mean?" affordance that reveals plain-language descriptions only when the user wants them.

### Change (in `src/components/launch/calendar/LaunchAiPlanAssist.tsx`, feeling step only)

1. Leave the three `Low / Steady / Strong` buttons as they are today — single word, capitalize, 56px min-height, current selected/hover styles.
2. Directly under the button grid, add a small inline toggle:
   - Icon + text link: `HelpCircle` icon + "What do these mean?"
   - Style: `text-sm text-brand-emerald-700 hover:text-brand-emerald-800 underline-offset-2 hover:underline`, left-aligned, `flex items-center gap-1.5`, min tap area 44px.
   - Clicking flips a local `showHints` boolean; label toggles to "Hide" when open; chevron rotates.
3. When `showHints` is true, render a soft panel (`rounded-xl bg-brand-emerald-50/60 border border-brand-emerald-100 p-3 text-sm text-gray-700 space-y-1.5`) below the toggle, with three lines:
   - **Low** — Tired, foggy, or stretched. Plan stays tiny and kind.
   - **Steady** — Okay-ish. A realistic, normal plan.
   - **Strong** — Clear and energised. Ready to lean in.
4. Preserve the existing "Skip this" button below.

No copy or behaviour changes elsewhere. No backend, hook, or schema changes.

### Why this shape

- Meets the "obvious it's there" bar via the inline link right under the buttons, so users never hunt for it.
- Meets the "only when needed" bar by keeping the panel collapsed by default — the choice screen stays uncluttered and honours the max-3-choices guardrail.
- Aligns with the existing progressive-reveal pattern used on the 4C cards.

### Files touched

- `src/components/launch/calendar/LaunchAiPlanAssist.tsx`