# Move "How long shall I keep this?" to before the save

## The problem today

The keep-for choice appears **after** the first capture is already saved and processed (`KeepForPrompt` opens on the Memory Bridge page once `processedRecordings.size > 0`). So the very first recording is saved under whatever default mode the profile has — the person's choice arrives too late to apply to the recording it was asked about.

## The change

Ask **after the person stops recording, before anything is saved or processed**. Their choice is written to their profile first, then the save proceeds — so the very first recording gets the retention clock they actually chose (including the new Write-up only 3-day audio countdown).

### Flow

```text
Record → Stop → [first time only] "How long shall I keep this?" → Save → Transcribe → Actions
```

- If the person has never made the choice (no `recording_consent` row), stopping a recording opens the choice dialog with the audio held in memory — nothing is uploaded yet.
- Once they confirm a mode, the profile is updated, consent is recorded, and the existing save-and-process pipeline runs unchanged.
- If they've chosen before, stopping goes straight to save — never asked twice.
- An "X" / dismiss isn't offered as a dead end; if they close without choosing we use the current default (Balanced) and still record consent, matching today's fallback behaviour.

## Files

1. **`src/components/launch/KeepForPrompt.tsx`** — refactor from self-opening (post-capture) into a controlled dialog:
   - Props: `open`, `onConfirm(mode)`, `onDismiss?`.
   - Copy tweak: "before I save this" framing instead of "your first capture is saved".
   - Same four choices, same consent-row write, still record `audio_retention_days` / `transcript_retention_days`.
2. **`src/components/memoryBridge/MemoryBridgeRecorder.tsx`** — in `handleStop`, after `stopRecording()` returns the blob:
   - Check once (cached per session) whether a `recording_consent` row exists for the user.
   - If none: hold the blob in state, open the dialog; on confirm, run `updateMode` then `handleSaveAndProcess(blob)`.
   - If present: proceed exactly as today.
3. **`src/components/memoryBridge/QuickCaptureRecorder.tsx`** — same gate around its `stopRecording → saveRecording` path (two save sites: auto-process at line ~171 and manual save at ~380).
4. **`src/pages/launch/LaunchMemoryBridge.tsx`** — remove the old post-capture `<KeepForPrompt hasCaptures=… />` mount (the dialog now lives inside the recorders).
5. **`docs/data-and-deletion-standard.md`** — update the "offered after the first recording" line to "offered before the first save".

## What doesn't change

- The four modes, the countdown UI, Settings card, database trigger/clocks — all untouched.
- Repeat recordings: zero added friction after the first choice.
- Existing `recording_consent` rows mean existing users never see the prompt again.

## Verification

- New tester flow: record → stop → dialog appears → pick "Write-up only" → save proceeds → card shows the 3-day countdown line.
- Second recording: no dialog, straight to save.
- Check `recording_consent` gets one row with the chosen mode.
- Typecheck the touched files.
