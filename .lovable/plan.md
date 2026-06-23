# Plan: MyRhythm GTM Playbook v3 — Three-Horizon, Easily Amendable

Rebuild the GTM Playbook as **one document with three selectable tracks** (5-week / 6-month / 1-year), all starting **Tuesday 23 June 2026**. Designed first and foremost to be **easy for you to amend week-to-week** without going back through me.

## 1. "Easily amendable" — the core requirement

Two parallel deliverables so you always have an editable surface:

**A. Editable master — `.docx`**
- Plain Arial, no locked styles, no images embedded in tables.
- Every track section uses **simple Word tables** (Week / Goal / Daily actions / KPI / Owner / RAG status / Notes) — click any cell, type, done.
- A single **"Change log" table** on page 2 (Date / Version / What changed / By whom) so amendments are tracked in the doc itself.
- Front-matter **"How to amend this playbook"** box: 4 bullets — update the cell, bump version, add a changelog row, re-export PDF.
- All dates rendered as text (not Word date fields) so you can edit freely.
- Placeholders like `[Partner name]`, `[£ target]`, `[Owner]` used consistently so find-and-replace works.

**B. Read-only share — `.pdf`**
- Generated from the same `.docx` for clients/investors/Founders.
- Footer notes "Living document — see .docx for latest".

Optional companion (default OFF unless you say yes): a **Google Docs / Notion-ready Markdown export** (`.md`) so the playbook can live online as your central link.

## 2. Document structure

**Front matter**
- Cover: "GTM Playbook v3 — Founding Edition", anchor date Tue 23 Jun 2026.
- How to amend this playbook (4 bullets).
- Change log table.
- How to pick a track (5-week vs 6-month vs 1-year decision guide).
- Central-source-of-truth usage: shared link convention, weekly Monday 30-min review ritual, audience-to-section map (Founders / charities / clinicians / investors), monthly version bump.

**Five GTM pillars carried through every track:**
1. Positioning & narrative (Discharge Cliff / Clinical-Ready vs Life-Ready Gap)
2. Channels & outreach
3. Founding cohort growth
4. Product proof points
5. Revenue & investment

## 3. Track A — 5-Week Sprint (23 Jun – 27 Jul 2026)

One editable table per week (Goal / Daily actions Mon–Fri / KPI / Owner / RAG / Notes).
- W1 launch to warm list, 10 demos
- W2 25 Founders, 3 clinician convos
- W3 first Memory Bridge case study, charity #1
- W4 50 Founders, first Taste & See conversions, investor teaser
- W5 retro + graduate decision

## 4. Track B — 6-Month Playbook (Jun – Dec 2026)

One editable table per month: Objective / 3 priorities / KPIs / Content / Partners / Investor milestone / RAG / Notes.
- M1 cohort to 50 · M2 clinician design partners · M3 charity channel + 150 Founders · M4 paid test + pre-seed convos · M5 300 Founders + outcomes data · M6 pre-seed close.

## 5. Track C — 1-Year Playbook (Jun 2026 – Jun 2027)

One editable table per quarter: Theme / Objectives / Hiring / Partnerships / Revenue / Fundraise / RAG / Notes.
- Q1 cohort + design partners · Q2 paid + pre-seed · Q3 clinical pilots + outcomes paper · Q4 seed raise + UK regional.

## 6. Deliverables

- `MyRhythm_GTM_Playbook_v3.docx` (editable master)
- `MyRhythm_GTM_Playbook_v3.pdf` (share copy)
- v2 left in place

## 7. Technical notes

- Generate with `docx-js`: US Letter, Arial, brand-orange #EA580C H1s, teal #0F766E accents, DXA tables, no unicode bullets, simple borders to keep tables editable.
- Confidentiality footer (3pt) + "Founding Edition v0.1 — Living document" on every page.
- PDF via LibreOffice; QA every page as JPEG, fix overflow, re-run until clean.

## Open questions (will default if no answer)

1. Add the **Markdown (`.md`) companion** for Notion/Google Docs hosting? Default: **no**.
2. Hard-code any **named partners/charities/clinicians/£ targets**, or leave as `[placeholders]`? Default: **placeholders** (easier to amend).
3. Keep all three tracks in **one document** (default) or split into three files?
