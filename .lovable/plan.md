# Professional finish: every label readable, every screen consultancy-grade

## The problem I found
All buttons across the app are set to stay on one line. On a phone (about 390px wide), any button with a longer label gets cut off or pushes past the edge of the screen. The same goes for a few labels and badges that are forced onto one line or cut short with "…", such as conversation titles, Circle member details and the small tags on the conversation summary.

## What changes (what you will see)
1. **No cut-off button text, anywhere.** Buttons wrap neatly onto two centred lines when they need to, instead of being cut off or overflowing.
2. **Shorter, sharper labels.** Every button and label longer than about 24 characters is rewritten to 1 to 4 words in a confident tone. For example, "Place 3 steps into my schedule" becomes "Schedule 3 steps", and "Open my full vision and goals" becomes "Open my vision". Any extra explanation moves to a short line beside the button, not inside it.
3. **Readable labels and tags.** The conversation summary tags grow from tiny 11px text to readable size. Titles and names wrap onto a second line instead of ending in "…".
4. **One consistent professional look on key screens.** Leftover generic grey, red and amber colours on Circle and Settings are swapped for the app's own ink, teal and gold. Headings, card corners and spacing follow one rhythm.
5. **Checked on real widths.** The register, sign-in and landing pages are checked in the browser at 320, 393 and 837px for clipped text, overflowing buttons and sideways scrolling. Anything found is fixed. The signed-in screens (Home, Record, conversation result, Diary, Circle, Vision and Settings) need an account to open, so they are reviewed screen by screen in the code. Checking them on screen needs a test account.

## Order
1. App-wide button wrapping fix
2. Label shortening sweep (Home, Record, conversation result, Diary, Circle, Vision, Settings, sign-in and register)
3. Cut-off titles and tiny tags
4. Colour and spacing consistency on Circle and Settings
5. Browser check at three widths and fixes

## Technical details
- `src/components/ui/button.tsx`: replace `whitespace-nowrap` with `whitespace-normal text-center leading-tight`, keep `min-h` sizing, and add `h-auto min-h-*` to the size variants so wrapped text never clips. Icon-only buttons are unchanged.
- Find long labels with a scan of JSX button and label text over 24 characters in `src/pages/launch`, `src/components/launch` and `src/components/memoryBridge` (skipping `_archive`).
- `ExecutiveSummaryPanel.tsx` chips: 11px/22px becomes `text-sm min-h-7` with wrapping allowed; `truncate` becomes `break-words` in `ExecutiveSummaryPanel`, `LaunchSupportCircle`, `CaptureDock`, `WhosInvolvedCell` and `ActionsTableView` where the content is a title or name.
- Replace gray/red/amber Tailwind classes with semantic tokens in `LaunchSupportCircle.tsx` and `LaunchSettings.tsx`.
- Playwright at 320/393/837 checks that no element is wider than the page and no button's text is wider than the button. Signed-in pages need a test account.
- Screens and wording only; no changes to data, reminders or scheduling.
