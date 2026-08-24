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

## 3. Storage and the 30-day deletion — important

You asked the right question. Right now the automatic clean-up deletes voice recordings after their retention window, and the database is wired so that **deleting a recording also deletes its capture, its extracted next steps, and any comments attached to them.** So today, notes would disappear along with the audio at day 30.

Proposed rule, which matches how the retention promise is meant to work:

- **Audio expires** on schedule (that's the privacy promise, and audio is what takes real space).
- **Text survives**: transcript, next steps, and all notes/encouragement stay. A capture whose audio has expired shows "Audio removed after 30 days" where the player was, with the transcript and thread intact.
- Notes are plain text — a thousand of them is a rounding error next to a single hour of audio, so there is no cost pressure to expire them.
- Deleting a capture yourself still removes everything belonging to it, as now.

## Technical notes

- Playback: shared `RecordingPlayer` component wrapping an `HTMLAudioElement`; `await audio.play()` so autoplay rejections are caught and surfaced; signed URL refetched on expiry; single global playing-id so players don't overlap.
- Notes: one new `item_notes` table keyed by (`target_type` = action | recording, `target_id`), with `owner_user_id`, `author_user_id`, `author_member_id`, `body`, `kind` (note | encouragement), and read tracking. RLS: owner full access; circle members with active status and view access to the target may read all and insert/delete their own. Grants for `authenticated` and `service_role`. Existing `memory_bridge_comments` and `support_member_action_notes` rows get read into the new thread view rather than being abandoned.
- Retention: drop the cascade from `voice_recordings` to `meeting_recordings` (set null on the audio link instead), so the clean-up job removes only the audio row and storage object; add an `audio_expired_at` marker the UI reads.
