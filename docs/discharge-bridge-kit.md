# Discharge Bridge Kit

**Status:** v0.1 spec · Owned by Founder + Lovable · Replaces Brain Games v0.2 as the sprint headline
**Anchor:** 3 July 2026 · **Ships by:** 15 August 2026 (Week 6)
**Companion docs:** [`docs/90-day-sprint.md`](./90-day-sprint.md), [`docs/5-year-vision.md`](./5-year-vision.md)

---

## 1 · What it is (one sentence)

The Discharge Bridge Kit is the tangible artefact a brain-injury survivor and their family walk out of hospital with — a printed 1-pager, a 7-day in-app path, and a clinician-facing PDF — that turns the Clinical-Ready → Life-Ready gap from an idea into something you can hand across a ward bed.

**Who it's for:** the survivor + one family member on discharge day. Secondary: the clinician who signs the discharge note.

---

## 2 · Why it replaced Brain Games in v0.1

Brain Games are a **retention** feature. The Kit is a **wedge** feature: it converts our clinical thesis into a distributable object that a clinician can physically hand over. It is the single fastest way to move from "MyRhythm is an app someone found online" to "MyRhythm is the thing my hospital gave me."

- Brain Games ship-cost: ~8 weeks, ~200 hours, ~£500–1,500 Lovable credits
- Kit ship-cost: ~2 weeks, ~40 hours, negligible credits
- Brain Games converts nothing new. The Kit unlocks LOI conversations, investor narrative, and the "first 30 days home" activation funnel.

Brain Games code remains in place at `/launch/games` — it is not deleted, only demoted from the v0.1 sprint headline.

---

## 3 · The three artefacts

### 3a · Printed 1-pager (the hand-over)
- A4 / US Letter, one page, print-optimised at `/launch/discharge-bridge/handout`
- Headline: **"First 30 Days Home — you don't walk this alone"**
- 5 plain-language bullets (see §5)
- QR code linking to `/subscribe`
- MyRhythm word-mark and the standard medical disclaimer footer
- Designed so a clinician can print a stack and leave them at the ward desk

### 3b · In-app 7-day path (the daily nudge)
- Route: `/launch/discharge-bridge`
- 7 day-cards, one small action per day, in this order:

  | Day | Action | Loop stage |
  |---|---|---|
  | 1 | Invite one Support Circle member | Reconnect |
  | 2 | First Capture (voice or text) | Capture |
  | 3 | First Commit (one thing tomorrow) | Commit |
  | 4 | First Calibrate check-in (how did that feel?) | Calibrate |
  | 5 | Share your first win with your Circle | Celebrate |
  | 6 | First Memory Bridge replay | Continuity |
  | 7 | Review the week + generate a Discharge Handover PDF | Handover |

- Each day = one screen, one primary CTA (56 px min), one skip
- Progress persisted (v0.1: `localStorage` under key `discharge_bridge_progress_v1`; v0.2: promote to Supabase `discharge_bridge_progress` table with RLS)
- On Day 7 completion, offer the clinician handover PDF (§3c)

### 3c · Clinician handover PDF (the return artefact)
- Generated from `src/utils/clinicalExport.ts` via a new `buildDischargeHandoverPdf()` variant
- Contents: patient name, discharge date, Support Circle list, first-week plan (what they committed to and completed), clinician contact block, standard confidentiality footer
- Explicitly labelled **"Prepared by the patient. Not a clinical record."**
- Purpose: the survivor brings this to their first post-discharge appointment. Closes the loop. Gives the clinician a reason to recommend the Kit to the next patient.

---

## 4 · Scope-in / scope-out

**In for v0.1 (by 15 Aug 2026):**
- `/launch/discharge-bridge` 7-day path with `localStorage` progress
- `/launch/discharge-bridge/handout` print page
- Discharge Handover PDF variant in `clinicalExport.ts`
- Copy locked in `src/config/appDescription.ts` as `DISCHARGE_BRIDGE_KIT_DESCRIPTION`
- Kit language reviewed against medical-claims policy (no "treatment", no "rehabilitation" as a claim)

**Out for v0.1 (deferred to v0.2 or later):**
- Server-side progress persistence (Supabase table + RLS)
- Multi-language versions of the handout
- Ward-specific co-branded handouts (waits for LOI 1)
- Analytics on QR scans (needs a redirect service)
- Push notifications for missed days

---

## 5 · Locked copy — printed 1-pager

Do not paraphrase. Any change goes through the founder.

> **First 30 Days Home**
> *You don't walk this alone.*
>
> 1. **Someone knows.** Invite one person to your Support Circle before you leave the ward.
> 2. **Capture, don't remember.** Small voice notes. Your future self reads them back.
> 3. **One thing tomorrow.** Commit to one thing. Not five. Not the whole week.
> 4. **Check in with yourself.** How did that feel? Green, amber, or red. That's the whole check-in.
> 5. **Celebrate small.** Share one win with your Circle every week.
>
> *MyRhythm is a wellness, productivity and cognitive support tool. It is not a medical device, diagnosis, or treatment.*
>
> **[QR to myrhythmapp.com/subscribe]**

---

## 6 · Success metric

**Primary:** % of new Founding Members who complete Day 1 of the Bridge within 48 hours of signup. Target: **≥ 60%** by 1 Oct 2026.

**Secondary:**
- ≥ 30% of new Founding Members complete Day 7 (generate the handover PDF)
- At least one clinician (LOI 1) confirms they will hand out the printed 1-pager to patients
- Bridge completion rate cited in the 5-minute investor Loom demo segment

---

## 7 · Risks

| Risk | Mitigation |
|---|---|
| Founding Members already past discharge feel it doesn't apply | Rename Day 1 CTA for post-discharge users ("Start where you are — invite one person today") |
| Clinicians can't legally hand out a specific product | Position as "a leaflet from a survivor community"; keep MyRhythm mark small on the print version |
| localStorage progress lost on device change | v0.1 accepted trade-off; ship Supabase persistence in v0.2 before scaling past 100 members |
| Copy drifts across surfaces | Single source in `appDescription.ts`; PR check any new use of "discharge" or "first 30 days" |
