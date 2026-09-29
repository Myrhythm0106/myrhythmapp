# Make MyRhythm easy to follow — returning-user fixes

## Honest answer

Mostly, yes, but not fully. The main path (Home, Record, See my day, the circular dial, Diary, Compass) meets good usability standards. People can still get stuck or misled in a few places, and those spots matter most for someone with memory or energy challenges. Score: about 5.5/10 now, and about 8/10 after the fixes below.

## What breaks user-friendly standards today

1. **One old link spins forever.** Opening an old "assessment" bookmark while signed in sends the page back to itself in a loop.
2. **"Capture" doesn't record.** The bottom "Capture" tab opens an explainer page instead of the recorder. The dial and the floating mic both record, so the same word does three different things.
3. **The "?" icon goes to the wrong place.** It's labelled "Support" and opens Support Circle (your people), not Help.
4. **Paying members can't see their plan.** The profile always says "Free Plan", and you can't manage or check membership after signing up.
5. **"Retake" doesn't start fresh.** It quietly brings back your old answers, and it can send you back to the "About me" setup screen.
6. **Some pages look like dead ends.** A hidden old dashboard and a few older pages can still be reached from old links.
7. **Waiting screens say nothing.** A spinner with no words shows while the app checks your progress.

## What changes

1. **One word, one action.** "Record" always opens the recorder, whether you use the bottom tab, the dial or the floating mic. The explainer page moves into Help.
2. **Honest labels.** The "?" becomes "Help" and opens Help. Support Circle keeps its people icon and plain name.
3. **"My membership" in the account menu.** It shows your real plan (Free, Founding, Friends & Family or Regular), the renewal date, and one button to manage payment.
4. **Retake asks first.** You choose "Start fresh" or "Continue where I left off", and you stay in the app with no setup screens.
5. **No loops, no ghost pages.** Every old link lands on the right current page: signed in goes to Home, signed out goes to /start.
6. **Waiting screens use plain words.** For example: "Getting your day ready…", plus a "Take me Home" link if it takes more than 5 seconds.
7. **One Back rule everywhere.** The top-left Back always returns to where you came from. If there's nowhere to go back to, it takes you Home.

## How we'll check it

- Phone-size walkthrough of the returning user: sign in, Home, Record, review actions, Calendar, Diary, Retake, Membership, Help, and back to Home. Nothing should need more than 3 taps or leave you stuck.
- Old-link test: every retired address lands on a real page.
- Distinguish the most recent version and create a seperate folder to keep all previous pages together but not in the final full flow.

## Technical details

- `RedirectToStart.tsx`: remove the self-redirect. `/assessment` goes to `/launch/assessment`. `/dashboard`, `/mvp`, `/journey` and `/prototype` go to `/launch/home` for signed-in users and `/start` otherwise.
- `LaunchDashboard.tsx`: remove the `?quiet=0` legacy branch.
- `LaunchNav.tsx`: the Capture tab becomes "Record" and goes to `/launch/memory`. `/launch/capture` redirects to `/launch/memory`, and its content moves into a Help section.
- `AccountDropdown.tsx`: Help (HelpCircle) goes to `/launch/help`. Support Circle (Users icon) goes to `/launch/support`. Add "My membership".
- New `LaunchMembership` card in Profile, fed by `SubscriptionContext` / the `check-subscription` function. "Manage payment" opens the Stripe customer portal (existing function if present, otherwise add `customer-portal`).
- `LaunchAssessment.tsx`: a `?mode=retake` dialog (fresh/continue). Don't bounce to `/launch/user-type` when a persona already exists in the profile.
- `AssessmentFirstGate` and `LaunchGuard`: labelled loading state plus a 5-second Home fallback.
- `LaunchHelp.tsx`: use the shared `LaunchPageHeader` back control.
- Use one auth hook import path (`@/contexts/AuthContext`).