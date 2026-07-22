
# Problem-fit confirmation: does the PoC address the defined problem, and at what scale?

Deliverable: **one standalone strategy doc** at `docs/problem-fit-and-market.md`. No UI changes. Purpose: a single reference you can hand an investor, clinician, or partner to answer "what problem does MyRhythm actually solve, and how big is that problem?"

Cited numbers reuse `src/config/appDescription.ts` (`THIRD_PROBLEM_STATS`) plus new re-admission data added in this pass. No made-up numbers — every figure gets a source line.

---

## Document structure

### 1. The problem MyRhythm defines (canonical, locked)
Three compounding failures, verbatim from `mem://brand/clinical-life-ready-gap` and `mem://brand/third-problem-ideal-brain`:
1. **Discharge Cliff** — 6-week void between hospital discharge and first outpatient follow-up.
2. **Clinical-Ready vs Life-Ready Gap** — ward-safe ≠ kitchen-table-safe.
3. **Ideal-Brain Assumption** — mainstream productivity tools fail ABI, dementia/MCI, ADHD, and stress-loaded brains identically.

### 2. NEW — The re-admission tax (the price of the Discharge Cliff)
This is the section you just asked for. It quantifies what the Cliff costs the health system and the survivor when the Life-Ready gap isn't bridged. Numbers to include, each with a source citation:

- **Stroke 30-day readmission rate: ~12.4%** (US Medicare, AHA/ASA data). Roughly 1 in 8 stroke survivors is back in hospital within a month.
- **Stroke 90-day readmission: ~17.4%**; **1-year: ~42.5%** — the curve does not flatten, it compounds.
- **Traumatic brain injury 30-day readmission: 12–23%** depending on severity (NIH/CDC surveillance data).
- **~70% of TBI/stroke readmissions are considered preventable** — driven by medication mismanagement, missed follow-up, falls, and cognitive/behavioural breakdown at home. Every one of these is a MyRhythm-shaped failure.
- **Average cost per stroke readmission (US): ~$13,500**; **UK NHS avoidable-readmission cost per case: ~£2,500–£3,600**.
- **Dementia/MCI 30-day readmission: ~20%** (highest of any chronic cohort) — driven by caregiver overload and missed daily-life scaffolding.
- **ADHD adults are 2–3× more likely to have an ED visit or unplanned admission** for medication non-adherence, injury, and stress-driven crises.

Framing sentence for the doc:
> "The Discharge Cliff isn't a soft problem. It has a hard price tag — measured in re-admissions, avoidable ED visits, and caregiver burnout crises. MyRhythm exists in the exact 6-week window where that price is paid."

### 3. Does the PoC address it? — honest scorecard

| Failure | What v0.1 ships | Verdict |
|---|---|---|
| Discharge Cliff | Discharge Bridge Kit route + handout + clinician PDF scaffolded (full summary ingestion → nurse-approved plan is v0.2) | **Partial** — on-ramp real, closed loop is v0.2 |
| Clinical-Ready vs Life-Ready | 4C loop, Memory Bridge (record → transcript → actions → calendar), Support Circle "in the loop", MyRHYTHM-G growth states, AI plan assist | **Yes** |
| Ideal-Brain Assumption | Memory-First Design — ≤3 choices, 56px targets, progressive reveal, You-Are-Here dial, universal 4C copy | **Yes** |
| Re-admission risk drivers (NEW) | Reminders (Gentle/Steady/Strong), recurrence, Support Circle escalation, Memory Bridge capture of clinician instructions, calendar push | **Yes for behavioural drivers; medication-adherence surface deferred to v0.2** |

### 4. Scale of the addressable market (UK + US launch)
- 350,000 UK brain-injury hospital admissions/year
- 900,000 UK adults with dementia/MCI
- ~6.5M UK+US adults with ADHD
- 74% of working adults report cognitive overload (stress/sleep)
- **Combined: 60M+ adults across UK + US launch markets**
- **NEW — Re-admission-preventable population (annual, UK+US combined estimate): ~500,000–650,000 avoidable readmissions/year across stroke, TBI and dementia cohorts alone.** This is the "hard-dollar" wedge inside the 60M soft-value market.

### 5. Trial-blocking gaps (flagged, not fixed in this pass)
- Discharge summary ingestion → nurse approval loop is v0.2, so the Cliff claim is currently narrative not demonstrable.
- No outcome-metrics surface (weekly-active, actions-completed, adherence streak) — needed to talk to clinicians about readmission prevention with a straight face.
- Market/readmission evidence lives in docs, never cited inside the app where a tester/investor would encounter it.

### 6. Non-medical-claims guardrail (applies to whole doc)
Every readmission stat is framed as *market context and problem scale*, never as "MyRhythm reduces readmissions by X%." Per `mem://brand/medical-disclaimer-policy` we do not claim clinical outcomes we have not measured. The doc will carry a footer stating this explicitly.

---

## Files touched
- **Create** `docs/problem-fit-and-market.md` (single new file, ~600–800 lines of prose with citations)

No code, no components, no schema, no routes.

## Follow-ups you can approve separately after reading the doc
- **A.** Add a gated `/launch/problem-fit` investor page reusing Emerald Prestige so you can walk this through live in the app.
- **B.** Close the three v0.1 gaps: outcome-metrics surface, in-app citation of the readmission data on the Discharge Bridge Kit page, and tightened Cliff narrative in the Kit.

## Out of scope
- v0.2 discharge summary ingestion (already deferred).
- Any medical-outcome claims about MyRhythm itself.
- Landing/marketing copy rewrite — this is a reference doc, not a campaign.
