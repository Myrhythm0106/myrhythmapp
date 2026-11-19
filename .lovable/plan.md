# Undo a batch of scheduled steps, safely with other people involved

## What I get
- After "Put my steps in my diary" (on the next-steps page, and wherever the batch runs), a calm panel appears: **"5 steps added to my diary · 3 people will be invited"** with a large **Undo all** button. Each step is listed with its time and a small Undo on its own line.
- The same Undo all also appears in a toast, so it is never more than one tap away.
- Undo removes the diary entries, puts every step back to "waiting for a time", and clears the reminders that were created. Nothing else changes: the conversation, the reference codes and the summary all stay.

## What if other people are invited (Support Circle or external guests)?
**1. Invites wait 2 minutes before sending.**
- When a batch includes people, their invitations wait for a short undo window. The panel shows "Invites send in 1:45" with two buttons, **Send now** and **Undo all**.
- If I undo inside the window, nobody ever hears about it. There is no awkward "sorry, ignore that" email.
- If I leave the app, the invites still go out on time, so nothing is lost.

**2. If I undo after invites have gone out:**
- One calm question: **"Let the 3 people know it's off?"** with Yes, let them know (the default) and No, I'll tell them myself.
- Yes sends a short, professional cancellation, for example "Annabel has taken 'Send report to Sam' off her diary for Tue 10:30." It includes a calendar cancel, so the item disappears from their diary too.
- Support Circle members who were only watching get a quiet one-line notice, never an alarm.

**3. Who is external is always visible.**
- In the batch panel, external guests are marked "Guest" next to Support Circle names, so I can see exactly who will get an email before it goes.

## Edge cases handled
- Undo works for the whole batch, or for one step at a time.
- If I edited a step after it was scheduled, Undo all still removes it, and the toast tells me.
- If a cancellation email fails, I see "Couldn't reach jo@... — I'll keep trying" rather than silence.

## Checks
- Tests for the undo rules: within the window nobody is notified; after the window, cancellation goes only to people actually invited; watchers get a notice only; the steps go back to waiting.
- An end-to-end run with a test account and one external guest email.

## Technical details
- New `src/launch/scheduling/batchUndo.ts`: a pure function `planUndo(batch, now)` that decides delete-only vs cancel-and-notify for each person (tested), plus `undoBatch(batchId)`, which deletes `calendar_events`, `event_reminders` and `event_invitations` rows and resets `extracted_actions` (reusing the `undoCommit` logic).
- `scheduleExtractedActions` returns a `batchId` and stops sending invites immediately. Invitation sends are queued as `event_invitations` rows with `send_after = now() + 2 min` and `status = 'queued'`.
- The `send-event-invitation` edge function gains a `mode: 'invite' | 'cancel'` (cancel sends an ICS file with METHOD:CANCEL plus a short email) and a sweep for queued rows past `send_after`. The client calls it on Send now or when the window ends; a scheduled sweep covers people who closed the app.
- Migration: add `send_after timestamptz`, `status text default 'sent'`, `batch_id uuid` and `cancelled_at timestamptz` to `event_invitations`; add `batch_id uuid` to `calendar_events`. Existing RLS (owner-only) stays as it is, and no new tables are needed.
- New presentation part `BatchScheduledPanel` used on the next-steps page (LaunchCommit) and in Memory Bridge results.
