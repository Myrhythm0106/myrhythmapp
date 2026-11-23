# Memory-friendly reminders

## What people will see
Each diary item with reminders on works in four calm steps:

1. **Get ready.** The evening before, or 2 hours before for same-day items, I see what is coming, when, who is invited and my notes, with one "I'm ready" tap.
2. **It's time.** At the start time, a clear card shows what, when, who and the first step, with three large buttons: **Done**, **Snooze** (10 min, 1 hour or tomorrow) and **Can't make it**.
3. **One gentle follow-up.** If I haven't answered 30 minutes later, one soft reminder comes: "Did this happen?", with the same three buttons. Nothing more after that.
4. **Still open.** From 6pm, anything unanswered appears in a short "Still open today" list on Home and in my calendar. Each item offers: Done, Move to tomorrow, or Let it go.

The wording stays warm and never blames. Done counts towards my day. "Can't make it" offers to move the item, with one undo.

## Where the reminders arrive
- In the app: a card at the top of any page while MyRhythm is open.
- By email: get-ready and follow-up messages, each with a Done link. These only send once email sending is fixed.
- On the phone: invitations and calendar downloads include phone alarms, so the phone's own alert fires even when the app is closed.

## Settings
These use the existing Gentle / Steady / Strong choice on each item:
- **Gentle:** "It's time" only.
- **Steady:** get ready plus "It's time".
- **Strong:** get ready, "It's time" and the follow-up.
- **Off:** no reminders.

## Technical details
- Add to `calendar_events`:
  - `reminder_status`: pending, ready, done, snoozed, missed or let_go.
  - `snoozed_until`, `prep_sent_at`, `due_sent_at`, `followup_sent_at`, `responded_at`.
- Add `src/launch/reminders/reminderStages.ts`, a pure function that takes an event, its level and the current time and returns the stage due now: prep, due, follow-up, still open or none. Unit tests cover:
  - stages per level;
  - the follow-up firing exactly once, 30 minutes after the start;
  - snooze moving the "It's time" reminder;
  - still open from 18:00 local time;
  - no reminders when the level is off or the item is done.
- Add a `useReminderEngine` hook in LaunchLayout that checks every minute and shows `ReminderCard` (56px buttons, at most 3 choices) for the stage due now. Answers update the original diary item.
- Add a `StillOpenList` on QuietHome and the calendar Day view. It is folded away when empty.
- Extend `send-scheduled-reminders` to read `calendar_events` and email the prep and follow-up stages using the same stage function. It sends each stage once (stamped columns) and runs on an hourly schedule. Done links use a signed token handled by a small `reminder-respond` function.
- Add VALARMs to the shared calendar-file builder (`_shared/ics.ts`) to match the level.
