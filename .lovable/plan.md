# Keep a small record, retire the bulk at 30 days

Short answer first: a file saved to your own computer is **not** reachable by the app. Once it leaves for your hard drive it is yours alone — the app can never read it back unless you upload it again. So "download it and we delete ours" is safe for your privacy and storage, but it means anything we delete is gone from the app forever.

That drives the model below.

## The model: three tiers, only one of them permanent

**Tier 1 — Source card (permanent, tiny)**
A few hundred bytes per conversation, kept for as long as you keep the account:
- Title, date, length, participants
- A short summary (max ~400 characters)
- Per action: the one-line quote it came from

This is what the calendar's "From Memory Bridge" chip opens. It never expires, and it costs almost nothing to keep — thousands of conversations would still be a few megabytes of text.

**Tier 2 — Full transcript (30 days, then purged)**
The long text. Kept 30 days, then deleted unless you have downloaded it.

**Tier 3 — Audio (30 days, then purged)**
By far the heaviest. Kept 30 days, then the file is removed from storage.

Result: storage stops growing. The only thing that accumulates is Tier 1 text, which is negligible.

## Because deletion is permanent, the download has to be obvious

- Each conversation shows: "Full transcript and audio available for another 12 days" — amber inside the last 5 days.
- One **Download everything** button producing a single file with the transcript, summary, participants and actions, plus a separate audio download.
- A once-a-week gentle prompt on Home when something is inside its final 5 days: "2 conversations expire this week — download them?"
- Confirmation before manual delete, unchanged.

## After expiry

The conversation tile stays, marked "Archived — summary kept". The summary, the actions and the calendar link all still work. Playback and full transcript show a short line explaining they were retired at 30 days.

## Settings

One control: how long full transcripts and audio are kept — 7, 30 or 90 days (30 default), with a line stating the summary card is always kept and never expires.

## Technical notes

- Add `summary_card` (jsonb, ~small) to `meeting_recordings`; populate at extraction time from the AI output. This is the permanent record.
- Rewrite `cleanup_expired_voice_recordings()`: no row deletes. Set `audio_deleted_at`, null `file_path`, and null the long `transcription` / `transcript` fields for expired rows where `legal_retention_required = false`.
- A scheduled edge function `purge-expired-media` removes the storage objects for those paths (service-role, bounded batch per run, marks rows as it goes).
- Per-action `transcript_excerpt` already exists on `extracted_actions` and is retained — that is what preserves the action-to-source link after purge.
- UI: countdown from `expires_at`; archived state keyed off `audio_deleted_at`; download bundles the transcript client-side before it expires.
