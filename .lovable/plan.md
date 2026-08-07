# Phone-ready testing pass + assessment upgrade

## 1. Dial: off during onboarding, on once they land on Home

`/launch/user-type` renders the floating quick-action button (`LaunchQuickActions`) directly inside the page, so it shows even though the header wayfinder dial is already hidden pre-account. Remove that floating button from this page.

New rule for the You-Are-Here dial: it appears once the user has finished onboarding and reaches `/launch/home`, and stays visible everywhere in the app from then on. It is hidden on every onboarding step (welcome, sign in/up, user type, assessment, results, payment). The trigger becomes "onboarding complete" rather than the current membership check, so a tester who has been through the steps gets the dial without needing a paid membership.


## 2. Use it on iPhone and Android — today

The app already has a viewport tag, a theme colour and a manifest, but the manifest points at `placeholder.svg` for icons and starts at a deep link, so "Add to Home Screen" gives a blank icon and drops you into the wrong screen.

Home-screen install pass (no app-store build needed):
- Generate proper 192px, 512px and maskable app icons plus an Apple touch icon, and reference them from the manifest and head.
- Fix manifest `start_url` to `/launch/welcome`, keep `display: standalone`, correct name/description to current positioning.
- Add `apple-touch-icon` and status-bar style tags.
- Mobile safety sweep on the onboarding path (welcome → user type → assessment → results → payment): remove the `h-screen overflow-hidden` traps that cut off content on short phone screens, add safe-area padding so the sticky footers clear the iPhone home bar, and confirm every tap target is at least 56px.

Then testing is: open `https://myrhythmapp.com` on the phone, Share → Add to Home Screen (iPhone) or menu → Install app (Android). It runs full screen like an app. A true App Store / Play Store build is a separate later step (Capacitor is already configured for it) and is not needed for your own testing.

## 3. Framework info button

Add a small "What is MYRHYTHM?" info button in the assessment header opening a sheet with: the 8 letters and what each one looks at, one line on why rhythm/energy timing and daily follow-through matter (brain-health-informed, in the spirit of Dr Amen's "your daily habits shape your brain" message), and a plain disclaimer that this is not a diagnosis or medical assessment and MyRhythm does not treat any condition. No clinical claims, no cited outcomes.

## 4. MYRHYTHM letter progress

Replace the plain bar with a MYRHYTHM letter strip across the top: all 8 letters visible, completed ones filled, the current one highlighted, upcoming ones faint. Under it, "M — Mindset · Step 2 of 8" so the letter's meaning is obvious (also covers point 5). The big letter badge already on the question gains its word and a one-line "what this letter is about".

## 5. Retake anytime, results stored

- Every completed assessment is saved as a new row in the existing `assessment_results` table (score, answers, persona, recency, timestamp) rather than only overwriting local storage.
- Results page gets "Retake assessment" plus "See past results" — a simple history list of dated scores so you can compare over time.
- Retaking never destroys an earlier result.
- If signed out, the result stays local and is uploaded on next sign-in.

## 6. Follow-through question

Add a follow-through question to each persona bank under the H (Harness/Habits) area — how often a plan made in the morning actually gets done, with options from "almost always" through "I plan and then it evaporates" — scored into the brain-health score and surfaced in the result as a "follow-through" signal.

## 7 & 9. Processing state after Continue

Clicking Continue on the last question shows a full-screen calm processing state (progress ring, rotating reassuring lines such as "Reading your answers…", "Shaping your rhythm…"), capped at ~6–8 seconds, then reveals the result. Save happens during this window; the button is disabled while it runs so double-tap can't skip it.

## 8. Error handling

Consistent, non-technical error handling on the onboarding path:
- Save failure: keeps your answers locally, shows "We couldn't save this yet — your answers are safe on this device" with Retry.
- Offline: banner plus retry, never a dead end.
- Checkout failure: stays on the page, explains what happened, offers Try again / Use an access code / Continue without paying for now.
- Every error message names one next action; no raw error codes shown.

## 11. "It sent me back to the beginning" after choosing a package

Confirmed cause: registration is currently in bypass mode (`BYPASS_REGISTRATION = true` in `LaunchRegister`), so signing up stores you only in the browser and creates no real Supabase session. `/launch/payment` then asks Supabase for a session, finds none, and bounces you to `/launch/register` — which reads as being thrown back to the start.

Fix:
- Make registration create a real account and session again (email confirmation off for the testing window) so payment, checkout and access codes work.
- Make the payment page never bounce: if there's genuinely no session it shows an inline "Confirm your email/password to continue" panel that returns you to the exact plan you picked.
- Remember the chosen plan across sign-in so nothing is retyped.

## 12. Phone compatibility answer

Yes — it's a web app, so it runs in Safari on iPhone and Chrome on Android now, and after step 2 it installs to the home screen and runs full screen. Native App Store / Play Store distribution needs an Xcode/Android Studio build step later.

## Technical notes

- Files touched: `src/pages/launch/LaunchUserType.tsx`, `LaunchAssessment.tsx`, `LaunchWelcome.tsx`, `LaunchRegister.tsx`, `LaunchPayment.tsx`, `src/data/launchAssessmentBanks.ts`, new `MyRhythmLetterProgress`, `AssessmentFrameworkSheet`, `AssessmentProcessing` components, `index.html`, `public/manifest.webmanifest`, new icon assets.
- Storage: reuse `public.assessment_results` (already RLS-protected, user-scoped); add an index on `user_id, created_at` and confirm grants for the history query.
- No change to scoring maths other than adding the follow-through item's weight.
