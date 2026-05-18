# Plan v6.4 — Universal 7-Stage Rhythm Timeline

Brain-injury-first foundation. Seven stages give every persona a sense of *where they are* without prescribing a timetable. Stage 0 (Pause) gives permission to do nothing. Recovery users see typical duration anchors; everyone else sees verbs only.

## Locked decisions

1. **Default stage** for unselected users → **Steady** (safe middle, never assumes recent trauma).
2. **Picker visibility** → quiet "Where am I in my rhythm?" link on home, not a 6-pill row.
3. **Duration anchors** → shown **only** to the recovery persona.
4. **Pause is opt-in**, not a default. A user (or caregiver-in-Supporting-view) deliberately chooses it.

## The 7 stages

| # | Label | Recovery anchor (recovery persona only) | Intent |
|---|---|---|---|
| 0 | Pause | Days 0–14 (incl. pre-discharge) | Stillness. No tasks. Acknowledgement. |
| 1 | Ready | Days 14–28 | Willing to begin. Set things up gently. |
| 2 | Steady | Month 1–6 | Daily rhythm taking shape. |
| 3 | Strengthen | Month 6–12 | Consolidation, stretching capacity. |
| 4 | Stretch | Year 1–2 | Bigger commitments, deeper work. |
| 5 | Return | Year 2–3 | Return to work / study / public life. |
| 6 | Sustain | Year 3+ | Long-term maintenance. |

Each stage carries a **persona-specific lens** (one sentence) so it reads correctly to recovery, caregiver, productivity, and student users.

No auto-progression. No countdowns. No badges or streaks tied to stages.

## Pause — what's different

Pause is a deliberate variant of the home surface. When the active stage is `pause`:

- `QuietHome` hides scaffolds, wins list, composer, and capture prompts.
- It shows only: greeting, #IChoose heart, and one sentence — *"Today, the only thing is rest."*
- A small muted control: "When you're ready, move to Ready." (One tap, no nag.)
- Caregivers in Supporting view can place the person they support in Pause on their behalf.

## Persona × Stage lens copy

```text
Pause
  recovery     You've been through something. No tasks today — just rest, and let people help.
  caregiver    The first days are a lot. Breathe. The system can wait until next week.
  productivity A real pause. No optimisation, no planning — just stop.
  student      A genuine break. The next term will still be there when you're ready.

Ready
  recovery     Ready to start gently. Capture what matters, protect your energy.
  caregiver    Ready to put a system in place. Small anchors first.
  productivity Ready to set the baseline. Clear the decks, then build.
  student      Ready for the term. Set up the scaffolding.

Steady
  recovery     Early recovery. Build daily rhythm, low-cost wins.
  caregiver    Settle into the caring rhythm without burning out.
  productivity First quarter. Lock in routines that compound.
  student      First semester. Lectures + revision cadence.

Strengthen
  recovery     Consolidation. Stretch capacity gently.
  caregiver    Confidence in the routine. Reclaim your own time.
  productivity Year-1 momentum. Bigger commitments, deeper work.
  student      Exams + projects. Recall under pressure.

Stretch
  recovery     Re-integration. Reintroduce harder roles.
  caregiver    Plan for transitions (treatment phases, school changes).
  productivity Year-2 ambition. Lead, ship, raise the ceiling.
  student      Specialisation. Internships, research, thesis.

Return
  recovery     Return to work, study, or public life.
  caregiver    Transition out of intensive caring, or hand off.
  productivity Senior role, multi-project leadership.
  student      Graduation, first role.

Sustain
  recovery     Long-term maintenance. Catch dips early.
  caregiver    Sustainable support over years.
  productivity Mastery. Defend the rhythm against drift.
  student      Continuous learning, career rhythm.
```

Tone rules: no medical claims, no "fix/transform", no gamification. Plain, calm, dignified.

## What gets built

### 1. Source of truth — `src/launch/stage/stages.ts`
- `Stage = 'pause' | 'ready' | 'steady' | 'strengthen' | 'stretch' | 'return' | 'sustain'`
- `stages[]` with: `id`, `label`, `order`, `recoveryAnchor`, `lensByPersona { recovery, caregiver, productivity, student }`.
- Pure data. No React, no localStorage.

### 2. Stage resolver — `src/launch/stage/useStage.ts`
- Reads `myrhythm_launch_stage` from localStorage. Default `steady`.
- Exposes `{ stage, setStage, stageData, isPause }`. SSR-safe. Persists on change.

### 3. Quiet picker — `src/launch/stage/StagePicker.tsx`
- Surface: a small text link "Where am I in my rhythm?" under the greeting in `QuietHome`.
- Opens a sheet listing all 7 stages with label + persona-appropriate lens.
- Recovery persona: each row shows the duration anchor as a small muted caption.
- One-tap to switch. Closes on selection. Never auto-opens.

### 4. Stage-aware lens chip — `src/launch/stage/StageLensChip.tsx`
- Optional small chip on Capture / Commit / Calibrate hero areas: "Stage: [label] — [lens]".
- Hidden until the user has engaged with the picker once (so recovery users in Pause aren't constantly reminded).

### 5. Pause home variant — `src/components/launch/quiet/QuietHomePause.tsx`
- Minimal variant rendered by `QuietHome` when `isPause` is true.
- Greeting + #IChoose heart + single rest sentence + quiet "Move to Ready" control.
- No scaffolds, wins, composer, or capture surfaces.

### 6. Light touch in existing surfaces
- `QuietHome.tsx` — branch on `isPause`; otherwise add "Where am I?" link under greeting.
- `CapabilityPage.tsx` — accept optional `stageLens?: boolean` prop to mount `StageLensChip`.
- `LaunchCapture.tsx`, `LaunchCommit.tsx`, `LaunchCalibrate.tsx` — pass `stageLens`.
- `LaunchWelcome.tsx` — one optional line on first visit: "We'll meet you wherever you are in your rhythm."

## Files

**New (5)**
- `src/launch/stage/stages.ts`
- `src/launch/stage/useStage.ts`
- `src/launch/stage/StagePicker.tsx`
- `src/launch/stage/StageLensChip.tsx`
- `src/components/launch/quiet/QuietHomePause.tsx`

**Edited (5)**
- `src/components/launch/quiet/QuietHome.tsx`
- `src/components/launch/chrome/CapabilityPage.tsx`
- `src/pages/launch/LaunchCapture.tsx`, `LaunchCommit.tsx`, `LaunchCalibrate.tsx`
- `src/pages/launch/LaunchWelcome.tsx`

## Out of scope

- No new dashboards, KPIs, routes, schema, or backend.
- No automatic stage progression.
- No medical claims, no countdowns, no badges, no streaks.
- No changes to Capture/Commit/Calibrate capability lists.
- No brand re-theming.

## QA matrix

Walk each of 4 personas through Welcome → Home → Picker → Pause variant → Capture → Commit → Calibrate. Confirm:
- Default lands in Steady; recovery anchors only show for recovery persona.
- Picker is one quiet link, never auto-opens.
- Pause variant suppresses all task surfaces and shows only the rest sentence.
- Lens chip stays hidden until the user has engaged with the picker once.
- Recovery path remains calm and dignified end-to-end.

## Risk

Low. All additive. One link, one sheet, one chip, one minimal home variant, one data file. No regressions to current Launch surfaces.
