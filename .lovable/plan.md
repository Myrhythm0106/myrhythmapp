# Permanent tester login

Goal: one fixed account you can sign into at any time, on phone or laptop, without waiting for email confirmation or a payment step.

## The account

- Email: `annabelaaron@yahoo.com` (your real inbox, so email flows can be tested end to end)
- Password: a strong fixed password you choose (I'll use the one you give me, or generate one and show it once)
- Confirmed immediately, so no email link is needed
- Marked as a founding-tier tester so recording limits and paid surfaces are unlocked

## How it gets created

A one-off admin task run against your Supabase project (service-role, server side only — never in the browser):

1. Create the user with `email_confirm: true` so it can sign in straight away.
2. Insert its profile row and give it the founding/tester entitlement used elsewhere in the app, so the paywall and Stripe trial never block it.
3. Skip the assessment gate if you want it to land straight on Home — otherwise the first sign-in walks the normal flow once and then remembers.

Nothing about normal signup changes; this is just one extra row in auth.

## Getting in quickly

On `/launch/signin`, add a small "Tester sign-in" button that fills the email and password and signs in with one tap. It only renders when the app is running in test mode (the existing `VITE_STRIPE_MODE=test` / non-production signal), so it never appears for real users on the live site.

## Technical notes

- User creation uses the Supabase Admin API with `SUPABASE_SERVICE_ROLE_KEY` from an edge function invoked once, then the function is removed (or left behind a founder-admin check).
- Entitlement is written to the same table `useMembershipStatus` reads, so no new logic is needed.
- The tester button reuses the existing sign-in path in `LaunchSignIn.tsx` — no separate auth code.
- Credentials are shown to you in chat once; they are not committed to the repo.

## Verification

- Sign in with the credentials in a fresh browser and confirm it reaches Home.
- Confirm no email confirmation prompt appears.
- Confirm recording and Commit surfaces are unlocked (no trial wall).
- Confirm the tester button is absent when the app is built for production.
