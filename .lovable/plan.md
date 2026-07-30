
# Where the M-Pack is

It's already generated, in your files panel under:

```text
launch_v2_3/founder_pack/
├── Founder_Pack_Index.md
├── myrhythm/
│   ├── MyRhythm_M1_MVP_90_Day_Plan.md
│   ├── MyRhythm_M2_MVP_90_Day_Action_Plan.xlsx
│   ├── MyRhythm_M3_Five_Year_Action_Plan.xlsx
│   ├── MyRhythm_F1_Investor_Financials_v1.xlsx / F1_Investor_Narrative.md
│   ├── MyRhythm_G1_Five_Year_Growth_Plan_v1.xlsx / G1_Growth_Narrative.md
│   └── MyRhythm_C1_Founder_Curriculum.md / C2_Daily_Founder_Plan.md
└── fit_collective/  (same 9 files, FIT-branded)
```

Nothing is missing — it just isn't surfaced anywhere as a single index, which is exactly what deliverable 1 fixes.

---

# Deliverable 1 — Investor Data Room

## 1a. Document index (source of truth)

**File:** `launch_v2_3/founder_pack/Investor_Data_Room.md` (+ FIT version)

Replaces the thin `Founder_Pack_Index.md` with a real data-room index:

- **Section 0 — How to use this room.** Reading order for a VC: narrative → financials → 90-day → 5-year → competitor pack.
- **Tabled artefact register** — one row per artefact: ID, title, what it answers, format, status (Final / Draft / Human-action-pending), last updated, owner.
- **Grouped sections** — Pitch narrative · Financial model · 90-day execution · Five-year plan · Market & problem fit · Competitor benchmarking · IP & legal · Product evidence.
- **Key assumptions page** — pulled together in one place: pricing, conversion, CAC, churn, cohort size, clinical LOI timing, IP spend, FX, anchor dates. Each with value, source, and confidence (High/Medium/Low). This is the page investors go to first.
- **Known gaps / human actions** — entity formation, US counsel, CPA review, trademark clearance, patent triage — stated openly rather than hidden.
- Confidentiality footer per project standard; forward-looking-statements disclaimer.

## 1b. In-app gated page

**Route:** `/founder/data-room`, wrapped in the existing `AdminRoute` (same gate as `/founder/financials`).

- Renders the same artefact register as cards grouped by section, with status chips and "what this answers" one-liners.
- Key Assumptions rendered as a compact table with confidence badges.
- Links across to the existing in-app founder surfaces (`/founder/financials`, investor deck, roadmap, clinical brief) so an investor call can be run entirely from the app.
- Documents in `/mnt/documents` are not web-served, so each artefact row shows filename + location rather than a dead download link, with an optional "paste a Drive link" field stored in `localStorage` so you can attach real share URLs once uploaded.
- Styling: launch Emerald Prestige palette, `LaunchCard`, semantic tokens only. Progressive reveal (accordion per section) so it never looks like a wall of text.

Data lives in one file, `src/founder/dataRoom.ts`, so the page and the markdown index never drift.

---

# Deliverable 2 — Competitor Benchmarking Pack

**Files:** `founder_pack/myrhythm/MyRhythm_B1_Competitor_Benchmarking.md` + `MyRhythm_B1_Competitor_Matrix.xlsx` (+ FIT versions)

## Narrative (B1 .md)

1. **Scope & method** — how comparables were chosen, what evidence is public vs estimated.
2. **The five clusters:**
   - Mindfulness/consumer scale — Calm, Headspace
   - Brain training — Lumosity, Elevate, Peak, CogniFit
   - Clinical/digital therapeutic — Constant Therapy, Akili/EndeavorRx, Neuro-Rehab VR, Sword/Hinge (arc model)
   - Planning/executive-function — Todoist, Sunsama, Motion, Goblin Tools, Tiimo
   - Care coordination — CaringBridge, Lotsa Helping Hands, Birdie, Jointly (UK)
3. **Lessons learned, one per brand** — what worked, what it cost, what broke. Includes the Lumosity FTC anti-pattern on unproven cognitive claims, Calm's brand-led consumer motion, Headspace's payer/enterprise pivot economics, Akili's evidence-heavy but distribution-poor arc, Tiimo's neurodivergent-native positioning.
4. **Why MyRhythm's GTM differs** — the four wedges nobody else holds together: begins pre-discharge on the ward; Collaborative Cognitive Continuity layer rather than a training game; Support Circle as a first-class surface ("no one walks alone"); universal by design, so the same product serves ADHD, stress, and ageing without a "senior mode".
5. **Where we are genuinely weaker** — no clinical trial, no brand awareness, single-founder capacity. Stated plainly; VCs test for this.
6. **Positioning statement + a one-paragraph "why now"** for the deck.
7. **What we will NOT copy** — no cognitive-improvement claims, no streak-guilt mechanics, no gamified leaderboards. Ties back to the no-medical-claims policy.

## Matrix (B1 .xlsx)

Tabs:
1. **README** — method, scoring key, refresh cadence.
2. **Comparables** — ~18 brands × columns: cluster, HQ/market, founded, funding, est. users/revenue, pricing model, primary channel, clinical evidence level, care-network feature, discharge/transition support, claim posture, notes/source.
3. **Scorecard** — formula-driven weighted score across 8 dimensions (problem fit, evidence, continuity, network, accessibility, pricing power, distribution, moat) for MyRhythm vs 6 closest comparables, with a computed gap column showing where the white space actually is.
4. **Lessons** — one row per brand: lesson, evidence, what MyRhythm does instead, which artefact it affects.
5. **Assumptions** — every estimated figure isolated here (drives the FIT version's neutralised numbers).

Blue = input, black = formula, green = cross-sheet, yellow = needs your input. Recalculated with the xlsx script to zero formula errors; every sheet rendered to image and QA'd. Landscape fit-to-width.

An abridged "top 6 comparables + why we differ" block also surfaces on the in-app data room page.

---

# Technical notes

- New: `src/founder/dataRoom.ts`, `src/pages/FounderDataRoomPage.tsx`, route registration in `src/App.tsx` behind `AdminRoute`. No database changes, no edge functions.
- All figures in the pack are estimates from public sources — flagged as such, not presented as verified.
- Nothing existing is deleted; `Founder_Pack_Index.md` is updated to point at the new data room index.

# Human actions (outside the build)

- Upload the pack to Drive and paste share links into the data-room page (or tell me and I'll hardcode them).
- CPA/counsel sign-off on financial figures before any of this goes to an investor.
- Sense-check the funding/user estimates for competitors — I'll cite sources, but they move fast.
