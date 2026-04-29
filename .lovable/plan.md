# Plan v4: Discharge Cliff + Clinical-Ready → Life-Ready Bridge + Timeline + Fundraising

Adds the **Discharge Cliff** explicitly as a co-equal problem statement alongside the Clinical-Ready vs Life-Ready Gap. Everything from v2 + v3 stands. Anchor date: **28 April 2026**.

---

## Part 0 (NEW): Problem Framing — Two Named Failures, One Bridge

The app/operating system addresses **two interlocking failures** in current care pathways. Both must be named in every investor doc, the deck, the pitch script, the website, and the in-app clinician/patient surfaces.

### Problem 1 — The Discharge Cliff
The moment a patient leaves the ward, the scaffolding (nurses, routines, prompts, observation, peer presence) disappears overnight. There is no graded step-down. Survivors and families fall — into missed medications, missed appointments, isolation, re-admission, depression, relationship breakdown, and job loss. The NHS knows this gap exists; nothing currently fills it at the patient's daily-life layer.

### Problem 2 — The Clinical-Ready vs Life-Ready Gap
Discharge confirms a patient is *clinically ready* — vitals stable, scans clear, no acute care needed. It does **not** confirm they are *life ready* — able to manage medications, appointments, energy, intentions, relationships, and work without ward structure. Clinical readiness is a checkbox; life readiness is a capability — and no one currently owns it.

### MyRhythm's role
MyRhythm is the **operating system that turns the Discharge Cliff into a guided crossing, and clinical readiness into life readiness**. The clinical team prescribes and monitors the bridge; the patient walks it; the support circle holds the rails.

### Standard wording block (replaces v2's single-paragraph block in every doc)

> **The Two Failures We Exist To Fix**
>
> **The Discharge Cliff** — At discharge, every support structure disappears at once. There is no step-down. Survivors fall silently into re-admission, isolation, depression, and lost livelihoods.
>
> **The Clinical-Ready vs Life-Ready Gap** — A discharge letter confirms clinical readiness. It does not confirm life readiness. The two are not the same, and no one currently owns the gap between them.
>
> MyRhythm is the clinically co-owned bridge across both. The pathway begins **pre-discharge** on the ward and continues through five life-readiness stages until the survivor is self-directed.

---

## Part 1 (UPDATED): Strategy & Investor Document Updates

The same 9 docs from v2, plus these now lead with the **two-failure framing**:

| File | Change |
|------|--------|
| `VISION.md` | Bridge becomes 6th pillar; problem section reframed as "Two Failures" |
| `MyRhythm_Investment_Presentation_Deck.md` | Problem slide split into 2 failures; Bridge slide follows as the unified solution |
| `MyRhythm_Investor_Presentation_Script.md` | Existing Discharge Cliff segment **kept and strengthened**; Bridge segment added immediately after |
| `MyRhythm_Executive Summary_One_Page.md` | Opening line: "MyRhythm bridges the Discharge Cliff and closes the Clinical-Ready vs Life-Ready Gap." |
| `MyRhythm_Executive_Strategy_Overview.md` | Phase 1 reframed around the Bridge Pathway |
| `MyRhythm_Value_Proposition_USP_Document.md` | USP #1: "Only platform clinically co-owned across the Discharge Cliff and the Life-Readiness Gap" |
| `MyRhythm_Justification_and_Commercials_Document.md` | NHS commissioning angle: SBRI Healthcare explicitly funds discharge/transition tools — direct match |
| `docs/myrhythm-one-page-pitch.md` | New tagline: *"From Discharge Cliff to Life-Ready — clinically co-owned."* |
| `MEMORY_PARTNER_DECISION_LOG.md` | Decision dated 28 Apr 2026 logging both failures as core thesis |

---

## Parts 2–5 (unchanged from v2)

- **Bridge Pathway** stages: Prepare (in-patient) → Stabilise → Structure → Strengthen → Stretch → Sustain → Discharged
- `ClinicalBridgeTracker.tsx` + patient bridge card on `/launch/home`
- `/launch/clinical/bridge` clinician dashboard, `has_role('clinician')` gated
- DB migration: `clinician` role, `clinical_bridge_status` table, RLS, entry/exit criteria JSONB
- Memory files + decision log updated
- Memory Bridge route subtitle, MedicalProfessional welcome copy refresh, UseCases.md update

---

## Part 6: Timeline — anchored to 28 Apr 2026

```text
WEEK 1  | 28 Apr – 4 May    Foundation
  - DB migration, memory + decision log
  - 9 strategy docs reframed with two-failure block
  - VISION.md Bridge pillar

WEEK 2  | 5 – 11 May        Patient Surface
  - ClinicalBridgeTracker, /launch/home Bridge card
  - Memory Bridge subtitle, UseCases.md, MedicalProfessional copy

WEEK 3  | 12 – 18 May       Clinician Surface
  - /launch/clinical/bridge dashboard
  - Entry/Exit criteria checklists, Stage 0 Prepare flow
  - RLS QA pass

WEEK 4  | 19 – 25 May       Investor Pack Refresh
  - Deck v5 (.pptx + .pdf) — Discharge Cliff + Gap split slides
  - Pitch Script v9 (.docx)
  - 90-Day Sprint Plan v2 (.xlsx)
  - 3-min Bridge demo recording

MILESTONE | 25 May 2026     Investor-Ready
```

---

## Part 7: £250K Seed Fundraising Playbook

### Round structure
| Item | Detail |
|------|--------|
| Ask | £250,000 |
| Instrument | SAFE or ASA (SEIS/EIS compatible, UK) |
| Valuation cap | £2.0M post-money |
| Use of funds | 40% engineering · 25% clinical pilots · 20% founder runway · 10% compliance (DTAC/DCB0129) · 5% legal |
| Runway | 12 months to Series-Seed milestone |

### Investor segments — pursued in parallel
1. **SEIS/EIS angels** (£10K–£50K cheques) — 8–15 needed. Channels: SyndicateRoom, Envestors, OION, Cambridge Angels, Health Foundry.
2. **Non-dilutive grants** (stack on equity): Innovate UK Smart Grants, **SBRI Healthcare** (NHS England — funds discharge/transition tools — direct fit), NIHR i4i Connect.
3. **Lived-experience strategic angels** via Headway, UKABIF, Stroke Association.
4. **Micro-VCs** (£50K–£150K): Zinc VC, Calm/Storm, Form Ventures, Ascension SEIS/EIS funds.

### 6-week fundraise sprint (parallel to build)
```text
W1–2 | 28 Apr – 11 May    Materials lock + SEIS Advance Assurance filed
W3   | 12 – 18 May        50-name list scored, 20 warm intros requested
W4–5 | 19 May – 1 Jun     25 first meetings → 10 seconds → 4–5 verbal commits
W6   | 2 – 8 Jun          Lead anchors; rolling close on SAFE
Target full close: end June 2026
```

### Investment thesis (one sentence to lead every meeting)
*"Discharge confirms clinically ready — not life ready. Survivors fall off the Discharge Cliff into that gap. MyRhythm is the clinically co-owned operating system that bridges both."*

This single framing:
- Maps directly to **SBRI Healthcare** funding criteria (de-risks revenue)
- Justifies a **£2M cap** above pure consumer comparables
- Gives every angel a defensible "why now" (post-COVID discharge backlog + NHS Long Term Plan digital priorities)

### Founder cadence
- Mon AM pipeline review · Tue–Thu meetings (5/wk) · Fri PM follow-ups + decision log · Weekly LinkedIn progress note (builds inbound)

### Risks & mitigations
| Risk | Mitigation |
|------|------------|
| SEIS Advance Assurance delay (4–8 wks) | File Week 1; angels commit subject-to |
| No lead investor | SeedLegals rolling-close SAFE — no lead required |
| Clinical pilot not signed in time | 2 LOIs from rehab centres are sufficient at this stage |
| Founder bandwidth | Weeks 1–6 fundraise is full-time; Bridge build continues via existing dev velocity |

---

## Cumulative Deliverables (v1+v2+v3+v4)

1. 9 strategy docs reframed with **Discharge Cliff + Life-Readiness Gap** two-failure block
2. `ClinicalBridgeTracker` + patient `/launch/home` card + clinician dashboard
3. DB migration: `clinician` role + `clinical_bridge_status` + RLS
4. 2 memory files (`mem://brand/clinical-life-ready-gap` covers both failures + Bridge; updated `mem://index.md` Core)
5. Decision log entry dated **28 Apr 2026**
6. `MyRhythm_Seed_Round_Onepager.pdf` + `MyRhythm_Investor_Pipeline.xlsx` (Week 1)
7. Deck v5, Pitch Script v9, 90-Day Sprint Plan v2 (Week 4)

Reply **Approved** to switch to build mode and execute Week 1 immediately.
