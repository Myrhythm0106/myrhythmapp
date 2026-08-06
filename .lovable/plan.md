# MyRhythm Playbook — Sheet First, App Second

## Goal
Turn the approved launch plan into a maintainable, downloadable, uploadable playbook that lives in Google Sheets first and is mirrored inside the app at `/founder/playbook`.

## Why this order
1. The spreadsheet is the working surface — easy to edit on any device, share with advisors, and track weekly.
2. The app page mirrors the sheet and becomes the record + data-room view.
3. A single typed source file drives both surfaces so they never drift apart.

## What gets built

### 1. Typed source of truth
**File:** `src/founder/playbook.ts`
- Horizons H0–H4 with questions, outcomes, exit gates and dates.
- Gates G1 (Friends & Family), G2 (Public launch), G3 (Rehab-ready) plus H1–H4 gates.
- 20-week H0 plan from 5 Aug 2026 → 18 Dec 2026 with themes, outcomes, targets and owners.
- MVP checklist grouped by 4C loop, Memory Bridge, Calendar, Support Circle, Access & payments, Data, Safety, Quality.
- IP & Legal actions with costs, owners and due dates.
- Objectives & key results for H1–H4 including bets and non-bets.
- Metrics aligned to permitted claim domains (Confidence, Identity, Behaviour, Quality of Life, Commercial) and mapped to NICE NG211 / CARF / CQC references where relevant.
- Risk register with triggers and responses.
- A stable `key` column for every row so sheet ↔ app sync works.

### 2. Excel export + import
**File:** `src/founder/playbookXlsx.ts`
- `buildPlaybookWorkbook()` generates a multi-tab `.xlsx` with:
  - README
  - Horizons
  - Gates
  - 20-Week Plan
  - MVP Checklist
  - IP & Legal
  - Objectives & KRs
  - Metrics
  - Risks
- `downloadPlaybookXlsx()` triggers a download named `MyRhythm_Playbook_YYYY-MM-DD.xlsx`.
- `parsePlaybookXlsx()` reads an edited workbook back and returns progress rows keyed by the `Key` column.
- Status columns use dropdown validation with the allowed values.

### 3. Database table
**Migration:** `founder_playbook_progress`
- Columns: `horizon`, `item_key` (unique), `status`, `value`, `note`, `updated_by`.
- RLS: admin-only read/write via `has_role(auth.uid(), 'admin')`.
- Upsert from uploaded sheet; export merges current progress into the workbook.

### 4. Founder playbook page
**File:** `src/pages/founder/FounderPlaybookPage.tsx`
- Admin-only route at `/founder/playbook`.
- Read-only summary of horizons, gates, current week, MVP checklist status and metric values.
- Download button for the full `.xlsx`.
- Upload drop-zone to import an edited sheet and upsert progress.
- Toast feedback on upload: matched rows, ignored keys.

### 5. Route registration
**File:** `src/App.tsx`
- Add `/founder/playbook` inside the existing admin route wrapper.

### 6. Documentation
**File:** `docs/playbook.md`
- Narrative companion explaining how to use the sheet, the weekly review ritual, the claim-domain discipline, and the two-way sync contract.

## Out of scope for this plan
- Real-time collaboration on the sheet (Google Sheets API sync is future work; the export/import loop is the v0.1 contract).
- Auto-populating metric values from the database (the `Value` column is manually tracked in the sheet; automated metric feeds are a future enhancement).
- Changing any launch strategy content — this plan only packages what was already approved.

## Definition of done
- `src/founder/playbook.ts` compiles and exports all data structures.
- `src/founder/playbookXlsx.ts` produces a zero-error workbook when recalculated.
- `/founder/playbook` renders for admin users, downloads a sheet, and re-imports edits.
- The migration runs and `founder_playbook_progress` is queryable by admins.
- `docs/playbook.md` is written and references `docs/claims-policy.md`.
