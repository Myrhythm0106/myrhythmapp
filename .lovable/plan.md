# Fix: "Start 7-Day Free Trial" button does nothing

## Root cause (confirmed)
Clicking **Start 7-Day Free Trial** on `/launch/payment` calls the `create-checkout` Edge Function, which returns **500: "Stripe secret key is not set"**. No Stripe secret key exists in the project's secrets, so checkout can never start. The page catches the error and shows only a toast — easy to miss, so it feels like the button is dead.

## Plan

1. **Connect Stripe keys (test mode — no real money)**
   - Add `STRIPE_TEST_SECRET_KEY` (and `STRIPE_SECRET_KEY` if provided) plus `STRIPE_MODE=test` as project secrets, using Lovable's built-in Stripe setup where possible.
   - If you don't have Stripe keys yet, I'll enable the Stripe integration flow so you can connect your Stripe account, or fall back to option 3.

2. **Make failures impossible to miss (frontend, `LaunchPayment.tsx`)**
   - Replace the fleeting toast with a persistent on-page error panel (same style as the "Confirm your details" panel) that says checkout couldn't start and points to the access-code option.
   - Keep the access-code path (`redeem_access_code`) as the zero-cost testing route — it already works without Stripe.

3. **Verify end-to-end**
   - Call `create-checkout` directly and confirm it returns a Stripe Checkout URL (not 500).
   - Confirm the trial button redirects to Stripe Checkout and that a test card (4242…) completes the trial.

## Fallback if no Stripe account yet
If Stripe can't be connected right now: in test mode, make the trial button create the trial directly (same as redeeming a Founding/tester code) so friends-and-family testing is unblocked, with a clear "Test Mode — payment simulated" label. Real Stripe checkout activates the moment keys are added.

## What stays the same
- Pricing (£10/mo, £84/yr), 7-day trial terms, access-code flow, and all page design — untouched.
