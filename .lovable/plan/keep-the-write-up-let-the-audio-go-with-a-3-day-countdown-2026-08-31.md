# Keep the write-up, let the audio go — with a 3-day countdown

## What you asked for

A fourth option in "How long shall I keep this?": **keep the write-up and my steps, delete the audio**. The audio isn't removed silently — you get a short window to download it first, a visible countdown (3 days, 2 days, 1 day, today), and a plain confirmation once it has actually gone.

## The new option

Added to the keep-for prompt and Settings, alongside Light touch / Balanced / Full record:

> **Write-up only**
> Keep my write-up and steps. Delete the audio in 3 days.
> _Audio removed after 3 days · write-up and steps kept_

Choosing it stamps each new recording with an audio-removal date 3 days ahead. The write-up, summary card, steps and reference codes are untouched — permanently.

## The countdown

On every recording that has audio due to go, a calm line shows on the recording card, in the recordings list, and at the top of Memory Bridge when something is within a day:

```text
Audio goes in 3 days   [ Download audio ]   [ Keep it longer ]
Audio goes in 2 days   ...
Audio goes tomorrow    ...
Audio goes today       ...
```

- **Download audio** saves the file to the device and marks the source as downloaded.
- **Keep it longer** pushes the removal out by another 7 days — no limit on how often, so nobody loses something they still need.
- The tone stays reassuring, not alarming: each line carries "Your write-up and steps stay either way."
- If you haven't downloaded it, the last day's line is firmer but still kind, and offers one-tap download.

This is a deliberate, narrow exception to the standard's "avoid countdown language" rule: here the countdown exists because something irreversible is genuinely scheduled, and hiding it would be worse. The exception is written into the standard document.

## Confirmed deletion

When the audio is actually removed, you get a clear, honest confirmation rather than silence:

- The recording card switches to "Audio removed on 3 Sep — write-up and steps kept", with the grey `retired` (or gold `downloaded`) reference dot.
- A one-off notice appears next time you open Memory Bridge: "The audio for MB-260903-K4 has been removed as arranged. Your write-up and steps are still here."
- Playback shows the existing purged-audio state instead of failing.

## Deleting the audio early

Each recording also gets a "Delete the audio now" option. Because it is permanent, it uses the existing Tier 2 confirm dialog: one line, no jargon, offering download first.

## Technical notes

- New privacy mode `writeup_only` on the `privacy_mode` enum; `retention_days_for_mode()` returns 3 days for audio and keeps the write-up indefinitely.
- New column `voice_recordings.audio_expires_at` (the audio clock, separate from the existing whole-record `expires_at`), plus a `audio_hold_count` so "Keep it longer" is auditable. `audio_deleted_at` already exists and is what the confirmation reads from.
- `apply_retention_to_voice_recording()` extended to stamp `audio_expires_at`; `cleanup_expired_voice_recordings()` extended to remove only the storage object when `audio_expires_at` has passed, set `audio_deleted_at`, and leave the row, transcript, summary card and steps intact.
- Files: `src/hooks/usePrivacyMode.ts` (new mode), `src/components/launch/KeepForPrompt.tsx` and `KeepForCard.tsx` (the fourth choice), a new `src/components/memoryBridge/AudioCountdownLine.tsx`, wired into `RecordingsTab.tsx`, `RecordingPlayer.tsx` and `LaunchMemoryBridge.tsx`, plus `src/lib/deleteStandard.ts` for the wording.
- `docs/data-and-deletion-standard.md` updated: new mode in the retention table, and the countdown exception recorded.
- Existing users are unaffected; their current mode stays as it is.
