## Goal
1. Lock the two approved app descriptions (user-facing + investor-facing) into every relevant document so wording stays consistent.
2. Unblock live sign-up so you and your husband can start using and testing the app **today**, without waiting on the Resend/SMTP domain setup.

---

## Part 1 — Documentation updates (wording lock)

**Canonical wording to be inserted:**

- **User-facing (primary):**
  > MyRhythm is a digital life empowerment and productivity companion for planning, prioritisation, reminders, emotional check-ins, and everyday follow-through. Designed for people who carry a lot — including those with memory and cognitive challenges.

- **Investor / About (secondary):**
  > Built with project scoping, user-centred design, requirements thinking, and continuous improvement — a wellness, productivity and cognitive support tool. Not a medical device, diagnosis, or treatment.

**Files to update:**
- `docs/v0.1-features.md` — replace opening description block.
- `docs/founding-core-value-map.md` — add "How we describe MyRhythm" section at top.
- `docs/v0.1-friends-family-testing-guide.md` — update the "What is MyRhythm" intro.
- `docs/v0.1-test-readiness.md` — add wording reference at top.
- `README.md` — replace project blurb.
- `index.html` — update `<title>` and `<meta name="description">` to the user-facing version (SEO-trimmed to <160 chars).
- `src/config/disclaimer.ts` (new) — export `APP_DESCRIPTION_USER`, `APP_DESCRIPTION_INVESTOR`, and `DISCLAIMER_TEXT` so future UI reads from one source.
- `mem://brand/app-description` (new memory) — persist both versions + rule "emotional regulation" is banned wording; use "emotional check-ins".
- `mem://index.md` — add reference to the new memory.

Founders Edition Word/PDF docs (Quick Start v2, User Manual v2, GTM Playbook v3) will be regenerated with the same wording on the same pass.

---

## Part 2 — Make the app testable NOW (bypass the email block)

The Resend SMTP is still broken and the managed-email domain isn't set up yet. To get you and your husband in **today** without waiting for DNS, use a two-step unblock:

**Step A — Temporary: disable "Confirm email" in Supabase Auth**
- I'll walk you through the exact toggle (Supabase → Auth → Providers → Email → "Confirm email" OFF).
- Effect: sign-up completes instantly, no email needed.
- Scope: keeps this ON only until managed email is wired. Only shared with you, your husband, and 5 vetted friends — access controlled by the Founding Core invite flow.

**Step B — Seed your two accounts directly (belt & braces)**
- Insert your two accounts via Supabase Auth admin so you can log in immediately even if UI sign-up hiccups.
- Mark both as `founding_comped` in `profiles` so payment gating skips.
- Confirm the Founding Core routes load cleanly for both.

**Step C — Live verification sweep (Playwright)**
- Run the weekend self-test script against both accounts:
  - Register → Assessment (persona-appropriate MYRHYTHM questions) → Welcome (Brain Health snapshot) → Home (name greeting + #IChoose share) → Capture → Commit → Calibrate → Memory Library → Support Circle → Settings.
- Capture screenshots + console/network logs. Report any breakage before you start real use.

**Step D — Restore email confirmation later**
- Once the managed email domain is verified (separate short task), flip "Confirm email" back ON and re-run the sweep. No code changes required at that point.

---

## Order of execution
1. Write/refresh all doc files + new memory (Part 1).
2. Regenerate Founders Edition Word/PDF exports with new wording.
3. Guide you through the Supabase "Confirm email OFF" toggle (30 seconds).
4. Seed you + husband accounts; verify login.
5. Run Playwright sweep across the 9 Founding Core routes.
6. Hand back with a green/red checklist so you know exactly what's testable this weekend.

## Open confirmations before I build
- **Confirm email OFF (temporarily)** — OK to proceed? (Only alternative is waiting on DNS.)
- **Seed accounts** — give me the two email addresses to seed (or I can create `you@myrhythmapp.com` + `husband@myrhythmapp.com` placeholders you rename later).
- **Founders Edition PDFs** — regenerate now, or only after the app sweep passes?
