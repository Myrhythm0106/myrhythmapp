# Always-visible Join Now and a clear personal starting path

## What will change
- Add a prominent **Join Now** button to the sticky `/start` heading for signed-out visitors, visible on phones as well as computers and remaining in reach while scrolling.
- Replace the heading’s existing **Start here** registration button rather than adding a duplicate. Keep **Sign in** available for existing users.
- Preserve the professional `/start` design, with a minimum 56px touch target and no overlap with the logo or other controls. On narrow screens, prioritise Join Now and Sign in; keep the existing Founding Member offer in the page content.
- Do not show Join Now as an account-creation prompt to someone already signed in; retain their appropriate continue-questions or go-to-my-day behaviour.

## Joining journey
```text
Join Now
  → Create my account
  → What brings me to MyRhythm?
  → Welcome to my questions
  → YES Quick Start (5–7 minutes), or Full Picture
  → My free snapshot
  → Optional membership / personalisation
  → Home
```

- Use the existing personal starting choices: rebuilding after a brain change, supporting someone, work/focus, or studying/learning.
- Make the brain-injury and supporting-someone choices explicit and easy to recognise, without assuming a diagnosis.
- Let the person choose; never silently label new users as having a brain injury.
- Keep this step brief, with **Not now — start my questions** available. Skipping must not assign a personal identity.
- Retain the selected starting point for the assessment’s wording and examples. Do not ask the same identity question again after the snapshot when it has already been answered.
- Questions and the complete snapshot remain free; joining does not mean buying membership or going straight to payment.
- Preserve returning-user progress and existing membership status.

## Confirmed current state
- `/start` already has a sticky heading, but its Start here button is hidden on phones.
- Registration currently proceeds straight to the assessment.
- A separate “What brings you to MyRhythm?” screen already contains the four starting choices; the assessment currently falls back to a brain-injury question bank when no starting choice is stored.

## Technical details
- Reuse the existing landing entry-route rules for Join Now; no new login system, account fields or payment behaviour.
- Adjust the post-registration and first-time entry routing to include the existing starting-choice screen before questions; do not alter sign-up credentials or email-confirmation settings.
- Make the starting-choice controls keyboard-accessible using the existing Button component, and keep the optional skip clearly named.
- Keep the shared assessment bank while distinguishing an unselected starting point from an explicitly chosen identity.

## Checks
- Phone and desktop: Join Now stays visible while scrolling; heading controls fit without clipping.
- New visitor: Join Now → account → starting choice → questions → free snapshot, without a payment detour.
- Existing visitor: Sign in and resume still work; signed-in people are not sent to create another account.
- Verify both brain-injury and supporting-someone choices, keyboard selection and the skip path.
- Check signed-out screens directly. If externally managed sign-in prevents automated account checks, report that limitation rather than claiming the complete signed-in journey passed.