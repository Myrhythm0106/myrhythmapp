# Make "Start here" and "Founding Member" lead to the questions first

## What is happening now
- **Start here** — if you're already signed in, it jumps straight to Home. If signed out, it goes to sign-up, then About me, then the questions.
- **Become a Founding Member / Founding Member** — if signed in, it jumps straight to the membership page. If signed out, it goes to sign-up and then straight to membership, **skipping the questions**.
- You're signed in on the preview, so both buttons skip the questions. That's why you never see them.

This goes against what we agreed: questions first, payment after the snapshot.

## What will change
All landing buttons will follow one path: **Account → About me → Questions → My snapshot**, then Home or membership.

| Button | Signed out | Signed in, no snapshot yet | Signed in, snapshot done |
|---|---|---|---|
| Start here | Sign up → About me → Questions → Snapshot → Home | Continue to About me / Questions | Home |
| Become a Founding Member | Sign up → About me → Questions → Snapshot, with the Founding offer shown | Questions → Snapshot with the Founding offer | Membership page with snapshot greeting |

- If someone left the questions halfway, both buttons take them back to where they stopped.
- The landing text under the buttons will say what comes next: "Start with a few short questions — about 5 minutes. Your snapshot is free."
- Existing members who tap Founding Member go to Home instead of being asked to pay again.

## How to test it
Sign out, tap each button and check that the questions appear before any payment. Then sign in with an account that has no snapshot and do the same.

## Technical details
- `MVPCore4C.tsx`: replace the `user ? '/launch/home'` / `'/launch/payment'` logic with one helper. It reads `myrhythm_launch_mode.assessmentCompleted`, the saved progress (`getResumePoint`) and whether the user is subscribed. It returns `/launch/register`, `/launch/user-type`, `/launch/assessment`, `/launch/welcome` or `/launch/payment`.
- The Founding intent is saved as `myrhythm_intent=founding` in localStorage. `LaunchRegister.tsx` then goes to `/launch/user-type` instead of `/launch/payment` (drop the `prefilledUserType → payment` shortcut for this intent). `LaunchWelcome` shows the Founding offer when the intent is set.
- Verify on a phone-size screen with Playwright, signed out: both buttons lead to sign-up, then About me. Check the helper's routing for signed-in states.
