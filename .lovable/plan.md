
# Memory Bridge + Calendar — PA-Readiness Audit

## TL;DR

- **Memory Bridge: READY.** It already behaves like a PA — record, auto-transcribe, auto-extract actions, one-tap "Accept & Schedule All", notify Support Circle. This is your hero flow and it works end-to-end.
- **Calendar: NOT READY.** One critical bug breaks the "PA loop" between the two features, plus two polish gaps stop it feeling like a PA. All three are small fixes.

---

## What I verified

### Memory Bridge (`/launch/memory-bridge`) — Working at PA level ✅
Confirmed in `src/pages/launch/LaunchMemoryBridge.tsx`:
- Tap-to-record → pause/resume/stop → auto-save → auto-extract actions (no extra button click).
- After extraction, `PostExtractionDialog` offers **"Accept & Schedule All"** (writes to `calendar_events` via `convertActionToCalendarEvent`) or **"Review individually"**.
- `notifySupport` toggle notifies Support Circle when saving.
- Past recordings list with play/reprocess/view-actions.
- PA feel: **strong.** User speaks, the app extracts, decides dates/times, and schedules. That's the PA promise.

### Calendar (`/launch/calendar`) — Three gaps 🚨

**Gap 1 (CRITICAL — breaks the PA loop):**
`LaunchCalendar.tsx` lines 34–39 render **hardcoded mock events** stored in local React state. It does **not read from the `calendar_events` table**.

Consequence: When Memory Bridge "Accept & Schedule All" writes real events into `calendar_events`, **they never appear on the user's calendar.** The two flagship features are visually disconnected. A tester will record a meeting, tap "Schedule all", get a success toast — then open the calendar and see the same four fake events ("Morning routine", "Call Dr. Smith"…). That will read as broken.

**Gap 2 (PA polish):** No daily briefing on the calendar. A PA opens the day with "Here's what's on for today, energy-tagged, one thing to focus on." Today the calendar just lists times.

**Gap 3 (PA polish):** Reschedule is a "coming soon" toast (line 89). A PA reschedules for you.

---

## Proposed fix (small, scoped — this is the launch minimum)

### PR-A · Wire the calendar to real data *(critical)*
- Replace the hardcoded events array with a `useEffect` + Supabase query against `calendar_events` filtered by `user_id` and the visible date range.
- `handleAddEvent`, `handleEventStatusChange`, `handleEventCarryOver` write to `calendar_events` instead of local state.
- Show a small badge on events that originated from Memory Bridge (already stored via `calendar_event_id` on `extracted_actions`) — reinforces "your PA scheduled this from your conversation."
- Keep the four sample rows as a *first-run seed only* (insert once, per user, if the table is empty) so new users don't see an empty grid.

### PR-B · Daily brief header on day view *(PA feel)*
- Add a compact strip at the top of `LaunchDayView`:
  - "Good morning, [name]. Today: 3 items. Focus: {highest-priority title}. Energy tip: {based on user's last mood/energy entry}."
- Pure read-only, one query, no new tables. Uses data that already exists (`daily_actions`, `mood_entries`).

### PR-C · Real reschedule *(remove the "coming soon")*
- Replace the toast in `handleEventReschedule` with a lightweight date/time picker modal (reuse `LaunchAddEventModal` structure).
- Updates the `start_time` / `end_time` on `calendar_events`.

### Out of scope for launch (park for v0.2)
- Drag-to-reschedule on week view.
- Google/Outlook sync surfacing inside `/launch/calendar` (integration code exists but wire-through can wait).
- Smart auto-scheduling of unscheduled extracted actions by energy window.

---

## Technical notes

- Table already exists: `calendar_events` (12 cols, 3 RLS policies) — no migration needed.
- `convertActionToCalendarEvent` in `src/utils/calendarIntegration.ts` already writes the right shape; PR-A just needs to read it back.
- Realtime is optional. Simple `fetchEvents` on view/date change is enough for launch; add a Supabase channel subscription later if needed.
- No new dependencies. No changes to Memory Bridge. No changes to routing, dial, or auth.

---

## Recommendation

Ship **PR-A + PR-B + PR-C** before opening tester access. Without PR-A specifically, the app's most impressive moment ("I just spoke and it scheduled everything") silently fails at the calendar view — that's the one thing that will kill first impressions.

Approve and I'll build all three in one pass.
