
# Documentation Update — Founding Core Scope & Value Justification

Approved scope confirmed. Before any code changes, update the project's reference documents so the full feature inventory **and** the chosen launch scope are recorded in one place, with explicit value-for-money framing for each Founding Core route.

No code or routing changes in this pass — documentation only. The actual route flagging / legacy redirects ship in the next plan.

---

## Files to update / create

### 1. `docs/v0.1-features.md` — rewrite
Replace the stale "Ready for Testing / v0.1" inventory (which still lists `/dashboard`, `/memory-bridge`, `/calendar` as the surfaces) with a current, accurate inventory split into three sections:

- **A. Full feature inventory** — every `/launch/*` route that exists today (34), every `/mvp/*` funnel route, every legacy route still wired, every edge function, every key table. Source of truth for "what's in the build."
- **B. Founding Core (shipping for cohort)** — the 9 routes listed below, each with: route, one-line purpose, key components, **"Why it earns the £7–£20/mo"** value line.
- **C. Hidden behind `FOUNDING_CORE_ONLY` flag (v0.2 queue)** — every route built but not exposed to cohort, with reason for deferral.

### 2. `docs/v0.1-test-readiness.md` — extend
Add a new top section: **"Founding Core scope lock"** — the 9 routes, the legacy redirects required, and a tick-box that scope has been frozen for the cohort. Existing checklist stays intact below it.

### 3. `docs/founding-core-value-map.md` — new
Single-page value map the team can hand to marketing, support, and investors. Structure:

```text
For £7–£20/month, a Founding Member gets:

  Capture        — never lose a clinical/family conversation again
  Commit         — turn captured moments into actions you'll actually do
  Calibrate      — schedule against real energy, not wishful thinking
  Memory Bridge  — one private, searchable home for everything captured
  Calendar       — day-of view that respects cognitive load
  Support Circle — invite family/clinician; nothing auto-shared
  Settings       — retention, MFA, calendar links, edition transparency
  Profile        — identity + persona
  Home           — the 4C loop, one screen, every day

Plus the Founding promise:
  • Locked introductory pricing (6 months)
  • Automatic upgrade to every new capability as it ships
  • Direct line to the founder via in-app Feedback
  • Founding Edition badge + early access to v0.2 (Memory Library, AI overhaul)
```

Each row expands to 2–3 sentences explaining the concrete benefit and the cost-pain it removes (missed appointments, repeated explanations to clinicians, lost actions, caregiver burnout, etc.). Includes the no-medical-claims disclaimer footer.

### 4. `strategic-documents/Founding-Member-Launch-Strategy.md` — append section
Add a new section **"Founding Core — what £7–£20/mo actually buys"** that mirrors the value map and explicitly states:

- The 9 routes are the **only** surfaces the cohort sees.
- Everything else (Brain Games, Feature Store, Analytics, Roadmap, Science, What's New, Clinical Brief, Continuity, Vision Statement, Goals, Gratitude, SC-Capture, Edition-About-as-standalone) is built and queued for v0.2 — not lost, just sequenced.
- Why this scope is enough to "move the dial": each Core route maps to one of the four founding pain-points (lost conversations, dropped actions, energy-blind scheduling, isolated caregiving). If any one of those is solved, the £7–£20/mo is already paid back versus the alternative (private OT, lost work hours, repeated clinical visits).

### 5. `mem://features/founding-core` — new memory file
Persist the scope decision so future sessions don't re-propose hidden routes as if they were live:

```text
---
name: Founding Core scope (v0.1)
description: The 9 /launch/* routes exposed to the Founding cohort; everything else is built but flagged off for v0.2.
type: feature
---
Cohort sees only: /launch/home, /launch/capture, /launch/commit, /launch/calibrate,
/launch/memory, /launch/calendar, /launch/support, /launch/settings, /launch/profile.
Public funnel: /, /mvp/user-type, /mvp/assessment, /mvp/payment, /auth, /privacy-policy, /terms.
Hidden behind FOUNDING_CORE_ONLY flag (built, not exposed): games, store, analytics, roadmap,
science, whats-new, clinical-brief, continuity, vision-statement, goals, gratitude, sc-capture,
edition-about (linked from Settings only).
Legacy /dashboard, /memory-bridge, /calendar, /command-center, /gratitude redirect to /launch/*.
```

Index entry added under `mem://index.md` → Memories.

---

## The Founding Core — value lines (will appear verbatim in docs)

| Route | One-line purpose | Why it earns the price |
|---|---|---|
| `/launch/home` | 4C loop in one screen | Every day starts and ends in one calm place — no app-hunting under cognitive load. |
| `/launch/capture` | One-tap voice/text capture | Replaces £40/hr private-OT note-taking and the 3am "what did the consultant actually say?" panic. |
| `/launch/commit` | Turn captures into committed actions | Stops the 70%+ drop-off between "good intention" and "thing actually done." |
| `/launch/calibrate` | Schedule against real energy | Prevents the crash-and-burn cycle that costs working days and family time. |
| `/launch/memory` | Memory Bridge — searchable record | One trustworthy place; no losing the clinical conversation that mattered. |
| `/launch/calendar` | Day-of cognitive-load view | Plans the day a brain-injured / ADHD / burnt-out user can actually execute. |
| `/launch/support` | Support Circle invites + permissions | Family/clinician informed without the user repeating themselves; nothing auto-shared. |
| `/launch/settings` | Retention, MFA, calendars, edition, feedback | Trust controls in plain sight — privacy, MFA, 30-day voice retention, direct feedback to founder. |
| `/launch/profile` | Identity + persona | Persona-correct experience across all 9 founding personas. |

---

## Out of scope for this pass

- No routing changes, no flag implementation, no legacy redirects.
- No edits to `src/App.tsx`, no nav changes, no component edits.
- Those land in the **next** plan ("Founding Core enforcement"): apply `FOUNDING_CORE_ONLY` flag to nav + route table, add legacy `<Navigate>` redirects, run the readiness checklist sweep.

---

## Approval needed

Approve this doc-only pass and I will:
1. Rewrite `docs/v0.1-features.md`.
2. Extend `docs/v0.1-test-readiness.md` with the scope-lock section.
3. Create `docs/founding-core-value-map.md`.
4. Append the value section to `strategic-documents/Founding-Member-Launch-Strategy.md`.
5. Save the `mem://features/founding-core` memory and update `mem://index.md`.

Then I'll queue the **"Founding Core enforcement"** code plan as the immediate follow-up.
