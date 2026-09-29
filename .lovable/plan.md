# Make "Start here" and "Founding Member" lead to the questions first

## What is happening now

- **Start here** — if you're already signed in, it jumps straight to Home. If signed out, it goes to sign-up, then About me, then the questions.
- **Become a Founding Member / Founding Member** — if signed in, it jumps straight to the membership page. If signed out, it goes to sign-up and then straight to membership, **skipping the questions**.
- Why: the Founding button was built as a shortcut to payment before we agreed on "questions first, payment after the snapshot". Sign-up also remembers the Founding choice and sends people straight to payment.
- You're signed in on the preview, so both buttons skip the questions. That's why you never see them.

## What will change

All landing buttons will follow one path: **Account → About me → Questions → My snapshot**, then Home or membership.

| Button                   | Signed out                                                               | Signed in, no snapshot yet                   | Signed in, snapshot done               |
| ------------------------ | ------------------------------------------------------------------------ | -------------------------------------------- | -------------------------------------- |
| Start here               | Sign up → About me → Questions → Snapshot → Home                         | Continue to About me / Questions             | Home                                   |
| Become a Founding Member | Sign up → About me → Questions → Snapshot, with the Founding offer shown | Questions → Snapshot with the Founding offer | Membership page with snapshot greeting |

- If someone left the questions halfway, both buttons take them back to where they stopped.
- The landing text under the buttons will say what comes next: "Start with a few short questions — about 5 minutes. Your snapshot is free."
- Existing members who tap Founding Member go to Home instead of being asked to pay again.

## "Built from my answers" — and my calendar, with my permission

- **On the snapshot:** a short card, "Your set-up is built from your answers", shows what was used: my best time to work, most productive window, when to take breaks, and my main focus. Each item has an "Edit" link.
- **Asking permission before changing the calendar:** after the snapshot, one screen asks "May MyRhythm show this on my calendar?" and lists what would appear: best time to work, productive window, breaks. There are three choices: "Yes, show it", "Let me choose" (a switch for each item) and "Not now". Nothing goes on the calendar without a yes.
- **Clearly visible on the calendar:** once agreed, these show on the MyRhythm calendar as soft, labelled bands ("My best time to work", "Break"), so they can't be mistaken for appointments. A small "From my answers" tag opens an explanation, and there's a switch to turn them off.
- **Changing my mind later:** Settings gets a "My rhythm on my calendar" switch. Retaking the questions updates the bands, but only after asking again.
- The wording stays advisory, never medical: "suggested", "you're in control".

## How to test it

Sign out, tap each button and check that the questions appear before any payment. Finish the snapshot, check the permission screen, choose "Let me choose" and switch on breaks only, then confirm only breaks show on the calendar. Then sign in with an account that has no snapshot and do the same.

## Technical details

- `MVPCore4C.tsx`: replace the `user ? '/launch/home'` / `'/launch/payment'` logic with one helper. It reads `myrhythm_launch_mode.assessmentCompleted`, the saved progress (`getResumePoint`) and whether the user is subscribed. It returns `/launch/register`, `/launch/user-type`, `/launch/assessment`, `/launch/welcome` or `/launch/payment`.
- The Founding intent is saved as `myrhythm_intent=founding` in localStorage. `LaunchRegister.tsx` then goes to `/launch/user-type` instead of `/launch/payment` (drop the `prefilledUserType → payment` shortcut for this intent). `LaunchWelcome` shows the Founding offer when the intent is set.
- Calendar consent is stored per item (`work`, `productive`, `breaks`) in `user_schedule_preferences`, keeping the existing `brain_healthy` type plus a consent flag. The calendar page shows bands only for items that are switched on. Retaking the questions sets the consent back to "ask again".
- Also add these tasks to roadmap.md when building.
- Verify on a phone-size screen with Playwright, signed out: both buttons lead to sign-up, then About me. Check the helper's routing for signed-in states.
