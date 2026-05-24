## Goal

Create a new document **`MyRhythm_ABI_TBI_AfterEffects_Timeline_v1.docx`** that answers three linked questions:

1. What are the primary after-effects of ABI/TBI survivors that MyRhythm can address?
2. What is the typical timeline of challenges (acute → life-long), and which MVP features (4Cs, Support Circle, Calendar, Recording) support each stage?
3. How do those same supports translate into universal benefits anyone can experience?

Anchored to 28 April 2026. No medical claims — disclaimer footer on every page. US + UK statistics. 3pt confidentiality footer per standard.

## Document Structure

**Page 1 — Cover & Thesis**
- Title, anchor date, confidentiality, "does not diagnose/treat/cure" disclaimer
- One-paragraph thesis: ABI/TBI after-effects are the *amplified* version of friction every adult brain experiences (load, fatigue, forgetting, isolation, scheduling chaos). Building for the hardest case makes the system work for everyone.

**Page 2 — Primary After-Effects (Side-by-Side)**
Two-column table: **ABI/TBI After-Effect** | **Universal Parallel Everyone Feels**
Covers: cognitive fatigue, working-memory failure, slowed processing, attention/distractibility, executive-function loss, emotional dysregulation, sensory overload, social withdrawal, sleep disruption, loss of confidence/identity, appointment overload, information loss in clinical/work conversations.

**Pages 3–5 — Timeline of Challenges + MVP Feature Response**
Six stages, each as a single page-block with: stage, typical timeframe, top challenges, MVP feature mapping (4Cs / Support Circle / Calendar / Recording), and "what good looks like".

1. **Acute / Hospital (Day 0–14)** — confusion, info overload from clinicians, family panic → Recording (capture consults), Support Circle (one source of truth), Calendar seeded with discharge plan.
2. **Discharge Cliff (Week 2–6)** — the drop from 24/7 care to home; missed appointments, medication errors, caregiver burnout → Calendar with energy-aware scheduling, 4Cs daily loop (Capture→Commit→Calibrate→Celebrate), Support Circle handoffs.
3. **Early Rehab (Month 2–6)** — fatigue crashes, PT/OT/SLT appointment overload, identity loss → Recording therapy sessions, Calendar pacing, 4Cs Celebrate for micro-wins.
4. **Plateau & Return-to-Life (Month 6–18)** — return-to-work/study, invisible-injury isolation, relationship strain → Support Circle widening, Calendar work pacing, 4Cs Calibrate for honest weekly review.
5. **Long-Term Adaptation (Year 2+)** — new normal, residual deficits, advocacy fatigue → Recording for advocacy/medico-legal, Calendar as compensatory scaffold.
6. **Life-Long Maintenance** — relapse prevention, ageing-with-ABI, dementia risk monitoring → all four features as a daily operating system.

Each stage block ends with **"Same feature, everyday benefit"** — a 2–3 line note showing how a healthy reader uses the same mechanic (e.g., recording a doctor visit for an ageing parent; calendar pacing during a busy launch week).

**Page 6 — Universal Benefit Matrix**
Table: **MVP Feature** | **ABI/TBI Problem Solved** | **Universal Benefit (everyone)** | **External Stakeholder Benefit (rehab, neurology, employer, insurer)**.

**Page 7 — Statistics Anchor (US + UK)**
Compact two-column stat block supporting the after-effects list: CDC TBI ~2.5M/yr US; Headway ~356K/yr UK; ~50% TBI survivors report persistent cognitive fatigue; ~40% post-stroke fatigue; caregiver burnout AARP 53M / Carers UK 10.6M; knowledge-worker 23-min refocus (Mark, UC Irvine); Ebbinghaus 50%/1hr forgetting curve. All `(Source, Year, US|UK)`.

**Page 8 — Summary & The Universal Thesis**
Short close: the after-effects of ABI/TBI are not exotic — they are the human cognitive condition under stress. MyRhythm's MVP is the operating system that makes them manageable for survivors *and* delightful for everyone else.

**Appendix — Sources**

## Technical

- Generate with `docx-js` in `/tmp/`, output to `/mnt/documents/MyRhythm_ABI_TBI_AfterEffects_Timeline_v1.docx`.
- QA: convert to PDF + per-page JPEG, inspect every page, fix and regenerate if any layout/clipping issues.
- Return `<presentation-artifact>` tag.
- No app code changes. No DB, no `/launch/*`, no payments.

## Out of Scope

- No edits to existing `MyRhythm_MVP_UseCases_v1.docx` (this is a companion document).
- No new personas beyond ABI/TBI + "everyone else" framing.
- No clinical/medical claims.
