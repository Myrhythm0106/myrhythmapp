# Bring back the daily welcome controls + one-tap recording

## 1. Undo the last change on the daily welcome screen

The dial and microphone come back on the "welcome to your new day" overlay — that was the wrong screen to strip them from. The `DayOpenWelcome` visibility check stops driving the layout.

## 2. Hide them on the sign-in screen instead

On `/launch/signin` (and the other pre-login/onboarding screens: welcome, signup, register, user type, assessment, payment) neither the You-Are-Here dial nor the floating microphone appears. The dial is already hidden there; the microphone dock is not, so it gets the same route rule.

## 3. One-tap recording from the phone itself

The app cannot register a system gesture on its own — no web app can bind iPhone Back Tap or an Android hardware gesture directly. What it *can* do is expose a single, stable "start recording now" entry point that those OS gestures can trigger. So:

- A deep link `myrhythm://record` equivalent: `/launch/capture?start=1` opens the app and begins recording immediately, no extra taps, no menu.
- Add it as a PWA app-shortcut ("Start recording") so a long-press on the MyRhythm home-screen icon starts a recording straight away.
- A new short setup card in Settings, "Tap to record", with copy-and-paste device instructions:
  - **iPhone:** Shortcuts app → new shortcut → Open URL → paste the link → Settings → Accessibility → Touch → Back Tap → Triple Tap → pick the shortcut. Three taps on the back of the phone then starts recording.
  - **Android:** Long-press the MyRhythm icon → drag "Start recording" to the home screen, or add it to Quick Settings/assistant routine using the same link.
  - A "Copy my link" button so nothing has to be typed by hand.

Recording still requires the phone to grant microphone access when the screen opens, so the first run after setup asks once and then remembers.

## Technical notes

- `src/components/launch/LaunchLayout.tsx`: remove `dayOpenWelcomeIsOpen` from `showDial`; gate `<CaptureDock />` on `!ONBOARDING_PATHS.has(location.pathname)` instead of the welcome flag.
- Leave `DayOpenWelcomeContext` in place (harmless) or drop its consumption in the layout only.
- Capture route reads `?start=1` and auto-arms `useVoiceRecorder` on mount, once, guarded so a refresh does not double-start.
- `public/manifest.webmanifest`: add a `shortcuts` entry pointing at `/launch/capture?start=1`.
- New `TapToRecordCard` in Launch Settings with the per-platform steps and a copy-link button.
