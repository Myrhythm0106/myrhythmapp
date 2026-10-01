# Make every "Register / Start here" button do what it says

## The problem
On the landing page, "Start here", "Register" and "Become a Founding Member" keep the same words even when you're already signed in. When a signed-in person who has finished the questions taps "Start here", they're sent to Home, and Home opens the "A new day is mine, Annabel" welcome. So a button that sounds like "sign up" lands you in your daily welcome instead, which is confusing.

## What changes

### 1. The buttons match who you are: new, returning, or signed in
On the landing page (top bar, hero, closing section, floating bottom button), there are four kinds of visitor:

| Who | Main button | Second option |
|---|---|---|
| **New**: first time on this device | Start here: light sign-up, then the questions | "Already have an account? Sign in" |
| **Returning, signed out**: has used MyRhythm on this device before | **Sign in**: back to where they left off | Quiet link "New here? Start here" |
| **Signed in, questions not finished** | Continue my questions | none |
| **Signed in, snapshot done** | Go to my day | Become a Founding Member (hidden for members) |

- "Become a Founding Member" stays available to new and returning visitors as a clear secondary button. It never replaces Sign in for returning people.
- The top bar shows **Sign in** for returning visitors and **Start here** for new ones. It never shows "Register" to someone who already has an account.
- Signed-in visitors see a small line: "Signed in as Annabel · Not you? Sign out".
- Returning visitors get a quiet "Welcome back" above the Sign in button.
- How returning is detected: the device remembers that an account was used or created here. This works even after signing out, and nothing personal is stored for it.

### 2. No surprise daily welcome after tapping a landing button
- When you go from the landing page to Home with "Go to my day", Home opens normally. The "A new day is mine" welcome does not pop up on top of it.
- The daily welcome still appears the first time you open the app each day by yourself.
- It never appears during sign-up, About me, the questions or the snapshot.

### 3. The sign-up page knows when you're already signed in
- If you open the sign-up page while signed in, it no longer shows an empty form. Instead it says: "You're already signed in as Annabel." It has one button that takes you to the right next step (Continue my questions or Go to my day) and a quiet "Sign out and create a new account" link.

### 4. Check every way in
Go through each button on the landing page and on /launch/start ("Open MyRhythm Home", "Start a capture now") and the floating buttons, both signed out and signed in. Make sure each one goes where its words promise.

### 5. Light sign-up, then the questions, then the fuller details
New order: **Light sign-up → Questions → Free snapshot → Fuller details (optional) → Home or membership.**
- The sign-up page asks for three things only: first name, email and password. Heading: "Takes 30 seconds, then your free questions."
- "About me" (who it's for) is no longer asked before the questions.
- After the snapshot, one optional "Make it yours" step asks for the fuller details: who MyRhythm is for, connecting a calendar, phone or reminder preference. Each part can be skipped with "Later". Nothing in it blocks Home.
- Founding Member still goes: light sign-up → questions → snapshot → membership.

## Technical notes
- `MVPCore4C.tsx`: work out an `entryState` (signedOut / needsQuestions / hasSnapshot / member) using the logic in `entryRoute.ts` (expose `isMember` and `hasSnapshot`). Choose labels from it. Navigate to Home with `?from=landing`.
- `DayOpenWelcome.tsx`: skip opening when `?from=landing` is in the URL or the path is an onboarding path. Do not mark the day as seen, so it still shows on a later visit that day.
- `LaunchRegister.tsx`: on mount, if a session exists, show the "already signed in" card and use `resolveEntryRoute('start', id)` for its button.
- Old leftover buttons (`FloatingRegisterButton` → `/mvp/user-type-selection`, `FloatingStartButton` → `/get-started`): send them to `/launch/register` so no old route is ever reachable.
- Light sign-up: cut `LaunchRegister.tsx` down to first name, email and password. After sign-up, always go to `/launch/assessment?first=1`. `entryRoute.ts` / `nextDestination.ts` stop requiring `/launch/user-type`. Add an optional "Make it yours" step after the snapshot that reuses the existing user-type and calendar pieces. Update `OnboardingProgressBar` to Account → Questions → Snapshot → Make it yours → Home. Update the onboarding rule in project knowledge/AGENTS.md.
- Check on a 393px phone, both signed out and signed in (with a session), and take screenshots of each button's destination.
