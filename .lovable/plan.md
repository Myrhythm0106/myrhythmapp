## Problem

On `/prototype/capture` the recording control is a single circle that silently morphs into a stop button. There is no visible **Pause**, no visible **Stop**, and no labels — so users don't know how to end the capture. For an assistant that's meant to remove the cognitive burden of "did I follow through?", the controls themselves must be unmissable, single-tap, and self-explanatory.

## Principles applied

- **SMART**: each control has one clear job, one tap, no hidden state.
- **Professional**: labelled buttons, not mystery icons.
- **Fewest clicks**: Stop also extracts (no separate "process" step) — already true, but the label must say so.
- **Reduce burden**: paused state is visually obvious so the user never wonders "is it still listening?".

## Fix

Below the mic indicator, show a clear control row that changes with state.

### States

- **Idle** — one large pill button: **"Start recording"** with mic icon. (Replaces the unlabelled circle as the primary action.) The circle becomes a passive visual.
- **Recording** — two side-by-side buttons:
  - **Pause** (outline, secondary) — pauses speech recognition + timer, keeps transcript.
  - **Stop & extract actions** (solid red, primary) — runs existing `stopAndProcess()`, goes straight to Review. One tap = done.
- **Paused** — two side-by-side buttons:
  - **Resume** (solid orange) — restarts recognition + timer, transcript continues appending.
  - **Stop & extract actions** (solid red) — same as above.
- **Processing** — both buttons hidden, replaced by a single disabled "Extracting actions…" pill with spinner.

### Visual indicator (the existing circle)

Stays as a status light only — no click handler:
- Idle: grey mic icon.
- Recording: red pulsing with ping ring.
- Paused: amber, no pulse, "Paused" caption.

### Helper text under timer

State-specific, one short line: "Tap Start to begin" / "Listening — I'm catching every action" / "Paused — your transcript is safe" / "Extracting actions…".

### Accessibility / touch targets

- All buttons ≥ 56px height (project core rule).
- `aria-label`s match visible text.
- Buttons keyboard-focusable in tab order.

## Technical details

- Single file: `src/pages/prototype/PrototypeCapture.tsx`. Pure UI/state, no store or backend changes.
- New local state: `isPaused: boolean`; new ref: `pausedRef` to gate the existing `recog.onend` auto-restart so a pause doesn't immediately re-start the recogniser.
- Split current toggle into four handlers: `startRecording` (existing logic), `pauseRecording`, `resumeRecording`, `stopAndProcess` (existing).
  - `pauseRecording`: set `pausedRef.current = true`, `setIsPaused(true)`, `clearInterval(timerRef.current)`, `recogRef.current?.stop()`.
  - `resumeRecording`: `pausedRef.current = false`, `setIsPaused(false)`, restart 1s interval, `recogRef.current?.start()` (recreate via the existing constructor block if `start()` throws because the instance is already ended).
- Existing `recog.onend` guard becomes `if (!pausedRef.current && isRecording) try { recog.start() } catch {}`.
- No changes to `prototypeStore`, `prototype-extract-acts` edge function, Review/Schedule/Reminders/Done, or routes.
- No changes to the "Try a sample meeting" escape hatch or the bypass-auth toggle.

## Out of scope

- No schema or edge function work.
- No new screens.
- No copy changes elsewhere in the prototype flow.