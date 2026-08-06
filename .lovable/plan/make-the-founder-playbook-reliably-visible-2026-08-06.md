# Make the Founder Playbook reliably visible

## Confirmed blocker

- `/playbook`, `/founderplaybook`, and `/founder-playbook` all resolve to the canonical `/founder/playbook` route.
- The canonical route is protected by the admin gate.
- A fresh live-browser test reaches `/auth` because there is no signed-in session; the current preview is also on `/auth` and recent auth logs show no active user.
- One admin role exists in the database, so access must remain limited to that authenticated admin account.
- The playbook component and route are present, and no playbook runtime error was found.

## Changes

1. Make every playbook alias carry an explicit, refresh-safe return URL to the founder playbook when authentication is required.
2. Update the auth screen to recognise a founder-playbook request and clearly say that signing in with the founder/admin account will open the playbook.
3. After successful sign-in, return directly to `/founder/playbook` instead of the dashboard or general app home.
4. If a session already exists on the auth screen, make the primary action open the preserved destination rather than always opening the dashboard.
5. Keep the existing admin-role check. A signed-in non-admin will receive a clear access-denied message; the private playbook will not become public.

## Verification

- Test all four URLs while signed out and confirm each reaches the founder-specific sign-in state.
- Test refresh on the sign-in page and confirm the playbook destination is retained.
- Test successful admin authentication and confirm the final URL and visible heading are `/founder/playbook` and “MyRhythm Playbook”.
- Test a signed-in non-admin path separately and confirm it remains denied.

## Scope

No playbook content, spreadsheet data, database schema, or admin permissions will be changed.