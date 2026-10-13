# Assessment: Quick Start (5–7 min) + optional Deep Dive

## What's missing today
The current 12 questions cover brain-health habits and one "best time" question, but nothing on **memory** (what slips, how they remember things now) or **daily routine** (wake/sleep, fixed commitments, when energy dips). So the app can't yet tailor reminders, Memory Bridge or the calendar as well as it could.

## The choice, shown on the welcome screen
Two clear cards (max 3 choices rule kept):
- **Quick Start — about 6 minutes** (recommended). "Enough to set up your diary, reminders and free snapshot."
- **Full picture — about 15 minutes, can be done in parts.** "Unlocks smarter planning, memory support and Support Circle suggestions."
Anyone who picks Quick Start is offered the Full picture later from the snapshot and Home ("Add more detail — 3 short parts"), never forced.

## Quick Start — 14 questions in 4 short parts
Each part opens with one line saying what it will change in the app.

1. **Memory (3)** — "Shapes how and when I remind you."
   - What slips most? (appointments / tasks halfway done / what people said / where I put things) — primary + "Also fits"
   - How do you remember things now? (phone, paper, someone reminds me, I don't)
   - After a conversation or appointment, how much do you usually remember the next day?
2. **My day (4)** — "Builds your daily rhythm on the calendar."
   - Usual wake-up and wind-down time (simple time pickers)
   - When does thinking feel easiest? (existing question)
   - When does energy usually dip?
   - How long can you focus before needing a break? (existing)
3. **Brain health (5)** — the strongest five of the current eight (sleep, movement, food/drink, stress/calm, connection), same plain wording.
4. **Support & goal (2)** — who helps you (existing) and one thing you'd like to get done this week (existing).

## Full picture — 3 optional parts (~3 min each, save and come back)
- **Memory & conversations:** reminder style (sound/vibration/spoken), how far ahead, best way to review a recording, hardest situations (appointments, phone calls, family plans).
- **Routine & energy:** fixed weekly commitments, meals, medication-time reminders (wording non-medical: "regular reminders you rely on"), good vs hard days, what drains energy (existing energy question).
- **Life & meaning:** remaining brain-health items (protection, everyday choices, meaning), the 5 vision areas in one line each, how much help you'd like from your Support Circle.
Each finished part immediately updates the snapshot with a "New: based on what you just added" line.

## Making them want to start
- Progress bar with parts, not a long number ("Part 2 of 4 — My day").
- After each part, a one-line live preview: e.g. "I'll suggest important tasks between 9 and 11am" or "I'll remind you the evening before appointments."
- Snapshot ends with **3 things set up for you already** (rhythm on calendar — with existing consent step, reminder style, first suggested action) and one button: **Try it — record or plan today**.
- Free snapshot unchanged and stated up front.

## Kept as-is
Primary circle + "+ Also fits" on additive questions; no practitioner names; non-medical wording; old results still viewable; resume where you stopped.

## Technical details
- `src/data/launchAssessmentBanks.ts`: add memory/routine question ids, tag each with `tier: 'quick' | 'full'` and `part`; bump `ASSESSMENT_SCHEMA_VERSION` to 5 (in-progress v4 runs restart with a notice; completed v4 results remain in history).
- New mappings: memory answers → reminder defaults (lead time, evening-before) and Memory Bridge review prompt; wake/wind-down + dip → calendar rhythm bands (still behind rhythm consent).
- `LaunchAssessment.tsx`: path choice on welcome, part headers + live previews, per-part save for Full picture; `assessmentHistory` stores tier and completed parts.
- Snapshot page: "3 things set up" block and "Add more detail" entry; Home card for unfinished Full picture parts (dismissible).
- Scoring: brain-health score computed from answered items only, labelled "based on 5 of 8 areas" for Quick Start.
- Update internal reference log for any new habit wording (neutral citations). Mobile check at 393px.
