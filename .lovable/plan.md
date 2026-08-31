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

## 4. The calendar uses it — invisibly, with one big switch

The window is advice, never a gate. Real life has other people's diaries, deadlines and priority dates in it.

**The 13-year-old test — the whole feature is one switch.** Launch Settings → Scheduling shows a single prominent toggle in plain words: **"Suggest times that suit my rhythm"** — on by default after the first assessment. On = the app quietly favours my clearest hours. Off = it stops, instantly and completely. That one switch is the entire user-facing cost of this feature. A user who never opens Settings gets sensible behaviour forever; a user who hates it kills it in one tap. No modes, no jargon, no per-booking questions — ever.

**The three priority levels live behind a collapsed "Advanced" section** inside the same Settings page, pre-filled sensibly (People's availability decides Meetings, My best window decides solo focus work, Deadline decides anything with a fixed due date). They are optional fine-tuning for the curious — never required, never surfaced elsewhere. If the Advanced section is never opened, the app works perfectly.

**Per-event override** — in the Add Event modal and in the action scheduler, a time outside the window is never blocked. If I pick one, the app shows a single quiet line — "This is outside my clearest window" — with three ways forward, all one tap:

- **Keep this time** — the stakeholder's availability or the deadline wins. Saved with `window_override: true` so it is never re-flagged.
- **Show my best times** — the nearest in-window slots.
- **Always allow this kind** — turns the nudge off for that event type (e.g. meetings) while keeping it for solo focus work.

**No per-booking questions — smart defaults that learn.** Setting priorities on every event, action or meeting is too much friction, so the app decides silently and only ever asks once, globally:

- **One switch, set once** — the toggle described above. The Advanced priority levels sit collapsed beneath it; most users never open them.
- **Applied automatically by event type** — the scheduler reads the defaults and ranks options without asking anything. The booking screen shows only the result: honest labels like "Best time everyone can make" or "Inside my clearest window". Nothing to tap, nothing to configure.
- **Learns from overrides** — when the user keeps a time the suggestion ranked lower (e.g. picks a 4pm slot when mornings were suggested), that choice is remembered. After the same kind of override repeats for the same event type, the app quietly adjusts that type's default once, with a small note: "I've noticed your meetings usually land in the afternoon — I've adjusted your meeting suggestions. Change this in Settings." One line, one undo, never a dialog that blocks.
- **The only visible control** — if the user picks a time outside their window, the single quiet line stays: "Keep this time / Show my best times / Always allow this kind". That is the entirety of the per-booking UI. Everything else is invisible.

**Sorting, not blocking** — out-of-window times are always offered, never hidden or greyed out. No red, no warning icons, no confirmation friction.

**Nothing is ever refused.** The app has no mode in which it declines to book a time the user chose. The window is a hint that can always be ignored in one tap, and the app does not repeat the hint for that booking.

Retaking the assessment updates the window; the global priority levels and learned adjustments are never reset, and existing events are never moved automatically.


## Technical notes

- `src/launch/framework/cognitiveCapital.ts` — new: pillar definitions and letter-to-pillar map, sourced from `myrhythm.ts` so the two can never drift.
- `src/data/launchAssessmentBanks.ts` — add `pillar` to `AssessmentQuestion`, add the rhythm-detail step to all four persona banks, extend `BrainHealthScore` with `pillars` and bump `version` to 3.
- `src/hooks/useBrainHealthyPrefs.ts` — extend `BrainHealthyPrefs` with `best_window_enabled: boolean` (default `true`) and `priority_levels_by_type: Record<BlockType, { window: PriorityLevel; people: PriorityLevel; deadline: PriorityLevel }>` where `PriorityLevel = 'decides' | 'counts' | 'off'` (meetings default to people=decides/window=counts, focus to window=decides), plus the derived window fields; Settings writes through this hook. A small `learned_adjustments` map records overrides the app has learned from, so it never relearns the same thing twice.
- `src/launch/assessment/productivityWindow.ts` — new: pure function turning answers into `{ peak, productiveHours, focusBlockMinutes, protectHours, meetingHours }`.
- `src/pages/launch/LaunchAssessment.tsx` — persist the derived window alongside the existing results, and call the new preference write.
- `src/utils/smartScheduler.ts` — repair the key mapping, honour `focusBlockMinutes`, and read the per-type priority levels from prefs (no per-booking input), converting them to ranking weights (decides > counts > off). Out-of-window candidates are always returned, only re-ranked. A `recordOverride()` helper logs kept-lower-ranked choices and proposes one quiet preference adjustment per event type after the pattern repeats.
- `src/components/launch/LaunchAddEventModal.tsx` and the action scheduler — no priority picker; only the non-blocking out-of-window note with Keep / Show best times / Always allow this kind, and the one-line "I've adjusted your suggestions" note with undo when a learned adjustment lands.
- Overrides ride on the existing per-action `schedulingOverride` shape in `capture-brief/model/types.ts`; calendar events store `window_override` in their existing metadata. No schema migration is required.
- `src/pages/launch/LaunchWelcome.tsx` — the "My best window" card and pillar bars.
- Older assessment runs without the new fields keep working through defaults.

## Success criteria

- Every question visibly belongs to one of the four pillars in the report.
- The report states a specific best window and focus-block length in first-person language.
- Scheduling a Memory Bridge action proposes a sensible time with zero questions asked — the priority levels come from Settings defaults, not per-booking prompts.
- A "Plan around my best window" toggle exists in Settings, defaults to on, and turning it off stops window-based suggestions without losing the data.
- The assessment still completes in under two minutes.
- Choosing a time outside the window is never blocked — one tap keeps it, and the app does not nag about it again.
- After the same override repeats for an event type, the app adjusts that type's suggestion default once, with a visible undo — and never asks again.
- Meetings rank by people's availability by default and the window is silent — never flagged as a problem.
- An action with a hard due date is scheduled on that date even when it falls outside the window.
- No named practitioner or programme, and no clinical claim, anywhere in the new copy.
