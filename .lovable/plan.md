# Send my actions to Google, Outlook, Apple — no sign-in needed

Right now, an action only lands in an outside calendar if someone else is invited by email. Your own dated actions stay inside MyRhythm unless you connect a Google account, and that connection can't work yet because the Google and Microsoft registrations haven't been set up.

This plan makes every dated action reach any calendar today, with nothing to register and no cost.

## What you'll be able to do

**1. "Add to my calendar" on any action**
One tap on an action offers three routes:
- **Google Calendar** — opens Google with the action pre-filled, one click to save
- **Outlook** — opens Outlook Web with the action pre-filled
- **Apple Calendar / other** — downloads the standard invite file, which iPhone, Mac, Apple Calendar, Fastmail and work calendars all open

**2. Email it to myself**
Sends the action as a real invitation to your own inbox, with Yes / No buttons. Useful on a phone where downloads are awkward: open the email, tap accept, it's in your diary.

**3. A subscribe link for my whole plan**
One private MyRhythm link you paste into Google, Outlook or Apple Calendar once. From then on, every dated action and reminder appears there automatically and updates itself — you never have to add anything again. The link lives in Settings with copy buttons and short "how to paste this in" steps for each of the three.

**4. Send my week**
On the calendar page, one button sends everything dated in the next seven days to your chosen calendar in a single go.

## What stays the same

- Timing suggestions stay advisory — nothing is blocked or moved for you.
- Inviting other people works exactly as it does now.
- No new sign-ins, no accounts, no fees. Signing in to Google or Outlook for automatic two-way sync stays a later option; that plumbing already exists in the app and only needs the Google and Microsoft registrations completed.

## Where it appears

- Each row of My Next Step Summary
- The review step before an action reaches the diary
- The event detail on the calendar page
- Settings — the subscribe link and the pasting steps

## Technical notes

- Extend `supabase/functions/_shared/ics.ts` with a `METHOD:PUBLISH`, attendee-free variant for self-add, reusing the existing timezone-correct `toUtcInstant` so times don't shift.
- New shared client helper `src/launch/calendar/externalCalendarLinks.ts`: builds the Google `render?action=TEMPLATE` URL, the Outlook `deeplink/compose` URL and a blob-download `.ics`, all from one action record (title, date, time, duration, reference code, source link). Replaces the ad-hoc builders in `src/utils/ics.ts` for launch surfaces; leave that legacy file untouched.
- New shared component `AddToCalendarMenu.tsx` (Google / Outlook / Apple file / Email to me), mounted in the actions table, review step and calendar event detail.
- "Email to me" reuses `send-event-invitation` with the signed-in user as the sole attendee — no new function, `RESEND_API_KEY` already configured.
- New public edge function `calendar-feed` (`verify_jwt = false`): takes an opaque per-user token, returns a `text/calendar` `VCALENDAR` of dated `calendar_events` and `extracted_actions` for the next 180 days, with `X-WR-CALNAME: MyRhythm` and stable per-item `UID`s so updates replace rather than duplicate. Reuses the folding and escaping helpers already in `_shared/ics.ts`.
- Migration: `calendar_feed_tokens` (`user_id`, `token`, `created_at`, `revoked_at`), with grants to `service_role`, RLS enabled, and a `SELECT` policy for the owning user so Settings can show and regenerate the link. The feed function reads it with the service-role client only.
- `calendar-push-upcoming` already handles connected Google and Outlook accounts; leave it as the later route and surface it in Settings as "coming when the Google/Microsoft setup is done".
- Add "external calendar delivery" to `roadmap.md`, and update `docs/app-proof-checklist.md` so the Google/Outlook credential item is no longer a blocker for founders testing.
