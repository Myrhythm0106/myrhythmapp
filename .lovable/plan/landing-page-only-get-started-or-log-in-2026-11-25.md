# Landing page: only "Get Started" or "Log In"

## What changes
- Remove "Go to your day" and "Continue where you stopped" from every spot on the landing page (top banner, main button, middle and bottom buttons, sticky phone button).
- Everywhere, the landing page offers just two choices: **Get Started** (register as a new client) and **Log In**.
- Remove the "Sign out" button from the landing banner, so it always looks the same.
- If someone who is already signed in taps **Log In**, they go straight to their Home (or back to their questions if they stopped part way), with no need to type their details again.
- Inside the app, people still reach their day through the Home tab as now.

## Technical details
- `src/components/mvp/MVPCore4C.tsx`: drop the `user ?` banner branch so the banner always renders Log In + Get Started; replace `primaryLabel` with fixed "Get Started" and route `handlePrimary` to `/launch/register` (new) ; Log In handler: if signed in, `resolveEntryRoute('start', user.id)`, else `/launch/signin`.
- Update `entryRoute.ts` comment and the AGENTS.md landing rule so labels no longer vary by entry state.
- Check signed-in and signed-out at phone width.
