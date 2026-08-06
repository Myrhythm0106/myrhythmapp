# MyRhythm Playbook — Sheet first, app second

## My advice on the order

Yes — your instinct is right, with one adjustment.

Build the **spreadsheet first** as the shape everyone agrees on, then build the app page to mirror it tab-for-tab. But the *data* must live in one typed file in the codebase (`src/founder/playbook.ts`) that generates both. Otherwise you end up hand-maintaining a sheet and an app page that drift apart within a month.

So the real order is:

```text
1. Agree the structure  ->  2. Generate the Google Sheet  ->  3. App page mirrors it
   (typed source file)      (download, use immediately)      (same tabs, same keys)
                                        ^                             |
                                        +----- upload to sync --------+
```

The sheet is your working surface. The app is the record. The `key` column in each tab is the contract between them, so an upload matches rows even after you sort, filter and colour in Sheets.

## Step 1 — The Google Sheet (delivered first)

A single `.xlsx` you upload to Google Drive and open as a Sheet. It carries **all the launch-plan contents already agreed**, plus the four later horizons.

| Tab | Contents |
|---|---|
| README | How to use it, the weekly ritual, sync rules, "don't edit the key column" |
| Horizons | H0–H4: window, outcome statement, exit gate, gate date, status |
| Gates | G1 F&F (21 Aug 26) · G2 Public launch (11 Dec 26) · G3 Rehab-ready (30 Jan 27) + horizon gates, with pass conditions |
| 20-Week Plan | Wk, dates, theme, 3 outcomes, target, owner, RAG status, notes — 5 Aug → 18 Dec 2026 |
| MVP Checklist | Every "Done line" item by group: 4C loop, Memory Bridge, Calendar, Support Circle, access codes + Stripe test, data export, disclaimers, mobile pass, error/empty states |
| IP & Legal | Copyright, trademark (UK IPO + USPTO, classes 9/42/44), assignment hygiene, NDAs, trade secrets, DPIA — each with why, owner, cost estimate, due date |
| Objectives & KRs | H1–H4 objectives and key results with baseline / current / target / due |
| Metrics | One row per Friday: paying members, weekly-active full 4C loop, capture→commit rate, invite acceptance, P0 bugs open, clinician conversations |
| Risks | The five risks, each with trigger and pre-agreed response |

Formatting matches the existing exporters: brand-orange frozen header rows, RAG-coloured status column with data validation dropdowns (Not started / In progress / Done / Blocked), date columns typed as dates so Sheets charts work, and the confidentiality footer line.

Delivered two ways: a file you can download straight away, and the same workbook generated on demand from the app so every later download reflects current status.

### The five horizons (H0 keeps every current launch-plan detail unchanged)

| # | Horizon | Window | Question it answers | Exit gate |
|---|---|---|---|---|
| H0 | **Launch Plan (primary)** | Aug – Dec 2026 | Is it real, used, and paid for? | G1 · G2 · G3 |
| H1 | 6 months | Jan – Jun 2027 | Does it retain, and will a centre pilot it? | 1 signed pilot; 30-day retention target held |
| H2 | 1 year | Jul – Dec 2027 | Does it repeat without me pushing it? | Repeatable acquisition + first renewals |
| H3 | 18 months | Jan – Jun 2028 | Is it a business or a project? | Break-even path proven; second cohort live |
| H4 | 5 years | 2028 – 2031 | What is the category position? | Category ownership, research corpus, IP portfolio |

Each of H1–H4 gets the same five-part shape and no more: outcome statement, max 3 SMART objectives, key results, bets *and non-bets*, exit gate.

## Step 2 — `docs/playbook.md`

The narrative version of the same content, generated from the same source file, so the doc, the sheet and the app never disagree. It supersedes and links `docs/90-day-sprint.md` and `docs/5-year-vision.md` (pointer headers added, nothing deleted).

## Step 3 — `/founder/playbook` (admin-only) mirrors the sheet

`/playbook` redirects here so your current bookmark keeps working. Layout mirrors the tabs one-to-one, so moving between Sheet and app needs no translation:

- **Horizon rail** — H0…H4, current highlighted, days remaining on each gate.
- **H0 panel (default)** — gate countdown strip, current-week card with tickable outcomes, 20-week RAG grid, Friday metrics row.
- **H1–H4 panels** — objectives, key results with baseline/current/target, bets vs non-bets, exit gate status.
- **Sheet bar** — Download · Upload · "last synced" timestamp.

**Upload back:** rows matched by `key`, only editable fields read (status, value, notes, baseline/current), then a **diff preview** ("18 unchanged, 6 changed, 2 unrecognised keys") before anything is written. Nothing is silently dropped.

## Technical notes

- Single typed source: `src/founder/playbook.ts`, importing the H0 launch-plan data rather than duplicating it.
- Export and import both use `exceljs` (already installed), following `src/components/memoryBridge/capture-brief/exporters/xlsx.ts` styling.
- Progress persists in a new `public.founder_playbook_progress` table — one row per item (`horizon`, `item_key`, `status`, `value`, `note`, `updated_at`) — grants to `authenticated` + `service_role`, RLS restricted via `has_role(auth.uid(),'admin')`.
- Route uses the existing `AdminRoute` pattern, same as `/founder/evidence`.
- All copy passes `docs/claims-policy.md` — no clinical outcome language in rehab- or investor-facing rows.

## Not in this plan

No member-facing changes. Nothing touches the 4C loop, Memory Bridge or Calendar. H1–H4 are planning artefacts only — no features built ahead of their horizon.
