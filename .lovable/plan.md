# Assessment: YES Quick Start (5–7 min) + MYRHYTHM Full Picture

## My view on your idea
YES as the first 3 weeks, and MYRHYTHM as the full app, works well. It gives a short, achievable beginning ("say YES to 3 weeks"), and turns the full app into something you grow into rather than face all at once. It also gives you a natural coaching structure.

## Proposed YES letters (please confirm or rename)
Built on the same brain-health principles as the existing letters, no names shown in the app.
- **Y — Your Starting Point** (week 1): memory, what slips, how you remember now. Know your brain today.
- **E — Everyday Energy** (week 2): sleep, movement, food and drink, stress. The brain-health basics.
- **S — Steady Rhythm** (week 3): wake/wind-down, best and dip times, focus length, one weekly goal.

## Quick Start — the YES assessment, about 6 minutes, 3 parts
Every question carries a YES letter AND one MYRHYTHM letter, so all 8 MYRHYTHM letters are covered once.

| Part | Question | MYRHYTHM letter |
|---|---|---|
| Y | What slips most? (primary + "Also fits") | Yes to Reality |
| Y | How do you remember things now? | Harness Support |
| Y | Next day, how much of a conversation do you remember? | Mindset |
| E | How well do you sleep at night? | Heal |
| E | How often do you move your body? | Rhythm |
| E | Food and drink that help your brain | Transform |
| E | How calm do most days feel? | Your Victories |
| S | Wake-up and wind-down time; easiest thinking time; energy dip | Rhythm |
| S | How long can you focus before a break? | Rhythm |
| S | One thing you'd like done this week — and why it matters to you | Meaning |

Each part opens with one line saying what it changes in the app, and ends with a live preview (e.g. "I'll suggest important tasks between 9 and 11am").

## Your 3-week YES plan (result of Quick Start)
Snapshot shows the YES result and sets up: week 1 memory support (reminder style, Memory Bridge), week 2 one energy habit, week 3 rhythm on the calendar (with existing consent step). One button: **Start week 1**.

## Full Picture — MYRHYTHM, about 15 min, 8 short parts (one per letter)
Offered from the snapshot and Home ("Unlock your full MYRHYTHM"), save and come back anytime. Each letter goes deeper: Mindset, Yes to Reality, Rhythm, Harness Support (Support Circle help), Your Victories, Transform, Heal, Meaning (vision areas). Each finished letter updates the snapshot.

## Kept as-is
Free snapshot stated up front; primary circle + "+ Also fits"; no practitioner names in-app; non-medical wording; old results viewable; resume where you stopped; max 3 choices on welcome.

## Technical details
- New `YES` definitions alongside `src/launch/framework/myrhythm.ts` (single source of truth); memory note saved for the YES → MYRHYTHM structure.
- `launchAssessmentBanks.ts`: add memory/routine ids, tag each with `yes`, `letter`, `tier: 'quick'|'full'`; bump schema to v5 (in-progress v4 restarts with notice; completed v4 kept in history).
- Mappings: memory → reminder defaults and Memory Bridge prompts; wake/wind-down/dip → calendar rhythm bands behind consent.
- `LaunchAssessment.tsx`: path choice, part headers, live previews, per-letter save for Full Picture; history stores tier and completed letters.
- Snapshot: 3-week YES plan block; Home card for unfinished MYRHYTHM letters (dismissible).
- Neutral citations in the internal reference log. Mobile check at 393px.
