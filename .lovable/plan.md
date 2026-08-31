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

## 4. The calendar uses it — as a preference, on by default, always overridable

The window is advice, never a gate. Real life has other people's diaries, deadlines and priority dates in it.

**Global preference** — Launch Settings → Scheduling: **"Plan around my best window"**, on by default after the first assessment. Off keeps the window visible in the report but makes suggestions time-neutral.

**Per-event override** — in the Add Event modal and in the action scheduler, a time outside the window is never blocked. If I pick one, the app shows a single quiet line — "This is outside my clearest window" — with three ways forward, all one tap:

- **Keep this time** — the stakeholder's availability or the deadline wins. Saved with `window_override: true` so it is never re-flagged.
- **Show my best times** — the nearest in-window slots.
- **Always allow this kind** — turns the nudge off for that event type (e.g. meetings) while keeping it for solo focus work.

**Who drives this booking?** — a one-tap chip at the top of the scheduler, remembered per event type:

- **My rhythm** (default for solo focus work) — the window ranks the options.
- **Stakeholder-first** (default for Meetings) — other people's availability and the invitee list rank the options; my window is shown only as a small note, never as a warning. If the only time everyone can make is 4pm, 4pm is the top suggestion, full stop.
- **Deadline-first** — the due date or project date drives the slot; the window only chooses between candidate times on that date.

**Sorting, not blocking** — out-of-window times are always offered, never hidden or greyed out. They are ranked and labelled honestly: "Inside my clearest window", "Best time everyone can make", "Driven by your Friday deadline". No red, no warning icons, no confirmation friction.

**Nothing is ever refused.** The app has no mode in which it declines to book a time the user chose. The window is a hint that can always be ignored in one tap, and the app does not repeat the hint for that booking.

Retaking the assessment updates the window; the mode chips, per-type exceptions and any saved overrides are never reset, and existing events are never moved automatically.


## Technical notes

- `src/launch/framework/cognitiveCapital.ts` — new: pillar definitions and letter-to-pillar map, sourced from `myrhythm.ts` so the two can never drift.
- `src/data/launchAssessmentBanks.ts` — add `pillar` to `AssessmentQuestion`, add the rhythm-detail step to all four persona banks, extend `BrainHealthScore` with `pillars` and bump `version` to 3.
- `src/hooks/useBrainHealthyPrefs.ts` — extend `BrainHealthyPrefs` with `best_window_enabled: boolean` (default `true`) and `scheduling_bias_by_type: Record<BlockType, 'my_rhythm' | 'stakeholder_first' | 'deadline_first'>` (meetings default to `stakeholder_first`, focus to `my_rhythm`), plus the derived window fields; Settings writes through this hook.
- `src/launch/assessment/productivityWindow.ts` — new: pure function turning answers into `{ peak, productiveHours, focusBlockMinutes, protectHours, meetingHours }`.
- `src/pages/launch/LaunchAssessment.tsx` — persist the derived window alongside the existing results, and call the new preference write.
- `src/utils/smartScheduler.ts` — repair the key mapping, honour `focusBlockMinutes`, and take a `bias` argument that decides the ranking weight order (window vs invitee availability vs due date). Out-of-window candidates are always returned, only re-ranked.
- `src/components/launch/LaunchAddEventModal.tsx` and the action scheduler — the mode chip plus the non-blocking out-of-window note with Keep / Show best times / Always allow this kind.
- Overrides ride on the existing per-action `schedulingOverride` shape in `capture-brief/model/types.ts`; calendar events store `window_override` and the chosen bias in their existing metadata. No schema migration is required.
- `src/pages/launch/LaunchWelcome.tsx` — the "My best window" card and pillar bars.
- Older assessment runs without the new fields keep working through defaults.

## Success criteria

- Every question visibly belongs to one of the four pillars in the report.
- The report states a specific best window and focus-block length in first-person language.
- Scheduling a Memory Bridge action proposes a time inside that window and says why.
- A "Plan around my best window" toggle exists in Settings, defaults to on, and turning it off stops window-based suggestions without losing the data.
- The assessment still completes in under two minutes.
- Choosing a time outside the window is never blocked — one tap keeps it, and the app does not nag about it again.
- Switching a meeting to Stakeholder-first ranks by invitee availability and stops mentioning the window as a problem.
- An action with a hard due date is scheduled on that date even when it falls outside the window.
- No named practitioner or programme, and no clinical claim, anywhere in the new copy.
