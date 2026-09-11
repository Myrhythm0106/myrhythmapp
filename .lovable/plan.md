# Make the brain health answers actually shape my day

Right now the eight MYRHYTHM questions are scored and shown in the report, but the
day-planning side only listens to three things: when I feel clearest, how long I can
focus, and what drains me. Everything I said about rest, fatigue, memory load, honest
starting point and support is scored — and then ignored by the calendar.

This change connects the two, without adding a single new question or screen.

## What changes for me

- **My best window gets sized to my capacity.** If my body-and-energy answers are low
  (little rest, heavy fatigue), the protected window narrows and the focus block shortens
  instead of assuming I can hold a full stretch.
- **Breathing room between things.** Low energy answers automatically add a recovery gap
  after commitments; steady answers leave it off.
- **A daily ceiling on demanding items.** A gentle cap on how many heavy things get
  suggested in one day, set from my snapshot.
- **The reasons are said out loud.** The line on Home changes from "you told me mornings"
  to also name *why* — e.g. "shorter blocks for now, because afternoons drain you."
- **Report shows the link.** My results page states plainly which answers shaped my window.
- **I always get the final say.** When a suggested time doesn't work — my client is only
  free at 4pm — I just pick the time I need. A quiet note appears ("this sits outside your
  best hours — I'll keep the block shorter and add a rest gap after"), and it saves without
  argument. No blocking, no warning pop-up, no repeated nagging.

Nothing new to configure. The existing on/off switch for best-window scheduling still
controls all of it.

## What does not change

- No new questions, no extra step, no extra taps.
- The report, letters, pillars and the visual snapshot stay exactly as they are.
- No clinical or diagnostic language — this is planning guidance, not assessment of health.

## Technical detail

**`src/launch/assessment/productivityWindow.ts`**
- Extend `ProductivityWindow` with: `windowMinutes` (derived), `bufferMinutes`,
  `maxDemandingPerDay`, and `reasons: string[]` (plain-English drivers).
- `deriveProductivityWindow(answers, score?: BrainHealthScore)` — new optional second
  argument. Rhythm/focusLength/energyDrain keep their current role as the base window;
  the score then adjusts it:
  - `pillars.biological` (rhythm + heal): ≤1 → clamp window to ~2h and focus block to
    min(base, 25); ≤2 → clamp block to min(base, 45); ≥2.5 → leave base untouched.
  - `pillars.psychological` (mindset, yesReality, transform): ≤1 → `maxDemandingPerDay = 1`
    and buffer 20m; ≤2 → 2/15m; else 3/10m.
  - Specific answers add targeted lines: `heal === 'none-yet'` → protect a reset slot;
    `transform` including `fatigue` → keep the back half of the day light;
    `memory` → lean on reminders; `pillars.social` ≤1 → suggest no invitee-heavy blocks.
  - Every adjustment pushes a short sentence into `reasons`, so nothing is silent.
- Keep the function pure and fully backwards-compatible when the score is absent.

**`src/pages/launch/LaunchAssessment.tsx`**
- Compute `brainHealthScore` before building the window (it already is), and pass it into
  both `deriveProductivityWindow` calls.
- Save the new fields into `user_schedule_preferences`: `focus_block_minutes` already
  exists; put `bufferMinutes`, `maxDemandingPerDay` and `reasons` inside the existing
  `time_slots` JSON payload so no migration is needed.

**`src/components/launch/quiet/RhythmLine.tsx`**
- Render the first one or two `reasons` after the existing sentence. Falls back silently
  to today's wording for anyone whose stored snapshot predates this change.

**`src/pages/launch/LaunchWelcome.tsx`**
- Add one short "How this shapes my days" block under the existing window summary,
  listing the same reasons. No layout restructure.

**Consumers of the window** (scheduling suggestions, Add Event, Commit) keep reading
`productiveStart`/`productiveEnd`/`focusBlockMinutes`, so they get the corrected values
with no changes. Buffer and daily-cap use is additive and can be applied where suggestions
are generated.

**Verification:** typecheck, then complete the assessment twice in the browser — once with
low-energy answers and once with strong answers — and confirm the window, block length and
Home line differ appropriately.
