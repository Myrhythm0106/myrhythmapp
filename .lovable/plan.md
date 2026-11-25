# Sign-up testing, executive Home and a complete induction

## 1. Real sign-up and payment test on phone, desktop and iPad
- Create a fresh test account (a new disposable address I generate, so your own email is untouched) and walk Get Started -> card -> landing page at three sizes: phone (393px), iPad (820x1180 and landscape), desktop (1440px).
- Card step uses Stripe test mode with the test card 4242 4242 4242 4242 (no real money).
- At each step, record: screenshot, any error, tap count, time taken, and anything cut off or hard to tap.
- Fix every issue found (layout, wording, broken redirects, Stripe return, slow steps).
- Confirm and report exactly where a new person lands after the card step (intended: Home with first-recording welcome) and after their next Log In.
- Delete the test accounts afterwards.

## 2. Executive Home dashboard (consultancy standard)
Rebuild Home as a calm, board-level briefing, not a student page:
- **Top band:** date, greeting, one-line "Today at a glance" (meetings, priorities, open commitments) as three clear figures.
- **Left, main column:** Today's 3 priorities as crisp rows with owner, time and status chip; tap opens the existing detail sheet to edit against the original record.
- **Right column (desktop/iPad):** Next meeting card with one-tap Record; compact week strip with Yesterday/Tomorrow arrows; Follow-through tile (done this week vs open, simple bar).
- **Lower row:** My Vision in ACTion (curved card, linked steps), Support Circle status (who can see what, off switch respected), Still open.
- Phone: same content stacked, priorities first, extras folded.
- Visual language: deep navy and warm neutral surfaces, one orange action colour, fine dividers, generous white space, refined serif headings with clean sans figures; no illustrations, no clutter. Max 3 actions visible at once.
- Dashboard / List view toggle kept.

## 3. Complete induction
One gentle, skippable induction that starts on first arrival at Home and can be replayed from Help:
1. Welcome (30 seconds): what MyRhythm does for me, in your voice.
2. Who it's for me (one tap, optional).
3. Guide me or Explore my way.
4. Guided first recording (or a 20-second practice sample if not in a conversation now).
5. See my summary and next steps; accept one into my diary.
6. Meet my reminders (Done / Snooze shown on that step).
7. Invite someone to my Support Circle (optional, skip is equal weight).
8. Free snapshot questions offered last; finish with "You're set up" and what happens tomorrow.
- Progress dots, Back and Skip on every step, resumes where left off, never blocks the app.
- Audit and retire the existing scattered pieces (first welcome, tour, guided start, first-run overlay, Make it mine) so there is only one induction.

## Technical details
- Playwright scripts under /tmp/browser for the three viewports; Stripe test card in hosted checkout.
- Home: refactor `QuietHome.tsx` into dashboard sections reusing `topThree`, `PriorityDetailSheet`, reminders, vision and circle data; no data model changes.
- Induction: one step engine driven by the existing user-scoped device-local walkthrough store; replaces `FirstRunOverlay`, `LaunchAppTour`, `LaunchGuidedStart`, `MakeItMine` entry points.
- Tests for induction step order/resume and post-card landing route.
