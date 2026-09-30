# After sign-up, go straight to About Me then the guided questions - seamlessly....

## What changes

### 1. Sign-up leads directly to the questions

- After "Create account" on the sign-up screen, the next screen is the questionnaire welcome — not "About me" and never the payment page.
- This also fixes a gap: people arriving with a pre-chosen type were being sent to payment before the questions. Everyone now follows the same order: **Account → Questions → My snapshot → Home (or membership)**.
- "About me" (who's using MyRhythm) is no longer a separate step. It becomes one gentle optional question at the start of the questionnaire ("Who is this for?"), so nothing is lost but there is one less screen.

### 2. The welcome explains why the answers matter

The welcome before the first question says, in plain words:

- "Your answers shape how MyRhythm works for you."
- Three short lines:
  1. **Your diary** — I'll plan your important things for the times you're usually at your best.
  2. **Your reminders and breaks** — spaced to suit your energy, not a generic timetable.
  3. **Your snapshot** — a free personal report at the end, yours to keep.
- "About 5 minutes. No right or wrong answers. You can change anything later."
- One button: **I'm ready**. Quiet link: "Not now — take me to my day".

### 3. Each question says what it helps with

Under every question, one small line in the same calm style, e.g.:

- Sleep — "Helps me avoid planning demanding things after a poor night."
- Best time of day — "This is when I'll suggest your most important tasks."
- Focus length — "Sets how long your planned blocks and breaks are."
The progress bar labels read "Part 1 of 2 — Your everyday brain health" and "Part 2 of 2 — How you like to plan".
Every helper line describes the benefit to the user only — never scores, weightings or scheduling rules — so the approach stays private.

### 4. The snapshot closes the loop

The snapshot adds one line: "Here's how your answers now shape your diary" with 2–3 concrete items (best window, block length, break rhythm), linking to the existing calendar agreement step so they still choose whether their calendar reflects it.

## Technical notes

- `LaunchRegister.tsx`: all post-signup navigations (`navigate`, `emailRedirectTo`, `handleContinue`) → `/launch/assessment?first=1`; honour safe `?next=` only for non-onboarding deep links; keep founding intent in localStorage for after the snapshot.
- `entryRoute.ts` / `nextDestination.ts`: drop `/launch/user-type` as a required step; default user type "self" when unset.
- `LaunchAssessment.tsx`: expand welcome copy; add optional "Who is this for?" first step (writes `myrhythm_user_type`, not scored); add a `helps` string per question in `launchAssessmentBanks.ts` rendered beneath the prompt.
- `OnboardingProgressBar.tsx`: steps become Account → Questions → Snapshot → Home.
- `/launch/user-type` stays routed (redirects into the assessment if reached mid-onboarding).
- Verify on a 393px phone: sign up → welcome → questions with helper lines → snapshot → Home.