# MyRhythm — Problem-Fit & Market-Scale Reference

_Last updated: 22 July 2026 · Owner: Founder · Status: v0.1 (Founding Edition)_

> A single reference for investors, clinicians, and partners answering two questions:
> **1. What problem does MyRhythm actually solve?**
> **2. How big is that problem — including the hard-dollar re-admission tax?**
>
> Non-medical-claims guardrail applies throughout. Every clinical/economic figure is cited. MyRhythm does not diagnose, treat, or cure any condition, and this document makes no outcome claims about the app itself.

---

## 1. The problem MyRhythm defines (canonical, locked)

MyRhythm addresses **three compounding failures** that current health systems, productivity tools, and rehabilitation pathways leave unresolved:

### 1.1 The Discharge Cliff
The 4–6 week void between hospital discharge and first outpatient follow-up. The patient is ward-safe but unsupported in the exact window their brain is most volatile. Instructions are paper-based, memory is fragile, and the family carries the load without a plan.

### 1.2 The Clinical-Ready vs Life-Ready Gap
Ward-safe ≠ kitchen-table-safe. A patient can pass discharge criteria (vitals stable, mobile, oriented) and still be unable to remember a medication schedule, plan a week, or hold a family conversation without exhaustion. Clinical readiness is a floor, not the goal.

### 1.3 The Ideal-Brain Assumption
Mainstream productivity apps (Notion, Todoist, Google Calendar, Apple Reminders) are built for a rested, uninjured, neurotypical, low-stress brain. They fail — identically — for ABI/stroke survivors, dementia/MCI, ADHD adults, and cognitively-overloaded working adults. Everyone gets punished by the same design assumption.

The same three failures show up differently across life stages; §4.3 maps the cohort-level opportunity.

Sources: `mem://brand/clinical-life-ready-gap`, `mem://brand/third-problem-ideal-brain`, `src/config/appDescription.ts` → `THIRD_PROBLEM_STATS`.

---

## 2. The Re-Admission Tax — the price of the Discharge Cliff

> **The Discharge Cliff isn't a soft problem. It has a hard price tag — measured in re-admissions, avoidable ED visits, and caregiver burnout crises. MyRhythm exists in the exact 6-week window where that price is paid.**

This section quantifies what the Cliff costs the health system and the survivor when the Life-Ready gap isn't bridged.

### 2.1 Stroke — the curve compounds, it does not flatten
- **~12.4% 30-day readmission rate** for stroke survivors (US Medicare fee-for-service data, AHA/ASA _Stroke_ journal).
  _Roughly 1 in 8 stroke survivors is back in hospital within a month._
- **~17.4% at 90 days.**
- **~42.5% at 1 year.** _(Bambhroliya et al., JAMA Network Open; AHA/ASA statistical updates.)_

### 2.2 Traumatic Brain Injury (TBI)
- **12–23% 30-day readmission** depending on severity and age band. _(NIH/CDC TBI surveillance; Saadat et al., J Neurosurg.)_
- Older adults with moderate/severe TBI sit at the top of that range.

### 2.3 Preventability — the wedge MyRhythm sits in
- **~70% of TBI/stroke readmissions are considered preventable**, driven by:
  - medication mismanagement,
  - missed outpatient follow-up,
  - falls at home,
  - cognitive/behavioural breakdown in the first 6 weeks,
  - caregiver overload with no scaffolding.
- **Every one of these is a MyRhythm-shaped failure** — capture, remind, schedule, loop in a witness, escalate before crisis.

_(Sources: AHRQ preventable-readmission analyses; NHS RightCare stroke pathway audits; Vashishtha et al., Neurocritical Care.)_

### 2.4 Cost per event
- **US — avg. cost per stroke readmission: ~$13,500** (CMS/AHRQ HCUP data).
- **UK — NHS avoidable-readmission cost per case: ~£2,500–£3,600** (NHS England, Nuffield Trust estimates).

### 2.5 Dementia / MCI
- **~20% 30-day readmission** — the highest of any major chronic cohort. _(CMS, Alzheimer's Association Facts & Figures.)_
- Primary drivers: caregiver overload, missed medications, delirium episodes, missed daily-life scaffolding.

### 2.6 ADHD adults
- **2–3× more likely to present at ED** or have an unplanned admission relative to matched controls, driven by:
  - medication non-adherence,
  - injury/accident risk,
  - stress-driven crises and comorbid mental-health events.
_(Sources: Barkley longitudinal studies; Dalsgaard et al., _The Lancet_.)_

### 2.7 What this means in one line
Every readmission above is a moment MyRhythm's core loop (Capture → Commit → Calibrate → Celebrate + Support Circle) is explicitly designed to prevent — not by treating the condition, but by removing the daily-life failure that triggers the return to hospital.

---

## 3. Does the v0.1 PoC address the problem? — honest scorecard

| Failure | What v0.1 (Founding Edition) actually ships | Verdict |
|---|---|---|
| **Discharge Cliff** | Discharge Bridge Kit route (`/launch/discharge-bridge`), printable handout, clinician PDF. Full discharge-summary → AI plan → nurse-approval loop is **v0.2**. | **Partial** — the on-ramp is real, the closed loop is v0.2. |
| **Clinical-Ready vs Life-Ready** | 4C loop, Memory Bridge (record → transcript → extracted actions → smart-scheduled calendar), Support Circle "in the loop" invites, MyRHYTHM-G growth states, AI Plan Assist (daily/weekly/monthly/yearly). | **Yes.** |
| **Ideal-Brain Assumption** | Memory-First Design — ≤3 choices per screen, 56px touch targets, progressive reveal, You-Are-Here dial, universal 4C copy that works for uninjured + clinical users identically. | **Yes.** |
| **Re-admission behavioural drivers** | Reminders (Gentle/Steady/Strong), recurrence patterns, Support Circle escalation, Memory Bridge capture of clinician instructions, calendar push to Google/Outlook, energy-aware scheduling. | **Yes for behavioural drivers.** Medication-adherence surface is deferred to v0.2. |

---

## 4. Scale of the addressable market (UK + US launch)

### 4.1 Total addressable population — the "soft-value" market
- **350,000** UK brain-injury hospital admissions/year _(Headway UK)._
- **~795,000** US new strokes/year _(AHA/ASA)._
- **~2.8M** US TBI-related ED visits/year _(CDC)._
- **900,000** UK adults with dementia; **~6.7M** US _(Alzheimer's Society; Alzheimer's Association.)_
- **~6.5M** UK + US adults with diagnosed ADHD (plus a large undiagnosed tail) _(NICE; CDC.)_
- **74%** of working adults report cognitive overload driven by stress + sleep debt _(APA _Stress in America_; Deloitte Wellbeing at Work.)_

**Combined: 60M+ adults across UK + US launch markets** whose daily cognitive load is either clinical or borderline.

### 4.2 The "hard-dollar" wedge — the re-admission-preventable population
Focusing only on the cohorts where readmission cost is documented (stroke, TBI, dementia):

- **UK + US combined estimate: ~500,000–650,000 avoidable readmissions / year** across stroke, TBI, and dementia populations.
- At published cost-per-event benchmarks, that maps to **£1.3B–£2.3B / year in avoidable UK+US readmission spend** attributable to preventable Discharge-Cliff-era failures.
- Even a **1–3% relative reduction** in this wedge — the range clinical care-transition programmes typically target — represents an eight- to nine-figure annual value pool.

_This is the wedge inside the 60M soft-value market where MyRhythm has the sharpest commercial and clinical story. Note: MyRhythm has not measured its own effect on readmissions; the figure is market context only._

### 4.3 Opportunity across ages and groups

The 60M soft-value market isn't one audience — it's overlapping life-stage cohorts sharing the same Ideal-Brain Assumption failure. This is where MyRhythm's opportunity extends beyond the clinical wedge.

| Cohort | Age band | Why current tools fail them | MyRhythm opportunity | Guardrail |
|---|---|---|---|---|
| **Students & young learners** | 16–24 | First time self-managing calendar, exam-load spikes, undiagnosed ADHD tail, lecture-heavy recall demands. | Memory Bridge for lectures/tutorials, weekly AI Plan Assist, "in the loop" study partner, MyRHYTHM-G growth states normalise the messy middle. | Not a study-skills or ADHD treatment. |
| **Early-career professionals** | 25–39 | Cognitive overload, sleep debt, new-parent stage, meeting sprawl. Ideal-Brain tools assume rest they don't have. | 4C loop as a personal PA (without naming it that), Gentle/Steady/Strong reminder ladders, Meeting-type events with invites, calendar push to Google/Outlook. | Productivity support, not a burnout intervention. |
| **Mid-career + sandwich generation** | 40–59 | Peak work load *and* caring for a parent or child with cognitive needs. No single tool holds both lives. | Dual-subject use (self + Anchor persona), Support Circle coordination, energy-aware scheduling, shared visibility without micromanagement. | Coordination tool, not a care-plan replacement. |
| **Post-event adults — ABI, stroke, long-COVID, MS-cognitive** | Any age, concentrated 30–70 | The Discharge Cliff cohort. Paper handouts, fragile memory, family with no plan. | Discharge Bridge Kit on-ramp, Memory Bridge capture of clinician instructions, smart-scheduled actions, MyRHYTHM-G growth states, Support Circle "in the loop". | Does not diagnose, treat, or replace rehab. |
| **Older adults & dementia / MCI** | 60+ | Memory volatility, highest 30-day readmission rate, heavy carer load, most productivity apps are unusable. | Memory-First Design (≤3 choices, 56px targets, progressive reveal), Anchor-persona carer view, gentle reminders, energy-aware scheduling. | Explicitly not a dementia treatment or diagnostic. |
| **Carers across all ages** (cross-cutting) | 18–75+ | Group-chat chaos, burnout, invisible labour, no shared source of truth with the person they support. | Anchor persona, Support Circle CRUD, "in the loop" invites replacing group chats, burnout-aware scheduling, subject-switch to see the day from the other side. | Coordination and self-protection, not clinical care management. |

**Honest v0.1 fit call-out.** Not every cohort is equally served today. The **Discharge Cliff cohort and Anchors get the sharpest v0.1 fit** — the Discharge Bridge Kit, Memory Bridge, Support Circle and MyRHYTHM-G are built for them first. **Students, early-career professionals, and the older-adult/dementia cohort are strategically in-scope** but their tailored surfaces (study mode, exec focus mode, simplified carer dashboard, dementia-specific carer view) sit in v0.2. This mirrors the candid tone in §5 — the market is real across all six cohorts; the shipped surface is not yet.



---

## 5. Trial-blocking gaps flagged (not fixed in this pass)

1. **Discharge summary ingestion → nurse-approval loop is v0.2.** Until it ships, the Cliff claim is narrative rather than demonstrable in-app.
2. **No outcome-metrics surface.** Weekly-active users, actions-completed, adherence streaks, and Support-Circle engagement are captured in data but not surfaced anywhere a clinician or investor can see them. Needed before any conversation about readmission prevention.
3. **Market/readmission evidence lives only in docs.** A tester or investor never encounters these numbers inside the app — the Discharge Bridge Kit page in particular should cite the Cliff data at the point of use.

---

## 6. Non-medical-claims guardrail

Per `mem://brand/medical-disclaimer-policy`:

- Every readmission/prevalence figure in this document is **market context and problem scale**.
- MyRhythm does **not** claim to reduce readmissions, treat brain injury, cure ADHD, slow dementia, or replace clinical care.
- MyRhythm is a **Memory-First Design™ app** that supports daily-life continuity through the Collaborative Cognitive Continuity layer running the 4C loop.
- All investor, clinical, and marketing use of the numbers above must preserve this framing.

---

## 7. Citation index

- American Heart Association / American Stroke Association — _Heart Disease and Stroke Statistics_ annual update.
- Bambhroliya AB, et al. Estimates and Temporal Trend for Stroke Readmission. _JAMA Network Open._
- Centers for Disease Control and Prevention — TBI Surveillance Report; Alzheimer's Disease Facts.
- CMS / AHRQ HCUP — Hospital Readmission cost data.
- Headway UK — Acquired Brain Injury statistics.
- NHS England / Nuffield Trust — Avoidable readmission cost analyses.
- NICE — ADHD prevalence and clinical guidance (NG87).
- Alzheimer's Society (UK) & Alzheimer's Association (US) — Prevalence & Facts and Figures.
- Barkley RA — Longitudinal ADHD outcomes; Dalsgaard S, et al., _The Lancet_.
- APA _Stress in America_; Deloitte _Wellbeing at Work_.
- Saadat S, et al. TBI readmission analysis, _Journal of Neurosurgery._
- Vashishtha M, et al. Preventable neurocritical readmissions, _Neurocritical Care._

---

_This document is confidential to MyRhythm founding operations. It is a strategy reference, not a clinical claim, not a marketing asset, and not a regulatory submission._
