## Goal
Seed two founding test accounts (`annabelaaron@gmail.com`, `annabelaaron@yahoo.com`) and mark them as `founding_comped` so payment/trial gating is skipped everywhere.

Current state (checked):
- `annabelaaron@gmail.com` **already exists** in `auth.users` (id `cee95ac5-…`).
- `annabelaaron@yahoo.com` **does not exist** yet.
- `profiles` has no `founding_comped` column yet.
- `subscriptions` has no comped concept — everything runs off `status` + `trial_end`.

---

## Step 1 — Schema: add the comped flag (migration)

Add a single source of truth on `profiles`:

- `founding_comped boolean not null default false`
- `founding_member boolean not null default false` (for the badge / UI, separate from comped)

Update `public.get_user_subscription_status(uuid)` so that if `profiles.founding_comped = true` it returns `'founding_comped'` before any other status check. This means every existing gate that calls this RPC (or checks the subscription table) will treat these users as fully entitled without touching Stripe.

No RLS policy changes needed — users already read their own profile row.

## Step 2 — Seed the Gmail account (already exists)

Data-only changes (insert tool):

1. `UPDATE public.profiles SET founding_comped = true, founding_member = true, name = COALESCE(name,'Annabel') WHERE id = 'cee95ac5-eeea-49c5-8a88-571199ef0f2d';`
2. Upsert a `subscriptions` row for that user:
   - `status = 'active'`, `plan_type = 'founding_comped'`
   - `current_period_start = today`, `current_period_end = today + 5 years`
   - no Stripe IDs.

## Step 3 — Seed the Yahoo account (does NOT exist)

Auth users can't be created from a SQL migration safely (password hashing, identities row, confirmation state). Two options — pick one:

**Option A (recommended): one-shot edge function `seed-founding-account`.**
- Uses `SUPABASE_SERVICE_ROLE_KEY` server-side.
- Calls `supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name: 'Annabel (Yahoo)' } })`.
- Then runs the same profile + subscription updates as Step 2 for the new user id.
- I invoke it once from the sandbox with a temp password you choose (or auto-generated and returned to you once, never logged).
- Then the function is deleted so it can't be reused.

**Option B: you create the Yahoo user manually in Supabase Dashboard → Auth → Users → "Add user" (check "Auto Confirm"), then I run the profile + subscription update.**

Either way you end up with an immediately-usable login. Option A is one click for you (I run it); Option B needs 30 seconds in the dashboard.

## Step 4 — Verify

Run a read query confirming both users show:
- `profiles.founding_comped = true`
- `profiles.founding_member = true`
- `subscriptions.status = 'active'` and `plan_type = 'founding_comped'`
- `get_user_subscription_status(user_id)` returns `'founding_comped'`

Then a quick Playwright login sweep on both accounts to confirm no paywall appears on the 9 Founding Core routes.

---

## Open confirmations before I build
1. **Yahoo account creation** — Option A (I run a one-shot edge function) or Option B (you add it in the Supabase dashboard)?
2. **Temp password for Yahoo** — pick one you'll change on first login, or let me auto-generate and show once?
3. OK to store `founding_comped` on `profiles` (vs a separate `founding_comped_users` table)? Profiles is simpler; a separate table is only worth it if you plan to track history of who was comped and when.