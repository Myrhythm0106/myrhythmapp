## Goal

Create `MyRhythm_MVP_UseCases_v3.docx` by extending the existing v2 doc with four new personas. The v2 file currently in `/mnt/documents/` does NOT contain these — that's why you don't see them.

(The After-Effects Timeline doc stays at v2 — no changes requested there.)

## New Personas Added

Grouped under a new section **"Adjacent & Universal Personas"** (placed after ABI/TBI personas, before Bridge Pathway):

1. **Dementia / Early-Stage Cognitive Decline** — Recording for "what did we agree?" replay; Support Circle for caregiver visibility; Calendar with high-buffer pacing; simplified 4Cs (daily Capture + Celebrate). Framed as supportive/compensatory, not therapeutic.
2. **Healthy Ageing / Cognitive Maintenance (55+)** — Daily 4Cs as cognitive hygiene; energy-paced Calendar; Recording for medical/financial recall; Support Circle for adult children.
3. **Memory Decline (non-clinical / sub-threshold)** — Capture–Calibrate loop to externalise memory load; Recording as evidence base; trend visibility over time.
4. **Productivity Guru / High-Performer** — Energy-aware Calendar; Recording for meeting recall + ACT extraction; weekly 4Cs cadence; Support Circle as accountability.

Each persona follows the existing v2 schema: context · pain points · MVP features used + mechanic · how it builds cognition/independence · universal parallel.

## Other Document Changes

- Cover: version → **v3**, date refresh.
- Market Impact: brief stat refresh (dementia: 55M global / 7M US per CDC/WHO; high-performer/burnout reference).
- Bridge Pathway intro: one-line note that dementia uses a modified maintenance-and-pacing reading (not a recovery curve).
- All existing v2 content preserved verbatim (ABI/TBI personas, 8-stage Bridge Pathway, Cognitive Domains Legend, Universal Benefit Matrix, Stats Anchor, Sources, 3pt confidentiality footer, medical disclaimer).

## Out of Scope

- No edits to v1 or v2 files (kept as history).
- No changes to the After-Effects Timeline doc.
- No app code, DB, or `/launch/*` changes.
- No clinical claims.

## Technical

- Single `docx-js` script in `/tmp/`, output `MyRhythm_MVP_UseCases_v3.docx` to `/mnt/documents/`.
- US Letter, 1" margins, Arial, `WidthType.DXA` tables with matching `columnWidths`, `ShadingType.CLEAR` headers, `LevelFormat.BULLET` lists.
- QA: convert to PDF + per-page JPEG, inspect every page, regenerate if clipping/overflow.
- Return one `<presentation-artifact>` tag for the new file.
