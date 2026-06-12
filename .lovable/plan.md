## Cognitive Continuity Layer — Three Connected Features

These features make MyRhythm explicitly support **sustained functioning across time, contexts, interruptions, and competing demands**. They're sequenced because each depends on the same underlying *continuity thread* data.

---

### Phase 1 — Cross-Persona Continuity Thread *(foundation)*

A single rolling record that follows the user across Pathfinder / Anchor / Driver / Scholar modes so switching personas doesn't reset state.

**What it captures (per user, per day):**
- Active persona at each moment of the day
- Open commitments still in-flight (not yet calibrated)
- Energy band, symptom flag (if logged), cognitive load reading
- Last 3 wins, last 3 misses, last voice capture
- "Carry-forward" items: anything the user explicitly marks "bring this with me"

**Where it shows up:**
- New `ContinuityRail` strip at the top of `/launch/today` — one line: *"Coming from Anchor mode · 2 open commits · energy steady · Maya's appt in 90 min"*
- Persona switcher (`SubjectSwitch`) shows a "carrying forward" preview before the swap so nothing feels lost.

**Data:** new `continuity_thread` table (user_id, date, persona, snapshot jsonb, carry_forward jsonb). One row per persona-session per day; latest = source of truth for the rail.

---

### Phase 2 — Re-entry Step After Missed Days

When the continuity thread detects a gap (≥2 days with no commits/check-ins, or a skipped key commitment), the app proposes the **smallest possible re-entry action** instead of resuming the full schedule.

**Detection rules (additive, deterministic):**
- ≥2 consecutive days with 0 commits → "Soft re-entry"
- ≥5 days → "Reset re-entry" (offer to archive stale commits)
- Missed clinical/anchor event → context-specific re-entry ("Reschedule Maya's OT — pick a window")

**What the user sees:**
- A single `ReentryCard` on `/launch/today` replacing the normal Smart Schedule until acknowledged
- One CTA, one action, one energy badge — no list
- Phrasing matches medical-disclaimer policy ("Let's start small — not catching up.")
- Skipping the card never penalises; the rail just notes "Re-entry skipped".

**No new table** — derived from `daily_actions` + `continuity_thread` + existing `extracted_actions`.

---

### Phase 3 — Continuity Summary Export

Shareable snapshot for handoff to a new clinician, therapist, employer, or caregiver. **Not a medical record** — a *life-readiness* summary.

**Contents (user picks what to include):**
- Current vision + top 3 priorities
- Last 14 days: energy pattern, commit-completion rate, top wins
- Active support circle (names + roles, no contact details unless toggled)
- Persona mix (e.g., "70% Pathfinder, 30% Driver this fortnight")
- Open carry-forward items
- Mandatory 3pt confidentiality footer (per existing Document Confidentiality Standard)
- Explicit non-medical disclaimer on page 1

**Two output formats:**
- **PDF** (generated client-side, brand-aligned, A4) — for sharing
- **JSON** — for portability / future provider directory matchmaking

**Where it lives:** new `/launch/continuity` page + entry point from Launch Settings → "Share my continuity summary".

---

### Technical Section

**New files:**
- `src/launch/continuity/useContinuityThread.ts` — reads/writes `continuity_thread`, derives carry-forward
- `src/launch/continuity/ContinuityRail.tsx` — rail on `/launch/today`
- `src/launch/continuity/ReentryCard.tsx` — re-entry UI
- `src/launch/continuity/reentryDetector.ts` — pure rules engine
- `src/launch/continuity/summary/buildContinuitySummary.ts` — assembles the export payload
- `src/launch/continuity/summary/ContinuitySummaryPdf.tsx` — react-pdf renderer
- `src/pages/launch/LaunchContinuity.tsx` — page with preview + Export PDF / Download JSON

**Edits:**
- `src/launch/persona/SubjectSwitch.tsx` — carry-forward preview before swap
- `src/pages/launch/LaunchSettings.tsx` — link to Continuity Summary
- `src/App.tsx` — register `/launch/continuity` route

**Migration:** one new table `continuity_thread` with RLS scoped to `auth.uid()`, plus `GRANT`s for `authenticated` and `service_role` (per public-schema grants rule).

**Out of scope (intentionally):**
- No new AI calls — derived from existing data
- No edge functions — PDF built client-side
- No changes to 4C loop, persona logic, or scheduling engine
- No medical claims; disclaimer reused from existing policy

---

### Sequencing & size

| Phase | Effort | Independently shippable? |
|---|---|---|
| 1 — Thread + Rail | Medium | Yes (rail-only is useful) |
| 2 — Re-entry Card | Small | Needs Phase 1 |
| 3 — Summary Export | Medium | Needs Phase 1 |

I'd ship Phase 1 first, validate the rail, then 2 and 3 in either order.

Approve to start with **Phase 1** (or tell me to bundle all three).
