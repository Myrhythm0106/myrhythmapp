# Plan: Tighten the snapshot-to-membership handoff

## Goal

The assessment-first flow is confirmed as the strategy (assessment before payment; the free snapshot is the conversion engine). This plan makes the moment *after* the snapshot — where a person decides to become a member — personal, transparent, and friction-free, in the `/start` Light Linen standard.

## What changes

### 1. Make the membership offer on the snapshot personal (LaunchWelcome)

The offer card currently says "Lock in founding pricing and unlock my full personalized plan" — generic, disconnected from the snapshot the person just read.

- Rewrite the offer line to echo their own snapshot: name their lowest MYRHYTHM letter and their best window, e.g. "My Rhythm is my strongest. My Focus needs support. Membership turns this snapshot into a plan that defends my 10:00–12:00 window."
- Add a short, plain "What membership adds" list directly in the offer card (full personalized plan, daily follow-through, reminders and calendar invites, Support Circle) so the choice is informed before they tap — the transparency rule, not a tease.
- Keep the free value visible: add a calm secondary exit "Not now — continue free to Home" alongside the payment CTA, so the offer reads as an invitation, never a trap.
- Remove the duplicate "See what's included" / "Sign in" pair if it competes with the primary choice (max 3 options per screen).

### 2. Carry the snapshot into the membership page (LaunchPayment)

The payment page already receives `fromReport`, but ignores it beyond the back button.

- When arriving from the snapshot, greet with their snapshot context: "My snapshot is ready — {score}/100, best window {start}–{end}." and one sentence on what membership completes.
- Restate the free-vs-paid boundary in one line (what the snapshot already gave them vs what membership adds) — stated plainly, not as upsell.
- Keep "Start my 7 free days" as the single primary CTA; tidy secondary links to match the max-3-options rule.

### 3. Post-checkout return already lands on the snapshot confirmation — verify only

`/launch/welcome?postCheckout=1` shows "I'm in. My plan is active." with a Go to Home button. Verify it end-to-end after the change; adjust copy if it reads cold.

## Out of scope

- Pricing, Stripe wiring, and the founding-member config (locked).
- Assessment questions and scoring.
- My Compass cloud persistence (still awaiting approval — device-local stays).

## Technical notes

- `src/pages/launch/LaunchWelcome.tsx` — the offer card block and CTA cluster; `bhs` (brain health score) is already in scope, so personalization is pure rendering.
- `src/pages/launch/LaunchPayment.tsx` — read `location.state.fromReport`, pull the saved snapshot from `myrhythm_launch_mode` for score/best window, render the greeting only when present (signed-out visitors keep the current generic page).
- All copy stays non-clinical, no diagnoses, no external practitioner names.
- Respect the house rules: min 56px targets, max 3 primary choices, Light Linen tokens (`launch-*`), no new colors.

## Verification

- Typecheck (`npx -y tsc --noEmit -p tsconfig.app.json`) and build clean.
- Playwright phone-size check: complete a snapshot (seeded answers) → confirm the personalized offer renders → tap through to the membership page → confirm the greeting and single CTA → confirm the free exit returns Home.
- Signed-out payment page still renders the generic version.
