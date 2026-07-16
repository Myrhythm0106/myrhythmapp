## Two small changes

### 1. Gate the You-Are-Here dial behind auth

**File:** `src/components/launch/LaunchLayout.tsx`

Wrap `<LaunchYouAreHereDial />` (line 62) so it only renders when the user is authenticated. Use `useAuth()` from `@/hooks/useAuth`; render the dial only when `user` is truthy AND we're not on the pre-account onboarding routes (`/launch/welcome`, `/launch/signin`, `/launch/signup`, `/launch/user-type`, `/launch/assessment`).

Rationale: on these pages the dial exposes destinations the user hasn't earned yet. Once they land on `/launch/welcome` post-assessment (still pre-signin) OR on any authenticated route, the dial appears.

Net effect the user asked for: dial hidden until sign-in / registration is complete.

### 2. Allow deselecting an answer on the assessment page

**File:** `src/pages/launch/LaunchAssessment.tsx`

Two tiny tweaks inside the existing primary/also-fits model — the "primary vs secondary" identification stays exactly as it is:

- **`setPrimary` (line 92):** if the tapped option is already the current primary, clear it (`primary: ''`) instead of returning `prev`. That lets the user untick a primary they've changed their mind on.
- **`toggleAlsoFits` (line 105):** when the user taps "Also fits" on the current primary, demote it — clear `primary` and add the value to `alsoFits`. (Currently that tap is a no-op.)

The Continue button already requires a primary (`canContinue = !!current.primary`), so if the user untick everything they simply can't advance until they re-pick — matching the "freedom to change their mind" ask.

### Out of scope

No route changes, no dial-config changes, no assessment scoring changes, no visual redesign. Non-`/launch/*` code untouched.

### Verification

- `tsgo` typecheck.
- Manual: visit `/launch/assessment` while signed out → no dial in header; sign in and visit `/launch/home` → dial present.
- On assessment: tap primary A → tick appears. Tap A again → tick clears, Continue disables. Tap A, then tap "Also fits" on A → A becomes also-fits, primary cleared. Tap B primary → B primary, A stays as also-fits (existing behaviour).