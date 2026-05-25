## Goal

Add a new caregiver-facing capability statement — **"Build a caregiver dashboard that lets me manage shared tasks, track needs, and schedule supportive check-ins"** — to both vision documents, bumping each to a new version.

## Files Produced

- `/mnt/documents/MyRhythm_MVP_UseCases_v4.docx` (extends v3)
- `/mnt/documents/MyRhythm_ABI_TBI_AfterEffects_Timeline_v3.docx` (extends v2)

(v1–v3 files preserved as history.)

## Use Cases v3 → v4

Placement: inside the existing **Caregiver persona** block (under ABI/TBI personas), appended to its "MVP features used" list as a dedicated row:

- **Caregiver Dashboard** — Manage shared tasks across the household, track the supported person's needs (energy, missed actions, upcoming appointments), and schedule supportive check-ins via Support Circle messaging + Calendar.
- Mechanic: surfaces actions assigned/shared with the caregiver, pulls needs signal from energy check-ins and missed-action alerts, and offers one-tap check-in scheduling.
- How it builds independence: reduces caregiver cognitive load, prevents missed-handoff failures, and keeps the supported person on their rhythm without over-monitoring.
- Universal parallel: anyone coordinating care for a family member.

Cover: version → **v4**, date refresh. All other v3 content preserved verbatim.

## After-Effects Timeline v2 → v3

Placement: in the **Caregiver Impact** column of the timeline (or equivalent caregiver-track section), add a short capability block tied to the **post-discharge → community reintegration** stages, where shared-task load and check-in cadence matter most:

- **Caregiver Dashboard (post-discharge onward)** — Shared task management, needs tracking (energy, missed actions, appointment adherence), and scheduled supportive check-ins.
- Anchored to the existing Bridge Pathway stages where caregiver burden peaks (discharge cliff → home routines → community reintegration).
- Framed as supportive/compensatory; no clinical claim.

Cover: version → **v3**, date refresh. All other v2 content preserved verbatim.

## Out of Scope

- No edits to v1/v2/v3 files (kept as history).
- No app code, DB, or `/launch/*` changes.
- No clinical claims; caregiver dashboard described as coordination + visibility, not treatment.

## Technical

- Two `docx-js` scripts in `/tmp/`, outputting to `/mnt/documents/`.
- US Letter, 1" margins, Arial, `WidthType.DXA` tables with matching `columnWidths`, `ShadingType.CLEAR` headers, `LevelFormat.BULLET` lists.
- 3pt confidentiality footer on every page (per Document Confidentiality Standard).
- QA: convert each to PDF + per-page JPEG, inspect every page, regenerate on clipping/overflow.
- Return two `<presentation-artifact>` tags.