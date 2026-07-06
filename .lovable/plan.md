# Confirmed actions + build plan for #2 then #3

## 1 · Confirmed — the 3 needle-movers

Re-stating so we're aligned before I build:

1. **Signed clinical LOI in 30 days** (pull LOI 1 forward from week 9 → week 4). Founder-led, not a build task.
2. **Replace Brain Games v0.2 headline with a Discharge Bridge Kit** — physical + digital handover artefact. Build task. **← Doing now.**
3. **5-minute investor Loom** as the distributable narrative asset (not a deck). Build task. **← Doing after #2.**

Actions #1 and #3 both depend on artefacts from #2 (the Kit is what the clinician actually hands to a patient, and it's the demo moment in the Loom). So #2 first is the correct order.

---

## 2 · Discharge Bridge Kit — what I'll build

### 2a · New doc: `docs/discharge-bridge-kit.md`
Single source of truth for the Kit. Sections:
- What it is (1 sentence) + who it's for (survivor + family member at discharge)
- The 3 artefacts (printed 1-pager, in-app 7-day path, clinician handover PDF)
- Positioning: this IS the Clinical-Ready → Life-Ready bridge, made tangible
- Scope-in / scope-out for v0.1 vs v0.2
- Success metric: % of new Founding Members who complete Day 1 within 48h of signup

### 2b · New route: `/launch/discharge-bridge` (in-app 7-day path)
- New page `src/pages/launch/LaunchDischargeBridge.tsx`
- 7 day-cards, one action per day (Day 1 = invite one Support Circle member; Day 2 = first Capture; Day 3 = first Commit; Day 4 = first Calibrate check-in; Day 5 = share first win with Circle; Day 6 = first Memory Bridge replay; Day 7 = review + clinical export)
- Uses existing `LaunchLayout`, `LaunchCard`, `LaunchButton`
- Progress persisted to Supabase (new table `discharge_bridge_progress` with proper GRANTs + RLS)
- Add route to `src/App.tsx` (or wherever launch routes register) and export from `src/pages/launch/index.ts`

### 2c · New landing entry: printable 1-pager
- New route `/launch/discharge-bridge/handout` — print-optimised page (A4, 1 page, QR to `/subscribe`)
- Headline: "First 30 Days Home — you don't walk this alone"
- 5 bullets + QR + MyRhythm mark + medical disclaimer footer

### 2d · Clinician handover PDF
- Reuse existing `src/utils/clinicalExport.ts`
- Add a new export variant: "Discharge Handover" (patient name, discharge date, Support Circle list, first-week plan, clinician contact block)
- Footer already correct per confidentiality standard

### 2e · Sprint doc updates: `docs/90-day-sprint.md`
- Section 3, Workstream C: replace "Brain Games spec locked / dev / ships 19 Sep" with "Discharge Bridge Kit ships by 15 Aug (week 6)"
- Week-by-week table: swap Brain Games milestones for Kit milestones weeks 5–8; free up weeks 9–13 for LOI work + retention
- Section 5 "not doing": add "Brain Games v0.2 — deferred to post-LOI sprint"
- Section 9 "sprint complete": swap Brain Games checkbox for "Discharge Bridge Kit live and used by ≥ 30% of new members"
- Add note that this change was made to prioritise the clinical-bridge wedge over retention features

### 2f · Memory + brand alignment
- Update `src/config/appDescription.ts` — add `DISCHARGE_BRIDGE_KIT_DESCRIPTION` constant so the Kit's public wording is single-sourced
- Save memory `mem://features/discharge-bridge-kit` describing scope + why it replaced Brain Games in v0.1

---

## 3 · Investor Loom script — what I'll build after #2

### 3a · New doc: `docs/investor-loom-script.md`
- 5-minute tight script with timestamps (0:00–0:45 Discharge Cliff, 0:45–1:30 Life-Ready Gap, 1:30–2:30 Ideal-Brain + TAM, 2:30–3:30 product demo including the new Discharge Bridge Kit as the demo moment, 3:30–4:15 traction, 4:15–5:00 ask + moat)
- Verbatim spoken lines (not bullets) — memorisable, conversational, front-loaded with the Founding Member number and 1 LOI target
- Cited stats pulled from `THIRD_PROBLEM_STATS` in `src/config/appDescription.ts` — no new numbers invented
- Shot list: which route/screen to record for each 30-second segment
- Recording checklist (screen resolution, mic, one-take rules, thumbnail frame)

### 3b · New doc: `docs/investor-loom-distribution.md`
- Where the Loom lives (unlisted YouTube + Loom link)
- Who gets sent it and in what wording (3 templates: cold investor, warm intro, clinician)
- Tracking: Loom's built-in view analytics = the metric

### 3c · Optional in-app surface (small)
- Add "For Investors" link on `/launch/roadmap` or `/launch/about` that opens the Loom (external link, no build cost beyond an anchor tag). Only if founder wants it public — otherwise keep it private-share only.

---

## What I am NOT touching in this build

- Brain Games code (`src/components/brain-games/*`, `LaunchBrainGames.tsx`) — left in place, still accessible; just removed from the sprint headline and roadmap v0.2 milestone
- `roadmapData.ts` £500K ARR target — separate reconciliation conversation
- Marketing site rebuild
- Trademark / Section 10 budget
- Any medical-claim-adjacent copy (Kit language is "companion", "handover", "first 30 days home" — never treatment/rehabilitation as a claim)

---

## Order of operations when you approve

1. Write `docs/discharge-bridge-kit.md`
2. Update `docs/90-day-sprint.md`
3. Create Supabase migration for `discharge_bridge_progress` (with GRANTs + RLS)
4. Build `/launch/discharge-bridge` page + register route
5. Build `/launch/discharge-bridge/handout` print page
6. Extend `clinicalExport.ts` with Discharge Handover variant
7. Update `src/config/appDescription.ts` + save memory
8. Write `docs/investor-loom-script.md`
9. Write `docs/investor-loom-distribution.md`
10. Short summary at end with what to record first and who to send LOI outreach to

Approve this and I'll switch to build and ship it in this order.
