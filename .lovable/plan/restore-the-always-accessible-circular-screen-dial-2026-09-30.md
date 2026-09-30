# Restore the always-accessible circular screen dial

## Goal
Make the elegant circular “Where to?” dial unmistakably visible and reachable on every established MyRhythm screen, including **My wins / Celebrate**, without crowding the phone header.

## What I confirmed
- The Celebrate screen uses the shared Launch layout, and the current code does ask that layout to render the dial.
- The latest build is clean, so this is not a compilation failure.
- I could not inspect the signed-in live screen automatically because this project’s authentication is externally managed; the automated check was redirected to Sign in.
- Because the dial is currently tied to several header and onboarding conditions, its presence is not guaranteed independently of the page header.

## Changes
1. **Give the dial one dependable home**
   - Mount one shared dial at the Launch layout level as a fixed, safe-area-aware control rather than relying on each page’s header.
   - Place it at the upper-right on phones and align it neatly with the desktop header.
   - Reserve enough space so it never overlaps the account control, page title, back button, or content.

2. **Keep it consistently available**
   - Show it on every established `/launch/*` app screen, including Home, Memory Bridge, Calendar, Diary, Compass, Support Circle, Settings, Help, and My wins.
   - Keep Sign in and Sign up free of wider-app navigation.
   - Preserve the existing linear first-time onboarding rules; returning users continue to receive the dial when revisiting setup screens.

3. **Preserve the elegant map**
   - Keep the current circular map, “Take me home,” four main destinations, and “More places.”
   - Keep the calm gold/ink/teal treatment and the clear “Where to?” label.
   - Ensure only one dial exists per screen.

## Verification
- Check the actual phone size shown in the preview: **393 × 822**.
- Confirm the dial is visible on My wins and remains visible while scrolling.
- Open it and navigate to Home, Memory Bridge, Calendar, and Diary.
- Check that the opened map fits without clipping or sideways scrolling.
- Confirm Sign in and Sign up remain uncluttered.
- Check desktop placement and the clean build result.
