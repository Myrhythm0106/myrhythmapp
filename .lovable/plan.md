## Goal

Extend **both** existing documents with a new, deeply-detailed **"Pre-Discharge → Independence at Work"** timeline section that names each MVP feature, shows the exact mechanic used at each stage, and tracks two parallel recovery curves: **cognitive ability** and **functional independence**.

Anchor: 28 April 2026. US + UK framing. No medical claims; standard disclaimer + 3pt confidentiality footer on every page.

## Files to Update

1. **`MyRhythm_MVP_UseCases_v1.docx` → v2** (`MyRhythm_MVP_UseCases_v2.docx`)
2. **`MyRhythm_ABI_TBI_AfterEffects_Timeline_v1.docx` → v2** (`MyRhythm_ABI_TBI_AfterEffects_Timeline_v2.docx`)

Originals are preserved; v2 files are the deliverables.

## New Shared Section: "Bridge Pathway — Pre-Discharge to Independence"

Inserted into both documents (tailored framing each side: Use-Cases doc anchors to persona impact; After-Effects doc anchors to symptom→feature mapping).

### Eight Stages (each = one detailed page-block)

| # | Stage | Typical Window | Cognitive Focus | Independence Focus |
|---|---|---|---|---|
| 1 | **Pre-Discharge (Ward)** | Day -7 to 0 | Orientation, info capture | Discharge plan ownership |
| 2 | **Discharge Day & First 72h** | Day 0–3 | Reduce overwhelm | Medication + appointment scaffold |
| 3 | **Early Home (Week 1–4)** | Wk 1–4 | Fatigue mapping, working memory | Daily routine restoration |
| 4 | **Structured Rehab (Month 2–4)** | M 2–4 | Attention, processing speed | Therapy attendance, self-tracking |
| 5 | **Re-Engagement (Month 4–9)** | M 4–9 | Executive function, planning | Light activities, social re-entry |
| 6 | **Phased Return-to-Work / Study (Month 6–12)** | M 6–12 | Sustained focus, multi-step tasks | Graded hours, workplace adjustments |
| 7 | **Full Return & Stabilisation (Month 12–24)** | Y 1–2 | Cognitive endurance, metacognition | Full role + self-advocacy |
| 8 | **Independent Operating (Year 2+)** | Y 2+ | Maintenance, relapse-prevention | Career progression, life goals |

### Per-Stage Detail Schema

Each stage block contains:
- **What's happening (clinical + lived experience)** — 2–3 lines
- **Cognitive ability targeted** — named domain (e.g. working memory, processing speed, executive function, attention, metacognition)
- **Independence milestone** — observable behaviour (e.g. "manages own medication", "attends therapy unaided", "completes 4-hour work block")
- **MVP feature(s) used + exact mechanic**:
  - **Recording** — what gets captured, by whom, replay pattern
  - **Support Circle** — who is in it at this stage, what they see, handoff rituals
  - **Calendar** — energy-aware pacing, appointment density, buffer rules
  - **4Cs Loop** — Capture / Commit / Calibrate / Celebrate cadence (daily vs weekly)
- **How this builds cognition** — plain-English mechanism (e.g. "external scaffold offloads working memory so attention can rebuild")
- **How this builds independence** — plain-English mechanism (e.g. "owning the calendar transfers control from caregiver back to survivor")
- **Universal parallel (everyone benefits)** — 1–2 lines: same mechanic for non-injured readers (new parent, post-burnout return, post-surgery, ADHD adult, demanding job)

### Visual Recovery Curve (Page after stages)

Two-column compact table approximating progress across the 8 stages:

| Stage | Cognitive Capacity (illustrative %) | Functional Independence (illustrative %) |
|---|---|---|
| Pre-Discharge | 20–35 | 10 |
| First 72h | 25–40 | 15 |
| Early Home | 30–50 | 25 |
| Structured Rehab | 40–60 | 40 |
| Re-Engagement | 55–75 | 55 |
| Phased RTW | 65–85 | 70 |
| Full Return | 80–95 | 85 |
| Independent | 90–100 | 95–100 |

Labelled clearly as **illustrative, not clinical**. Disclaimer reiterated.

### Cognitive Domains Legend (one page)

Short reference: working memory, processing speed, sustained/divided attention, executive function (planning, initiation, inhibition), metacognition, emotional regulation, social cognition — each with one line on how the MVP touches it.

## Document-Specific Insertions

### `MyRhythm_MVP_UseCases_v2.docx`
- Insert the Bridge Pathway section **after the personas, before Market Impact**.
- Add a short cross-reference paragraph in the ABI persona linking forward to the new timeline.
- Refresh footer date; version bump on cover.

### `MyRhythm_ABI_TBI_AfterEffects_Timeline_v2.docx`
- Replace the existing 6-stage timeline with the new 8-stage Bridge Pathway (the existing acute/discharge/early-rehab/plateau/long-term/life-long mapping is absorbed and expanded).
- Keep the existing After-Effects table, Universal Benefit Matrix, Stats Anchor, and Sources pages.
- Add the Cognitive Domains Legend page before Sources.
- Version bump on cover.

## Technical

- Generate with `docx-js` via a single script in `/tmp/`, output both v2 files to `/mnt/documents/`.
- US Letter, 1" margins, Arial, semantic Heading styles, `LevelFormat.BULLET` for lists, `WidthType.DXA` for all tables with matching `columnWidths`, `ShadingType.CLEAR` for shaded header rows.
- 3pt confidentiality footer on every page; medical disclaimer in footer/page intros.
- QA both files: convert to PDF + per-page JPEG, inspect every page for clipping/overflow/empty pages, regenerate if issues.
- Return one `<presentation-artifact>` tag per file.
- No app code changes. No DB. No `/launch/*`. No payments.

## Out of Scope

- No new personas.
- No edits to v1 files (kept as historical baseline).
- No clinical claims, no recovery guarantees — all percentages explicitly illustrative.
- No new statistics beyond what already lives in the v1 stats anchor (unless needed to support a stage; then cited).
