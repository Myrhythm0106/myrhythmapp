# Make invitations land in the other person's calendar, with Accept / Decline

Today, when you schedule a step and loop someone in, they get an email with a calendar file attached. It adds the event to their calendar if they open the file — but there are no Accept / Decline buttons, the time can be wrong, and you never find out whether they said yes.

This plan turns those emails into proper calendar invitations that Google Calendar, Outlook, Apple Calendar and most others recognise, with RSVP buttons and a reply that comes back into MyRhythm.

## What's happening now (checked in the code)

- The invite email attaches a calendar file, but it lists no attendees. Without an attendee line matching the recipient, Gmail and Outlook treat it as "add this to my calendar", not "you're invited — reply".
- The date and time are written as if they were UTC. Someone in the UK in summer sees the step an hour out; anyone further afield sees it further out.
- Every invitation is 30 minutes long, regardless of the finish date or how long the step really takes.
- The attachment is sent as a plain file rather than as a calendar request, which is the other reason clients don't offer RSVP buttons.
- Invitation rows are created in the database when a step is scheduled, but nothing ever updates them — so a reply has nowhere to land.
- The "Who's involved" emails (Responsible / Accountable / Consulted / Informed) carry no calendar file at all.

## What I'll build

### 1. A real invitation, not just a file
Add each person as a named attendee on the invitation, marked as needing a reply, with you as the organiser. Send it as a calendar request so Gmail, Outlook and Apple show the familiar **Yes / No / Maybe** buttons directly in the email.

### 2. Correct time, correct length
Carry your timezone with the invitation so the time shows correctly wherever the person is. Use the step's own length where one is set, and fall back to a sensible default otherwise. Where a step has a finish date, that goes into the invitation too.

### 3. Their answer comes back to you
When someone replies, their answer is recorded against the step, so the Next Step Summary and the calendar entry show "Accepted", "Declined" or "No reply yet" next to each person. Two ways in, and I'll build both:
- The reply email their calendar sends is received and read automatically.
- A plain **Yes / No** link in the email body for anyone whose email client doesn't do RSVP, which records the answer in one tap without needing a MyRhythm account.

### 4. "Who's involved" emails get the invitation too
Anyone marked Responsible or Accountable receives the same calendar invitation with the step's dates, so it lands in their diary rather than only in their inbox. Consulted and Informed keep the lighter "for your awareness" note.

### 5. Native Google / Outlook invites when you've connected yours
If you've connected your own Google or Outlook calendar in Settings, the event is created there with the attendees attached, so the invitation goes out through Google or Microsoft itself — the most reliable route of all. Email invitations stay as the fallback for everyone else.

## What you'll see

- Loop someone in when scheduling a step, and they get an email showing **Yes / No / Maybe**.
- Accepting puts the step in their Google, Outlook or Apple calendar at the right time, with the right duration.
- Back in MyRhythm, each person on the step shows their answer, and you get a quiet note when someone declines.

## Technical notes

- `supabase/functions/send-event-invitation/index.ts`: add `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE`, `ORGANIZER` set to the user, `VTIMEZONE` with a `TZID`-qualified `DTSTART`/`DTEND`, `SEQUENCE`, stable per-event `UID` (stored on the event so updates and cancellations reuse it), and send with `content_type: 'text/calendar; method=REQUEST; charset=utf-8'`.
- Reuse that ICS builder from `send-action-raci` rather than duplicating it — move it to `supabase/functions/_shared/ics.ts`.
- New public edge function `rsvp-response` handling both the one-tap link (signed token, no auth) and inbound `METHOD:REPLY` parsing, writing `status` and `responded_at` on `event_invitations`.
- Migration: add `ics_uid` and `sequence` to `calendar_events`; add `responded_at` and a token column to `event_invitations` if not already present.
- `commitActions.ts`: pass `timeZone` (from `Intl.DateTimeFormat().resolvedOptions()`), `endDate`, and duration through to the invitation call, and surface RSVP state in the actions table.
- Google/Outlook path: extend `create-google-calendar-event` with `attendees` and `sendUpdates: 'all'`, and the Outlook equivalent, invoked only when an integration exists.
