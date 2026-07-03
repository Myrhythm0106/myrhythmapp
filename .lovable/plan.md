## Goal
On `/launch/welcome` MYRHYTHM snapshot, make each of the 8 letter bars explain itself:
- **Hover (desktop):** short summary — letter word, what it measures, the score you got, one-line meaning of that score.
- **Click / tap (all devices):** full description with what the score means in depth and 2-3 concrete suggestions to raise it.

Only affects the snapshot block in `LaunchWelcome.tsx`. No changes to scoring logic or the assessment itself.

---

## Files

### 1. New — `src/data/myrhythmLetterInsights.ts`
Single source of truth for letter copy. Keyed by cluster id (so the two Ys and two Hs stay distinct):

```ts
export interface LetterInsight {
  id: LetterId;              // mindset | yesReality | ...
  letter: 'M'|'Y'|'R'|'H'|'T';
  word: string;              // e.g. "Mindset"
  lens: string;              // brain-health lens (from launchAssessmentBanks)
  short: string;             // one-line description of the cluster
  bands: [string, string, string, string]; // meaning for scores 0..3
  suggestions: [string[], string[], string[], string[]]; // 2-3 suggestions per band
}
```

All 8 clusters filled with plain-English content aligned to the existing `launchAssessmentBanks` lenses (Mindset, Yes to Reality, Rhythm, Harness Support, Your Victories, Transform, Heal, Multiply). Suggestions link to Founding Core routes where relevant (Capture, Commit, Calibrate, Support Circle) using plain URLs — no route changes.

### 2. New — `src/components/launch/MyRhythmLetterBar.tsx`
Renders one bar. Composes:
- shadcn `HoverCard` — desktop hover shows: letter · word · lens · your score `X/3` · one-line band meaning · "Tap for more".
- shadcn `Dialog` — opens on click/Enter/Space. Contains: word + lens, big score, current-band description, "Ways to raise this" list (bulleted suggestions for the current band), a small "Not a clinical score" reminder, and a Close button.
- Button wrapper with `aria-label="M — Mindset, score 2 of 3. Tap to learn more."` for accessibility.
- Visual keeps the existing teal-fill bar; adds a subtle focus/hover ring so it looks interactive.

Score 0 gets "start here" suggestions; score 3 gets "keep it going" suggestions.

### 3. Edit — `src/pages/launch/LaunchWelcome.tsx`
Replace the inline bar loop (lines 118–134) with `<MyRhythmLetterBar />` per cluster, passing `id`, `letter`, `score` (0–3, from `bhs.letters[id] ?? 0`). Update the small caption under the grid to: *"Tap any letter for what it means and how to raise it."*

No other changes on the page.

---

## UX details
- Hover card: ~280px wide, appears above bar, closes on mouseleave; delay 100ms open, 80ms close (Radix defaults are fine).
- Dialog: standard shadcn `Dialog` size, scroll on overflow, ESC to close, focus returns to the bar button.
- Touch devices: HoverCard is pointer-only in Radix, so on mobile a tap goes straight to the dialog — exactly what we want.
- Colour: keep existing teal palette; no new tokens.

## Out of scope
- Persona-specific suggestion variants (can layer on later using existing `mapToPersona`).
- Editing the assessment itself or the total-score calculation.
- Any change to `MVPCore4C`, Home, or other routes.

## Verification
1. Type-check.
2. Playwright: load `/launch/welcome` with a seeded snapshot in localStorage, hover each letter (screenshot the popover for M and R), click the H bar, screenshot the dialog, ESC-close and confirm focus returns.
3. Mobile viewport (390×844): tap a letter, confirm dialog opens without hover flicker.