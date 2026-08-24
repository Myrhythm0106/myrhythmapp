# Memory Bridge: saves, but "0 actions"

## What the data actually shows

Checked your recordings and meetings tables directly:

- Your last successful capture (24 Aug, 03:58 UTC, 9m13s) uploaded fine — one audio row, one 5.8k-character transcript. Good.
- But it created **two** meeting records from that single recording, one minute apart. One ended up with **3 extracted actions**; the twin ended up with **0**.
- The review screen polls one meeting id. If it is watching the twin that got 0, you see "0 actions" even though the extraction worked and 3 actions exist in the database.
- No recording or meeting row exists from today's attempts at all, and there are no `process-meeting-audio` logs. So today's taps never reached upload — separate from the duplicate problem, cause not yet confirmed.

Two distinct problems, both addressed below.

## Fix

1. **One recording, one meeting.** Make `processSavedRecording` reuse an existing meeting row for a given `recording_id` instead of inserting a new one, and guard the save handler so a second tap (or a re-mount mid-flight) can't launch a parallel run. A unique constraint on `meeting_recordings.recording_id` makes this impossible to regress.

2. **Count actions by recording, not just by meeting.** When polling completes, look up actions for the recording (across any meeting rows attached to it) so a stray duplicate can never report zero. If actions exist, show them.

3. **Never end on a silent zero.** When processing completes with a transcript but genuinely no actions, go straight to the review screen with the transcript visible and an "extract again / add my own step" choice — not a dead "0 actions" toast.

4. **Find out why today's taps produced nothing.** Add explicit stage logging and on-screen status through the save path (blob present → upload started → row inserted → function invoked), plus a visible error toast at each failure point. Today there is no server-side trace at all, so the failure is before upload; this makes the next tap self-diagnosing.

5. **Clean up the existing twin.** Merge/remove the empty duplicate meeting from 24 Aug so your Recent Recordings shows one entry with its 3 actions.

## Verify

- Record 60 seconds with two clear commitments, tap Save: exactly one meeting row is created, actions appear in the review table.
- Tap Save twice quickly: still one meeting, no second run.
- Reopen the 24 Aug recording: shows 3 actions, not 0.

## Technical notes

- `src/utils/processSavedRecording.ts`: upsert-by-`recording_id` meeting creation; poll actions via `recording_id`; in-flight lock.
- `src/pages/launch/LaunchMemoryBridge.tsx`: disable Save while running, stage-by-stage status line, error toasts.
- Migration: unique index on `meeting_recordings(recording_id)` plus a one-off cleanup of the empty duplicate.
- No change to the extraction prompt or the `process-meeting-audio` / `extract-acts-incremental` logic in this pass — the data shows extraction itself worked.
