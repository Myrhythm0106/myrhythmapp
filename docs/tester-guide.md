# MyRhythm Tester Guide

Welcome, and thank you for helping test MyRhythm. This page shows you how to walk through the **entire real app** — sign-up, payment screen, and all — without spending a penny.

## Two paths — pick one

### Path A: Access code (fastest, £0)
1. Go to the app and tap **Become a Founding Member**.
2. Sign up with any email + password you like (a real inbox helps, but a plus-alias like `you+test1@yourdomain.com` works too).
3. When you reach the **payment page**, look for the **"Have an access code?"** panel.
4. Paste one of your tester codes:
   - `TESTER01` — 10 uses
   - `FOUNDING2026` — 50 uses
   - `FRIENDS` — unlimited, expires 30 Sep 2026
5. Tap **Redeem code**. You're in as a Founding Member. No card. No charge. Ever.

### Path B: Stripe test card (walks the full checkout flow, still £0)
Use this if you want to see the exact Stripe screens a real customer sees.

1. Sign up as above.
2. On the payment page, tap **Start 7-Day Free Trial**.
3. On Stripe's checkout page, paste a test card:
   - `4242 4242 4242 4242` → success
   - `4000 0000 0000 0002` → declined
   - `4000 0025 0000 3155` → 3D-Secure challenge
   - `4000 0000 0000 9995` → insufficient funds
4. Use **any future expiry date**, **any 3-digit CVC**, **any postcode**.

The payment page shows an amber **Test Mode** banner and a **Show Stripe test cards** button — tap it to copy any card in one click.

## Try invalid data — nothing will break

Please poke at the edges. Try:
- Wrong password on sign-in
- Access code that doesn't exist (e.g. `NOTREAL`)
- Access code with typos (`tester01`, spaces, etc.)
- Declined card during checkout
- Closing the tab mid-checkout and coming back
- Signing up twice with the same email

All these paths are safe — you can't charge anyone real money in Test Mode.

## Where to report bugs
- Take a screenshot (whole screen if you can).
- Note what you tapped, what you expected, and what happened.
- Send them to the MyRhythm team.

## Going live later
When you're ready to accept real payments, one flag flips: `VITE_STRIPE_MODE=live`. The Test Mode banner and test-card panel disappear automatically. Access codes still work if you want to keep comping specific people.
