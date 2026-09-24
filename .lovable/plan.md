# Assessment answers: first tap = primary, rest = secondary, easy swap

## Goal
On /launch/assessment, answering a question should feel natural: the first option the user taps becomes their **primary** answer, any further taps become **secondary** ("also fits"), and the user can promote a secondary to primary at any time. No separate "add secondary" button, no forced re-primary on every tap.

## Current behaviour (confirmed)
- `LaunchAssessment.tsx` — tapping an option's circle calls `setPrimary`, which makes that option primary and demotes the old primary to "also fits" (with a toast). Secondaries can only be added via a separate "+ Also fits" chip on each card.
- Data model already supports this: `AssessmentAnswer = { primary, alsoFits[] }` (launchAssessmentBanks.ts:704). No data or scoring changes needed.

## Changes — all in `src/pages/launch/LaunchAssessment.tsx`

1. **New single tap handler** on each option card (whole card tappable, min 56px target):
   - Option unselected, no primary yet → becomes **primary**.
   - Option unselected, primary exists → becomes **secondary** ("also fits").
   - Option is secondary → tap removes it.
   - Option is primary → tap deselects it; the first secondary (if any) is promoted to primary automatically.
2. **"Make primary" control** on each secondary card — a small text button next to the "Also fits" badge. Tapping it swaps: that option becomes primary, the old primary becomes a secondary. Keeps the existing toast ("Switched primary — your earlier pick is kept as 'also fits'.").
3. **Remove the "+ Also fits" chip** — redundant once tapping adds secondaries automatically.
4. **Keep** the Primary / Also fits badges, the "None of these fit me" escape hatch, and the freeform note exactly as they are.
5. **Update the helper line** (currently "Tap the circle on the one that fits best…") to:
   > "Tap the one that fits best first — that's your primary. Tap any others that also fit. You can change which is primary at any time."
6. Rhythm-detail step (focus length / energy drain) is unchanged — it's single-select per row already.

## Accessibility & guardrails
- `aria-pressed` states and aria labels updated to match ("Primary answer — tap to remove", "Also fits — tap to remove", "Make primary").
- Toast confirms every primary swap so the change is never silent.
- Scoring, results payload, productivity-window derivation, and saved-progress format are untouched — same `primary`/`alsoFits` shape.

## Verification
- Typecheck (`bunx tsgo --noEmit`).
- Playwright at 390×844 on /launch/assessment: tap option A → Primary badge; tap option B → Also fits badge; tap "Make primary" on B → B primary, A secondary; tap primary → deselects and promotes; "None of these fit me" still clears picks.
