# Plan v7.13 — Quiet Power re-skin + Cognitive Continuity as the 5th layer (not the 5th C)

## Decision

Keep the **4C behaviour loop**: Capture → Commit → Calibrate → Celebrate.
Name **Cognitive Continuity** as the *operating layer* underneath the loop — the substrate that makes the 4Cs work for a brain-injured user and their circle. It is not a 5th step the user performs; it is the promise the product keeps between steps, sessions, and people.

Pitch sentence: *"Four actions — Capture, Commit, Calibrate, Celebrate — held together by Cognitive Continuity."*

## Two payloads in one plan

### A. Quiet Power re-skin of `/prototype/*`

The `/prototype` track was built in isolation and never inherited the Quiet Power language applied to `/launch/*` in v5.9 / v6.0. This plan re-aligns it. Visual only — no flow, copy logic, scheduling, or extraction changes.

**Rules applied to every prototype screen:**

1. One accent per screen. Drop the teal+orange duo. Slate-900 ink on white with a single brand accent on the primary action only.
2. Mono surfaces. Replace gradient backgrounds with flat `bg-white` + `bg-slate-50` panels.
3. Restrained type. `text-2xl font-semibold` heroes + 15px subtitle. Drop `text-4xl font-bold` and gradient text fills.
4. Chrome over decoration. Remove gradient M logo tile and "MVP Prototype" pill. Replace with plain wordmark + neutral "Prototype" tag.
5. Step rail as ticks. Thin slate-200 track, slate-900 fill, dot markers, single active label.
6. Buttons. Primary `bg-slate-900 text-white` (no glow). Secondary `bg-white border border-slate-200`.
7. Cards. `bg-white border border-slate-200 rounded-xl`. No tinted "confirmed" backgrounds.
8. Pills/tags. Lowercase, slate ink, hairline borders, `• high` leading dot for energy.
9. Iconography. Lucide only, 16–18px, slate-500. Remove every `Sparkles`.
10. Smart Schedule hero. Calm panel: one sentence, one button, one expandable "How this was decided" line. No `Recommended` badge, no glow.

**Files touched (presentation only):**
- `src/prototype/PrototypeLayout.tsx`
- `src/pages/prototype/PrototypeLanding.tsx`
- `src/pages/prototype/PrototypeCapture.tsx`
- `src/pages/prototype/PrototypeReview.tsx`
- `src/pages/prototype/PrototypeSchedule.tsx`
- `src/pages/prototype/PrototypeReminders.tsx`
- `src/pages/prototype/PrototypeDone.tsx`

### B. Cognitive Continuity named as the operating layer

Codify the framing so it shows up consistently in the prototype, the 4C component, and project memory.

**What Cognitive Continuity means (single source of truth):**
The MYRHYTHM brain-health profile, the inferred context of each capture, the owner of each ACT, and the dispatched invites all carry forward — so the next session, the next day, and the people in the circle never start from zero.

**Three actors it keeps in sync:**
- The user (MYRHYTHM profile + today's energy flag)
- The assistant (cognitive load context attached to every ACT)
- The circle (calendar entries reflect the user's best-fit window)

**Surface changes (copy only, one-line additions, no new screens):**
- `PrototypeLanding.tsx` — under the four step tiles, add one quiet line:
  *"Held together by Cognitive Continuity — your rhythm, your context, your circle, carried forward."*
- `PrototypeSchedule.tsx` — the existing low-energy-day sentence gets a trailing tag: *"— continuity preserved."*
- `src/components/mvp/MVPCore4C.tsx` — add a small footer strip beneath the four cards: *"Operating layer: Cognitive Continuity."* No structural change to the four cards themselves.

**Memory updates:**
- `mem://brand/behaviour-loop` — append a "Cognitive Continuity" section defining it as the operating layer (not a 5th C), with the three actors and what carries between them.
- `mem://brand/terminology` — add `Cognitive Continuity` entry pointing to the behaviour-loop file.
- `mem://index.md` — Core line updated to: *"4C loop (Capture → Commit → Calibrate → Celebrate) over a Cognitive Continuity operating layer."*

## Explicitly out of scope
- No changes to `/launch/*`.
- No changes to scheduling logic, extraction, ICS dispatch, MYRHYTHM intake, or owner detection.
- No new routes, no new screens, no new edge functions, no schema changes.
- No rename of the 4C component or its cards.
- No investor deck edits in this plan (separate pass once language is settled in product).

## Acceptance
1. Every `/prototype/*` screen passes the Quiet Power checklist: one accent, slate-900 primary CTA, no gradient hero text, no `Sparkles`, no "MVP Prototype" pill, neutral chips.
2. `/prototype` and `/launch/home` feel like the same product when viewed side by side.
3. The phrase "Cognitive Continuity" appears exactly once on Landing, once on Schedule, and once on the 4C page — never as a navigation item, never as a step.
4. `mem://brand/behaviour-loop` defines Cognitive Continuity as the operating layer with the three actors named.
5. All v7.11 + v7.12 behaviour (MYRHYTHM-driven scheduling, silent context classifier, clinical extras row, low-energy-day deferral, ICS dispatch) is unchanged and still passes.

## Build order
1. Memory updates (`behaviour-loop`, `terminology`, `index.md`) — establishes the vocabulary the screens will quote.
2. Re-skin shared chrome (`PrototypeLayout.tsx`) — propagates to every prototype screen.
3. Re-skin screens in flow order: Landing → Capture → Review → Schedule → Reminders → Done.
4. Add the three Cognitive Continuity copy lines (Landing, Schedule, 4C page).
5. Visual QA pass at `/prototype/*` and `/mvp/core-4c`.
