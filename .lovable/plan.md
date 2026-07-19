## Goal
Let testers walk through the **real** end-to-end app — including the payment screen — with fake data, so every button, redirect, and confirmation fires exactly as it will in production, but £0 ever moves.

## Full bundle (option A)

Five changes shipped together so testers can hit every path at zero cost.

### 1. Sign-in fix
Remove the dev bypass in `useAuth.ts` (`VITE_MOCK_SECURITY` path) for the launch flow. Real Supabase auth handles sign-in / sign-up / password reset. Existing `useAuthOperations.ts` already has friendly error messages — keep them.

### 2. Founding pricing date bump
`src/config/pricing.ts` → `foundingMemberConfig.triggers.launchDate` currently `2024-12-01` with a 6-month window, so it has expired and the CTA falls back to £15. Bump to `2026-07-01` (or the date you choose) so the £10 Founding price shows during testing and early launch.

### 3. Access-code gate (£0, skips Stripe entirely)
- New table `access_codes` (code, max_uses, uses, expires_at, active).
- New RPC `redeem_access_code(code)` — marks the caller as a Founding Member via `profiles.founding_comped = true` and increments usage. Existing `get_user_subscription_status` already reads `founding_comped` and returns `'founding_comped'`, so downstream gating just works.
- New panel on `/launch/payment`: **"Have an access code?"** → input + Redeem button → success toast → straight to `/launch/welcome`.
- Seed codes: `TESTER01` (10 uses), `FOUNDING2026` (50 uses), `FRIENDS` (unlimited, expires 30 Sep 2026).

### 4. Stripe Test Mode + tester banner + test-card panel
- Add `VITE_STRIPE_MODE = 'test' | 'live'` to `.env`. One flag flips the entire payment flow between test and live.
- The `create-checkout` edge function reads it and picks between `STRIPE_TEST_SECRET_KEY` (test) and `STRIPE_SECRET_KEY` (live), plus the corresponding price IDs from `pricing.ts`.
- The `stripe-webhook` function accepts both `STRIPE_TEST_WEBHOOK_SECRET` and `STRIPE_WEBHOOK_SECRET`.
- **Amber "TEST MODE" banner** on `/launch/payment` when in test mode, hidden in live.
- **Collapsible "Show test cards" panel** listing Stripe's standard test cards with one-click copy:
  - `4242 4242 4242 4242` → success
  - `4000 0000 0000 0002` → declined
  - `4000 0025 0000 3155` → 3D-Secure challenge
  - `4000 0000 0000 9995` → insufficient funds
- All test cards use any future expiry + any 3-digit CVC. Zero real money moves.

### 5. Export button polish + tester docs
- Rename Capture Brief export buttons to plain English: "Send to my clinician (PDF)", "Save my notes (PDF)", "Copy actions to clipboard".
- New `docs/tester-guide.md`: one-page plain-English guide covering sign-up → access-code path → OR test-card path → where to report bugs.

## Secrets you'll need to provide

I'll open the secure form for each — no values pasted in chat:
1. `STRIPE_TEST_SECRET_KEY` — from Stripe dashboard → Developers → API keys → **Test mode toggle ON** → "Secret key"
2. `STRIPE_TEST_WEBHOOK_SECRET` — Stripe dashboard → Developers → Webhooks → **Test mode** → your webhook endpoint → "Signing secret"

Live keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) stay as-is for go-live.

## What testers experience after this ships

| Path | Steps | Cost |
|---|---|---|
| **Access code** | Sign up → payment page → paste `TESTER01` → in the app | £0 |
| **Stripe test card** | Sign up → payment page → paste `4242…` → full Stripe checkout → in the app | £0 |
| **Failure paths** | Sign up → payment page → paste `4000 0000 0000 0002` → see decline UX | £0 |
| **Live (later)** | Flip `VITE_STRIPE_MODE=live` — no code change | Real £ |

## Reversibility
- Access-code system: 1 table + 1 RPC + 1 UI panel. 10-minute deletion if unwanted.
- Stripe test mode: one env var flip to go live. Banner + test-card panel auto-hide.
- Nothing touches the 4C loop, Memory Bridge, Calendar, You-Are-Here dial, or any core feature.

## Order of build
1. Pricing date bump + sign-in bypass removal (2 min, no secrets needed)
2. Request Stripe test-mode secrets
3. Access-code migration + RPC + payment-page panel
4. Test-mode banner + test-card cheat sheet + edge-function mode switch
5. Export button relabel + tester docs
6. Playwright smoke test: access code path + test-card success path

Approve to build.