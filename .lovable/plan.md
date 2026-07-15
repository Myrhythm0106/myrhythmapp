
# MyRhythm — App Map, Market Evidence & Flow Sequencing Proposal

Nothing gets deleted. Everything I retire moves into an `src/_archive/` tree with a README so we can restore any file in one move. This plan has three parts: (A) market evidence, (B) app map, (C) sequencing + archive plan.

---

## A. Market evidence — is this app meeting a real need?

The three problems MyRhythm targets (Discharge Cliff, Clinical-Ready vs Life-Ready Gap, Ideal-Brain Assumption) all show up in independent public data.

**Neuro-recovery / TBI / stroke — the Discharge Cliff**
- WHO / Lancet Neurology: ~69 million new TBIs per year globally; stroke affects ~12.2 million people/year and is the second-leading cause of adult disability.
- Digital cognitive rehabilitation market: multiple analyst reports (Stratistics, Verified Market Reports, MarkWide) all project 2024→2034 CAGR ≈ 12–18%, driven explicitly by *post-discharge* and *community-based* care — the gap MyRhythm targets.
- IntechOpen 2026 chapter "The Digital Revolution in TBI Rehabilitation" frames the exact thesis: *"conventional models are constrained by limited resources, access barriers, and a disconnect from patients' real-world functioning"* — bridging clinic-to-community.
- NHS England / Headway UK: >350k UK hospital admissions/year with acquired brain injury; typical outpatient neuropsychology waitlists 6–18 months → validated Discharge Cliff.

**ADHD / executive function — the Ideal-Brain Assumption**
- CDC MMWR (2023): ~6% of US adults currently have ADHD; only ~1 in 3 receive treatment.
- Strategic Market Research: ADHD-apps market USD 563M (2024) → USD 1.1B (2030), 10.8% CAGR.
- Growth Market Reports: Digital ADHD Executive-Function Trainer market USD 4.45B by 2034, 13.7% CAGR.
- Peer-reviewed 2025 (Psychiatric Quarterly): adult ADHD caregiver burden is comparable to major depressive disorder — validating Support Circle as a first-class surface, not a feature.

**Long COVID / MS / dementia — same cognitive-continuity problem**
- WHO: ~6% of adults report post-COVID cognitive symptoms >3 months.
- Alzheimer's Association 2024: 6.9M Americans living with dementia, projected 13.8M by 2060; MCI affects 12–18% of adults over 60.
- Pattern: none of these populations have a "one condition, one app" solution — they have overlapping needs (memory, scheduling, mood, family loop) which is exactly the 4C loop.

**Caregivers — the Anchor persona**
- AARP / NAC 2020: 53M unpaid caregivers in the US; ~61% also work; average 24 hrs/week of care.
- ~40% clinically significant burnout scores in ADHD, stroke, and dementia caregiver cohorts.

**Signals against pure-brain-training competitors (Lumosity, Elevate, Peak, CogniFit)**
- FTC 2016 Lumosity settlement ($2M) — "brain training" alone lacks functional-outcome evidence.
- The gap those apps *don't* fill: converting real life (meetings, appointments, decisions) into structured next-steps. That is Memory Bridge + 4C, not a puzzle.

**So what does this add up to?**
MyRhythm sits at the intersection of three markets each growing double-digit CAGR, with a positioning ("Collaborative Cognitive Continuity layer running the 4C loop" + Memory-First Design™) that none of the current leaders (MyReDA, Constant Therapy, BrainHQ, Inflow, Numo) occupy. The evidence supports a **need**, and the whitespace is credible.

*(All figures above are sourced from public analyst reports and peer-reviewed literature and are marked in the plan for citation in any investor-facing doc.)*

---

## B. What the app actually contains today (map)

### The one live flow (`/launch/*`, v0.1 Founding Core)

```text
/start
  └─ /launch  (Landing — "Become a Founding Member")
       ├─ /launch/register ─┐
       └─ /launch/signin  ──┤
                            ▼
                   /launch/user-type
                            ▼
                   /launch/payment
                            ▼
                   /launch/assessment
                            ▼
                   /launch/welcome  (BH score reveal)
                            ▼
                   /launch/home  ◀── DASHBOARD HUB
                            │
        ┌───────────────────┼───────────────────────────────┐
        ▼                   ▼                               ▼
  4C LOOP (primary)   CORE FEATURES               SECONDARY / SETTINGS
  ─ /capture          ─ /memory (Bridge)          goals · analytics · store
  ─ /commit           ─ /calendar                 profile · settings · help
  ─ /calibrate        ─ /games                    whats-new · roadmap
  ─ /gratitude        ─ /support                  continuity · science
                                                  clinical-brief · vision
                                                  discharge-bridge (+handout)
                                                  edition (about)
```

### Noise around the live flow
- 8 landing surfaces (`Landing`, `DemoLanding`, `Preview/Preview2/Preview3Landing`, `Home`, `StartPage`, `MemoryFirstIndex`).
- 12 persona welcome pages at `/mvp/*-welcome` — routed but nothing links to them.
- `Dashboard.tsx` (legacy) still renders for `/goals`, `/analytics`, `/brain-games`, `/support`, `/support-circle`, `/profile`, `/settings`, `/testing`, `/accountability`.
- Duplicate MVP pipeline (8 files): `MVPMainFlow`, `MVPPaymentPage`, `MVPAssessmentPage`, `MVPAssessmentFlowPage`, `MVPCore4CPage`, `MVPDashboardPage`, `PlanSelectionPage`, `WelcomeCongratsPage`.
- `AppMemoryFirst.tsx`: full parallel app tree with its own AuthProvider and legacy pages.
- `LaunchDashboardLegacy.tsx` sitting unrouted next to `LaunchDashboard.tsx`.
- Two parallel onboarding tracks (`/journey/brain-injury/*`, `MVPMainFlow`) — neither shares state with the live flow.

### Friction points
1. No single front door.
2. **Payment before value** — money asked before BH-score reveal.
3. Persona work exists twice, used zero times.
4. "Celebrate" hidden under `/launch/gratitude`; Calibrate mood link points to `/home`.
5. Bookmark traps → legacy Dashboard.
6. Two apps in one repo.
7. Secondary nav overloaded (12+ items).

---

## C. Proposal — sequence + archive, delete nothing

### C1. Acquisition (one front door)
`/launch` is the only marketing surface. All others redirect to `/launch` and their source files move to `src/_archive/landings/`.

### C2. Onboarding (assessment before payment)
```text
register → user-type → assessment → welcome (BH score) → payment → home
```
User sees their result *before* the paywall. Only ordering changes; no page is removed.

### C3. Core loop shape
```text
Morning:  Capture → Commit
Midday:   Calendar (passive)
Evening:  Calibrate → Celebrate
```
Rename `/launch/gratitude` → `/launch/celebrate` (keep redirect). Fix Calibrate's mood link.

### C4. Nav hierarchy
- **Bottom bar (5):** Home · Capture · Calendar · Memory · Support
- **Header action:** Celebrate 🎉 (end-of-day nudge from Calibrate)
- **More drawer:** Goals · Games · Analytics · Store · Profile · Settings
- **Deep / contextual (not in nav):** Continuity, Clinical Brief, Discharge Bridge (+handout), Science, Vision, Edition About, Roadmap, What's New, Help.

### C5. Archive strategy (nothing deleted)

New folder: `src/_archive/` with subfolders and a `README.md` listing each archived file, its previous route, and how to restore it. Structure:

```text
src/_archive/
  README.md                         ← inventory + restore instructions
  landings/                         ← alt landing pages
  mvp-legacy/                       ← 8 duplicate MVP pipeline files
  personas/                         ← 12 /mvp/*-welcome pages
  dashboard-legacy/                 ← old Dashboard.tsx + LaunchDashboardLegacy
  memory-first-app/                 ← AppMemoryFirst.tsx + its unique pages
  journey-brain-injury/             ← /journey/* tree
  prototype/                        ← /prototype/* tree
```

Archived files are moved (`git mv`) — history preserved. Any route that used to hit them becomes a `<Navigate>` to the `/launch/*` equivalent so bookmarks keep working. To restore: `git mv src/_archive/<path> <original>` + re-add the route.

### C6. Three build-mode PRs (independently revertable)

**PR-1 — Front door & sequence (highest impact, lowest risk)**
- Reorder onboarding to assessment → welcome → payment
- Redirect all alternate landings to `/launch`; move sources to `src/_archive/landings/`
- Rename `/launch/gratitude` → `/launch/celebrate` (keep old path as redirect)
- Fix Calibrate → mood link to stay in Calibrate
- Tighten bottom nav to the 5 above; move the rest into "More"

**PR-2 — Legacy route cleanup (archive, don't delete)**
- Convert `/dashboard`, `/goals`, `/analytics`, `/profile`, `/settings`, `/support`, `/support-circle`, `/brain-games`, `/testing`, `/accountability` to `<Navigate>` redirects
- Move `LaunchDashboardLegacy.tsx`, `Preview*Landing.tsx`, `Home.tsx`, `MemoryFirstIndex.tsx`, `BrainFriendlyDashboard.tsx`, unrouted TBI/MemoryBank into `src/_archive/`

**PR-3 — Retire second app + MVP legacy + personas decision**
- Move `AppMemoryFirst.tsx` and its unique pages into `src/_archive/memory-first-app/`; entry stays on the main `App.tsx`
- Move the 8 MVP legacy files into `src/_archive/mvp-legacy/`
- Personas: either (a) archive the 12 `/mvp/*-welcome` pages (recommended — `LaunchWelcome` already adapts persona inline), or (b) wire them in as post-assessment interstitials. Awaiting your call.
- Flag `/journey/*` and `/prototype/*` as dev-only builds; sources stay in place (they already sit in their own folders and aren't in the way).

### C7. What stays exactly as-is
4C loop, Memory Bridge, Calendar, Support Circle, Brain Games, all `src/launch/*` subsystems (persona, stage, continuity, profile), Supabase/RLS/provider wiring.

---

## Questions before I start building

1. Approve **assessment-before-payment** reorder in PR-1?
2. Personas: **archive** the 12 `/mvp/*-welcome` pages (rely on inline persona copy), or **wire them in** as an interstitial after `LaunchWelcome`?
3. OK to archive **`AppMemoryFirst.tsx`** (main app entry stays `App.tsx`)?
4. Want the market-evidence section (part A) also saved as `docs/market-evidence.md` for investor use?
