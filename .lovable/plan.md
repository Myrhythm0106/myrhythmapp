
# MyRhythm Launch Master Plan — v2.3 (v2.2 + dual MYRHYTHM / FIT Collective template pairs in Google Sheets & Docs)

Delta from v2.2: v2.1 finance model + v2.2 replicability & founder-proof still stand. New requirement: **every reusable template ships as a matched pair** — one pre-filled `MYRHYTHM` version (yours, live, editable) and one neutral `FIT_COLLECTIVE` version (stripped, ready to hand to a FIT cohort member). Both live in **Google Sheets / Google Docs** so you can start using and amending them today.

Anchor: 29 Jul 2026. Founders window: 3 Aug – 30 Sep 2026. Public paid launch: 1 Oct 2026.

---

## 1. Delivery mechanism — Google Workspace via connector

Templates are created in your Google Drive using the **Google Sheets** and **Google Docs** connectors (already surfaced in this environment). For each template I:

1. Create the `MYRHYTHM` version pre-filled with your data (from v2.2 workbook + existing docs).
2. Create the `FIT_COLLECTIVE` version — identical structure, your data stripped, prompts inserted in every editable cell (e.g. `<your ARPU in USD>`, `<your first ring-1 contact>`).
3. Return the Google Drive URLs in a single index doc so you have one starting point.

Both versions land in a Google Drive folder pair:
```
/MyRhythm — Launch Master (live)
/FIT Collective — Launch Templates (blank, ship to members)
```

If the Google Sheets or Google Docs connector isn't yet linked when build mode starts, I'll call `standard_connectors--connect` and pause until you approve — no silent failures.

---

## 2. Template pairs to create

Every row = one MYRHYTHM version + one FIT_COLLECTIVE version.

### Google Sheets pairs
| # | Template | Source in v2.2 | MYRHYTHM state | FIT_COLLECTIVE state |
|---|---|---|---|---|
| S1 | Launch Master Plan | tabs 01–22 of v2.2 xlsx | your dates, tasks, owners | dates as `LaunchDate+N` formulas, tasks tagged `[UNIVERSAL]` / `[BRAND-SPECIFIC: replace]` |
| S2 | Financial Model | tabs 13–18 | your Lean/Expected/Safe tiers, £/$ rate | Assumptions tab reset to neutral defaults, ARPU/churn/conversion blank with prompts |
| S3 | Assumptions (single source of truth) | tab 26 | your 12 driver cells | prompts + example values in comments |
| S4 | Founder Usage Log | tab 23 | pre-seeded with actions taken to date | headers only + one worked example row |
| S5 | Evidence Vault Index | tab 24 | your links to `/mnt/documents/evidence/` | headers + storage convention note |
| S6 | Weekly Metrics Log | derived from `90-day-sprint.md` §8 | your live weekly numbers | blank grid with the 5 metric definitions |
| S7 | Outreach CRM (light) | Ring 1–4 from marketing plan | your names, status, last touch | blank rows + ring definitions |
| S8 | Clinical LOI Tracker | new | your 3 target sites, stage, next action | headers + example row |

### Google Docs pairs
| # | Template | Source | MYRHYTHM state | FIT_COLLECTIVE state |
|---|---|---|---|---|
| D1 | Investor Loom Script | `docs/investor-loom-script.md` | your verbatim script | placeholders for founder story, stats, ask |
| D2 | Investor Loom Distribution — 3 email templates | `docs/investor-loom-distribution.md` §2 | your signature, your Loom URL | `[Loom link]`, `[Founder]`, `[Mutual]` prompts |
| D3 | Founders-Market Outreach Emails (4 rings) | `docs/founders-market-marketing-plan.md` | your voice, your warm names referenced | neutral, `[brand]` / `[founder story hook]` markers |
| D4 | Monthly Founder Update email | marketing plan §3 | your Aug update pre-drafted | blank monthly template with 5 section prompts |
| D5 | Discharge Bridge Kit — clinician handout | `docs/discharge-bridge-kit.md` | MyRhythm branded | `[Product name]` / `[Category claim]` / `[Ask]` markers |
| D6 | FIT Replication Playbook | new (was `FIT_Cohort_Playbook_v1.md`) | worked example = your own launch | the playbook itself + fork instructions |
| D7 | One-Page Financial Summary | `MyRhythm_Financial_Summary_1page.pdf` source | your numbers | blank with prompts |
| D8 | README / Index of all templates | new | links to both folders + how to use | same doc — this one is shared |

Total: **16 Google files** (8 Sheets + 8 Docs), each in two versions → **32 files** in Drive, organised into the two folders above.

---

## 3. Neutralisation rules for every FIT_COLLECTIVE version

Applied consistently so a FIT member never has to guess:

- Brand text replaced with `[Product name]`.
- Category claim replaced with `[Your category claim — one line]`.
- Founder story replaced with `[2-sentence founder story: why you, why now]`.
- Numeric values in formulas preserved; input cells cleared and given a comment prompt.
- Dates converted to `Assumptions!LaunchDate + N` where possible; otherwise `[YYYY-MM-DD]`.
- Rows tagged `[UNIVERSAL]` (keep as-is) or `[BRAND-SPECIFIC: rewrite]` in a leftmost `Type` column so a FIT member can filter.
- Every doc has a top-of-file **"How to fork this"** callout (3 bullets) and a footer with the v2.2 confidentiality line.

---

## 4. What still lives in `/mnt/documents/` (unchanged from v2.2)

The local artifacts remain the master record and the offline fallback:
1. `MyRhythm_Launch_Master_Plan_v2.3.xlsx` — canonical, source of truth for Sheets pair S1.
2. `MyRhythm_Launch_Master_Plan_v2.3.csv`
3. `MyRhythm_Launch_Master_Plan_v2.3_README.md` — now lists every Google Drive URL created.
4. `MyRhythm_Financial_Summary_1page.pdf`
5. `FIT_Cohort_Template_v1.xlsx` — offline mirror of the Google Sheets FIT pair.
6. `FIT_Cohort_Playbook_v1.md` — offline mirror of D6.
7. `evidence/` folder scaffold.
8. **NEW** `Template_Index.md` — flat list of all 32 Google Drive URLs + local mirror paths, so if Drive access ever breaks you have offline fallbacks.

---

## 5. Build order (single pass)

1. Verify Google Sheets + Google Docs connectors are linked; if not, `standard_connectors--connect` and pause.
2. Create the two Drive folders.
3. Build the local v2.3 xlsx (source of truth) with QA loop (recalc, zero formula errors, screenshot every tab).
4. Push S1–S8 to Google Sheets as MYRHYTHM version, duplicate + strip for FIT_COLLECTIVE version.
5. Create D1–D8 in Google Docs (both versions each).
6. Generate `Template_Index.md` with all 32 URLs.
7. Generate financial 1-page PDF.
8. Deliver: single message with folder URLs + local artifact paths.

---

## 6. ⚠️ Human-only actions (adds to v2.2 §7)

- [ ] Confirm the Google account you want these created in (the connected account owns the files by default). If you want them owned by a Google Workspace under `myrhythmapp.com`, connect that account first.
- [ ] Decide sharing on the FIT_COLLECTIVE folder: **view-only for public link**, or **"Anyone with link can copy but not edit the master"** (recommended so members always fork clean).
- [ ] Decide licence stamped in every FIT_COLLECTIVE file footer: `All rights reserved © MyRhythm 2026` vs `CC BY-NC 4.0`. Affects whether FIT members can commercialise their fork.
- [ ] Any file with real names (Ring 1 contacts, LOI clinician names) stays in MYRHYTHM folder only — I will never copy real personal data into FIT_COLLECTIVE files.

---

## 7. What v2.3 still does not do

- No shared-drive workspace, no permission automation, no Zapier/Make hooks.
- No auto-sync between local xlsx and Google Sheets — Google Sheets is the working copy after handoff; local xlsx is the point-in-time snapshot.
- No branding kit / logo drop into Google Docs (you can apply your Google Docs theme after).
- Still not financial, legal, tax, or immigration advice.

---

Ready on approval + switch to build mode. Single pass: connector check → folders → local xlsx + QA → 16 Sheets (both versions) → 16 Docs (both versions) → index → PDF → delivery.
