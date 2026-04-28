# Plan: Codify the "Clinical-Ready vs Life-Ready" Gap as a Core Pillar

## The Insight to Encode

A patient can be **clinically discharged** (vitals stable, scans clear, mobility safe) yet remain **life-unready** (cannot reliably manage medications, appointments, energy, relationships, work, or daily intentions). MyRhythm exists to bridge that gap — and the **clinical team must be active participants**, not just referrers. This becomes a stated product pillar, a narrative anchor for investors, and a concrete clinical workflow.

This pairs with the existing "Discharge Cliff" narrative already in the investor script, sharpening it from a problem statement into a **product mechanism with clinical co-ownership**.

---

## Part 1: Strategy & Investor Document Updates

Add a consistent new section — **"The Clinical-Ready vs Life-Ready Gap"** — to the following docs, positioned immediately after the existing problem/Discharge Cliff section:

| File | Update |
|------|--------|
| `VISION.md` | New top-level section "Bridging Clinical Readiness to Life Readiness" + add as 6th strategic pillar |
| `MyRhythm_Investment_Presentation_Deck.md` | New slide "The Readiness Gap" between Problem and Solution slides |
| `MyRhythm_Investor_Presentation_Script.md` | New 60-second segment after Discharge Cliff |
| `MyRhythm_Executive Summary_One_Page.md` | One-line addition to the problem framing |
| `MyRhythm_Executive_Strategy_Overview.md` | New "Clinical Bridge Pathway" subsection in Phase 1 |
| `MyRhythm_Value_Proposition_USP_Document.md` | Add as USP #1: "Only platform clinically co-owned across the readiness gap" |
| `MyRhythm_Justification_and_Commercials_Document.md` | Add NHS/clinical commissioning angle leveraging the gap |
| `docs/myrhythm-one-page-pitch.md` | Tagline refresh option |
| `MEMORY_PARTNER_DECISION_LOG.md` | Log this decision with date and rationale |

### Standard wording block (consistent across all docs)

> **The Clinical-Ready vs Life-Ready Gap**
> Discharge confirms a patient is *clinically ready* — stable, safe, no longer needing acute care. It does not confirm they are *life ready* — able to manage medications, appointments, energy, intentions, relationships, and work without the structure the ward provided. Survivors fall into this gap silently. Re-admissions, depression, relationship breakdown, and job loss live here.
>
> MyRhythm is the bridge. The clinical team prescribes and monitors the bridge alongside the patient — turning discharge from a cliff into a guided crossing.

---

## Part 2: Clinical Bridge Workflow (Product Mechanism)

Define the named mechanism so it's referenceable across docs and code:

**The Bridge Pathway** — five clinically-monitored stages from discharge to life-readiness:

1. **Stabilise** (Weeks 0–2) — Energy baseline, medication adherence, appointment capture
2. **Structure** (Weeks 2–6) — Daily rhythm established, Memory Bridge in active use
3. **Strengthen** (Weeks 6–12) — Brain Health Score trending, support circle engaged
4. **Stretch** (Months 3–6) — Return-to-work / study readiness, complex planning
5. **Sustain** (Month 6+) — Self-directed, clinical check-ins move to as-needed

Each stage has: clinical exit criteria, patient-facing milestones, and a clinician-visible status.

---

## Part 3: Code & UI Changes

### A. New clinician-facing concept: "Bridge Stage"
- Add a `bridge_stage` enum + field to the patient profile (types only this loop; DB migration listed separately):
  - `'stabilise' | 'structure' | 'strengthen' | 'stretch' | 'sustain' | 'discharged'`
- Surface it in `src/components/dashboard/clinical/ClinicalViewToggle.tsx` area — when clinical view is on, show current Bridge Stage and exit criteria.

### B. New component: `ClinicalBridgeTracker`
Location: `src/components/dashboard/clinical/ClinicalBridgeTracker.tsx`
- Visual 5-stage progress strip (Stabilise → Sustain)
- Per-stage exit criteria checklist (medication adherence %, appointments captured, energy logs, etc.)
- Clinician-only "Advance Stage" / "Hold Stage" actions (gated by `has_role('clinician')`)
- Patient view: same strip but encouragement-framed, no clinical terminology

### C. Patient-facing surface
New card on `/launch/home`: **"Your Bridge to Life-Ready"**
- Shows current stage in empowerment language
- Shows next milestone
- Shows whether clinical team has reviewed this week

### D. Medical Professional welcome update
Update `src/pages/MedicalProfessionalWelcomePage.tsx` and `MedicalProfessionalWelcome` component copy to lead with: *"Prescribe and monitor the bridge from clinical-ready to life-ready."*

### E. Memory Bridge naming alignment
The existing **Memory Bridge** feature name now ladders directly into this pillar — add a one-line subtitle in `src/routes/MemoryBridge.tsx` header: *"Part of your bridge from clinical-ready to life-ready."*

### F. Use cases doc
Update `src/docs/UseCases.md` Brain Injury section intro to lead with the readiness-gap framing.

---

## Part 4: Database (migration)

Add to `profiles` (or a new `clinical_bridge_status` table — preferred for auditability):

```text
clinical_bridge_status
  id, user_id (FK auth.users), stage (enum), entered_stage_at,
  reviewed_by (FK auth.users, clinician), reviewed_at, notes,
  exit_criteria_met (jsonb), created_at, updated_at
RLS:
  - patient: select own
  - clinician role: select/update where assigned
  - admin: full
```

Uses the existing `has_role()` security-definer pattern. New role value `'clinician'` added to `app_role` enum if not already present.

---

## Part 5: Memory updates

- New memory file `mem://brand/clinical-life-ready-gap` — the core principle, wording block, and 5-stage Bridge Pathway names
- Update `mem://index.md` Core section: add one-liner *"Core purpose: bridge clinical-ready → life-ready. Clinical team is co-owner of the bridge, not just referrer."*
- Cross-reference from `mem://features/memory-bridge` and `mem://architecture/traceability-model`

---

## Deliverables

1. 9 strategy/markdown docs updated with consistent gap section
2. New `ClinicalBridgeTracker` component + patient-facing bridge card on `/launch/home`
3. Medical Professional welcome copy updated
4. Memory Bridge route subtitle added
5. DB migration for `clinical_bridge_status` + RLS + `clinician` role
6. 2 memory files written/updated
7. `MEMORY_PARTNER_DECISION_LOG.md` entry dated 28 Apr 2026

No new investor artifacts (.pptx/.docx/.xlsx) regenerated this round — those refresh next loop once wording is locked. Confirm if you want them regenerated immediately instead.
