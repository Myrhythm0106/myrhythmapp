# Plain wording for "verify" + finish Support Circle access

## 1. Replace "verify / verification" with everyday words (new)

Landing page (what you are looking at now):
- "Verify my next steps" -> **"Check my next steps"** (story step and the icon row)
- "Why verification matters" -> **"Why checking matters"**

Email sign-up messages (sign-up, sign-in, banners, pop-up):
- "verification email / link" -> **"confirmation email / link"**
- "Verify your email" -> **"Confirm your email"**
- "Email verification required" -> **"Please confirm your email"**
- "I'll verify first" -> **"I'll confirm first"**
- "Verify within 24 hours" -> **"Confirm within 24 hours"**

Only the words people see change; nothing else behaves differently.

## 2. Finish the approved Support Circle access work (unchanged from the approved plan)

- "Where to?" map now opens over the whole screen (already done; to be checked on phone).
- Run the database change (it was paused before running): helper logins, the three levels **See / Support / Step in**, notes, suggested calendar items, and Step-in recordings saved to the person's Memory Bridge.
- Invite screen with the 3-level picker, the helper's "Supporting [name]" page, and two-account testing.

## Technical details

- Copy edits in `MVPCore4C.tsx` (lines ~70, 75, 468), `LaunchRegister.tsx`, `LaunchSignIn.tsx` (toast only; keep the `includes('verify')` error match), `VerificationBanner.tsx`, `EmailVerificationPopup.tsx`. Component/file names unchanged.
- Re-submit the paused migration with access level values `see` / `support` / `step_in`.
- Add the wording task to `roadmap.md`.
