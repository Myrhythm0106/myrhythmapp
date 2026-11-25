# Executive Home, complete induction, then Stripe last

## Test findings so far
- Registration works on phone (393px), iPad (820px) and desktop (1440px): each lands on "Add my card".
- The card step fails on all three because no Stripe key is set up. Stripe will be connected as the very last step.

## 1. Executive Home dashboard
- Top band: date, greeting, "Today at a glance" with three figures (meetings, priorities, open commitments).
- Main column: today's 3 priorities as crisp rows (time, owner, status); tap opens the existing detail sheet.
- Side column on iPad/desktop: next meeting with one-tap Record, week strip with Yesterday/Tomorrow, Follow-through bar.
- Lower row: My Vision in ACTion (curved), Support Circle status (respects the off switch), Still open.
- Phone: stacked, priorities first, extras folded. Dashboard/List toggle kept.
- Navy and warm neutrals, one orange action colour, serif headings; welcoming to anyone with cognitive, wellness or brain-related challenges.

## 2. One complete induction
Starts on first arrival at Home, replayable from Help, Back and Skip on every step, resumes where left off:
Welcome, who it's for, Guide me or Explore, first recording (or practice), summary and one step into the diary, reminders, invite someone (optional), snapshot questions, "You're set up".
Retire the scattered pieces (first welcome, tour, guided start, first-run overlay, Make it mine).

## 3. Stripe ready, connected last
- Card step shows a calm message and the access-code route if payment is unavailable, never a dead end.
- Checkout settings, return to Home and trial rules left ready.
- Final step: connect Stripe, then rerun the sign-up and card test on phone, iPad and desktop and confirm where new users land.

## Technical details
- Refactor `QuietHome.tsx` into dashboard sections reusing `topThree`, `PriorityDetailSheet`, reminders, vision and circle data.
- One induction step engine using the existing device-local walkthrough store; tests for step order and resume.
- `LaunchPayment` error state; `create-checkout` unchanged until the key exists.
- Add "Stripe last" to roadmap.md.
