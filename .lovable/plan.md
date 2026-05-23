# Plan: MVP Use-Case Document — ABI-anchored, universal benefit, US + UK stats, market impact

Produce a downloadable **DOCX** at `/mnt/documents/MyRhythm_MVP_UseCases_v1.docx` covering the four MVP pillars — **4Cs, Support Circle, Calendar, Recording** — across **every persona**, with **Acquired Brain Injury (ABI)** explicitly named as the founder's lived experience AND the thesis that **the same MVP benefits every other persona**. Now also includes **US + UK statistics side-by-side** and a **market-impact section** with clearly-labelled illustrative estimates.

## Framing thesis (stated upfront and revisited in the summary)

> ABI exposed the problem in its rawest form — but the cognitive load, memory friction, scheduling chaos and isolation that MyRhythm solves are universal. **If MyRhythm works for an ABI survivor on day 14 post-discharge, it works for everyone.**

## Structure

1. **Cover + purpose** — anchor date 28 April 2026; medical disclaimer + 3pt confidentiality footer on every page.
2. **Why ABI is named first (and why everyone benefits)** — defines ABI (TBI, stroke, hypoxic, tumour, infection, post-surgical), states founder lived experience, and the universal-benefit thesis with a *ABI need → universal need* mapping table.
3. **How to read this document** — 4-lens frame applied to every persona:
   1. Registration journey
   2. Features that benefit them (and *why*)
   3. Challenges they will face
   4. How the MVP model (4Cs + Circle + Calendar + Recording) is used and the benefit delivered
4. **The shared problem (US + UK statistics)** — every stat shown for **both US and UK** in a two-column layout where data exists; world figure included when relevant. Covers cognitive load, Ebbinghaus forgetting curve, caregiver burden, discharge cliff, RTW gap, ADHD prevalence, dementia trajectory, knowledge-worker context-switching cost.
5. **Primary persona sections** — one page each, **equal depth for every persona**, each opening with a US + UK stats block:
   - ABI survivor (lead persona)
   - Concussion / mild TBI
   - Family caregiver / next-of-kin
   - Cognitive-fatigue (Long-COVID, MS-cognitive, ME/CFS)
   - ADHD / executive-function rebuild
   - Post-recovery returner (RTW / return-to-study)
   - Busy professional seeking rhythm
   - Student
   - Healthy-ageing adult (early MCI watch, menopause cognitive change)
   - Medical professional / high-stakes operator
   - "Everyone else" — the general adult who simply wants to stop dropping balls
6. **External stakeholder sections** — ½–¾ page each (Rehab/OT/SLT, Neurologist/stroke physician, GP/discharge coordinator, Employer/RTW coach, Insurer/case manager, Educational institution/DSA assessor) — each with US + UK sector context.
7. **Cross-cutting benefit matrix** — feature → problem → ABI benefit → benefit for every other persona → benefit for external stakeholder.
8. **Market impact section (NEW)** — clearly labelled **"Illustrative estimates — directional, not financial guidance"**. Subsections:
   - **Total Addressable Audience (TAA)** — sum the US + UK population figures from sections 4–6 (ABI survivors, caregivers, ADHD adults, Long-COVID, MCI/dementia, knowledge workers losing >2 hrs/day to context-switching, students) → headline TAA in millions of adults across US + UK.
   - **Serviceable Addressable Market (SAM)** — adults with smartphone + monthly subscription willingness; assume ~60% of TAA. Show the % assumption explicitly.
   - **Serviceable Obtainable Market (SOM) — Year 1–3 illustrative**: 0.1% → 0.5% → 1.5% of SAM as conservative/base/stretch. Annual revenue ranges at £/$9.99 and £/$14.99 monthly tiers. All numbers tagged "illustrative".
   - **System-level impact estimates** (per 100,000 active users):
       - Caregiver hours saved/week (assume 30 min/day avg) → annualised hours.
       - Hospital readmissions avoided (assume 1–3% relative reduction in 30-day post-discharge readmissions among ABI/stroke cohort, citing published readmission baselines).
       - Knowledge-worker hours reclaimed (assume 20 min/day of saved context-switching × working days).
       - Employer cost saved at average US + UK hourly wage.
   - **Healthcare-system value pool** — qualitative-quantitative bridge: UK NHS cost per emergency readmission, US average 30-day readmission cost — multiplied by avoided-readmission estimate.
   - **Why these estimates are conservative** — short paragraph naming the assumptions and citing the source baselines.
9. **Summary — Discharge Cliff, Life-Ready Gap, and the universal rhythm.**
10. **Evidence appendix** — full reference list (source, year, URL) for every statistic and every assumption used in the market-impact section.

## Statistics to source and verify (US + UK; web-search before drafting)

**ABI** — US: CDC TBI ED visits/yr (~2.5M); CDC stroke (~795,000/yr); BIAA estimate of Americans living with TBI-related disability. UK: Headway admissions (~356,000/yr, every 90s); SSNAP stroke incidence (~100,000/yr); ONS ABI prevalence estimates. World: WSO 12.2M strokes/yr.

**Caregivers** — US: AARP "Caregiving in the US 2020" (~53M unpaid caregivers; avg hours/week; burnout %). UK: Carers UK "State of Caring" (~10.6M carers; hours/week; financial impact).

**Cognitive fatigue** — US: CDC Long-COVID prevalence (~6–7% adults). UK: ONS Long-COVID self-reported (~2M). MS Society (US + UK): ~50% of pwMS have cognitive symptoms.

**ADHD** — US: CDC adult ADHD ~6%. UK: NICE / ADHD UK ~3–4% adults.

**Dementia / ageing** — US: Alzheimer's Association 2024 (~6.9M living with Alzheimer's). UK: Alzheimer's Society (~944,000 with dementia, rising to 1.6M by 2040). World: WHO 55M → 139M by 2050.

**Knowledge work** — McKinsey/Microsoft (US): ~28% of week on email, 23-min refocus cost (Gloria Mark, UC Irvine). UK: ONS productivity. Ebbinghaus: ~50%/1hr, ~70%/24hr.

**Students** — US: NCES enrolment; ACHA stress data. UK: HESA enrolment; ONS student mental health.

**Readmissions baselines** — US: CMS 30-day stroke readmission ~12%; AHRQ avg readmission cost ~$15,000. UK: NHS Digital 30-day emergency readmission ~14%; cost per emergency admission ~£3,000.

Each stat carries inline `(Source, Year, US|UK)` and an appendix entry with URL.

## Tone & constraints

- No medical claims; "does not diagnose, treat, or cure" disclaimer in every page footer.
- Behaviour Loop framing: Capture → Commit → Calibrate → Celebrate on Cognitive Continuity.
- 3pt confidentiality footer per Document Confidentiality Standard.
- Market-impact numbers explicitly labelled "Illustrative estimate — directional, not financial guidance" with every assumption visible on the page.
- Timeline examples anchored to 28 April 2026.
- ABI named and defined; every other persona given equal page depth.

## Delivery

1. Batch web-search to verify every US and UK statistic before drafting.
2. Generate DOCX via `docx-js` script in `/tmp/`, output to `/mnt/documents/MyRhythm_MVP_UseCases_v1.docx`.
3. QA: convert to PDF + page images, inspect every page for overflow, fix and re-render until clean.
4. Return `<presentation-artifact>` link.

No app code is changed.
