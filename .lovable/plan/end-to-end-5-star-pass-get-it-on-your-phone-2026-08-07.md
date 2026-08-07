# End-to-end 5-star pass + get it on your phone

## What I checked

I walked the real code path from landing → sign up → user type → assessment → results → payment → Home → Memory Bridge → Calendar → reminders. Most of it is in place. Three things genuinely break the flow, and a few make it feel less than 5-star.

## Confirmed breaks

**1. After paying, you land on the wrong app.**
The Stripe checkout returns you to `/welcome` (the old legacy welcome page), not `/launch/welcome`. So the moment you finish paying, you fall out of the launch app into a different, older screen. Fix: return to `/launch/welcome?postCheckout=1`, show a short "You're in" confirmation, then a single button through to Home.

**2. The payment page can still throw you out.**
If the session hasn't loaded yet, "Start trial" and "Redeem code" bounce you to `/launch/register`, which reads as being sent back to the beginning. Fix: never navigate away. Wait for auth to settle, and if there is truly no session show an inline "confirm your details to continue" panel that returns you to the exact plan you picked.

**3. Nothing tells you where you go after redeeming a code.**
Redeeming sends you to `/launch/welcome` (results), which is backwards. Fix: after a successful code or checkout, go forward to Home with a welcome moment.

## Flow polish (start to finish)

- **One forward action per screen.** Welcome → user type → assessment → results → plan → Home each get exactly one primary button plus a quiet secondary. No dead ends.
- **Resume where you left off.** If you close the app mid-assessment or mid-payment, reopening returns you to that step instead of the landing page.
- **Signed-in returning user** always lands on Home, never re-runs onboarding.
- **First minute on Home** shows a three-step "start here" card: capture something, commit one action, see it on your calendar. It disappears once done.
- **Errors never dead-end.** Every failure (offline, save failed, checkout failed) shows plain language plus one clear next action and keeps your data on the device.

## Memory Bridge — the bridge working properly

- Recorder: clear states (ready / recording with timer and remaining minutes / processing / done) so you always know what it's doing.
- After a capture, one screen: what was said, the actions found, and a single "Add to my week" button. Loop-in a Support Circle member from the same screen.
- If transcription fails or takes long, show a friendly waiting state with an option to keep the audio and come back — never a spinner that ends in nothing.
- Every action created carries through to Commit → Calendar → Celebrate so the loop closes visibly.

## Results and reminders

- Results page: keep the snapshot, add "Retake" and dated history so you can compare over time.
- Reminders are already sent on a five-minute server schedule — that part works. What's missing on a phone is permission to alert you. Add a one-tap "Turn on reminders on this phone" prompt in Settings and after your first scheduled action, with Gentle / Steady / Strong intensity already supported.
- Add a "Reminders test" button so you can confirm on your own phone within seconds that alerts land.

## Getting it on your phone (today, no app store)

1. On your iPhone, open **https://myrhythmapp.com** in Safari → Share → **Add to Home Screen**.
2. On Android, open the same link in Chrome → menu → **Install app**.
3. It launches full screen with the MyRhythm icon, remembers your sign-in, and behaves like a normal app.

Before that feels 5-star I'll do a phone pass: correct app icon and name on the home screen, safe-area padding so buttons clear the iPhone home bar, no screen that traps scrolling, and every primary button at least 56px tall.

App Store / Play Store distribution is a separate later step and is not needed for your own testing.

## Technical notes

- `supabase/functions/create-checkout/index.ts`: change `success_url` to `${origin}/launch/welcome?postCheckout=1&...`.
- `src/pages/launch/LaunchPayment.tsx`: remove both `navigate('/launch/register')` bounces; gate on auth-loading; inline re-auth panel; redirect target after redeem becomes `/launch/home`.
- `src/pages/launch/LaunchWelcome.tsx`: handle `postCheckout=1` confirmation state.
- New `src/launch/onboarding/resumePoint.ts` for step resume; Home first-run card in `LaunchDashboard.tsx`.
- Notification permission helper + Settings toggle and test send; reuse existing `send-scheduled-reminders` cron (verified running every 5 minutes).
- Memory Bridge state clarity in `LaunchMemoryBridge.tsx` / `LaunchCaptureResult.tsx`; no change to extraction logic.
- Manifest/icon and safe-area sweep across the onboarding and core screens.
