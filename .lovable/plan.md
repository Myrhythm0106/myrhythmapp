# Ready for user testing? Honest verdict, and the five things to fix first

## Short answer

The machinery works — signing in, recording a conversation, pulling out actions, putting them in the diary, inviting people. What is not ready is the **first twenty minutes**. A tester can sign in and land on a busy Home page having never answered a single brain health question, with no clear first move. That is the gap between "it works" and "it felt like having my own assistant".

## What I checked and found

- **Signing in always drops straight onto Home.** It makes no difference whether someone is brand new or has been using it for weeks — same screen, same starting point. There is only a small dismissible "pick up where you left off" strip.
- **The brain health questions are optional.** They sit in the sign-up path, but anyone signing in afterwards skips them entirely. There is a "Take my assessment" card on Home, but nothing insists.
- **The first-run helper is skippable and thin.** Three steps, a "Skip — I'll explore on my own" link, and no follow-through afterwards.
- **Home shows a lot at once** — daily welcome, stage picker, arrive-and-arm, next action, completion stats, assessment card, weekly planning, I-choose, re-entry, scaffolds, composer, wins, load meter. On day one, most of it is empty. Empty and crowded at the same time is the worst combination for the people this app is for.
- **Capture to actions to calendar is genuinely working** — saving, extracting, scheduling and notifying all run, with a graceful message if the session expires.
- **No paywall blocks a tester.** Payment is test-mode and an access code skips it. The developer-only tier switcher correctly hides itself.

## The plan

### 1. Brain health questions come first — properly

Anyone signing in who has never completed the assessment goes to the assessment, not Home. One calm screen explains why in a sentence ("Eight questions, about three minutes — it's how I learn when you're at your best"), with a single "Not now" that Home then keeps quietly reminding them about. Once complete, they land on their report, then Home.

If they answered before, sign-in goes to Home as it does today.

### 2. Pick up exactly where they stopped

If someone got part way through sign-up, the assessment or payment and comes back, signing in returns them to that exact step instead of dumping them on Home. The information to do this is already stored; nothing reads it at sign-in.

### 3. Home on day one becomes one clear next move

For a brand-new account, Home shows a short "start here" sequence instead of a dozen empty panels: your name and the day, one primary button ("Record my first conversation"), and two quiet secondary options. Panels that have nothing in them yet stay hidden until there's something to show. Everything reappears as the account fills up — nothing is removed.

### 4. Make it behave like an assistant, not a dashboard

Once the assessment is done, the app uses what it learned immediately and says so out loud: a single line on Home such as "You told me mornings are your strongest — I've put your first action at 9:30." One sentence, visible on day one, is what makes it feel personal rather than a set of tools.

### 5. A tester's first session, guaranteed

A short guided path that survives leaving the app: record something → see the actions it found → send one to the diary → tick it off. Progress is remembered, so a tester who closes the app mid-way is picked up where they left off rather than starting over.

## Also worth doing before it goes out

- Remove the leftover startup console message.
- Confirm the "Today's wins" list on Home is genuinely empty for a new live account rather than showing sample content.
- One pass on a real phone through the whole path, signed in as a tester.

## Technical notes

- `LaunchSignIn.tsx:62` — replace the flat `navigate(redirectTo)` with a resolver that reads `getResumePoint()` and assessment completion before choosing a destination.
- New `src/launch/onboarding/nextDestination.ts` — single source of truth: resume point → assessment (if never completed) → `/launch/home`.
- `LaunchGuard.tsx` — optional guard flag for the assessment-first rule, so a direct URL to Home also redirects for a first-timer.
- Assessment completion signal: reuse `listAssessmentRuns()` from `src/launch/assessment/assessmentHistory.ts` plus the `myrhythm_launch_mode` score already read by `LaunchWelcome.tsx:70-80`.
- `QuietHome.tsx` — add a `isNewAccount` branch rendering a `FirstSessionCard`; hide `CompletionStatsStrip`, `Scaffolds`, wins and `CognitiveLoadMeter` until they have data.
- New `FirstSessionCard` driven by a small localStorage checklist (record → review → schedule → complete), reusing `recordAction` analytics.
- Rhythm line on Home from the stored `productivityWindow` (`src/launch/assessment/productivityWindow.ts`).
- `App.tsx:197` — drop the render console log.
