# MyRhythm Next 3-Phase Plan

In the order you asked for: make recording/playback bulletproof, prove launch-readiness, then run a focused founding-market push.

```text
Phase 1  →  Phase 2  →  Phase 3
Recording  →  Launch  →  Go-to-market
reliability  readiness  motion
(Week 1)    (Week 2)   (Weeks 3-8)
```

---

## Phase 1 — Recording & Playback Reliability

Goal: a user can tap the circle, record on any device, save, extract actions, and play it back without a silent failure.

1. **Ship the diagnostic layer that already exists**
   - Keep the frame/permission/allowance panels in `LaunchMemoryBridge`.
   - Keep the singleton `useAudioPlayer` and `RecordingPlayer` scrub/progress/skip UI.

2. **Close the remaining unknowns**
   - Add an explicit toast + console log when `startRecording` returns false, so there is never a silent path.
   - On playback failure, render the failure reason inline in `RecordingPlayer` (not just a toast that can be missed), with a one-tap retry.
   - Verify the IndexedDB restore path reloads a pending recording and still lets the user save and extract.

3. **Device test matrix**
   - Desktop Chrome (own tab, not preview iframe).
   - iPhone Safari as installed PWA.
   - Android Chrome as installed PWA.
   - Test 20 s, 2 min, and 10 min recordings to confirm 4-hour cap is set but not tested in full.

4. **Pass criteria**
   - Record starts on first tap, timer and level meter move.
   - Save completes, a reference code is generated, actions appear.
   - Play button starts audio within one tap, progress bar moves, pause/resume and 15 s skip work.
   - A second recording stops the first playback.
   - Purged audio shows "Audio no longer stored" instead of a dead play button.

---

## Phase 2 — Launch Readiness (MVP Sign-Off)

Goal: confirm the app is safe, coherent, and complete enough for real users.

1. **Scope lock**
   - Surface only the 9 Founding Core routes in nav: `home`, `capture`, `commit`, `calibrate`, `celebrate`, `memory`, `calendar`, `support`, `settings`.
   - Keep all other `/launch/*` routes reachable by direct URL but out of the dial/primary nav.
   - Confirm legacy redirects: `/dashboard` → `/launch/home`, `/memory-bridge` → `/launch/memory`, `/calendar` → `/launch/calendar`.

2. **End-to-end smoke test using `docs/v0.1-weekend-self-test.md`**
   - Public funnel: landing → user type → assessment → payment → welcome.
   - 4C loop: capture a voice memo, review extracted actions, commit to the diary, calibrate, celebrate.
   - Support Circle: invite, toggle `can_record_on_behalf`, confirm it persists.
   - Safety net: no-medical-claims disclaimers, GDPR download, edition badge, feedback write.

3. **Mobile install pass**
   - Verify PWA manifest and icons.
   - Document the 3-tap install flow on iOS Safari and Android Chrome.
   - Confirm installed app opens at `/launch/home` for returning users.

4. **Pass criteria**
   - All weekend self-test checkboxes ticked.
   - No 🟥 failures; ≤2 🟧 failures ship with a known-issues note.
   - `founding_feedback` table receives no critical bug reports in a 48-hour founder-run test.

---

## Phase 3 — Founding-Market Go-to-Market

Goal: 100 Founding Members and 3 signed clinical Letters of Intent by 1 October 2026.

1. **Prepare the minimum assets**
   - Record the 5-minute Loom using `docs/investor-loom-script.md`.
   - Print or PDF the Discharge Bridge Kit handout from `/launch/discharge-bridge/handout`.
   - Finalise Ring 1–4 email templates from `docs/founders-market-marketing-plan.md`.
   - Create one contact spreadsheet: name · ring · last touch · status.

2. **Run the four-ring outreach**
   - Week 3: Ring 1 (personal warm list) — 5–10 personal emails/week asking them to try the app and become a Founding Member.
   - Week 4: Ring 2 (brain-injury community contacts) — ask for one survivor/carer tester each.
   - Week 5: Ring 3 (clinicians/rehab) — 25-min calls, Discharge Bridge Kit handout, LOI ask.
   - Ongoing: Ring 4 (founders/advisors) — one warm intro per contact into Rings 1–3.

3. **Feedback loop**
   - Route all feedback into `founding_feedback` with `route`, `category`, and `edition_version`.
   - Founder reviews feedback weekly; anything blocking the 4C loop gets a fix in the next weekly build.
   - Monthly founder update email to everyone contacted.

4. **Pass criteria**
   - 100 paying Founding Members (£10/mo) or 100 active free-trial accounts if Stripe live is not yet on.
   - 3 signed LOIs from rehab centres, NHS trusts, or ABI charities.
   - ≥40% weekly-active rate among members.

---

## Guardrails

- **No deletions.** Anything not needed for the founding cohort is archived to `src/_archive/`, not deleted.
- **One primary CTA during Founding phase.** "Become a Founding Member" everywhere.
- **No medical claims.** Use only the language in `docs/claims-policy.md` and `docs/v0.1-test-readiness.md`.
- **No 5th C.** The 4C loop stays as Capture / Commit / Calibrate / Celebrate.
- **Memory-First Design™** appears only where the brand rules already allow it.

## Out of scope

- New feature routes beyond the 9 Founding Core routes.
- Public paid advertising, social content calendar, or press outreach.
- Live Stripe mode (remains Test Mode until explicit sign-off).
