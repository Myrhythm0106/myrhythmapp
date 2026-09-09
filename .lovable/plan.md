# Welcome before the assessment, and "you are here, here's what's next" on every onboarding step

## What changes

### 1. A proper welcome before the brain health questions

Today, first-timers get one small italic line above the first question. Replace that with a full, warm welcome screen that appears before any question is asked:

- A greeting using their name (already stored at registration).
- "What to expect" in three short lines, e.g.:
  1. Eight questions, about three minutes — no right or wrong answers.
  2. You can change any answer before moving on.
  3. At the end you'll get your personal MYRHYTHM report, and I'll learn your best hours for planning your day.
- One primary button: "I'm ready". A quiet "Not now — take me to my day" link stays (same behaviour as today: deferred for the day, Home gently reminds them).
- This screen shows for anyone arriving at the assessment who hasn't completed it (the `?first=1` flow), not for retakes.

### 2. Every onboarding step says what it is and what comes next

The Register → You → Assessment → Results → Membership → Home step bar already exists. Add a one-line step description directly beneath it on each step, so the user always knows where they are and what's coming:

- **Register** — "Create your account — your information stays private and only you can see it. Next: a little about you."
- **You** — "Tell me who's using MyRhythm so everything feels made for you. Next: eight quick questions."
- **Assessment** — "Eight questions about your days — it's how I learn when you're at your best. Next: your personal report."
- **Results** — "Your MYRHYTHM report — read it, keep it, come back to it any time. Next: choose your membership."
- **Membership** — "Choose how you'd like to join. Next: your new Home."
- Implemented as one small shared component fed by a simple per-step config, rendered inside the existing `OnboardingProgressBar` — no per-page wiring beyond that.

Both pieces use the existing launch visual style, 56px touch targets, and warm first-person assistant language. Nothing else changes; no existing content is removed.

## Technical notes

- `src/pages/launch/LaunchAssessment.tsx` — extend the current `isFirstRun` intro block (~lines 196–206) into a full welcome panel (name via `useDisplayName`), keeping the existing defer/"Not now" behaviour.
- `src/components/launch/OnboardingProgressBar.tsx` — add a `STEP_DESCRIPTIONS` map keyed by path and render a one-line description under the `LaunchStepLocator`.
- Verify with a walkthrough: register → user-type → assessment welcome → questions → results → membership, confirming each step's line shows and the "Not now" path still lands on Home.
