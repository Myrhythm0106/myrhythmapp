# MYRHYTHM Brain Health Assessment in the MVP — and matched to the person taking it

## What's true today

- The assessment exists at `/launch/assessment` and already has four persona-specific question banks (rebuilding after a brain change, caregiver, work/focus, student) in `src/data/launchAssessmentBanks.ts`.
- It is **not** part of the MVP surface set: it is absent from `src/launch/routes.ts` (the You-Are-Here dial and nav source of truth) and is not one of the five advertised surfaces (Home, Capture, Commit, Calendar, Support). Today it is reachable only during first-run onboarding, from Profile, and from the retake card on Welcome.
- The step before the questions asks everyone "When did the experience happen?" with recovery-flavoured framing, regardless of who they said they are.
- The "I'm not sure yet — show me around" shortcut on the user-type screen silently stores `brain-injury`, so an unsure career or study user gets the recovery bank.

## What this plan does

### 1. Make the assessment a first-class part of the MVP

- Add the assessment to the single source of truth (`src/launch/routes.ts`) as **MYRHYTHM Brain Health Assessment**, so it appears in the You-Are-Here dial and is a named, findable place — not a one-off onboarding screen.
- Add one calm entry point on Home: a single card that either invites the first assessment ("Take my MYRHYTHM Brain Health Assessment — 8 questions, about 3 minutes") or, once completed, shows the last result date with "Retake". One card, one action — no extra clutter.
- Keep Profile and Welcome retake paths as they are.

### 2. Make what's displayed match who is taking it

- **Name the lens.** Every assessment screen shows the persona label already selected (e.g. "Focus at work"), plus a quiet "Not me — change this" link that returns to the user-type screen and reloads the matching bank.
- **Reframe the "before we begin" step per persona** instead of asking everyone about a recovery event:
  - Rebuilding after a brain change / caregiver: keep the recency question ("When did the experience happen?").
  - Focus at work: replace with "How long has focus been the thing you're fighting?" using the same time bands.
  - Studying and learning: replace with "How long has this study season been running?" using the same time bands.
- **Fix the unsure shortcut.** "I'm not sure yet" no longer silently stores `brain-injury`; it asks one plain question ("Mostly for me after a health change, for someone I care for, for work, or for study?") or defaults to the general focus bank — never assumes injury.
- **Persona-aware results.** The results/snapshot copy speaks in the language of the chosen lens (no "recovery" or "rebuilding" wording for the work and study lenses), while the MYRHYTHM letters and scoring stay identical across personas.
- **Changing lens re-runs cleanly.** If the stored user type changes, stale in-progress answers from a different bank are cleared instead of being partly reused.

## Guardrails kept

- Same eight MYRHYTHM letters, same scoring maths, same evidence framing for everyone — only the wording changes.
- No medical claims, no diagnosis language, in any persona.
- Maximum three visible choices per moment on the new Home card, 56px targets, existing Emerald/Launch styling.
- Nothing is deleted: the existing recency step is reused for the personas it fits.

## Technical notes

- `src/launch/routes.ts` — new route entry (middle ring, key-features group).
- `src/data/launchAssessmentBanks.ts` — add a per-bank `preQuestion` (title, subtitle, option labels) so the "before we begin" step is data-driven.
- `src/pages/launch/LaunchAssessment.tsx` — read `preQuestion` from the bank, show the persona label plus "change this" link, clear progress when the stored persona differs from saved progress.
- `src/pages/launch/LaunchUserType.tsx` — replace the silent `brain-injury` fallback.
- Home (`QuietHome.tsx`) — single assessment/retake card reusing `AssessmentRetakeCard` logic and `assessmentHistory.ts`.
- Results copy — persona-conditional strings only; no schema or scoring changes.
