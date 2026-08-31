# Never-Lose-A-Conversation: memory-safe capture

The problem: someone with memory challenges may forget to start recording, forget to stop it, or forget to save it. The fix is to make every one of those three moments survivable without the user remembering anything.

Guiding rule: no always-on listening, no hidden recording. Everything is consented, visible, and interruptible — but nothing depends on the user remembering.

## 1. Forgetting to START — the app offers, the user just says yes

- **Calendar-armed capture.** When a calendar event marked Meeting or Appointment is about to begin, a full-screen, high-contrast prompt appears: "Your appointment with X starts now. Shall I listen and take the notes?" One big Yes, one Not this time. Auto-dismisses if untouched.
- **Arrive-and-arm.** If the user opens the app during a scheduled meeting window and hasn't started capture, Home leads with the same single prompt instead of the usual welcome.
- **Late start is still a save.** If capture starts 20 minutes into a meeting, the card is stamped "Started part-way through" so the user is never made to feel they failed.
- **Companion start.** A Support Circle member with permission can trigger "Start capture" on the user's device (a push prompt the user simply accepts). Useful when a family member is in the room at the appointment.

## 2. Forgetting to STOP — it ends itself, safely

- **Quiet-end detection.** After a sustained stretch of silence or non-speech (default 10 minutes), capture finishes on its own and saves. A short "still going?" chime with a Keep going button plays first.
- **Calendar-aware end.** Capture wraps up shortly after the scheduled event's end time, with the same grace prompt.
- **Hard ceiling.** The tier allowance (Free 20m / Regular 120m / Founding 240m per recording) remains the outer limit and now ends cleanly with a save rather than a cut-off.
- **Leaving the room.** If the device is locked or the app is backgrounded for a long stretch with no audio activity, capture closes and saves rather than draining battery.

## 3. Forgetting to SAVE — saving stops being a decision

- **Continuous safe-keeping.** Audio is written to the device in short segments while recording, so a crash, flat battery, or accidental close never loses what was already said.
- **Auto-finish.** Whenever capture ends by any route, the recording is saved and queued for write-up automatically. There is no unsaved state to forget.
- **Retention gate becomes non-blocking.** The "How long shall I keep this?" choice no longer holds the file hostage: the default privacy mode from Settings is applied immediately, and the card shows a friendly "You can change this" line for a few days.
- **Unfinished capture rescue.** On next open, any interrupted capture surfaces as a single card: "I found a conversation from Tuesday afternoon that didn't finish saving. Shall I write it up?"

## 4. Reassurance while it runs

- A persistent, unmistakable capture banner (timer + live level bar) on every screen, so the user always knows the state without remembering it.
- One-tap Stop and write up from the banner — no hunting for the Memory Bridge screen.
- A short spoken/on-screen confirmation at the end: "Saved. Your write-up will be ready shortly."

## Settings (three choices, no more)

Under Memory Bridge settings, a single "Help me remember to capture" section:
1. Ask me when a meeting starts (on by default)
2. Finish on its own after quiet time (on by default, adjustable 5 / 10 / 20 minutes)
3. Let my Support Circle start a capture for me (off by default)

## Technical notes

- Extend `useVoiceRecorder` / `src/hooks/voiceRecording` with: `MediaRecorder` timeslice chunking, chunk persistence to IndexedDB (the `idb` path already used for offline saves), and a resumable session record so a reload can rejoin or finalise.
- Silence detection via the existing `AnalyserNode` used by `MicLevelMeter` — rolling RMS below a threshold for N seconds triggers the grace prompt, then finalise.
- Calendar arming reads upcoming `calendar_events` rows client-side (no new table); a lightweight `capture_prompts_dismissed` flag in local state prevents nagging.
- Recovery UI extends `src/utils/pendingRecording.ts` and the existing recovery path in `LaunchMemoryBridge.tsx` into a visible card rather than a silent restore.
- New user setting columns on `user_schedule_preferences` (or a small `capture_preferences` block) for the three toggles plus quiet-end minutes.
- Companion start requires a cross-device notification to the owner's device; reuses `cross_device_notifications`. The owner must accept — no remote recording without an on-device tap.
- Wake Lock API while capturing on mobile, with graceful fallback.

## Out of scope

- No always-on ambient listening, no background recording without an explicit visible session, no recording that starts without a tap.
