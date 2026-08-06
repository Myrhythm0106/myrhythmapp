# MyRhythm Playbook — MVP → 5 Years

One living playbook. The launch plan (today → Christmas → rehab centres) stays exactly as agreed and becomes **Horizon 0**, the primary milestone everything else hangs off. Four further horizons stack behind it. Every horizon is downloadable as a Google Sheet, editable there, and **re-uploadable** so the app stays in sync with whatever you edited on the road.

Anchor: **today, Wed 5 Aug 2026**. Public launch gate: **Fri 11 Dec 2026**. Rehab-centre outreach: **Jan 2027**.

## The five horizons

| # | Horizon | Window | Primary question it answers | Exit gate |
|---|---|---|---|---|
| H0 | **Launch Plan (primary)** | Aug – Dec 2026 | Is it real, used, and paid for? | G1 F&F · G2 Public launch · G3 Rehab-ready |
| H1 | 6 months | Jan – Jun 2027 | Does it retain, and will a centre pilot it? | 1 signed pilot, 30-day retention target held |
| H2 | 1 year | Jul – Dec 2027 | Does it repeat without me pushing it? | Repeatable acquisition + first renewals |
| H3 | 18 months | Jan – Jun 2028 | Is it a business or a project? | Break-even path proven, second market/cohort live |
| H4 | 5 years | 2028 – 2031 | What is the category position and the exit shape? | Category ownership, defensible data + IP |

H0 keeps **all its current contents unchanged** — three gates, MVP "Done" line, 20-week SMART schedule, Friday metrics, weekly ritual, feedback→decision loop, risk register, and the IP/copyright action list.

## What gets built

### 1. `docs/playbook.md` — the master document

Section per horizon. H0 is the full launch plan verbatim. H1–H4 each carry the same five-part shape so the document never sprawls:

- **Outcome statement** — one sentence, written as a state of the world, not a task.
- **3 objectives max** — SMART: number, date, owner.
- **Key results** — the measures that prove each objective, with a baseline column left blank until it's real.
- **Bets and non-bets** — what we're deliberately *not* doing in that window (this is what stops scope creep).
- **Exit gate** — pass/fail on a fixed date; failing means the next horizon slips rather than starts half-built.

Indicative content (refined during build, all claims-policy compliant):

```text
H1 6mo   Retention + first pilot     KRs: 30-day retention, 1 signed centre pilot,
                                          Continuity Report used in a real review
H2 1yr   Repeatable acquisition      KRs: CAC/LTV known, referral loop live, renewals
H3 18mo  Business, not project       KRs: break-even path, second cohort, team of 2-3
H4 5yr   Category + defensibility    KRs: Memory-First Design™ recognised, research
                                          corpus, IP portfolio, partner distribution
```

Also in H4: a short **"what must stay true"** list — the app is never a medical device, no clinical outcome claims, "no one walks alone" stays load-bearing.

### 2. `src/founder/playbook.ts` — one typed source of truth

Everything — horizons, gates, weeks, MVP items, IP actions, objectives, key results, metrics definitions — lives in this one typed file. The document, the in-app page, and the spreadsheet are all generated from it. `src/founder/launchPlan.ts` (H0 data) is imported into it rather than duplicated, so the launch plan has exactly one home.

### 3. `/founder/playbook` — the in-app playbook (admin-only)

Same admin gate as `/founder/evidence`. `/playbook` redirects here so your current bookmark keeps working.

- **Horizon rail** across the top: H0 … H4, current one highlighted, days-remaining on each gate.
- **H0 panel (default view)** — the launch-plan tracker as planned: gate countdown strip, current-week card with tickable outcomes, 20-week red/amber/green grid, Friday metrics row.
- **H1–H4 panels** — objectives with progress, key results with baseline/current/target, bets vs non-bets, exit gate status.
- **Sheet bar** — Download, Upload, and "last synced" timestamp.

State lives in `founder_playbook_progress` (admin-only RLS): one row per item (`horizon`, `item_key`, `status`, `value`, `note`, `updated_at`), which is generic enough to cover week ticks, MVP ticks, IP actions, and metric entries without new tables later.

### 4. Download → edit in Google Sheets → upload back

**Download** produces one `.xlsx` (opens in Google Sheets via File → Import; a CSV option per tab for quick edits):

| Tab | Contents |
|---|---|
| README | How to use, sync rules, do-not-edit warning on the key column |
| Horizons | H0–H4, window, outcome, exit gate, date, status |
| Gates | G1/G2/G3 + horizon exit gates, dates, pass conditions, status |
| 20-Week Plan | Week, dates, theme, 3 outcomes, target, owner, status, notes |
| MVP Checklist | Item, group, done Y/N, date ticked |
| IP & Legal | Action, why, owner, cost estimate, due date, status |
| Objectives & KRs | Horizon, objective, key result, baseline, current, target, due |
| Metrics | One row per Friday, six metric columns, ready to chart |

**Upload** takes the same workbook back. Every row carries a hidden-ish `key` column (first column, locked styling, "do not edit" noted in README). On upload:

1. Rows are matched by `key` — never by position, so you can sort, filter and colour freely in Sheets.
2. Only the editable fields (status, value, notes, baseline/current) are read; structural fields are ignored.
3. You see a **diff preview** — "18 unchanged, 6 changed, 2 unrecognised keys" — with the changed rows listed, before anything is written.
4. Confirm writes to `founder_playbook_progress` in one transaction; unrecognised keys are reported, not silently dropped.

That's what makes it maintainable: the Sheet is the working surface, the app is the record, and the `key` column is the contract between them.

### 5. Maintenance ritual (baked into the page)

- **Friday 4pm, 30 min** — fill the metrics row, RAG last week, pick next week's 3 outcomes, log one thing to stop doing.
- **Last Friday of the month** — review the current horizon's key results only.
- **Horizon gate day** — pass/fail, then open the next horizon. The page nudges you when a gate date is within 14 days.

## Technical notes

- `docs/playbook.md` supersedes and links `docs/90-day-sprint.md` and `docs/5-year-vision.md` so there is one entry point, not three competing plans; the older docs get a pointer header rather than being deleted.
- Export reuses the `exceljs` pattern in `src/components/memoryBridge/capture-brief/exporters/xlsx.ts` — brand orange headers, frozen header row, confidentiality footer. Import uses the same `exceljs` dependency (already installed), parsed client-side.
- Route follows the existing founder pattern: `AdminRoute` + server-side `has_role` check, matching `/founder/evidence`.
- Migration creates `public.founder_playbook_progress` with grants to `authenticated` + `service_role` and RLS restricted to `has_role(auth.uid(),'admin')`.
- All copy passes `docs/claims-policy.md` — no clinical outcome language anywhere in the rehab or investor-facing sections.

## Not in this plan

No member-facing changes. Nothing touches the 4C loop, Memory Bridge, or Calendar. H1–H4 are planning artefacts only — no features are built ahead of their horizon.
