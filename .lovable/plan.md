## Changes to `src/pages/launch/LaunchWelcome.tsx`

### 1. Make the click-to-reveal on letter bars discoverable
The `MyRhythmLetterBar` component already opens a full detail dialog on click (letter meaning, score band, ways to raise/protect it) — same as the pre-redesign version. It just doesn't look tappable in the dark hero. Fix by:

- Change the hero helper copy from "Tap any letter for what it means and how to raise it." → **"Tap any letter → see what it means & how to raise it"** with an inline gold arrow, moved directly under the letter-bar grid so it sits with what it describes.
- Add a subtle gold underline + `cursor-pointer` hover lift on each bar (via `MyRhythmLetterBar` dark tone) so it reads as interactive.
- Add a tiny "TAP" pill above the first bar on load (fades out after 3s) as an affordance hint.

No changes to the dialog content itself — the rich reveal already works.

### 2. Add a Register / package CTA
Right now the primary button says "Continue" and silently routes to `/launch/payment`. Replace the CTA block (left column, lines ~198–215) with a clearer sign-up offer:

- **Primary button:** `Register & Unlock Your Full Plan →` — deep emerald, routes to `/launch/payment`.
- **Supporting line above button:** small gold eyebrow "Founding Member · £10/month" (pulled from `foundingMemberConfig` in `src/config/pricing.ts` so it stays truthful), plus one-line value: "Lock in founding pricing and get your full personalized plan."
- **Secondary link below:** keep "Sign in to existing account" → `/launch/signin`.
- Add a third micro-link: "See what's included" → also `/launch/payment` (same destination, lower-commitment label) for users who want to browse before committing.

### 3. Keep everything else unchanged
Hero, magazine layout, persona copy, disclaimer, and animation timings stay as-is. No changes to `MyRhythmLetterBar` beyond the light hover affordance in dark tone. No pricing logic changes — only reading the existing founding price for display.

### Out of scope
- Building a new pricing/packages page (already exists at `/launch/payment`).
- Auth-aware "returning user → /launch/home" redirect (still deferred per prior plan).
