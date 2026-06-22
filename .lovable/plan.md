## Goal
Reduce assessment stress by letting users pick a **primary** answer and optionally tag any other options that **also fit**, instead of forcing a single choice.

## UX pattern (per question)
- Question + brain-health lens caption (unchanged).
- Each option becomes a two-state row:
  1. **Primary** — exactly one, selected by tapping the option body (large 56px target). Shows a filled brand-orange ring + "Primary" chip.
  2. **Also fits** — a secondary "+ Also fits" pill on the right of every non-primary option. Tapping toggles it on/off. Selected ones show a soft teal outline + check.
- Helper copy under the question: *"Pick the one that fits best. Tap '+ Also fits' on any others that also feel true — there are no wrong answers."*
- Continue button enabled as soon as a primary is chosen; "also fits" is always optional.
- Tapping a different option promotes it to primary; the previous primary stays selected as "also fits" automatically (so users never lose a tap), with a subtle toast: *"Switched primary — your earlier pick is kept as 'also fits'."*

## Data model
Extend the per-question answer stored in `myrhythm_launch_mode.answers`:

```ts
// before
{ [questionId]: optionId }
// after
{ [questionId]: { primary: optionId, alsoFits: optionId[] } }
```

Backward-compat read helper: if value is a string, treat as `{ primary: value, alsoFits: [] }`.

## Scoring (BHS) update
- Primary option score counts at **full weight** (0–3 as today).
- Each "also fits" option contributes **+0.5** to that letter's score (capped at the letter max of 3) — rewards nuance without inflating.
- Letter score formula:
  `letterScore = min(3, primary.score + 0.5 * sum(alsoFits.score >= primary.score ? 1 : 0.5))`
  Simpler v1: `letterScore = min(3, primary.score + 0.5 * alsoFits.length)`.
- BHS normalization unchanged (sum / 24 * 100).
- Store both `primary` and `alsoFits` per letter in `letterScores` for future analytics.

## Files to change
1. **`src/data/launchAssessmentBanks.ts`**
   - Update `AssessmentAnswer` type to `{ primary: string; alsoFits: string[] }`.
   - Update `computeBrainHealthScore` to use the new formula and remain tolerant of legacy string answers.
   - Add `normalizeAnswer(raw)` helper.

2. **`src/pages/launch/LaunchAssessment.tsx`**
   - Replace single-select radio behavior with primary + "also fits" toggles.
   - Add helper copy line under the question.
   - Update continue-gate to require only `primary`.
   - Persist new shape; keep legacy `selectedOptionId` mirror (= primary) for any downstream readers.
   - Add the auto-demote-to-alsoFits behavior + toast.

3. **`src/pages/launch/LaunchWelcome.tsx`**
   - No structural change; mini-bars already read `letterScores`. Add a tiny caption *"Includes any 'also fits' answers"* under the BHS number.

## Out of scope
- Changing question wording, persona mapping, or the 8-letter structure.
- New visualisations or trend history (still v0.2+).
- Reassessment flow.

## Plan doc
Append a "Primary + Also Fits" subsection under Plan v63 in `.lovable/plan.md` summarising the above so the longitudinal-doubling roadmap stays aligned (future waves keep the same answer shape).