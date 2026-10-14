# A welcoming start, with two ways forward

## Keep the welcome screen
Preserve the professional appearance and engaging snapshot on `/launch/welcome`. Add a clear way to begin without redesigning the page or turning it into another long setup process.

## 1. Identify the blank “1”
The welcome page's three numbered “Shaped for you” highlights contain text in the source. The exact blank item and its cause are not yet confirmed.

- Inspect the item in the user's actual screen and saved answers before changing it. If it cannot be reproduced, ask for a screenshot identifying the blank.
- If an answer or suggestion is unavailable, show an honest explanation and an appropriate next step, rather than an empty space or an invented result.

## 2. Offer two empowering choices
At the end of the free snapshot, present **How would I like to begin?**

- **Guide me** — show one practical next step at a time, with a clear Continue button and an option to stop or switch approaches.
- **Explore my way** — open Home without a compulsory walkthrough, letting the person choose their next action.

Both choices use the same app and features. They do not change membership, permissions or assessment depth. Keep membership optional and the free snapshot available; choosing support must not require payment.

## 3. Make both approaches easy to navigate
- Use the existing circular **Where to? / You are here** map, not a second competing navigation system.
- Make the map available from this welcome handoff and throughout the established app, beside the profile button.
- Show the current place clearly and keep Home easy to reach. Retain the structured path and “More places” presentation.
- In the guided approach, lead towards a first useful result: capture something important, check the next steps, then choose whether to add an action to the calendar. Never require recording or add calendar items without consent.
- Remember the chosen approach on this device and allow switching from the existing map without restarting setup.

## 4. Keep it calm and adult
- Preserve the welcome screen's visual quality and use matching styling for new controls.
- No “beginner”, “senior”, “hand-holding” or ability labels.
- No more than three main choices at once; large touch targets, readable text and clear Back/Continue controls.
- Separate these starting choices from Quick Start versus Full Picture assessment choices.

## Technical details
- Integrate with `LaunchWelcome`, the existing first-session guidance and `LaunchYouAreHereDial` in `LaunchLayout`.
- Keep account → questions → free snapshot as the canonical entry sequence, with optional personalization and membership preserved.
- Use one shared state for the selected starting approach and guided progress; scope device-local state to the signed-in user. Do not promise cross-device saving.
- Reuse existing guidance where suitable, correcting any reused tour text to match the actual dial location and available screens.
- Use semantic design tokens and existing controls for additions; no new navigation framework or database changes.

## Checks before completion
- Confirm the blank item's cause and verify its real screen displays meaningful content.
- Test welcome → Guide me → first useful step, and welcome → Explore my way → Home.
- Test switching approaches, returning later, reaching Home through the map and closing the map with keyboard controls.
- Check phone and desktop layouts for clipped text, overlapping controls and extra scrollbars.
- Distinguish real signed-in checks from any isolated checks; report account-related verification limitations honestly.