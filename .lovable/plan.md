# Notes, archive-on-completion, and a reminder ladder for next steps

## 1. Notes and encouragement (`item_notes`)

One thread component, two places it can attach:

- **On a single next step** — my own progress updates ("rescheduled, waiting on the clinic") and short encouragement from the circle.
- **On a whole recording** — context that isn't tied to one action.

Each note records who wrote it, whether it's a **note** or an **encouragement**, and when it was read (so a row can show an unread badge).

Who can do what:

- Access is **per item, granted by me**. Being in my Support Circle is not enough — a member sees a thread only on the specific next step or capture I've given them access to (they're a watcher / looped in on it) and their circle status is **active**.
- Granting is one tap from the row: "Loop someone in" picks from my circle, and I can revoke that access at any time, which immediately hides the thread from them.
- A permitted member can read the thread and add notes or encouragement on that item only, and can delete **only their own** note.
- I keep full control of everything on my own items — read, add, delete any note, and see who has access.
- "Send encouragement" quick-tap offers a few kind one-liners so a family member doesn't have to compose anything.


## 2. Next steps: archive only when completed

- A step that is **completed** is archived — it leaves the working list after a short Undo window.
- Anything else **stays open** until it is explicitly **Closed** (closed also archives it). Overdue does not archive; it stays visible and keeps chasing.
- My Next Step Summary gets a filter: **Open** (default) / **Archived** / **All**, with counts.
- Archived rows keep everything — dates, priority, notes thread, which capture they came from — and are searchable.
- One-tap **Restore** returns an archived step to the open list with its dates intact.
- Nothing is ever deleted by archiving.

## 3. Reminder ladder around the due date

Each next step can carry reminders on a fixed ladder, chosen per step (and defaulted by priority):

```text
before due:   7 days · 5 days · 3 days · 1 day · due now
after due:    1 day late · 3 days late · 5 days late · 7 days late
```

- Defaults, so nothing has to be configured: **Gentle** = 1 day + due now; **Steady** = 3, 1, due now, 1 late; **Strong** = the full ladder. Same Gentle/Steady/Strong wording already used on calendar events.
- I can tick or untick any rung on a step without leaving the table.
- Reminders stop the moment the step is completed or closed — no chasing a finished item.
- Late reminders carry a softer line ("still open — want to move the date?") with one-tap **Reschedule** or **Mark done**, never a scolding.
- Delivery uses whatever is already granted: in-app banner always, device push where notification permission exists.
- Support Circle members set as watchers on that step see the same overdue signal in their view, so encouragement can land at the right moment.

## 4. Recordings: audio dies at 30 days, everything else survives

- Recordings gain an **audio deleted on** marker, so the UI can say "Audio deleted after 30 days" where the player was.
- The link from a capture to its audio no longer deletes the capture. When audio is permanently removed, the **transcript, next steps and notes survive**.
- The 30-day permanent deletion of the audio file itself is unchanged — that promise stays, with the day-25 and day-29 warnings and a Download action to keep a personal copy.

## Technical notes

- **Migration** (single): create `public.item_notes` (`owner_user_id`, `target_type` = `action` | `recording`, `target_id`, `author_user_id`, `author_name`, `body`, `kind` = `note` | `encouragement`, `read_at`, timestamps) with grants for `authenticated`/`service_role`, RLS (owner full access; active circle members read all and insert/delete only their own via `get_current_user_email()`), an index on (`target_type`, `target_id`, `created_at desc`), and the standard `updated_at` trigger.
- Same migration adds `archived_at` to `extracted_actions` (+ index on `user_id, archived_at`), `audio_deleted_at` to `voice_recordings`, and re-points `meeting_recordings.recording_id` to `ON DELETE SET NULL`. `cleanup_expired_voice_recordings` is rewritten to delete only the audio row so the cascade can no longer reach the text.
- Reminders: new `action_reminders` rows (`action_id`, `offset_days` signed — negative before due, positive after, `0` = due now, `sent_at`) generated from the chosen preset against `end_date`/`scheduled_date`; a scheduled function sweeps due rungs, writes an in-app notification and pushes where a token exists, and skips any action whose status is completed/closed.
- UI: shared `ItemNotesThread` (used by a drawer from `ActionsTableView` rows and from each recording row), a `ReminderLadderPicker` in the row's edit surface, and an Open/Archived/All segmented filter above the table; list queries default to `archived_at is null`.
