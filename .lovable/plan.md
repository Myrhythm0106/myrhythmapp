
# Plan: Refresh 3 strategy docs + build unified 3-audience Handbook

Anchor date: **3 June 2026**. All docs use locked frameworks from project memory (3 problems, 4Rs, 4C loop, two on-ramps) and the canonical strings in `src/config/appDescription.ts`. Confidential 3pt footer on every page.

## Deliverables → `/mnt/documents/`

1. `MyRhythm_5Year_Vision_2026-2031_v3.pdf` + `.docx`
2. `MyRhythm_MVP_UseCases_v6.pdf` + `.docx`
3. `MyRhythm_90_Day_Sprint_Plan_v2.pdf` + `.xlsx` (re-anchored 3 Jun → 1 Sep 2026)
4. `MyRhythm_Handbook_v1.pdf` + `.docx` — single unified handbook

## 1. 5-Year Vision v3
- North Star reframed around all three problems (not just Discharge Cliff)
- Horizons: Y1 Founding Core → Y2 Bridge Pathway partnerships → Y3 Ideal-Brain expansion → Y4 payer/CCM → Y5 global platform
- Ideal-Brain audience block with cited stats from `THIRD_PROBLEM_STATS`
- 4R value language per horizon; metrics (Founding Members, Bridge referrals, ARR, retention)

## 2. MVP Use Cases v6
Per audience (Brain-injury survivor, Caregiver, Ideal-Brain adult), one use case per Founding Core feature (Capture, Commit, Calibrate, Celebrate, Memory Bridge, Support Circle, Assessments) with 4R outcome. Includes both on-ramps (pre-discharge + already discharged). Explicit non-goals + disclaimer.

## 3. 90-Day Sprint Plan v2 (3 Jun → 1 Sep 2026)
- Weeks 1–4 (Jun): Founding Members onboarding, Bridge Pathway pilot conversations, already-discharged comms
- Weeks 5–8 (Jul): Support Circle + Memory Bridge hardening, first clinical LOI, 4C loop telemetry
- Weeks 9–13 (Aug): Ideal-Brain test cell, pricing validation, v0.2 gate review
- Columns: week, deliverable, owner, success metric, risk
- xlsx: Gantt + weekly milestones

## 4. Unified Handbook v1 (single PDF, audience-tinted)

```text
Cover — Welcome to MyRhythm
1. Read Me First (60 sec) — APP_DESCRIPTION_USER + DISCLAIMER_TEXT verbatim
2. Which door is yours? — 3 audience doors with page pointers
     A. Survivor (pre- or post-discharge)
     B. Caregiver / Support Circle
     C. Busy brain (ADHD, stress, focus)
3. The 4C Loop in 4 minutes — Capture → Commit → Calibrate → Celebrate
4. The 4Rs — Remove / Reduce / Return / Reconnect, with audience-tinted examples
5. Navigate the app — annotated map of the 9 /launch/* routes (when to use / who this helps)
6. Your first 7 days — SMART daily checklist per audience
7. Support Circle setup — no one walks alone
8. Troubleshooting & help
9. Glossary
Back cover — disclaimer + confidential footer
```

SMART applied to the handbook itself: one action per page, checkboxes, day-by-day targets, max 3 options per page, 60 sec / 4 min / 7 days markers, plain language, no medical claims.

## Technical approach
- Python build script per doc (`python-docx` for docx, `reportlab` for pdf, `openpyxl` for xlsx)
- Pull canonical strings from `src/config/appDescription.ts` — no paraphrasing
- Confidential 3pt footer on every page
- QA: `pdftoppm -r 150` render every page, visually inspect for clipping, missing footer, table alignment, overlapping elements; fix and re-run
- Emit `<presentation-artifact>` tags for each final file

## Out of scope
- CCM / Productivity investor decks
- App code, UI, routes, business logic
- Older versioned docs
