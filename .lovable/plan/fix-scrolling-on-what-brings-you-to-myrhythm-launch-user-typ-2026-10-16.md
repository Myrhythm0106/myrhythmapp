# Fix scrolling on "What brings you to MyRhythm?" (/launch/user-type)

## Problem
The screen is fixed to the window height with scrolling switched off, but the page itself never provides its own scrolling area. On shorter screens the lower choices and the "Not now — start my questions" button are cut off and unreachable.

## Fix
- Make the page fill exactly the screen height (`h-full`) instead of growing past it.
- Turn the middle section (progress steps, heading, choices, "Work, study or another starting point") into the single scrolling area, with smooth touch scrolling and a little bottom breathing room.
- Keep the "Not now" button and "You can change this any time in Settings" pinned neatly at the bottom, always visible, with a subtle top border.
- One scrollbar only — no double scrollbars.

## Check
- Phone (393px, 320px), tablet (834x822, your current size) and desktop: scroll to the last choice, expand "other choices", confirm the bottom button is visible and tappable, no sideways overflow.

## Technical details
File: `src/pages/launch/LaunchUserType.tsx` only.
- Root: `min-h-full` -> `h-full min-h-0`.
- Content wrapper: `flex-1 py-6 px-4` -> `flex-1 min-h-0 overflow-y-auto overscroll-contain py-6 px-4 pb-10`.
- Footer stays `flex-shrink-0`; reduce `pb-8` to `pb-4` (safe-area padding already applied).
