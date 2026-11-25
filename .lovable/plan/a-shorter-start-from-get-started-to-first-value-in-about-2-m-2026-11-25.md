# A shorter start: from Get Started to first value in about 2 minutes

## Today (7 screens before anything useful)
```text
Landing -> Register (plan choice + name/email/password) -> Card -> Who it's for
-> Welcome (Guide me / Explore) -> Questions (~5 min) -> Snapshot -> Home
```

## Proposed (3 screens, then you're in)
```text
Landing -> 1. Create account (name, email, password + plan choice as one toggle)
        -> 2. Card (secure checkout, 7 days free or start today)
        -> 3. Home, with one big "Record my first conversation" button
```

What changes:
1. **One register screen.** The plan choice becomes a simple two-way toggle at the top (Free 7 days is chosen by default) above the three fields. No separate step for it.
2. **Card stays straight after the account**, as you decided: card at the start, nothing charged for 7 days. The page only shows the price, one button and the access-code link; the extra detail folds away.
3. **"Who it's for" moves to Home** as one small optional card ("Tell me who MyRhythm is for, so I can tailor it"). It's skipped by default and the app still works.
4. **No separate welcome screen.** Guide me / Explore my way turns into a one-line choice at the top of Home on the first visit.
5. **The questions become optional and come later.** Home offers "Get my free snapshot (6 minutes)" as a gentle card after the first recording, not before. Smart diary times use sensible defaults until the questions are answered.
6. **The first thing you do is the main thing:** record or upload a conversation and see the summary and actions.
7. Progress steps at the top go down from 4 to 2 (Account, Card), with Save and finish later kept.

Note: the free start is **7 days**, not 14. Tell me if you'd like it to be 14.

## Technical
- `startPlan.ts`: `nextAfterCard()` always returns `/launch/home?first=1`; update its tests.
- `LaunchRegister.tsx`: plan choice becomes a compact segmented toggle with trial as the default.
- `LaunchPayment.tsx` (setup mode): condensed layout, details in a collapsible section, success goes to `/launch/home?first=1`.
- `QuietHome`: first-visit strip (Guide me / Explore), an optional audience card, a primary Record button and a snapshot card shown after the first recording.
- `JourneySteps`: two steps. Update the onboarding rule in `AGENTS.md` and the front-door memory.
