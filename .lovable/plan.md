# Fix: nothing shows at /playbook

## What's happening

The playbook page is registered only at `/founder/playbook`. You are viewing `/playbook`, which has no route defined, so the app falls through to the not-found screen — the page itself is fine.

One admin account exists (`aarontochukwu@yahoo.com`), so the admin gate will pass once you're on the right URL signed in as that account.

## Change

- Add a redirect route `/playbook` → `/founder/playbook` in `src/App.tsx`, alongside the existing legacy redirects.
- Do the same for `/founder-playbook` as a convenience alias.

No other files change; no database or business-logic changes.

## After the change

Visiting `/playbook` lands on the founder playbook page (summary cards, gates, next 4 weeks, metrics, download/upload). If you see "Access Denied" instead, you're signed in as a non-admin account.
