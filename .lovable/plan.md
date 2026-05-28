# Plan v17 — Let made-up accounts through `/launch/register`

## Goal
Until you say otherwise, anyone can fill in name / email / password on `/launch/register` and immediately proceed into the app. No real Supabase sign-up, no email verification, no "already registered" blocks.

## Scope
Single file change: `src/pages/launch/LaunchRegister.tsx`.

## Behaviour after change
1. User fills the form (or even partial form — minimum: a non-empty name and an `@`-shaped email).
2. On submit:
   - Skip `signUp()` entirely.
   - Save to `localStorage`:
     - `myrhythm_mock_user` → `{ name, email, createdAt }`
     - `myrhythm_user_type` → `prefilledUserType` (if present in URL)
   - Toast: "Account ready — let's get you set up."
   - Navigate straight to `/launch/payment` (if `userType` was prefilled) or `/launch/user-type` (otherwise).
3. The "Check your email" success card is **not shown** in bypass mode.
4. Existing form validation stays in place but is relaxed (password length drop to 1 char so any string works); zod schema kept for shape only.

## How the bypass is gated
Top of file:

```ts
// TEMP: open registration. Flip to false to restore real Supabase signup + email verification.
const BYPASS_REGISTRATION = true;
```

When `BYPASS_REGISTRATION === false`, the file behaves exactly as it does today (current `signUp` + verification card flow untouched).

When `true`:
- `signUp` is not called.
- `registrationSuccess` branch is unreachable.
- `handleSubmit` just stores + navigates.

This keeps the switch back to a one-line edit when you're ready.

## Out of scope
- No change to `useAuth`, `AuthContext`, `MockAuthWrapper`, or `.env` (`VITE_MOCK_SECURITY` stays as-is).
- No change to `/launch/signin`, `/launch/payment`, onboarding, or any downstream guard.
- No DB migrations, no Supabase calls, no edge functions.
- No visual redesign of the page — just the submit behaviour.

## Risks / notes
- Anything downstream that reads `useAuth().user` will still see `null`, because we are not creating a real session. If `/launch/payment` or `/launch/user-type` hard-require an authenticated user, we'll see it the moment we test and can add a follow-up (e.g. flip `VITE_MOCK_SECURITY=true` to get a mock session). Calling out so we don't get surprised.
- `localStorage` only — clears with browser data. Fine for "made-up accounts".

Ready to build on approval.
