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

## Phase 3 — Founding-Market Go-to-Market & Marketing Strategy

Goal: 100 Founding Members and 3 signed clinical Letters of Intent by 1 October 2026.

### 3.1 Positioning (the single line everything hangs off)

> **MyRhythm is the app that keeps your plan going after the appointment ends or the commitment has been made.**

- Category descriptor: **Memory-First Design™**.
- Hero feature in all external messaging: **Memory Bridge** (record → agreed next steps → shared with the people who matter). This resolves the open decision in `strategic-documents/Memory-Bridge-Positioning-Decision.md`; the in-app 4C loop is unchanged.
- Three problems, in this order: the **Discharge Cliff**, the **Clinical-Ready vs Life-Ready Gap**, the **Ideal-Brain Assumption**.
- Every audience block uses the 4Rs verbatim: **Remove / Reduce / Return / Reconnect**.
- Language discipline: confidence, identity, behaviour and quality of life. Never clinical outcome language. Never diagnose, treat or cure.

### 3.2 Messaging by audience

| Audience | Their words for the problem | Our promise | Proof to show |
|---|---|---|---|
| Survivor / post-discharge | "They said I was ready. I don't feel ready." | Your plan keeps going after the appointment ends. | Discharge Bridge Kit, Memory Bridge capture |
| Carer / family | "I'm the only one holding it all." | No one walks alone — Reconnect. | Support Circle, shared next steps |
| ADHD / stress / focus | "I know what to do, I just don't follow through." | Follow-through that fits the day you're actually having. | Energy-matched schedule, reminder ladder |
| Clinician / rehab centre | "We lose sight of them at discharge." | Written evidence of follow-through after discharge. | 30/60/90-day continuity report, clinical export PDF |
| Investor / advisor | "Is there a real channel here?" | Consumer entry, clinical distribution. | Loom, data room, LOIs |

### 3.3 Assets to prepare before Week 1

- 5-minute Loom recorded from `docs/investor-loom-script.md`, distributed per `docs/investor-loom-distribution.md`.
- Discharge Bridge Kit handout, printed and PDF, from `/launch/discharge-bridge/handout`.
- Confidential PRD preview PDF for anyone pre-NDA.
- Ring 1–4 email templates finalised from `docs/founders-market-marketing-plan.md`.
- One contact spreadsheet: name · ring · last touch · status · outcome.
- Monthly Founder Update email template.

### 3.4 Channels — only what one founder can maintain

Do the top three religiously. Everything else waits for 3 LOIs.

1. 1:1 personal email from the founder's own address — 5–10 per week.
2. WhatsApp / Signal warm introductions.
3. Loom link attached to every clinician and angel email.
4. Printed Discharge Bridge Kit at every clinician meeting.
5. Monthly Founder Update, first Monday of the month.
6. Face-to-face at meetings already in the diary.

**Deliberately excluded during the founding window:** paid ads, LinkedIn/X/TikTok content calendars, press outreach, podcast tour, webinars, referral software, CRM tooling.

### 3.5 Eight-week outreach cadence

| Week | Ring | Action | Weekly target |
|---|---|---|---|
| 3 | Ring 1 — personal warm list | Personal emails: try it, become a Founding Member, pass to one person like you | 10 sends |
| 4 | Ring 1 + Ring 2 — brain-injury community | Ask each contact for one survivor or carer tester | 10 sends |
| 5 | Ring 3 — clinicians / rehab | 25-min calls, Bridge Kit handout, LOI ask | 4 calls booked |
| 6 | Ring 3 continued | Follow-up, continuity report walkthrough, LOI sent | 2 LOIs out |
| 7 | Ring 4 — founders / advisors | One warm intro each, into Rings 1–3 | 8 asks |
| 8 | All rings | Second-touch on non-repliers, first Founder Update | 30 touches |

### 3.6 Conversion path (one CTA, no forks)

```text
Warm email  →  Landing page  →  Become a Founding Member  →  /subscribe
                                                              ↓
                              Access code (testers) or Stripe test/live checkout
                                                              ↓
                    Assessment  →  /launch/home  →  first Memory Bridge capture
```

Activation moment to optimise for: **first capture that produces at least one scheduled next step**. Anyone who reaches it is counted activated; anyone who doesn't gets a personal follow-up from the founder.

### 3.7 Metrics reviewed every Monday

- Sends by ring · replies by ring (targets: warm ≥40%, cold ≥10%, clinician ≥60%).
- Loom viewers past 3:30 (the qualified-lead signal).
- Sign-ups · activated (first capture → scheduled step) · weekly active.
- Founding Member count against the 500-seat cap; Friends & Family against the 50-seat cap.
- LOIs: contacted → call → kit sent → signed.

Log one line per week in `docs/90-day-sprint.md` §8. No new tooling.

### 3.8 Feedback loop

- All feedback lands in `founding_feedback` with `route`, `category`, `edition_version`.
- Anything blocking the 4C loop is fixed in the next weekly build.
- Every fifth fix gets named in the Founder Update: "you said, we changed".

### 3.9 Pass criteria

- 100 Founding Members at £10/mo, or 100 activated trial accounts if Stripe is still in Test Mode.
- 3 signed LOIs from rehab centres, NHS trusts, or ABI charities.
- ≥40% weekly-active rate among members.
- ≥60% of new members reach the activation moment within 7 days.

### 3.10 Documents to update

- `docs/founders-market-marketing-plan.md` — add the positioning line, messaging table, conversion path, activation metric and 8-week cadence.
- `strategic-documents/Memory-Bridge-Positioning-Decision.md` — mark approved, Memory Bridge leads external messaging.
- `docs/90-day-sprint.md` — add the weekly metric line format.


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
