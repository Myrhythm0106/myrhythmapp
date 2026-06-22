## Plan: Primary / "Also fits" selection model

### Goal
Make the Launch Assessment answer-selection model explicit: the **radio tick** selects the primary answer, the **+Also fits** button toggles secondary answers, and the primary answer stays pinned until the user chooses a different tick.

### Current behaviour to change
In `src/pages/launch/LaunchAssessment.tsx`, clicking anywhere on an option card (except the +Also fits button) currently calls `setPrimary`. This makes it too easy to switch primary by accident.

### Proposed changes

1. **Split the tap targets** in each option row:
   - **Card body**: no-op (or purely visual hover). It does NOT change selection.
   - **Radio tick/circle**: calls `setPrimary(value)`. This is the only way to select or change the primary answer.
   - **+Also fits button**: calls `toggleAlsoFits(value)` as today. If there is no primary yet, it still promotes the tapped option to primary.

2. **Preserve existing primary behaviour**:
   - Tapping the same radio tick again does nothing (primary stays).
   - Selecting a new primary moves the old primary to "Also fits" and removes the new one from "Also fits".
   - Primary never becomes empty until a different tick is selected.

3. **Keep visual clarity**:
   - Primary option: orange border, orange tick, "Primary" badge.
   - Also fits: teal border, teal tick, "Also fits" badge.
   - Unselected: grey border, empty circle.

4. **Accessibility & touch**:
   - The radio tick keeps `role="button"` and a clear `aria-label` such as `Set as primary answer`.
   - The +Also fits button keeps its label and `aria-pressed` state.
   - Both tap targets meet the 56 px minimum touch target requirement.

5. **No change to persistence, scoring, or navigation**:
   - The `myrhythm_assessment_progress` localStorage logic remains as-is.
   - Back/Next/Complete and the `handleNext` results payload remain unchanged.

### Verification
- Open `/launch/assessment`, select a primary answer via the radio tick, then tap +Also fits on another option. The primary remains unchanged and the second option becomes "Also fits".
- Tap the radio tick on a different option. The first option moves to "Also fits" and the new option becomes primary.
- Tap the same radio tick again. Primary stays.
- Tap the card body (outside tick or +Also fits button). Nothing changes.
- Continue through to Complete; progress persistence still works across remounts.