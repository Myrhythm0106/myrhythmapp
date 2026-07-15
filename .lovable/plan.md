## Goal
Every `/launch/*` link in the app must land on a working screen — no 404s, no dead buttons. Fix broken outbound links, add safety-net redirects for known aliases, and add a `/launch/*` catch-all so unknown deep paths (like the current `/launch/account/profile`) recover gracefully instead of hitting NotFound.

## Audit findings

Cross-checked every `/launch/...` string referenced in `src/**` against the routes defined in `src/App.tsx`. Broken outbound links found:

| Where | Broken link | Should go to |
|---|---|---|
| `src/components/launch/AccountDropdown.tsx:56` | `/launch/features` | `/launch/store` |
| `src/pages/launch/LaunchProfile.tsx:81` | `/launch/features` | `/launch/store` |
| `src/pages/launch/LaunchDashboardLegacy.tsx:108` | `/launch/actions` | `/launch/commit` |
| `src/pages/journey/brain-injury/JourneyRegister.tsx:336` | `/launch/sign-in` | `/launch/signin` |
| `src/pages/launch/LaunchDischargeBridge.tsx:46` | `/launch/support-circle` | `/launch/support` |
| `src/pages/launch/LaunchDischargeBridge.tsx:91` | `/launch/memory-bridge` | `/launch/memory` |

Also: the user is currently on `/launch/account/profile`, which is not defined anywhere and currently falls through to `NotFound`. No component navigates there — likely typed/bookmarked — but it exposes the fact that unknown `/launch/*` deep paths 404 today.

Every route referenced in `src/launch/routes.ts` (the You-Are-Here dial source of truth) is defined in `App.tsx` and confirmed working.

## Changes

**1. Fix the 6 broken outbound links** in the 5 files above — one-line `navigate(...)` / `ctaRoute` swaps to the correct existing route.

**2. Add safety-net redirects in `src/App.tsx`** for known `/launch/*` aliases so any hand-typed or historical link recovers instead of 404-ing:

```tsx
<Route path="/launch/memory-bridge"  element={<Navigate to="/launch/memory" replace />} />
<Route path="/launch/support-circle" element={<Navigate to="/launch/support" replace />} />
<Route path="/launch/brain-games"    element={<Navigate to="/launch/games" replace />} />
<Route path="/launch/sign-in"        element={<Navigate to="/launch/signin" replace />} />
<Route path="/launch/features"       element={<Navigate to="/launch/store" replace />} />
<Route path="/launch/actions"        element={<Navigate to="/launch/commit" replace />} />
<Route path="/launch/account/*"      element={<Navigate to="/launch/profile" replace />} />
```

**3. Add a `/launch/*` catch-all** just before the global `NotFound` route so any other unknown `/launch/...` deep path lands on Home instead of 404:

```tsx
<Route path="/launch/*" element={<Navigate to="/launch/home" replace />} />
```

This must be the **last** `/launch/*` route (React Router matches in order) so it never shadows a real route.

## Verification

- Typecheck via `tsgo` (auto-run).
- Manually confirm the 7 alias redirects and 6 fixed links resolve to real screens: click through AccountDropdown → Features & Add-ons, LaunchProfile featured card, Discharge Bridge CTAs, and legacy JourneyRegister sign-in link.
- Confirm `/launch/account/profile` (current URL) now redirects to `/launch/profile` instead of 404.

## Out of scope

- No changes to `src/launch/routes.ts` (dial config) — already correct.
- No new pages, no design changes, no route renames of existing working paths.
- Non-`/launch/*` routes untouched (PR-2 legacy redirects already shipped).