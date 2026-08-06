# Restore Founder Playbook Access

## Confirmed cause
- `/founder/playbook` is correctly wrapped by the admin-only route.
- The guard shows **Access Denied** only after confirming a user is signed in but `has_role(user.id, 'admin')` returns false.
- The database currently has exactly one admin assignment: the existing `a***@yahoo.com` founder account.
- The second founder account currently being used has not been assigned the admin role, so authentication succeeds but authorization fails.

## Changes
1. **Keep the existing founder admin**
   - Preserve the current admin assignment; do not replace or downgrade it.

2. **Authorize the current founder account**
   - Identify the signed-in account by its authenticated user ID, not by a client-supplied role or local storage.
   - Add an `admin` row for that user in `public.user_roles`, retaining both founder accounts as requested.
   - Avoid duplicate assignments using the table's existing user/role uniqueness rule.

3. **Make access failures actionable**
   - Update the admin guard so a signed-in non-admin sees which account is active and gets clear actions to return home or switch accounts.
   - Distinguish a genuine “not an admin” result from a role-check/network failure instead of silently treating every error as denied.
   - Keep the playbook itself admin-only; do not weaken RLS or expose founder data to ordinary users.

4. **Verify both paths**
   - Confirm the new founder account opens `/founder/playbook` and can load `founder_playbook_progress`.
   - Confirm the original founder admin still has access.
   - Confirm a normal non-admin account remains denied and receives no playbook data.

## Technical details
- Use the existing `public.user_roles` table and `public.has_role` security-definer function.
- This is a role-data correction plus guard UX/error handling; no new table or permissive RLS policy is needed.
- Role authority remains server-backed in Supabase and is never inferred from email, URL parameters, or browser storage.

## Definition of done
- Both founder accounts have explicit admin assignments.
- `/founder/playbook` renders for both founder accounts.
- Non-admin users remain blocked.
- Role lookup failures display a retryable error rather than a misleading authorization verdict.