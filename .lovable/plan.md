
# Plan v59 — Cognitive-Accessibility Sweep + Weekend Self-Test Readiness

Goal: by end of this pass, every Founding Core surface is **safe and usable under cognitive load**, broadly valuable beyond brain-injury, and you can sit down this weekend and run through the full flow with confidence.

Scope is locked to the 9 Founding Core routes from `mem://features/founding-core`:
`home, capture, commit, calibrate, memory, calendar, support, settings, profile`
plus the public funnel needed to reach them (`/`, `/mvp/user-type-selection`, `/mvp/assessment`, `/mvp/payment`, `/auth`).

---

## Part 1 — Cognitive-accessibility audit (read-only)

Spawn parallel sub-agents (one per route) to walk each Founding Core page and score it against a **Cognitive Load Rubric**, then produce one consolidated report at `docs/v0.1-cognitive-accessibility-audit.md`.

Rubric (each item Pass / Soft-fail / Hard-fail):

1. **One decision per screen** — max 3 primary options visible; secondary actions tucked under "More".
2. **Plain language** — Flesch reading ease ≥ 70; no jargon ("synthesise", "calibrate" need a plain sub-label); no double-negatives.
3. **Re-entry safety** — if user leaves mid-task and returns, the screen shows "Here's where you were" not a blank state.
4. **Output legibility** — summaries, action lists, transcripts: body ≥ 18px, line-height ≥ 1.5, max 70ch, no all-caps blocks.
5. **Copy / amend / send affordances** — every output (transcript, summary, action, brief) has visible Copy + Edit + Email/Share buttons (your earlier ask).
6. **Touch targets ≥ 56px** on every primary CTA.
7. **Reversibility** — destructive actions confirm; "Undo" toast where possible.
8. **No medical claims** — disclaimer present where the surface touches symptoms, energy, or clinical export.
9. **Energy-honest defaults** — nothing demands the user during a Pause/low-energy stage; QuietHome / Pause states respected.
10. **Universally useful** — copy works for a tired parent, a busy professional, an older adult — not just brain-injury survivors.

Output per route: rubric scorecard + list of concrete fixes ranked Critical / Important / Nice.

## Part 2 — Make-it-better fixes (build pass, only after you approve audit)

I'll group fixes into 3 small commits so you can stop at any point:

**Commit A — Output handling (your weekend must-have):**
- Add a shared `<OutputActions>` toolbar (Copy / Edit / Email / Download) and drop it onto: capture transcripts, capture brief, commit action lists, calibrate reflections, memory entries.
- Wire Email to `mailto:` with prefilled subject + body (no backend needed for v0.1).
- "Copy" uses `navigator.clipboard.writeText` with success toast.

**Commit B — Centralised, SMART Memory Library (your earlier ask):**
- Promote `/launch/memory` to the single index of every recording, summary, and action across the app.
- Filters: date, persona, has-actions, starred, search-by-quote.
- Each row exposes the `<OutputActions>` toolbar inline.
- No new tables needed — read from `meeting_recordings` + `extracted_actions` + `memory_entries`.

**Commit C — Cognitive-load polish:**
- Apply Critical fixes from audit (typography bumps, primary-CTA size, re-entry banners, plain-language rewrites, missing disclaimers).
- Add `aria-label` to every icon-only button found.
- Verify QuietHome / Pause stage respected everywhere.

## Part 3 — Weekend self-test readiness

Produce `docs/v0.1-weekend-self-test.md` — a 30-minute scripted run-through **you** can follow Saturday morning. Sections:

1. **Pre-flight (5 min):** sign out, clear localStorage, confirm seed account, confirm preview URL.
2. **Funnel run (5 min):** `/` → persona pick → assessment → payment (test mode) → `/launch/welcome`.
3. **4C loop (10 min):** Capture a 60-second voice note → review brief → Copy + Email the summary → promote 1 action to Commit → mark complete in Calibrate → see it in Celebrate strip.
4. **Memory Library (5 min):** open `/launch/memory`, find the recording, copy a quote, email a summary.
5. **Support Circle (3 min):** invite a fake email, verify pending state, toggle `can_record_on_behalf`.
6. **Safety net (2 min):** confirm disclaimer text on Capture + Calibrate, run GDPR "Download my data", confirm Clinical Export PDF renders with footer.

Each step has a tick-box and an "If this breaks, look here" pointer.

Also tick through `docs/v0.1-test-readiness.md` Founding Core scope-lock section and mark blockers.

---

## Deliverables

| File | Type |
|---|---|
| `docs/v0.1-cognitive-accessibility-audit.md` | new — audit report |
| `docs/v0.1-weekend-self-test.md` | new — your Saturday script |
| `src/components/shared/OutputActions.tsx` | new — Copy/Edit/Email/Download toolbar |
| Memory Library upgrades to `src/pages/launch/LaunchMemory*.tsx` | edit |
| Targeted copy/typography/aria fixes per audit Critical list | edit |
| `docs/v0.1-test-readiness.md` | append weekend-test cross-link |
| `.lovable/plan.md` | append v59 |

## Out of scope (deferred to v0.2)

- AI multi-pass overhaul, offline queue, cron retry, source-quote chips
- Hidden routes behind `FOUNDING_CORE_ONLY` flag
- Live Brain Health / energy / calendar signals
- Any new database tables

## Approval gate

Approve and I'll run Part 1 first (read-only audit, ~1 batch of parallel sub-agents) and come back with the scorecard before touching code. If you'd rather I batch Part 1 + Commit A together for speed, say "do A with the audit" and I'll fold them.

---

## v59 — Executed (build pass 1)

Shipped:
- `src/components/shared/OutputActions.tsx` — Copy / Email / Download / Edit toolbar with 44–56px targets, aria-labels, plain-language toasts.
- Wired `<OutputActions>` into `LaunchMemoryBridge` recording rows.
- `docs/v0.1-cognitive-accessibility-audit.md` — 10-rule rubric, per-route scorecards, ranked fix queue.
- `docs/v0.1-weekend-self-test.md` — 30-min Saturday script with pass/hold gates.

Deferred to next pass (still in scope of Plan v59):
- Wire `<OutputActions>` into `LaunchCaptureResult`, `LaunchCommit` daily list, `LaunchCalibrate` reflection.
- 🟧 plain sub-labels ("Calibrate" → "How did today land?", etc.).
- 🟧 sticky medical-disclaimer on `/mvp/assessment` + `/launch/calibrate`.
- Centralised filterable Memory Library (search-by-quote, starred, has-actions filter).
