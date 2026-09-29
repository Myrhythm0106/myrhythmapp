# Bring the You-Are-Here dial back — visible on every screen

## Goal
The circular dial that opens the map of the app (Home, Memory Bridge, Calendar, Diary, plus "More places") should be easy to spot and available on **every** screen, so the user can always move to another screen without hunting.

## What I found
- The dial component (`LaunchYouAreHereDial`) works and opens the full map correctly.
- It currently only appears inside the sticky top header — and the header is **completely hidden** on the full-screen setup screens: Register, About me (user-type), and Membership (payment). On those screens there is no dial at all.
- On screens that do have the header (like Memory Bridge), the dial is a quiet 56px circle with only an icon — easy to overlook next to the account menu.

## Changes

### 1. Dial on the full-screen screens
- Add the dial to the self-contained screens (Register, About me, Membership) as a fixed circular button in the top-right corner, matching the header position, so it is present everywhere without disturbing those screens' own layout or back button.
- It stays hidden only during the very first run of sign-in/sign-up, where leaving early makes no sense — once signed in, it is always available.

### 2. Make the dial unmistakable
- Add a small "Where to?" label under/beside the dial in the header so first-time users know what it does (kept subtle, in the Light Linen style — no bright badges).
- Slightly stronger gold ring so it reads as a button, not decoration.

### 3. Keep behavior identical
- Tapping the dial opens the same map: four landmarks around the circle, "Take me home", "More places" for Compass, Assessment, Support Circle, Settings, Help, What's New.

## Technical notes
- Files touched: `src/components/launch/LaunchLayout.tsx` (render dial for self-contained paths via a fixed-position wrapper), `src/components/launch/LaunchYouAreHereDial.tsx` (optional label, stronger ring).
- No changes to routes, the map contents, or onboarding logic.
- Verify: phone-size check that the dial appears on /launch/memory, /launch/register, /launch/user-type, /launch/payment, and opens the map; typecheck.
