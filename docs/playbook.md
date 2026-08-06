# MyRhythm Playbook — How to use it

## What this is
The Playbook turns the launch plan into a working document you can edit, share and sync. It lives in **Google Sheets first** (via the `.xlsx` export) and is **mirrored inside the app** at `/founder/playbook`.

It covers:
- **Horizons** — H0 (Launch Plan) through H4 (5-year category position)
- **Gates** — Friends & Family, Public launch, Rehab-ready, and H1–H4 gates
- **20-week plan** — week-by-week outcomes from 5 Aug 2026 to 18 Dec 2026
- **MVP checklist** — the technical and product items that must pass before launch
- **IP & Legal** — copyright, trademark, confidentiality and data actions
- **Objectives & KRs** — H1–H4 outcomes and explicit non-bets
- **Metrics** — the measures that sit inside permitted claim domains
- **Risks** — triggers and responses

## The sheet-first rule
1. **Download** the current playbook from `/founder/playbook`.
2. **Edit** the `Status`, `Value` and `Note` columns in any tab.
3. **Upload** the same file back to `/founder/playbook`.
4. The app stores the changes and becomes the record.

Only those three columns travel back into the app. Everything else is regenerated from the source code, so the structure cannot drift.

## The Key column is sacred
Every row has a stable `Key`. Do not edit, delete or duplicate keys. If a key in the uploaded sheet is not recognised, the row is ignored and reported in the upload toast.

## Status values
Use only these four values:
- **Not started**
- **In progress**
- **Done**
- **Blocked**

Anything else is treated as blank.

## Weekly review ritual (30 minutes, every Monday)
1. Open the downloaded sheet.
2. Mark last week as Done or Blocked.
3. Set this week to In progress and write the one thing that must be true by Friday in the Note column.
4. Update the Metrics tab with the latest numbers.
5. Upload the file.

## Claim discipline
The Metrics tab is locked to five claim domains:
- Confidence
- Identity
- Behaviour
- Quality of life
- Commercial

No metric should imply improved cognition, function or medical outcomes. Centres already collect FIM+FAM / UKROC / MPAI-4 through their own systems. MyRhythm records what those instruments stop short of: whether the agreed plan continued after discharge.

See `docs/claims-policy.md` for the full policy.

## IP & legal — what the costs mean
The indicative costs in the IP & Legal tab are not legal advice. Confirm current fees with the UK IPO, USPTO or a solicitor before filing. The actions are ordered so the cheapest protections (copyright notices, dated build archives, NDAs) happen before the more expensive filings.

## Sync contract
- The app can export the full workbook at any time.
- The app can import an edited workbook and upsert progress rows.
- Real-time two-way Google Sheets API sync is not part of v0.1; the export/import loop is the contract.
- If you need multiple people editing at once, share the `.xlsx` file through Google Drive and re-upload when ready.

## When to update the source code
If you want to:
- Add new rows or tabs
- Change dates, targets or pass conditions
- Add a new horizon or gate

…edit `src/founder/playbook.ts`, then rebuild and re-download the sheet. The source code is the single source of truth for structure; the sheet is the working surface for progress.

## Out of scope
- Real-time collaboration via Google Sheets API
- Automated metric feeds from the database
- Changing launch strategy content without updating the source code
