# Restore the circular “You are here” dial

## Goal
Bring back the distinctive circular wayfinder on every established in-app screen where the user is free to move elsewhere, while keeping the header calm and consistent with `/start`.

## Recommended placement
Place one **56px circular dial in the top-right header, immediately before the account control**. This is the most dependable location because it remains visible while scrolling, is separate from page actions, and does not cover content or compete with the recording control.

On small phones, keep only the dial and account control in this area. Move “What’s new” and Help into the opened map so the header does not become a row of unexplained icons. Desktop can retain those links inside the map too, creating one consistent navigation pattern.

## What will change

### 1. Restore the circular trigger
- Replace the current wide “You are here” pill with the recognisable circular dial.
- Use a restrained champagne-gold segmented outer ring, deep-ink centre and teal current-location marker.
- Keep it adult and editorial: no bright rainbow wheel, cartoon styling, spinning decoration or gamification.
- Give it a clear accessible label such as “You are here: My Calendar. Open MyRhythm map.”
- Show the current page name in a small, calm line directly beneath or beside it on larger screens; on narrow phones the name appears when the map opens, preventing header crowding.

### 2. Open a clear circular map
- Tapping the dial opens a focused map with **the current page in the centre**.
- The first ring shows the four familiar landmarks: **Home, Memory Bridge, My Calendar and My Diary**.
- A quiet “More places” control reveals My Compass, Brain Health Assessment, Support Circle and Settings only when wanted.
- Include a prominent **Take me home** action whenever the user is away from Home.
- Keep every destination at least 56px, with an icon, a plain-English name and one short purpose line.
- Close through a clear ×, “Close map”, tapping outside, or the Escape key.

### 3. Show it only where navigation is appropriate
- Keep the dial present across established `/launch/*` app screens, including Home, Calendar, Diary, Memory Bridge, Compass, Support Circle and daily welcome.
- Keep it out of sign-in, registration, first-time setup and payment steps, where leaving midway could be confusing.
- For a returning user retaking the assessment, retain an obvious route home rather than trapping them in the sequence.

### 4. Remove competing clutter
- Consolidate Help and What’s New inside the map on phone-sized screens.
- Preserve the bottom navigation for the 4C rhythm; the dial remains the single route to the wider app.
- Do not add another floating control or duplicate menu.

## Technical details
- Refine `LaunchYouAreHereDial.tsx` into the circular trigger and progressively disclosed map while retaining the current route registry.
- Update `LaunchLayout.tsx` to place it consistently and distinguish established in-app navigation from first-time setup.
- Keep route names and destinations sourced from `src/launch/routes.ts` so the map cannot drift from the actual app.
- Preserve keyboard focus, screen-reader naming, reduced-motion behaviour and safe-area spacing.

## Verification
- Check Home, Memory Bridge, Calendar, Diary, Compass, Support Circle and a returning-user assessment.
- Check sign-in, register, first-time assessment and payment remain uncluttered.
- Test at phone and desktop sizes: no overlap, no clipped labels, no duplicate scrollbars.
- Confirm any destination is reachable in two taps: **dial → destination**.
- Confirm Home is always one tap away once the map is open.
