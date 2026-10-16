# Clear front door — Log In or Get Started

## Goal
Make `/launch/landingpage` the first page everyone sees, with two obvious choices in the top-right banner: **Log In** and **Get Started**. Every step tells the person where they are, what happens next, and lets them stop, save and return.

## What exists today (checked)
- `/` redirects to `/start`; `/start`, `/launch` and `/launch/landingpage` all show the same landing page, so the address people see varies.
- The landing banner currently shows **Join Now**, **Founding Member** and **Sign in / Sign out** — three competing choices.
- Get Started already runs: Account → optional starting choice → Questions → My snapshot → Home or membership.
- Progress is remembered only on the device in use; returning on a different device may not resume at the right step.

## 1. One front door
- `/`, `/start`, `/launch` and `/landing` open `/launch/landingpage`, keeping any invite or founding code in the address.
- Landing story, images and wording stay as approved.

## 2. Banner: two choices only
- **Get Started** (orange, primary) and **Log In** (quiet secondary), right-aligned, visible on phone and desktop while scrolling.
- Founding Member leaves the banner; it is offered at the right moment inside Get Started and remains in the page story.
- When already signed in, the banner shows **Continue** (to the exact next step or Home) plus the account menu with Sign out.

## 3. Get Started — the full registration
A short visible path on every screen: "Step 2 of 4 · About me · Next: a few questions (about 5 minutes)".

```text
1 Create account  ->  2 About me (optional)  ->  3 Questions  ->  4 My snapshot
                                                                   |
                                         Choose: Free trial · Founding Member · Not now
```
- One main action per screen; a quiet **Save and finish later** on every step after the account exists.
- The membership choice comes only after the free snapshot, with price and what changes stated plainly before any payment.
- Back always returns to the previous step without losing answers.

## 4. Log In — for people already registered
- Email + password, forgot password, and "New here? Get Started".
- After signing in, one clear destination:
  - Registration unfinished: "Welcome back — you stopped at Step 3, Questions" with **Continue** (and **Start again** quietly).
  - Trial or paid member: straight to Home, with trial days left shown calmly.
  - Trial ended: a calm choice screen (become a member or continue with what is free) — never a dead end or a surprise charge.
- If a person uses Get Started with an email that already exists, offer Log In instead of an error.

## 5. Stop, save and return anywhere
- Save progress to the person's account, not only the device, so it resumes on phone or laptop.
- Answers save as they go; leaving mid-question returns to that question.
- Save confirmation is quiet ("Saved — you can come back any time") rather than a pop-up.

## 6. Never overwhelming
- Max three choices per screen; plain words; 56px buttons; no new terms mid-flow.
- Each step states how long it takes before starting.

## Technical notes
- Route redirects in `App.tsx`; banner in `MVPCore4C.tsx`; landing state from `getEntryState`; sign-in destination from `resolveNextDestination`.
- Add an account-level onboarding progress record (step + last answered question) with owner-only access via the database approval tool; keep the device copy as a fallback.
- Update `AGENTS.md` navigation rules and the roadmap; resume the paused recording-limit security fix first.

## Checks
- New visitor: landing → Get Started → stop at Questions → close → Log In on another browser → resumes at the same question.
- Returning trial and paid accounts land on Home; expired trial sees the calm choice.
- Old addresses all reach the landing page; codes survive redirects.
- Phone (393px, 320px) and desktop banner fit; keyboard and 200% zoom.
- Signed-in checks are limited by the project's sign-in setup; I'll report clearly what I could and could not test.

## Not included
Price changes, new membership types, landing story rewrites, or social sign-in.
