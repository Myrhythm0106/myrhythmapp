# Plan — Persona-aligned launch refresh across core docs

## Goal

Make all core narrative docs reflect what actually ships at launch, mapped to the four code-defined personas (Pathfinder, Anchor, Operator, Scholar) using both the persona label and a plain-language descriptor. Add a full step-by-step app flow to every use case in the UseCases doc.

## Persona ↔ launch feature matrix (the source of truth I'll use)

| Persona (label + plain) | Entry route | Core launch features they engage |
|---|---|---|
| **Pathfinder** — rebuilding after brain injury / stroke / long-COVID / MS | `/launch` → user-type → recovery onboarding | Bridge Pathway scaffold, Memory Bridge recording (clinical + family), simplified 4C (Capture + Celebrate primary), high-buffer Smart Schedule, Support Circle, Vision Board, Energy Check, Founding Edition badge |
| **Anchor** — caregiver / family member holding the line | `/launch` → user-type → caregiver onboarding, Subject context (self/supporting) | Subject switch, record-on-behalf (off by default), Support Circle coordination, shared Smart Schedule, Anchor capability lens copy, burnout calibration, Calendar invites distinct from Support Circle |
| **Operator** — high-output professional protecting deep work | `/launch` → user-type → productivity onboarding | Full 4C loop, Smart Schedule with energy badges, Memory Bridge for meetings (searchable record), deep-work protection, Google/Outlook calendar sync, Vision → Goals → Priorities → Daily Actions traceability |
| **Scholar** — student pacing toward recall | `/launch` → user-type → student onboarding | Lecture/revision capture, study-block Smart Schedule, weekly Calibrate, Celebrate streak, Vision Board for term goals |

Cross-cutting launch features applied to all: `/launch/landingpage` presentation mode, MYRHYTHM assessment, Settings (timezone, calendar sync, 30-day voice retention with 5/25-day reminders), MFA, Clinical Export PDF, GDPR data export, medical-disclaimer footer, Founding Edition labelling.

## Documents to update (all written to `/mnt/documents/`)

1. **MyRhythm_MVP_UseCases_v5.docx** — biggest change
2. **MyRhythm_GTM_Playbook_v2.docx**
3. **MyRhythm_Investor_Pitch_Script_v9.docx** (+ PDF)
4. **MyRhythm_5Year_Vision_2026-2031_v2.docx**
5. **MyRhythm_ABI_TBI_AfterEffects_Timeline_v4.docx**

Originals stay untouched (versioned suffix), per the artifact-iteration rule.

## 1. MVP UseCases v5 (primary deliverable)

For every persona/use case, add a new **"App flow — step-by-step"** subsection after *MVP Features Used & Mechanic*. Each step lists: screen/route → action → system response → 4C touchpoint.

Standard step template (full step-by-step, per user request):

```text
1.  Open /launch (or app icon) → Founding Edition splash
2.  /launch/user-type → select persona → persona stored
3.  /launch/register → email + password → MFA prompt (optional)
4.  /launch/onboarding → MYRHYTHM assessment (persona-tailored)
5.  /launch/energy-check → first energy badge captured (Calibrate seed)
6.  /launch/home → Daily Card with one anchor action (Commit)
7.  Memory Bridge → record / upload → ACTs extracted (Capture)
8.  Smart Schedule → review suggested blocks → accept/adjust (Commit)
9.  Support Circle → invite 1–3 anchors (or Subject switch for Anchor persona)
10. Day-end → Celebrate card → streak + gentle calibrate prompt
11. Weekly → Calibrate review → Vision Board check-in
12. Settings → calendar sync, voice retention, clinical export
```

Each of the 7+ personas (ABI/TBI, Caregiver, Dementia, Healthy Ageing, Sub-threshold Memory Decline, High-Performer, Student) gets this flow **tailored** — e.g. Dementia drops steps 8/11 and adds caregiver-assisted Commit; Operator emphasises step 7 for meetings and step 12 for calendar sync.

Also add at top:
- "Personas in the app" table mapping each use-case persona to its code persona (Pathfinder/Anchor/Operator/Scholar).
- "Launch feature inventory" one-pager listing every shipping feature with the routes they live at.

Retain v4's structure, disclaimers, and the confidentiality footer.

## 2. GTM Playbook v2

- Insert new section **"Launch product surface by segment"** right after section 2 (Market Wedge), with the persona matrix above.
- Update ICP scorecard to add a "Primary launch features" column.
- Update wedge/expand/scale phases to name the actual `/launch/*` routes and features each segment lands on.
- Preserve all numbers, targets, and the rest of the playbook unchanged.

## 3. Investor Pitch Script v9 (112 lines — light touch)

- Add a single new beat: "What ships at launch, by who it's for" — the four-persona matrix in one slide of script.
- Update any feature names to match shipping language (Memory Bridge, Smart Schedule, Support Circle, 4C loop, Bridge Pathway).
- Regenerate companion PDF.

## 4. 5-Year Vision v2

- Update Year-1 section to reflect the launch feature set per persona (replace any aspirational features that aren't in MVP with the actual shipping list).
- Add a "Launch reality check" callout: features live at v0.1 vs deferred to v1.1 (pulled from Founding-Member-Launch-Strategy.md v1.1 Roadmap table).
- Years 2–5 unchanged.

## 5. ABI/TBI After-Effects Timeline v4

- For each of the 8 Bridge Pathway stages, add a "Launch features active at this stage" line (e.g. Pre-Discharge: Memory Bridge recording + Support Circle invite; Independent Operating: full 4C + deep-work Smart Schedule).
- Keep all clinical content, citations, and disclaimers intact.

## Build approach

- Use the `docx` skill (docx-js) to generate fresh files; copy carried-over prose verbatim from the v(N-1) plain-text extraction.
- Apply the document confidentiality footer (3pt) on every page per project standard.
- QA: convert each new docx → PDF → JPGs, inspect for overflow/missing footers, fix and re-render. Report QA findings before declaring done.

## Out of scope

- No code changes.
- No edits to PPTX investor deck, financial model, or sprint plan.
- No new persona definitions — using the four already in `usePersona.ts`.
- No changes to v4 and earlier of any doc (kept as history).

## Open question (non-blocking)

If you'd rather I **edit v4 in place** (tracked changes via the docx skill's modify-existing flow) instead of producing v5/v2/v9/etc., say so and I'll switch the build step. Default is fresh versioned files so you can diff.
