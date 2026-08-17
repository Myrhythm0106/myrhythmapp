# Fix: recording isn't captured, and "Save & Extract Actions" does nothing

You stop a ~5 minute recording, tap **Save & Extract Actions**, and nothing happens — no spinner, no message, no error, and nothing lands in your captures.

## Recording quality today (confirmed from the code)

The recorder asks the browser for plain microphone access with no quality settings at all, and records to **Opus audio in a WebM container**, letting the browser pick sample rate and bitrate (typically 48 kHz, ~32–64 kbps mono — fine for speech and transcription).

Two consequences worth knowing:

- There is no explicit echo cancellation, noise suppression, or bitrate choice — it's whatever the device defaults to.
- **On iPhone/iPad Safari, WebM isn't supported**, so the recorder falls back to the browser default (MP4/AAC) while the save path still labels and uploads the file as `.webm`. A mislabelled file is a known cause of transcription rejecting the audio.

## What the code shows about the failure (confirmed)

- The save handler exits **silently** if the recorded audio is no longer in memory or the session isn't available — no toast, no spinner. That matches "nothing at all".
- The audio lives only in a temporary in-memory reference. Any remount (phone backgrounding the tab, auth refresh, navigating away) drops it while the review screen stays reachable — a dead button.
- There is **no check that the recording actually contains audio**. An empty or zero-byte capture would pass through the same paths without complaint.

Which of these hit your 5-minute attempt isn't confirmed yet. Step 1 makes it visible on the next tap.

## Fix, in order

1. **Never fail silently.** Clear messages instead of the silent exit: "recording no longer in memory — record again", "please sign in to save", plus diagnostic logging in both cases.

2. **Prove the audio exists.** Track captured bytes while recording and show a live size indicator; block save with an explicit "that recording came through empty — check your microphone" if the blob is empty or implausibly small for its duration.

3. **Record in the right format for the device.** Pick the best supported type (`audio/webm;codecs=opus`, else `audio/mp4`), record mono with echo cancellation and noise suppression on, and carry the real MIME type through to upload so the stored file extension matches the bytes — this is what makes iPhone recordings transcribable.

4. **Make the audio survive.** Persist the recorded blob to IndexedDB as it's captured, restore it if the page reloads or the tab is backgrounded, and clear it after a successful save. A 4-hour cap means this must not rely on memory alone.

5. **Immediate tap feedback plus visible upload progress.** Busy state the instant the button is pressed, an upload progress/status line, and upload errors surfaced as toasts rather than console-only.

6. **Recovery net.** If audio was saved but extraction didn't run, offer "Extract actions" on the most recent capture in Recent Recordings.

## Verify

- Record 1 minute on desktop and on iPhone: byte counter climbs, save shows a spinner, upload completes, actions appear.
- Reload mid-review: the recording is restored and saves normally.
- Mic muted/denied: an explicit warning appears during recording, not after.

## Technical notes

- Files: `src/hooks/useVoiceRecorder.ts` (constraints, MIME detection, byte tracking, correct file extension and `content-type` on upload, error surfacing), `src/pages/launch/LaunchMemoryBridge.tsx` (guards, feedback, restore-on-mount), plus a small IndexedDB helper for the pending blob.
- No database or edge function changes in this pass; the extraction pipeline is untouched. If the diagnostics show the failure is inside extraction rather than capture/save, that becomes the follow-up.
