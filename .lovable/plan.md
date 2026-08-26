# Fix: playing back a recording does nothing

Tapping play on a saved capture gives no sound, no player, no error.

## What the checks show

- The audio really is there: every recent capture has a matching file in storage (e.g. 4.5 MB webm for the 9-minute capture on 24 Aug), none marked deleted, sizes and durations look sane. So this is a playback problem, not a lost-recording problem.
- The play handler fetches a signed URL with `await`, and only *then* creates the `Audio` object and calls `play()`. By that point the browser no longer considers this a user gesture, so mobile Safari/Chrome can refuse to start. The call's promise is never awaited or caught, so the refusal is swallowed — no toast, no console error, nothing. `onerror` does not fire for a blocked play, which is why the existing "Failed to play recording" toast never appears.
- The second play surface (`RecordingsTab`) is worse: it creates an `Audio`, calls `play()`, keeps no reference and tracks no state — nothing can ever show progress or stop it.
- There is no visible player at all: no progress bar, no time, no seek, no speed. Even when audio does start, there is no feedback that anything is happening.

Exactly which of these bites on your device isn't yet proven — step 1 makes it impossible to fail silently again.

## Fix, in order

1. **Never fail silently.** Await the `play()` promise, catch rejections, and show a clear message ("Tap play again to start audio" for a blocked autoplay, "That recording couldn't be loaded" for a bad URL) with the reason logged.
2. **Keep the tap alive.** Create the audio element on the tap itself and attach the signed URL when it arrives, so the browser still treats playback as user-initiated. Show a brief loading state on the button while the URL is fetched.
3. **A real player, not a bare button.** One shared inline player for the capture row: play/pause, elapsed and total time, a draggable progress bar, 15-second skip back, and 1x/1.5x speed. Sized to the app's touch-target rules, using existing tokens.
4. **One player at a time.** A single shared audio instance so starting one capture stops another, with the row's state driven from it (fixes the fire-and-forget path in the recordings tab).
5. **Handle expired audio honestly.** If audio has passed its retention window or was purged, the row shows "Audio no longer stored — summary and reference code kept" instead of a dead play button.

## Verify

- Play a saved capture on desktop and on iPhone: audio starts, time counts up, scrubbing works, pause/resume works.
- Start a second capture while one is playing: the first stops.
- Simulate a missing file: an explicit message appears rather than silence.

## Technical notes

- Files: `src/pages/launch/LaunchMemoryBridge.tsx` (play handler, row player), `src/components/memoryBridge/RecordingsTab.tsx` (same player, replacing the fire-and-forget call), plus a new small `useAudioPlayer` hook holding the single shared `Audio` instance and playback state, and a presentational player component.
- No database, storage or edge-function changes; retention and reference codes are untouched.
