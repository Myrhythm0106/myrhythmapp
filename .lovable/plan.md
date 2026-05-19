# Plan v7.8 — SMART auto-schedule (one tap)

## Problem
`/prototype/schedule` currently forces the user to eyeball each ACT, pick a date, pick a time, pick attendees, then confirm. That's manual, slow, and contradicts the "reduce cognitive burden" promise. People will bounce.

## Goal
Make **Auto-schedule (SMART)** the default path. Manual editing stays available but secondary.

## UX

**Top of `/prototype/schedule`** — a single hero card:

```
✨ Smart Schedule  (recommended)
We'll place all 4 actions in your best-fit windows
based on your energy pattern, urgency, and free time
in your calendar.

  [ Auto-schedule all 4 actions → ]   ← orange primary, 56px

  See how this was decided ▾
```

When expanded ("See how this was decided"), show 3–4 short bullets:
- Energy pattern: peak 09:00–11:00, dip 14:00–15:30 (from your assessment)
- Calendar: 6 free windows found in next 7 days
- Urgency: 2 high-priority placed first
- Buffers: 15 min between back-to-back actions

**Secondary affordance** below the hero:
`Prefer to place them yourself? Review slots manually ▾`
→ expands the existing per-card editor (current UI, untouched).

**After tapping Auto-schedule:**
1. Brief inline "Placing…" state (~600ms, simulated; no backend).
2. Cards animate into their new slots with a small green check + the chosen time.
3. Sticky bottom CTA becomes `Set smart reminders (4) →` (unchanged behaviour) and the user is one tap from `/prototype/reminders`.

So the happy path is **two taps**: Auto-schedule → Set reminders.

## SMART placement logic (frontend-only, prototype-grade)

New helper `autoScheduleActs(acts)` in `src/prototype/prototypeStore.ts`. Pure function, deterministic, no backend.

Inputs per ACT: `priority`, `attendees`, current `proposedDate/Time` (used as a hint only).

Rules, applied in order:
1. **Sort by urgency**: high → medium → low. Within same priority, keep original order.
2. **Energy windows** (hard-coded prototype assessment result):
   - High-cognitive (priority=high, or attendees>0): place in **peak window 09:00–11:00**.
   - Medium: **10:30–12:00 or 15:30–17:00**.
   - Low / solo admin: **17:00–18:30**.
3. **Day spread**: never put more than 2 ACTs on the same day. Roll to next weekday.
4. **Calendar awareness (simulated)**: assume working hours Mon–Fri 09:00–18:00. Skip 12:30–13:30 (lunch) and 14:00–15:30 (energy dip from assessment). No real Google/Outlook call in the prototype — leave a `// TODO: replace with calendar-google-sync availability` comment so the production wiring is obvious.
5. **Buffer**: minimum 30 min gap between two ACTs on the same day.
6. **Earliest viable**: high-priority starts tomorrow if possible, never today after 16:00.

Output: same ACTs with refreshed `proposedDate` / `proposedTime`, then `smartReminderDefaults()` re-run (already exists).

## Files

- **Edit** `src/prototype/prototypeStore.ts` — add `autoScheduleActs(acts: PrototypeAct[]): PrototypeAct[]` and an `ENERGY_PROFILE` const (peak/dip windows) with a comment that production reads this from the assessment table.
- **Edit** `src/pages/prototype/PrototypeSchedule.tsx` — add the hero "Smart Schedule" card at the top, the "How this was decided" disclosure, the placing animation, and an `isManualOpen` state that hides the existing per-card list behind a collapsible. Wire the hero button to `autoScheduleActs` → `setActs` → scroll cards into view.

## Out of scope
- No real Google/Outlook availability call (prototype only — flagged with TODO).
- No assessment-table read (energy profile hard-coded for prototype).
- No changes to `/prototype/reminders`, `/prototype/review`, `/prototype/capture`, edge functions, schema, or bypass-auth.
- No copy changes outside this page.

## Acceptance
1. Land on `/prototype/schedule` → hero "Auto-schedule all N actions" is the first and most obvious control.
2. One tap places every ACT into a sensible slot (high priority in AM peak, lunch + dip avoided, ≤2 per day, ≥30 min apart).
3. Manual per-card editing still reachable in one tap via the "Review slots manually" disclosure.
4. Sticky `Set smart reminders` CTA still works and routes to `/prototype/reminders`.
