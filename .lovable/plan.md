# Keep the write-up, retire the audio

The link from a calendar entry back to its source only holds value if the source survives. So: the **write-up of a conversation is kept for as long as you keep your account**, and **only the audio expires** at 30 days — unless you have downloaded it first.

## What needs fixing

Today the 30-day clean-up deletes the whole recording record, which takes the transcript and summary with it. That breaks the link from an action back to where it came from. The clean-up must remove the audio file only and leave the write-up intact.

## What you will see

**On each recording in Memory Bridge**
- A quiet line: "Audio available for another 12 days" — turning amber inside the last 5 days.
- A **Download audio** button while the file still exists, so you can keep your own copy.
- After expiry the tile stays, marked "Audio retired — write-up kept", with the transcript, summary and actions all still there.

**The write-up itself**
- Title, date, length, participants, transcript, summary and extracted actions — kept indefinitely.
- **Save write-up** action to download it as a text file, alongside the existing copy/email options.

**From the calendar**
- The "From Memory Bridge" chip keeps working forever, because the conversation record is never removed. If the audio has gone, the source view simply shows the written record.

**In Settings**
- The retention control is relabelled so it clearly governs *audio only*, with a line stating write-ups are never auto-deleted.

## Technical notes

- Rewrite `cleanup_expired_voice_recordings()`: stop the `DELETE`; instead set `audio_deleted_at = now()` and null the `file_path` for expired rows where `legal_retention_required = false`. Storage objects for those paths are removed by a small scheduled edge function (`purge-expired-audio`) that reads due rows, deletes from the `voice-recordings` bucket, then marks them — service-role only.
- Guard the write-up: never delete `voice_recordings` or `meeting_recordings` rows on expiry; only the audio artefact goes.
- UI: expiry countdown derived from `expires_at`; download uses the existing `getRecordingSignedUrl`; audio-retired state keyed off `audio_deleted_at`.
- Playback and re-transcription controls hide once `audio_deleted_at` is set, with a short explanatory line rather than a dead button.
- Manual delete of a recording continues to remove everything, as now.
