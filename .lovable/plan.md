## Goal
Stop the assessment from snapping back to letter 1 mid-flow.

## Root cause
- `LaunchAssessment` keeps `currentQuestion` and `answers` only in component state.
- `LaunchModeProvider` writes its own `state` to the SAME localStorage key (`myrhythm_launch_mode`) on every render, with `assessmentResults: defaultAssessment` until the assessment is marked complete. So mid-flow our key holds no `answers`.
- If anything remounts `LaunchAssessment` (auth `SIGNED_IN` event observed in console at the time of the bug, route transitions, HMR, parent re-keying), local state is wiped and we restore nothing — user lands back on letter 1.

## Fix
Persist the in-progress assessment to a **dedicated key** that the launch-mode provider does not touch, and rehydrate from it on every mount.

### Changes to `src/pages/launch/LaunchAssessment.tsx`
1. New storage key: `myrhythm_assessment_progress` holding `{ persona, currentQuestion, answers, updatedAt }`.
2. Lazy-init `useState` for `persona`, `currentQuestion`, and `answers` from that key (synchronous, so first render already shows the right question — no flash).
3. New `useEffect` that writes `{ persona, currentQuestion, answers }` to that key whenever any of them changes.
4. Remove the existing restore-from-`myrhythm_launch_mode` effect (obsolete and was the source of the "nothing to restore" gap).
5. On `Complete`: keep writing the full results to `myrhythm_launch_mode` as today, then `localStorage.removeItem('myrhythm_assessment_progress')` so a fresh start next time begins at letter 1.
6. Keep the existing persona-resolution effect, but only `setPersona` if it actually changes (guard against the redundant set that adds churn).

### Out of scope
- Changing `LaunchModeProvider` (its broad persistence behaviour is reused elsewhere; safer to isolate the assessment's own progress key).
- Any visual changes, scoring changes, or new fields.
- Server-side persistence (still v0.2+).

### Verification
- Answer through letter H, force a remount (e.g. click somewhere that triggers an auth refresh, or hard-refresh) → assessment resumes on the same letter with prior answers intact.
- Reach "Complete" → progress key is cleared; revisiting `/launch/assessment` starts fresh at letter 1.