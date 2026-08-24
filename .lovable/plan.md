# Memory Bridge: working playback + a notes & encouragement thread

## 1. The Play button

What you should expect today: tapping Play fetches a temporary link to the audio file and starts invisible background playback — there is no player, no progress bar, no loading state, and nothing to scrub or stop. If the browser blocks playback or the file format isn't supported (common with iPhone recordings), the failure is swallowed and you simply see nothing happen.

What to build instead — a real inline player on each recording row:

- Play/pause button that shows a spinner while the link loads, then a live progress bar with elapsed / total time.
- Scrub to any point, skip back 15s, and a speed control (1x / 1.25x / 1.5x / 2x) — useful for replaying a long consultation.
- Only one recording plays at a time; starting another stops the first.
- Real error messages instead of silence: "Couldn't load this recording" (link failed), "Your browser can't play this file" (unsupported format), plus a Download option as a fallback.
- Same player used in the launch Memory Bridge screen and the Recordings tab, sized for phone taps.

## 2. Notes and Support Circle encouragement

Two threads, one shared component:

- **On each next step** — open a notes panel from a row in My Next Step Summary. Progress updates from me ("rescheduled, waiting on the clinic") and short encouragement from the circle.
- **On each capture** — one thread on the recording itself, for context that isn't tied to a single action.

Behaviour:

- Anyone in my Support Circle who already has view access to that item can post; everyone sees who wrote what and when.
- My own notes and their notes are visually distinguished (mine plain, theirs marked as from the circle, with a small encouragement tag).
- Unread count badge on the row so I notice a new message without hunting.
- I can delete anything on my own items; a member can delete only their own note.
- A "Send encouragement" quick-tap with a few kind one-liners, so a family member doesn't have to compose a message.

## 3. The original rule stands: audio is permanently deleted at day 30

This is the promise already written in Settings and the docs, and the plan keeps it exactly:

- **Audio is destroyed 30 days after capture.** Permanent — no archive, no recycle bin, no way for me or anyone else to get it back.
- **Download is the only way to keep it.** Every recording row gets a **Download** action next to Play, so I can save my own copy to the phone or laptop before the deadline.
- **Two warnings, deliberately close to the deadline** so they land as urgent, not as background noise:
  - **Day 25** — "This recording is deleted in 5 days" with a one-tap Download.
  - **Day 29** — final amber notice, "Deleted tomorrow", again with Download.
- Each capture also carries a quiet countdown line ("Audio deleted on 23 Sept") so the date is never a surprise, plus a one-time explainer the first time I record.
- **Whether I download or not, nothing else changes.** Downloading is purely a personal copy — it does not extend the audio's life, and skipping it does not touch anything else.

## 4. What survives the deletion — and what doesn't

- **Deleted for good at day 30:** the audio file itself.
- **Kept:** the transcript, my next steps, their dates, and the notes thread. These are what my plan actually runs on, so losing them would break the schedule rather than protect my privacy.
- A capture whose audio has gone shows "Audio deleted after 30 days" where the player was, with the transcript and thread intact.
- Deleting a capture myself still removes everything belonging to it, immediately.

**Optional tidy-up after the audio goes.** Once a capture's audio is deleted, I'm offered a choice on that capture — never automatic, never silent:

- **Export first**: download its next steps as Excel (.xlsx), a Google-Sheets-ready file, or a PDF summary. Same export engine already used for the Capture Brief.
- **Then, if I want, clear the next steps** for that capture — a single confirm, with the export offered in the same dialog so nothing is lost by accident.
- If I don't act, nothing happens: next steps stay exactly as they are, and anything already in my calendar stays scheduled.




## 5. Closed actions are archived, not gone

- Marking a next step done or cancelled moves it out of the active list into an **Archive** after a short "Undo" window, so the working list stays short.
- My Next Step Summary gets a filter: Active (default) / Archived / All, with a count.
- Archived rows keep everything — dates, priority, notes thread, which capture they came from — and are searchable.
- One-tap **Restore** puts an archived step back into the active list with its dates intact.
- Archived items still count towards streaks and celebration totals; nothing is deleted.

## Technical notes

- Playback: shared `RecordingPlayer` component wrapping an `HTMLAudioElement`; `await audio.play()` so autoplay rejections are caught and surfaced; signed URL refetched on expiry; single global playing-id so players don't overlap. Download uses the same signed URL with a `download` attribute / blob save on iOS.
- Notes: one new `item_notes` table keyed by (`target_type` = action | recording, `target_id`), with `owner_user_id`, `author_user_id`, `author_member_id`, `body`, `kind` (note | encouragement), and read tracking. RLS: owner full access; circle members with active status and view access to the target may read all and insert/delete their own. Grants for `authenticated` and `service_role`. Existing `memory_bridge_comments` and `support_member_action_notes` rows get read into the new thread view rather than being abandoned.
- Retention: keep the existing `cleanup_expired_voice_recordings` job and the 30-day `expires_at`, but stop it taking the text with it — drop the cascade from `voice_recordings` to `meeting_recordings` (null the audio link instead), so the job removes only the audio row and its storage object. Add an `audio_deleted_at` marker the UI reads. Day-25 and day-29 warnings fire from the same expiry date (in-app banner + push where permission is granted); the old day-5 reminder is removed.
- Archive: add `archived_at` (and reuse existing status) on `extracted_actions`; list queries filter `archived_at is null` by default; archiving is a status/timestamp update, never a delete.
- Next-step export: reuse `exportCaptureBriefXlsx` (ExcelJS) for .xlsx / Sheets-ready output and the existing brief PDF exporter for the PDF; both scoped to one capture's next steps. The post-expiry "clear next steps" action is an explicit, confirmed delete only.


