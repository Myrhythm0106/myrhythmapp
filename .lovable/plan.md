# Fix founder playbook access and sign-in return

## Confirmed current behavior

- The real app entry point mounts `src/App.tsx`.
- The canonical page exists at `/founder/playbook` and is protected by `AdminRoute`.
- `/playbook` and `/founder-playbook` redirect to the canonical route.
- `/founderplaybook` is not currently registered.
- When signed out, `AdminRoute` redirects to `/auth` without carrying the requested location. The auth page already supports returning to a saved location, but it receives none, so successful sign-in defaults to the dashboard.
- The supplied runtime logs show no active session, matching the current `/auth` screen.

## Changes

1. Add `/founderplaybook` as another redirect alias to `/founder/playbook`.
2. Update `AdminRoute` to preserve the requested founder URL when sending a signed-out user to `/auth`.
3. Keep the existing admin-role check: an authenticated non-admin will see the explicit Access Denied screen rather than the private playbook.
4. Verify all supported links:
   - `/founder/playbook`
   - `/founderplaybook`
   - `/founder-playbook`
   - `/playbook`
5. Verify the signed-out flow reaches sign-in and returns to the playbook after successful admin authentication; separately verify the page renders without a perpetual loading state for an authenticated admin.

## Scope

No playbook content, spreadsheet logic, database schema, or admin permissions will be weakened or changed.