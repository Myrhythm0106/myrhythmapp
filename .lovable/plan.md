# MyRhythm 5-Year Vision Document (2026–2031)

## Goal

Produce a single, board-ready 5-year vision document that consolidates everything agreed across prior artifacts (Use Cases v4, After-Effects Timeline v3, Founding Member Launch Strategy, Bridge Pathway, Caregiver Dashboard, MYRHYTHM framework) and projects it forward against competitor differentiation, USP, and market direction.

## File Produced

- `/mnt/documents/MyRhythm_5Year_Vision_2026-2031_v1.docx`

All previous documents preserved untouched.

## Document Structure

1. **Cover** — Title, version 1.0, date 25 May 2026, 3pt confidentiality footer (per Document Confidentiality Standard).
2. **Executive Summary** — One page: thesis, market size, USP, 5-year ARR/user targets.
3. **The Core Thesis** — Clinical-Ready vs Life-Ready Gap + Discharge Cliff. Why MyRhythm exists. Anchored to 28 April 2026 baseline.
4. **Market Direction (2026–2031)** — Dementia (£1.2B digital cognitive market, 55M→139M cases by 2050), ABI/TBI growth, aging populations, productivity/longevity convergence, AI-native health tooling, payer/employer shift to prevention.
5. **Competitive Landscape & Differentiation**
   - Competitors: Lumosity, BrainHQ, CogniFit (brain training); Headway, Calm, Wysa (wellness); Cognito, Constant Therapy, Neofect (clinical rehab); Notion/Motion/Reclaim (productivity).
   - Where each falls short: no Bridge Pathway, no caregiver layer, no energy-aware scheduling, no trauma-informed onboarding, no cognitive continuity layer.
   - MyRhythm USP grid: 4C loop on Cognitive Continuity, trauma-informed, caregiver-integrated, assistant-first scheduling, persona-specific paths, clinical-to-life bridge.
6. **The Five-Year Arc** — Year-by-year vision:
   - **Year 1 (2026):** MVP + 1,000 founding members, £500K ARR (per roadmap), MyStarter/Stretch/Leap live, Memory Bridge + Caregiver Dashboard shipped.
   - **Year 2 (2027):** Clinical partnerships scale (Shepherd, Craig + 5 UK NHS trusts), B2B2C payer pilots, MYRHYTHM assessment v2, £3M ARR target.
   - **Year 3 (2028):** Provider Directory Marketplace fully monetised, Dementia/MCI vertical launched with caregiver-first onboarding, multi-language (ES, FR, DE), £10M ARR.
   - **Year 4 (2029):** Insurance reimbursement pathway (US CPT + UK NHS Digital Tech Assessment), employer wellbeing channel, longitudinal outcomes dataset, £25M ARR.
   - **Year 5 (2030–2031):** Category leader for "Cognitive Continuity" — defined market we created. Acquisition-ready or Series B path. £60M+ ARR, 250K+ active users.
7. **Product Vision Pillars** — what gets built/extended:
   - Cognitive Continuity OS (the operating layer under 4C).
   - Caregiver Dashboard → Care Network (multi-caregiver, clinician seats).
   - Memory Bridge → Ambient Capture (passive meeting/voice with consent).
   - Assistant-First Scheduling → Predictive Rhythm (ML on personal energy curves).
   - Provider Directory → two-sided marketplace with outcomes scoring.
   - Bridge Pathway → embedded in discharge protocols (ward → community).
8. **Business Model Evolution** — B2C founding tiers → B2B2C (clinics, employers) → B2P (payers/insurers). Pricing ladder and gross margin trajectory.
9. **Moat & Defensibility** — Proprietary longitudinal cognitive dataset, trauma-informed brand trust, caregiver network effects, clinical partnership lock-in, Cognitive Continuity category ownership.
10. **Risks & Mitigations** — Regulatory (no medical claims policy), competitive entry by big tech, clinical validation timelines, caregiver churn.
11. **What We Will NOT Do** — No diagnosis/treatment claims, no ad-supported model, no data resale, no displacement of clinicians.
12. **5-Year Scorecard** — Table: Users, ARR, Clinical partners, Countries, NPS, Caregiver-linked accounts, by year.
13. **Sources** — Standard sources block (WHO, Dewan, WSO, CDC, AARP, Grand View, Headway UK, NHS).

## Out of Scope

- No edits to existing v1–v4 docs.
- No app code, DB, or `/launch/*` changes.
- No clinical claims; all forward-looking language framed as supportive/compensatory.

## Technical

- `docx-js` script in `/tmp/`, output to `/mnt/documents/`.
- US Letter, 1" margins, Arial, H1/H2 overrides with `outlineLevel`.
- Tables: `WidthType.DXA`, matching `columnWidths`, `ShadingType.CLEAR` headers, cell margins.
- Lists via `LevelFormat.BULLET` numbering config.
- 3pt confidentiality footer on every page.
- QA: convert to PDF + per-page JPEG, inspect every page for clipping/overflow, regenerate if needed.
- Return one `<presentation-artifact>` tag.
