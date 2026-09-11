# My Diary, real calendar sync, and a Brain Health tracker

Three build items, then a straight answer on readiness, then the commercial documents refreshed. Nothing new is added to the main navigation beyond one page — everything else lives inside screens that already exist.

## Honest answer first: is this ready for real use by others?

**No — not yet fully ready.** It is ready for a small, hand-held founders group who know they are testing. It is not ready for strangers, clinicians, or paying customers.

What still blocks real-world readiness:

1. **Calendar sync is not live.** The connect buttons and sync code exist, but no Google or Microsoft credentials are configured, so "connect my calendar" currently cannot complete. This plan fixes that, but it needs you to create the Google and Microsoft app registrations — I cannot do that for you.
2. **Payment is in test mode.** No real money can be taken yet.
3. **Recordings have not been proven at length on real phones.** Long captures on iPhone and Android need a live pass before anyone relies on them.
4. **No independent accessibility or security review** has been done on the finished flows.
5. **Support Circle permissions** need one deliberate end-to-end check with two real accounts.

Everything below moves items 1 and 3 forward; 2, 4 and 5 stay on the list for the testing round.

## 1. My Diary — one place where nothing is lost

A new page at `/launch/diary`, reachable from Home and from Memory Bridge.

- One time-ordered list, newest first, of everything that has happened: conversations captured, brain-health results, and completed next steps.
- Each row shows the date in plain words ("Tuesday 8 September"), a one-line title, its reference code, and what kind of entry it is.
- A single search box across titles, write-ups and reference codes.
- Three filters only: All / Conversations / Brain health.
- Tapping a row opens the thing itself — the recording write-up, or the assessment report.
- Empty state says what will appear here, so day one does not look broken.

No new tables. This reads what is already stored: `meeting_recordings`, `voice_recordings`, `assessment_results`, `extracted_actions`.

## 2. Real calendar sync

- **Settings → My calendars** becomes the single home for this: Google, Outlook/Microsoft 365, and **Apple/any other calendar via a subscribe link** (an ICS feed — this is how Apple Calendar, Fastmail and most others connect).
- Connect, show last-synced time, and disconnect. One button each, no wizard.
- Once connected, events from the real calendar appear on the MyRhythm calendar day view and, critically, **the Home window and event suggestions avoid times that are already busy** — a suggested time that clashes is quietly skipped rather than offered.
- Events created in MyRhythm continue to push out to the connected calendar and to invited people.
- If a calendar is not connected, everything behaves exactly as it does today.

**You will need to do one thing:** create a Google Cloud OAuth client and a Microsoft Entra app registration, and give me the client ID and secret for each. I will store them securely. Without those, the buttons stay disabled with an honest "not connected yet" message.

## 3. Brain Health tracker

Added to the existing assessment area (no new nav item) at `/launch/assessment/history`, linked from the Home assessment card:

- Today's score, large and plain, with the one-line meaning.
- A simple line showing every past score by date, so the trend is visible at a glance.
- The eight MYRHYTHM letters with this run's strength and whether each moved up, down, or held since last time.
- "See my answers" reveals the questions and what was chosen on any past run.
- Wording stays non-clinical throughout: this is a self-check, not a diagnosis.

## 4. Recording saved at every level

Confirmed and completed so a capture survives all three failure points:

- Audio is written in short pieces while recording, so a crash or flat battery loses nothing.
- Whenever a capture ends — by tap, by quiet, by time limit, or by the app closing — it saves automatically.
- The write-up and next steps are kept permanently; audio follows the retention choice with the 3-day countdown already built.
- Any unfinished capture is offered back on next open: "I found a conversation that didn't finish saving."

## 5. Weeding out complexity

Removed from the visible app (archived, not deleted) because they do not serve the core promise:

- Brain Games, Feature Store, Analytics, Roadmap, Circle Growth, Science — all moved out of the navigation dial for the testing round.
- The navigation dial keeps only: Home, Capture, Commit, Calibrate, Celebrate, Calendar, Memory Bridge, **Diary**, Assessment, Support Circle, Profile, Settings, Help.

## 6. Documents refreshed

- `docs/myrhythm-one-page-pitch.md` — sales pitch rewritten around "the app that keeps your plan going after the appointment ends", with the diary, calendar sync and tracker as proof.
- `docs/problem-fit-and-market.md` and the investor material — updated with the current build state, the honest readiness position above, and what the founders round will prove.
- `docs/founding-core-value-map.md` — customer value and benefits per feature, in the 4R language (Remove / Reduce / Return / Reconnect).
- **New:** `docs/scenarios-and-pain-points.md` — a conversation kit: eight customer scenarios (brain injury survivor post-discharge, family carer, rehab centre, occupational health lead, ADHD professional, dementia family, high-load executive, student) with the pain in their own words, the moment it bites, what MyRhythm does about it, and an opening line you can use on a call.

## Technical notes

- Diary page: new `src/pages/launch/LaunchDiary.tsx` plus a `useDiaryEntries` hook merging recordings, assessment runs and completed actions client-side; route added in `App.tsx` and `src/launch/routes.ts`.
- Calendar: the `calendar-google-auth` / `calendar-outlook-auth` edge functions already exist and read `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and `OUTLOOK_CLIENT_ID`/`OUTLOOK_CLIENT_SECRET`; these secrets need adding. New lightweight ICS-subscribe path stores a feed URL on `calendar_integrations` and a small edge function polls it. Busy-time awareness reads `external_calendar_events` inside the existing suggestion logic in the productivity-window consumers.
- Brain Health tracker reads `assessment_results` via the existing `listAssessmentRuns()`; no schema change.
- Route trimming is a change to `LAUNCH_ROUTES` visibility flags only — pages remain reachable by direct URL.
