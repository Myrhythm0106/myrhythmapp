# Fix: "Save & Extract Actions" does nothing

You stop a ~5 minute recording, tap **Save & Extract Actions**, and nothing happens — no spinner, no message, no error. Right now the app has no way to tell you why, because that button can fail completely silently.

## What the code shows (confirmed)

In the Memory Bridge page, the save handler starts with a guard that exits immediately and silently if the recorded audio is no longer held in memory, or if the sign-in session isn't available at that moment. No toast, no spinner, no console message — exactly the "nothing at all" you're seeing.

The recorded audio is only kept in a temporary in-memory reference. Anything that remounts the page (tab backgrounded on a phone, auth token refresh, hot reload, navigating away and back) drops that audio while the review screen can still be reachable — and then the button is a dead button.

The diagnosis of *which* of those two triggered your case is not yet confirmed. Step 1 below makes it self-evident on the next tap.

## Fix, in order

1. **No more silent failure.** Replace the silent guard with clear, actionable feedback:
   - Audio missing: "That recording is no longer in memory — record again" plus a one-tap way back to the recorder.
   - Not signed in: "Please sign in to save" plus a sign-in action.
   - Log a diagnostic line in both cases so any repeat is traceable.

2. **Make the audio survive.** Persist the recorded blob to browser storage (IndexedDB) the moment recording stops, keyed to the session, and restore it when the review screen loads. Clear it after a successful save. This makes the button work even after a phone backgrounds the tab or the page reloads.

3. **Immediate tap feedback.** Show the busy state and status line the instant the button is pressed (before any upload starts), so a slow first step never reads as "nothing happened".

4. **Guard the long path.** A 5-minute recording is a multi-megabyte upload. Add a visible progress/status line during upload and surface upload errors as toasts instead of only console logs, so a failed upload is never invisible.

5. **Recovery net.** If the audio is gone but a recording was already saved, offer "Extract actions" on the most recent saved capture from the Recent Recordings list, so nothing is lost.

## Verify

- Record ~1 minute, tap save: spinner appears immediately, upload completes, extraction starts, actions appear.
- Reload the page mid-review, then tap save: the recording is restored from storage and saves normally.
- Signed-out state: tapping save shows a sign-in prompt, not silence.

## Technical notes

- Files: `src/pages/launch/LaunchMemoryBridge.tsx` (handleSave guards, feedback, restore-on-mount), `src/hooks/useVoiceRecorder.ts` (surface upload errors, expose progress), plus a small IndexedDB helper for the pending blob.
- No database or edge function changes; the extraction pipeline itself is untouched in this pass. If step 1's diagnostics show the failure is actually inside extraction rather than save, that becomes a follow-up.
