# Founders-Launch Readiness Plan

Four parts as requested: (1) Pomodoro-alignment of Brain-Healthy Scheduling, (2) app status rating, (3) problem-fit + competitive read, (4) exact gap-close actions to ship to Founders.

---

## 1. Anchor Brain-Healthy Scheduling + Time-Blocking to the Pomodoro evidence base

Right now `BRAIN_HEALTHY_DEFAULTS` (15-min gaps, 10-min breaks, 120-min longer-break trigger, 20-min longer break) is sensible but presented as MyRhythm opinion. Grounding it in Pomodoro + ultradian-rhythm research gives testers and clinicians something to trust and stops it reading as arbitrary.

**Evidence base we'll cite (short, non-medical, in tooltips + Handbook):**
- Classic Pomodoro (Cirillo): 25 min focus / 5 min break, long break 15–30 min every 4 cycles.
- Ultradian BRAC (Kleitman): ~90-min work cycles with recovery dips — supports our 120-min "longer break trigger".
- DeskTime study: highest-performing 10% average 52 min on / 17 min off — supports the "Classic Focus" and "Recovery-friendly" templates.
- Meeting-fatigue research (Microsoft Human Factors Lab, 2021): 10-min gaps between back-to-back meetings measurably reduce cumulative stress markers — supports the meeting-gap rule.

**Concrete changes (build-mode work):**

1. **Add a `pomodoroPreset` to defaults** in `src/launch/scheduling/defaults.ts`:
   - `classic_pomodoro` → work 25 / short 5 / long 15 / long-every 4
   - `long_focus` → 50 / 10 / 20 / 4 (aligns with existing `cognitive-optimization` preset in `PomodoroSetupFlow.tsx`)
   - `gentle_recovery` → 15 / 10 / 20 / 2 (aligns with existing `brain-injury` preset)
   - `desktime_52_17` → 52 / 17 / 25 / 3
2. **Unify the two Pomodoro sources.** Today `src/contexts/PomodoroContext.tsx` (hard-coded 25 min) and `src/components/pomodoro/types.ts` (`DEFAULT_SETTINGS`) are duplicative and neither talks to Brain-Healthy prefs. Make `PomodoroContext` read from `useBrainHealthyPrefs` so a single knob drives the timer, the auto-inserted breaks, and the "longer break" trigger.
3. **Add a "Focus cycle" section to `BrainHealthySettingsCard`** with the 4 presets above + a "Custom" that exposes the same steppers already built. Label each preset with a one-line evidence chip (e.g. "Pomodoro · Cirillo 1987").
4. **Auto-insert breaks in `ensureRecoveryBreaks`** using the preset's short/long rules, not just the flat `break_length_minutes`.
5. **Template alignment.** Rename time-block templates in `src/launch/scheduling/timeBlockTemplates.ts` so the mapping is obvious:
   - `classic_focus` → "Pomodoro Classic (25/5)"
   - `meeting_heavy` → "Meeting-heavy + micro-resets"
   - `recovery_friendly` → "Gentle recovery (15/10)"
   - add `desktime_52_17` → "Deep work 52/17"
6. **Handbook + tooltips.** Add a "Why these numbers?" reveal on the settings card (progressive-reveal pattern already used in Memory Bridge) with the 4 citations above. Update `docs/tester-guide.md` accordingly.

---

## 2. Current status rating

Scored 1–5 against what a Founders cohort actually judges.

| Area | Score | Note |
|---|---|---|
| Core loop (Capture → Commit → Calibrate → Celebrate) | **4.5** | End-to-end works; extract + schedule proven this week. |
| Memory Bridge | **4** | Recorder, transcription, action extraction, 4-hr cap, quota countdown all live. Missing: co-listen ("Bring a Witness") — already scoped v0.2. |
| Calendar / PA feel | **4** | Daily Brief, reschedule, Google + Outlook push/pull, event modal with invites + reminders + recurrence. Missing: time-block **visual lanes** on the calendar. |
| Brain-Healthy Scheduling | **3.5** | Settings shipped this turn. Enforcement banners in Add-Event / Reschedule modals + Daily Brief nudge still open (listed in working state). |
| MyRHYTHM-G growth layer | **4** | Picker, chip, states, Amen/Leaf alignment documented. |
| Support Circle / Loop-in | **4** | Roles + presets shipped; invite round-trip works. |
| Discharge Bridge Kit | **3** | Handout + clinician PDF live; full Discharge-Summary→Plan feature correctly deferred to v0.2. |
| Onboarding + You-Are-Here dial | **4** | 9 persona paths land on Welcome; dial gated post-auth. |
| Payments + access-code tester bundle | **4** | Stripe test mode + `founding_access_codes` gate. |
| Visual system (Emerald Prestige + Ember) | **4.5** | Consistent across /launch. |
| Accessibility (16px floor, 56px targets, focus rings) | **3.5** | Baseline met; needs a final sweep. |
| SEO / meta / social preview | **3** | Not verified this cycle. |
| Security posture (RLS, MFA, Vault) | **4** | Linter warnings on unrelated tables still open. |
| Docs (Handbook, Tester Guide, In-app Guide) | **3.5** | Handbook refresh pending Pomodoro citations + Brain-Healthy Scheduling section. |

**Overall Founders-launch readiness: 3.9 / 5.** Shippable to a small, hand-held cohort in ~5–7 working days once section 4 is closed.

---

## 3. Problem-fit and competitive read

**Your three-failure problem definition — how MyRhythm now answers each:**

1. **The Discharge Cliff.** Addressed by the Discharge Bridge Kit v0.1 (handout + clinician PDF at `/launch/discharge-bridge`) and the Pre/Post-discharge on-ramps. Full AI-drafted Life-Ready Plan lands v0.2 — this is the right sequencing.
2. **Clinical-Ready vs Life-Ready Gap.** Answered by Memory Bridge (record → extract → schedule → share) + Calendar PA layer + Support Circle. This is the demo-in-10-seconds moat.
3. **Ideal-Brain Assumption.** Answered by Brain-Healthy Scheduling + Time-Blocking + MyRHYTHM-G (honest "messy middle" states) + Inclusive-Design guardrails (16px / 56px / max-3 choices). Pomodoro grounding (section 1) closes the last credibility gap here — it says out loud "we designed for real brains, and here's the science".

**Competitive read (same-category tools):**
- Calendly / Motion / Reclaim: strong AI scheduling, zero cognitive-continuity or clinical layer.
- Otter / Fireflies: strong transcription, no scheduling, no Support Circle, no life-readiness framing.
- Headway / BrainHQ / Constant Therapy: cognitive exercises, no daily-life PA.
- Rehab-specific apps (Brain in Hand, MindMate): closest peers; weaker on AI + calendar sync + growth-mindset layer, no discharge-bridge.

**MyRhythm's defensible position:** the only product that stitches capture → schedule → share-with-clinician → grow-with-circle behind Memory-First Design™ and the 4C loop on a Collaborative Cognitive Continuity layer. Nothing in this plan contradicts that thesis.

---

## 4. Exact actions to close before Founders launch

Grouped by must-ship vs nice-to-have. Every item names the file(s) and the acceptance check.

### A. Must-ship (blocks Founders invite emails)

**A1. Finish Brain-Healthy enforcement (the reason section 1 exists).**
- Read `src/components/launch/calendar/LaunchAddEventModal.tsx` and insert an EMBER-accent banner using a new `evaluateBrainHealthyFit(event, prefs, blocks)` helper. Actions: "Shift to suggested time" and "Loosen this rule".
- Same in `src/components/launch/calendar/LaunchRescheduleModal.tsx`.
- Create `src/components/launch/calendar/TimeBlockLanes.tsx` and mount in `src/pages/launch/LaunchCalendar.tsx` — translucent lanes behind events, drag-to-resize.
- Add meeting-heavy nudge to `LaunchDailyBrief.tsx` ("You have 5 back-to-back — insert 2 resets?").
- Acceptance: booking a meeting into a Protected Window or over the daily cap shows a non-blocking banner with a one-tap fix.

**A2. Pomodoro grounding (section 1 items 1–6).** Acceptance: settings card shows 4 presets with evidence chips; Handbook has "Why these numbers?" section.

**A3. Test-readiness checklist sweep.** Run `docs/v0.1-test-readiness.md` end-to-end on a real device. Every unchecked box either gets ticked or gets a v0.2 tag. No half-states.

**A4. Legal + disclaimer surfaces.** Confirm no-medical-claims disclaimer on: Welcome, Assessment, Memory Bridge, Clinical Export, Discharge Bridge Kit, new Pomodoro tooltips.

**A5. Payments dry-run in test mode.** One tester per tier (Founding / Premium / Family) round-trips subscribe → cancel → resubscribe using access codes. Screenshot each state.

**A6. Auth + routing regression.** Signed-in users on `/` route to `/launch/home` or `/launch/welcome` per rules in memory. Sign-out clears the You-Are-Here dial. Legacy redirects (`/dashboard`, `/memory-bridge`, `/calendar`, `/gratitude`) all resolve.

**A7. SEO + share preview.** Update `index.html` title / meta description / og:title / og:description / twitter:card with locked app description from `src/config/appDescription.ts`. Verify social preview on WhatsApp, LinkedIn, iMessage.

**A8. Founders comms pack.** In `docs/`:
- `founders-welcome-email.md` — invite copy + access code + tester guide link.
- `founders-day-1-checklist.md` — what to try in the first 15 minutes.
- Update `docs/tester-guide.md` with new Brain-Healthy + Pomodoro sections.

### B. Should-ship (visible polish, low risk)

**B1. Accessibility sweep.** Automated axe pass on `/launch/welcome`, `/launch/home`, `/launch/capture`, `/launch/commit`, `/launch/calendar`, `/launch/memory`, `/launch/settings`. Fix any AA contrast fails inside the Emerald Prestige tokens — do not hardcode colours.

**B2. Empty-state pass.** Every core surface (Home, Calendar, Memory Bridge, Support Circle, Growth) has a warm empty state with one primary CTA. No blank grids.

**B3. Handbook refresh (all three).** Printable Handbook, in-app User Guide, Tester Handbook — add Brain-Healthy + Pomodoro + Time-Blocking + MyRHYTHM-G sections. Confidentiality footer + `Founding Edition · v0.1` on every page.

**B4. Analytics smoke test.** Confirm `analytics_events` captures: assessment_completed, subscribe_started, capture_saved, action_extracted, event_created, block_created, growth_state_selected. Founders debrief depends on this.

### C. Defer to v0.2 (already documented)

- Discharge Summary → Life-Ready Plan
- Memory Bridge "Bring a Witness" co-listen
- Provider Directory Marketplace
- Free-account "Start Your Journey" CTA return

### Suggested sequencing (5 working days)

```text
Day 1  A1 (enforcement + lanes)             + A2 (Pomodoro presets)
Day 2  A1 finish (Daily Brief nudge)        + B3 Handbook refresh
Day 3  A3 checklist sweep                   + A4 disclaimers
Day 4  A5 payments + A6 auth regression     + B1 a11y sweep
Day 5  A7 SEO + A8 Founders comms           + B2 empty states + B4 analytics
```

At end of Day 5 you send the Founders invite email.

---

## Technical details

- **Files to create:** `src/components/launch/calendar/TimeBlockLanes.tsx`, `src/launch/scheduling/evaluateBrainHealthyFit.ts`, `docs/founders-welcome-email.md`, `docs/founders-day-1-checklist.md`.
- **Files to edit:** `src/launch/scheduling/defaults.ts` (add `pomodoroPreset` + presets), `src/launch/scheduling/timeBlockTemplates.ts` (rename + add `desktime_52_17`), `src/contexts/PomodoroContext.tsx` (bind to `useBrainHealthyPrefs`), `src/components/launch/BrainHealthySettingsCard.tsx` (Focus-cycle section + evidence chips), `src/components/launch/calendar/LaunchAddEventModal.tsx`, `src/components/launch/calendar/LaunchRescheduleModal.tsx`, `src/components/launch/calendar/LaunchDailyBrief.tsx`, `src/pages/launch/LaunchCalendar.tsx`, `index.html` (SEO), `docs/tester-guide.md`, `docs/v0.1-test-readiness.md`, `src/docs/UserGuide.tsx`.
- **No new tables required.** `time_blocks` and extended `user_schedule_preferences` already migrated.
- **Memories to add on approval:** `mem://features/brain-healthy-scheduling` (Pomodoro grounding + 4 presets + citations), `mem://features/founders-launch-checklist` (Day-1..Day-5 sequencing).
- **Guardrails preserved:** no medical claims, Memory-First Design™ external / 4C internal, max 3 primary choices, 56px targets, Founding-Core route lock.
