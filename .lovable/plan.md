# Making the assessment decide when I work best — and letting the calendar act on it

Goal: the MYRHYTHM assessment stays short and warm, but every question now sits under a recognised brain-health pillar, the report tells me my best working window in plain English, and the scheduler actually uses it when it proposes meeting times.

## What I verified first

- The eight questions already exist, one per MYRHYTHM letter, with a `brainHealthLens` label on each (`src/data/launchAssessmentBanks.ts`). The R question already asks "When does your brain feel clearest?" and stores `rhythmPreference`.
- **The answer never reaches scheduling.** `smartScheduler.mapAssessmentToPreferences` looks for response keys `energy-level` / `energyLevel` / `h-energy` (`src/utils/smartScheduler.ts:76-79`). The assessment writes `rhythm` / `rhythmPreference`. Nothing matches, so every user silently falls back to the default 09:00-11:00 window.
- **`saveAssessmentPreferences` is never called anywhere** in the codebase, so `user_schedule_preferences` is never written from the assessment either.
- The report on `/launch/welcome` renders the total score and per-letter bars, but says nothing about when the person is at their best.

So the plumbing exists and is disconnected. That is the core fix.

## 1. A four-pillar brain-health lens (no extra questions)

Group the eight existing letters under four pillars, so the report reads as a recognised brain-health model rather than eight loose scores:

```text
Biological     Rhythm (R) · Heal (H)          sleep, energy, daily clock
Psychological  Mindset (M) · Yes to Reality (Y) · Transform (T)
Social         Harness Support (H)
Spiritual      Meaning (M) · Your Victories (Y)   purpose, momentum
```

No named programme or practitioner appears anywhere in the app. Each pillar gets one plain-English line and the standard non-clinical disclaimer.

## 2. Two extra taps, not eight

The current R question captures *when*. Two things are missing to schedule well, added as one compact "Rhythm" step with two rows rather than two full screens:

- **How long can I hold real focus?** (20 min / 45 min / 90 min / it varies)
- **What flattens me fastest?** (long meetings / back-to-back days / noise and crowds / decisions)

Total assessment length goes from 8 questions to 8 questions + one two-row step. Everything else stays as it is.

## 3. The report says when I am at my best

New card near the top of the `/launch/welcome` report:

- **My best window** — "Mornings, roughly 09:00-11:30. Best focus block: about 45 minutes."
- **Protect** — the hours to keep clear, derived from the drain answer.
- **Good for other people** — the window where meetings are safest for me.
- Four pillar bars (Biological / Psychological / Social / Spiritual) beneath the existing letter bars, each with a one-line "what this means for my week".

## 4. The calendar uses it — as a preference, on by default

- New setting in Launch Settings → Scheduling: **"Plan around my best window"** — on by default after the first assessment. Turning it off keeps the window on the report but stops the scheduler from favouring or protecting it.
- On assessment completion, write the derived window to `user_schedule_preferences` (the existing table and shape) alongside a `best_window_enabled: true` flag.
- Fix `mapAssessmentToPreferences` so it reads the keys the assessment actually writes (`rhythm`, `focusEndurance`, `drains`, `heal`), with the old keys kept as fallbacks, and respects the enabled flag.
- Smart scheduling suggestions then label times honestly: "Inside my clearest window", "Outside my best window — still fine for a short one", "I'd protect this hour". When the preference is off, suggestions are time-neutral again.
- Retaking the assessment updates the window; the toggle state is never reset, and existing events are never moved automatically.

## Technical notes

- `src/launch/framework/cognitiveCapital.ts` — new: pillar definitions and letter-to-pillar map, sourced from `myrhythm.ts` so the two can never drift.
- `src/data/launchAssessmentBanks.ts` — add `pillar` to `AssessmentQuestion`, add the rhythm-detail step to all four persona banks, extend `BrainHealthScore` with `pillars` and bump `version` to 3.
- `src/hooks/useBrainHealthyPrefs.ts` — extend `BrainHealthyPrefs` with `best_window_enabled: boolean` (default `true`) plus the derived window fields; the Launch Settings toggle writes through this hook.
- `src/launch/assessment/productivityWindow.ts` — new: pure function turning answers into `{ peak, productiveHours, focusBlockMinutes, protectHours, meetingHours }`.
- `src/pages/launch/LaunchAssessment.tsx` — persist the derived window alongside the existing results, and call the new preference write.
- `src/utils/smartScheduler.ts` — repair the key mapping, honour `focusBlockMinutes`, and update the suggestion reason strings.
- `src/pages/launch/LaunchWelcome.tsx` — the "My best window" card and pillar bars.
- Older assessment runs without the new fields keep working through defaults; no migration is required.

## Success criteria

- Every question visibly belongs to one of the four pillars in the report.
- The report states a specific best window and focus-block length in first-person language.
- Scheduling a Memory Bridge action proposes a time inside that window and says why.
- A "Plan around my best window" toggle exists in Settings, defaults to on, and turning it off stops window-based suggestions without losing the data.
- The assessment still completes in under two minutes.
- No named practitioner or programme, and no clinical claim, anywhere in the new copy.
