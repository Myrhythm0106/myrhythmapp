# Transcript to keep, memory-friendly reminders, email invites

## What I found
- **Transcript:** older conversation pages can download it as a plain text file. The current Memory Bridge needs one clear "Keep my transcript" download.
- **Reminders:** the add-to-diary screen has Gentle / Steady / Strong reminder levels. They send a timed nudge only. Nothing asks "Done?" and nothing follows up if a reminder is missed.
- **Email invites:** the add-to-diary screen collects up to 5 email addresses, but **no invitation is sent**. The sending service exists and is not connected to that screen.

## 1. The transcript is the keepsake
- Every saved conversation shows **Transcript** first, with key points and actions after it.
- One button, **Download transcript**, with a choice of tidy PDF (title, date, reference code, who was there, key points, full transcript, agreed actions) or Word-friendly text.
- Also **Email it to me**, with the PDF attached.
- Audio stays optional. The written record is always kept and never auto-deleted, in line with the retention rule.

## 2. Reminders known to help memory
These follow recognised memory-support practice (cue at the moment, prepare ahead, confirm, follow up), with no medical claims.
- **Before:** one "get ready" reminder the day before or that morning, showing what to bring and who is coming.
- **At the moment:** a clear reminder that says what, where, who and the first step, not just the title.
- **Done / Snooze / Can't make it:** one tap. Snooze offers 10 min, 1 hour or tomorrow.
- **If not answered:** one gentle follow-up. If it is still unanswered, it goes to the end-of-day list ("Still open"), never a nag.
- **Optional:** Support Circle members with "help with my day" permission can also get the reminder for important items. Off by default and set per item.
- Delivered through the app, email, and the phone calendar file (.ics alarms), so the phone's own alerts fire even when the app is closed.
- Strong stays the suggested default for appointments; plain wording and large buttons.

## 3. Invite people by email when creating a meeting or reminder
- In "Add to diary", type an email, tap Add, then Save. Each person gets a proper invitation with **Add to calendar** (.ics) and **Accept / Decline** links.
- Replies show beside the item (Accepted, Declined, No reply).
- When you change or delete the item, invitees get an update or cancellation, with one calm confirmation first.
- Works the same from conversation actions ("Add to diary + invite").

## Technical details
- Connect `LaunchAddEventModal` → `send-event-invitation` (Resend + `_shared/ics.ts`) after the event insert. Store invitees with status and reuse `rsvp-response`. Send update/cancel emails on edit/delete.
- Add a transcript PDF export (client-side jsPDF) on the current Memory Bridge record view, with an emailed copy through `send-email`.
- Extend `send-scheduled-reminders`/`send-action-reminders` with prep, at-time and single follow-up stages. Add a `reminder_status` (done/snoozed/missed) on events, a circle-copy flag, and VALARMs in .ics.
- Email delivery depends on the sender domain being set up; this was the earlier sign-in email issue and must be confirmed first.
- Tests: reminder stage schedule (prep, at-time, one follow-up only), invite limit of 5, and valid emails only.
