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


## Traceability: every action carries a reference

So a downloaded transcript, a calendar entry and a Next Step row can always be matched back together, each conversation and each action gets a short human-readable reference.

- **Conversation reference**: `MB-260825-A7` — prefix, date of capture, two characters. Shown on the conversation tile.
- **Action reference**: `MB-260825-A7-03` — the conversation reference plus the action's number in that conversation.

Where the reference appears:
- On the conversation tile and the summary card.
- In the Next Step Summary table, as a quiet monospace column (tap to copy).
- On the calendar entry, next to the "From Memory Bridge" chip.
- In the downloaded bundle: in the filename (`MB-260825-A7.txt`), in the file header, and against each action listed inside it.
- In reminder emails and Support Circle notices for that action.

What it buys you: after the transcript and audio are gone from the app, the archived tile still shows `MB-260825-A7`, and the downloaded file on your own drive carries the same code — so any action on the calendar or in the Next Step log can be matched to its source document by eye, with no lookup needed. A search box on Memory Bridge accepts a reference and jumps straight to the conversation or action.

## After expiry

The conversation tile stays, marked "Archived — summary kept", and keeps its reference. The summary, the actions and the calendar link all still work. Playback and full transcript show a short line explaining they were retired at 30 days, alongside the reference to look up in your own download.


## Settings

One control: how long full transcripts and audio are kept — 7, 30 or 90 days (30 default), with a line stating the summary card is always kept and never expires.

## GDPR — yes, squarely, and it shapes the build

Recordings of conversations about someone's recovery are **special category data** (health) under UK GDPR Article 9, and they capture third parties too — the clinician, the family member in the room. That raises the bar, and the design above already leans the right way (data minimisation, storage limitation). What the build must add:

**Lawful basis and consent**
- Article 9 requires **explicit consent** for health data. A one-time, clearly worded consent at first capture — separate from the terms tick — recording what is stored, for how long, and that they can withdraw. Versioned, with the timestamp stored, so consent is provable.
- A short in-recorder line reminding the person to tell others in the room they are recording, and a "Consent noted" tick on the capture. This covers the third-party angle honestly without turning it into a legal form.

**Storage limitation (Article 5(1)(e))**
- The 30-day purge is now a documented retention rule, not an implementation detail: it goes in a public retention schedule and in the privacy notice. The permanent tier is limited to the minimum needed to keep the action-to-source link meaningful.

**Rights (Articles 15, 17, 20)**
- Export already exists (`gdprExport.ts`) — extend it to include the summary cards and any surviving transcripts, in a machine-readable form.
- **Delete my account and everything in it** must be a real, self-service action: purges rows, storage objects and derived records, and confirms in writing. Add it to Settings.
- Rectification is covered by the existing transcript editing.

**Processors and transfers**
- List every processor touching this data — Supabase (hosting/storage), the transcription provider, the AI provider used for extraction, the email provider — with the data each receives, and confirm a Data Processing Agreement and appropriate transfer mechanism (UK IDTA / SCCs) for each. Recorded in `docs/`, not in code.
- Confirm no recording content is used for model training by any provider.

**Accountability**
- A **DPIA** — this is high-risk processing (health data, potentially vulnerable people, recordings), so a written DPIA is expected rather than optional. Draft it as `docs/dpia.md`.
- A Record of Processing Activities, a breach procedure with the 72-hour notification path, and a privacy notice written in plain language.
- The research layer is already compliant by design (opt-in, pseudonymised, k=20) per the existing research charter — cross-reference rather than duplicate.

This is a build-and-document plan, not legal advice; before taking paying users or approaching rehab centres it is worth a short review by a data protection adviser, and rehab partners will ask for the DPIA and the retention schedule by name.



## Technical notes

- Add `summary_card` (jsonb, ~small) to `meeting_recordings`; populate at extraction time from the AI output. This is the permanent record.
- Rewrite `cleanup_expired_voice_recordings()`: no row deletes. Set `audio_deleted_at`, null `file_path`, and null the long `transcription` / `transcript` fields for expired rows where `legal_retention_required = false`.
- A scheduled edge function `purge-expired-media` removes the storage objects for those paths (service-role, bounded batch per run, marks rows as it goes).
- Per-action `transcript_excerpt` already exists on `extracted_actions` and is retained — that is what preserves the action-to-source link after purge.
- UI: countdown from `expires_at`; archived state keyed off `audio_deleted_at`; download bundles the transcript client-side before it expires.
- GDPR: `capture_consent` record (version, timestamp, scope) written at first capture; account-deletion routine as a service-role edge function that removes rows and storage objects across all user-owned tables; `docs/dpia.md`, `docs/retention-schedule.md` and an updated privacy notice.
- Traceability: add `ref_code` (text, unique) to `meeting_recordings`, generated on insert from the capture date plus a short random suffix; add `ref_code` to `extracted_actions` as `<meeting ref>-<zero-padded sequence>`, assigned at extraction time. Calendar entries read the action's `ref_code` through the existing `extracted_action_id` link, so no third column is needed. Reference search resolves either shape with a prefix match.


