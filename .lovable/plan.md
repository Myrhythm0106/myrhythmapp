
# MyRhythm — Approved Plan (Market Evidence as Standalone Reference Doc)

## Confirmation of your directive
- `docs/market-evidence.md` is a **standalone strategic reference document** — for sales, investor conversations, clinician outreach, and as a permanent anchor to the app's purpose.
- It is **not** wired into the app UI. Users never see it. No in-app link, banner, or route.
- It exists to ensure we (and future contributors) **never lose sight of the three failures MyRhythm exists to fix**: Discharge Cliff, Clinical-Ready vs Life-Ready Gap, Ideal-Brain Assumption.
- Living document — versioned, updated as new evidence emerges.

## Contents of `docs/market-evidence.md`
1. **Purpose statement** — "This document exists so MyRhythm never drifts from why it was built."
2. **The three failures** — with cited stats, sources, dates.
3. **Market size** — TBI, stroke, dementia/MCI, ADHD, long-COVID cognitive, caregiver burden (UK + global, cited).
4. **Competitive landscape** — Constant Therapy, BrainHQ, Lumosity, Cogmed, Inflow, Nerva, Noom-for-brain — what they do, what they miss, where MyRhythm wins (Memory Bridge, Support Circle, Bridge Pathway).
5. **Evidence base** — positive psychology (gratitude/celebrate), spaced retrieval, energy-matching, family-mediated rehab, discharge-planning research.
6. **Proof points** — Founding Member quotes, clinician letters, pilot outcomes (as they arrive).
7. **Talking-points library** — one-liners for sales, investor pitch, clinician intro, press.
8. **What MyRhythm is NOT** — no diagnosis, no treatment, no "brain OS" language, no medical claims.
9. **Change log** — dated entries when evidence is added/updated.

## The rest of the plan (unchanged, approved to proceed)

### PR-1 — Front door, sequence, wayfinding, guardrails
- `/` and `/start` → `/launch/landing` (single front door).
- Onboarding sequence: `register → user-type → assessment → welcome (BH score + results teaser + 2–3 personalised insight cards + "unlock full plan" CTA) → payment → home`.
- `LaunchStepLocator` shared component reused across onboarding + 4C loop.
- `LaunchYouAreHereDial` radial menu in `LaunchLayout` header — every reachable page, current highlighted, one-tap jump, keyboard accessible.
- `src/launch/routes.ts` — single source of truth `{ path, label, icon, ring, group }`.
- Core-surface guardrails (D0–D4) applied to Capture, Commit, Calibrate, Celebrate, Memory Bridge, Calendar: one primary CTA, ≤3 choices on first paint, ≤40 words above the fold, smart-default moment, non-blank empty states, Support Circle share stays visible as ghost action.
- Route rename `/launch/gratitude` → `/launch/celebrate` (in-app label; "gratitude journaling" language retained in clinician brief + market-evidence doc).
- Calibrate mood-log bug fix (currently redirects to `/home`).
- Memory saves: `mem://ux/you-are-here-dial`, `mem://ux/core-surface-guardrails`.

### PR-2 — Legacy route redirects
- All legacy `/dashboard`, `/calendar`, `/gratitude`, `/goals`, `/analytics`, `/memory-bridge`, `/support-circle`, etc. → `<Navigate to="/launch/…" replace />`.
- No content deleted yet; redirects only.

### PR-3 — Archive (never delete)
- `src/_archive/` with subfolders:
  - `landings/` — old landing variants
  - `mvp-legacy/` — `MVPCorePage` + supporting MVP components
  - `personas/` — 12 persona pages (copy already inline on Welcome/Assessment)
  - `dashboard-legacy/` — `Dashboard.tsx` router shell + legacy dashboards
  - `memory-first-app/` — `AppMemoryFirst.tsx` + `MemoryFirstIndex`
- Each folder has a `README.md` listing what's inside, why archived, and per-file restore steps.
- `main.tsx` continues to mount `App.tsx` only — `AppMemoryFirst.tsx` never referenced.

### Discharge Bridge Kit
- Untouched by this plan. Ships on its own 15 Aug 2026 track per existing memory.

### Verification
- Manual walk-through of onboarding + 6 core screens.
- Screenshot checks: choice count, word budget, first-paint suggestion present, dial + step-dots visible.
- Redirect smoke test on every archived route.
- `tsgo` clean, `bun run build` clean.

## Locked-in defaults

| # | Decision | Status |
|---|---|---|
| 1 | Assessment before payment + results teaser | ✅ |
| 2 | Persona pages → archive | ✅ |
| 3 | `AppMemoryFirst.tsx` → archive | ✅ |
| 4 | `docs/market-evidence.md` as **standalone reference doc**, not app-linked | ✅ |
| 5 | You-Are-Here radial dial + step-dot locator | ✅ |
| 6 | Core-surface guardrails (D0–D4) | ✅ |
| 7 | `/launch/gratitude` → `/launch/celebrate` (clinical language retained in docs) | ✅ |
| 8 | Discharge Bridge Kit handled separately | ✅ |

Approve to switch to build mode and start on PR-1.
