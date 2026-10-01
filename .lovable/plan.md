# Make every "Register / Start here" button do what it says

## The problem
On the landing page, "Start here", "Register" and "Become a Founding Member" keep the same words even when you're already signed in. When a signed-in person who has finished the questions taps "Start here", they're sent to Home, and Home opens the "A new day is mine, Annabel" welcome. So a button that sounds like "sign up" lands you in your daily welcome instead, which is confusing.

## What changes

### 1. The buttons change their words when you're signed in
On the landing page (top bar, hero, closing section, floating bottom button):

| Who | Main button | Second button |
|---|---|---|
| Signed out | Start here: sign up, then the questions | Become a Founding Member: sign up, questions, then membership |
| Signed in, questions not finished | Continue my questions | Become a Founding Member: back to the questions first |
| Signed in, snapshot done, not a member | Go to my day | Become a Founding Member: membership page |
| Signed in, already a member | Go to my day | (hidden) |

- The top-bar "Register" button only shows when you're signed out. This is already the case and stays that way.
- A small line under the buttons when signed in: "Signed in as Annabel · Not you? Sign out".

### 2. No surprise daily welcome after tapping a landing button
- When you go from the landing page to Home with "Go to my day", Home opens normally. The "A new day is mine" welcome does not pop up on top of it.
- The daily welcome still appears the first time you open the app each day by yourself.
- It never appears during sign-up, About me, the questions or the snapshot.

### 3. The sign-up page knows when you're already signed in
- If you open the sign-up page while signed in, it no longer shows an empty form. Instead it says: "You're already signed in as Annabel." It has one button that takes you to the right next step (Continue my questions or Go to my day) and a quiet "Sign out and create a new account" link.

### 4. Check every way in
Go through each button on the landing page and on /launch/start ("Open MyRhythm Home", "Start a capture now") and the floating buttons, both signed out and signed in. Make sure each one goes where its words promise.

## Technical notes
- `MVPCore4C.tsx`: work out an `entryState` (signedOut / needsQuestions / hasSnapshot / member) using the logic in `entryRoute.ts` (expose `isMember` and `hasSnapshot`). Choose labels from it. Navigate to Home with `?from=landing`.
- `DayOpenWelcome.tsx`: skip opening when `?from=landing` is in the URL or the path is an onboarding path. Do not mark the day as seen, so it still shows on a later visit that day.
- `LaunchRegister.tsx`: on mount, if a session exists, show the "already signed in" card and use `resolveEntryRoute('start', id)` for its button.
- Old leftover buttons (`FloatingRegisterButton` → `/mvp/user-type-selection`, `FloatingStartButton` → `/get-started`): send them to `/launch/register` so no old route is ever reachable.
- Check on a 393px phone, both signed out and signed in (with a session), and take screenshots of each button's destination.
