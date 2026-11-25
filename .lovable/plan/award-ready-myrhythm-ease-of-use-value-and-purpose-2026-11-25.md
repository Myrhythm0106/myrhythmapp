# Award-ready MyRhythm: ease of use, value and purpose

Goal: every screen feels effortless, every tap earns its place, and the North Point is felt, not explained. Judged against the criteria award panels use (Apple Design Awards, Webby, Good Design): Delight and fun, Inclusivity, Innovation, Interaction, Social impact, Visuals.

## 1. Walk the whole journey as each person (audit first)
Phone-sized walkthrough for all five audiences, signed in with a test account: landing, Get Started, card step, who it's for, welcome, Questions, snapshot, Home, Record, report, actions into diary, reminder, Done, Support Circle, Vision.
For every screen, score: Where am I? What do I do? What happens next? Taps needed. Anything confusing, crowded, clinical or off-voice.
Output: a scored list of fixes, ranked by impact.

## 2. Fix the friction found
- Remove stray controls that do not belong (including the back button showing on or leading to the landing page; it will be hidden there and on first-time screens).
- Max 3 choices per screen, 56px buttons, 16px text floor, no dead ends, undo everywhere.
- One calm confirmation per action, no repeated questions.

## 3. Show the value within two minutes
- First recording to first scheduled action in under 2 minutes, measured.
- Snapshot ends with one clear, personal next step.
- Home always shows one priority and Record.

## 4. Polish and accessibility
- WCAG AA contrast, screen-reader labels, reduced-motion respected, dark mode checked.
- Consistent visual style across older and newer screens.
- Wording sweep in your blog voice on the screens found weakest.

## 5. Prove it
- Repeatable phone checks for each audience journey kept in the project.
- A short "award readiness" scorecard with before and after scores.

## What I cannot promise
I can make the app meet award criteria; I cannot guarantee a judging panel's decision. Real sign-up still depends on fixing the email sender (your Supabase settings).

## Technical details
- Playwright journeys at 393x822 under /tmp/browser, with a signed-in test account where possible.
- Fixes stay in presentation code unless a flow is broken.
- Scorecard saved to docs/award-readiness.md.
