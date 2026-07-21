# Continue Emerald Prestige theming + Memory Bridge transcript & action-scheduling home

Two workstreams in one pass. First finishes the visual continuation from the last turn; second answers "where do the transcripts live, and how are the actions structured with suggested dates?"

---

## 1) Continue Emerald Prestige across authenticated /launch/* screens

Audit and repaint any leftover legacy purple/indigo/grey on screens the user hits after sign-in.

**In scope (visual only, no logic changes):**
- `LaunchHome`, `LaunchCalendar`, `LaunchMemoryBridge`, `LaunchCalibrate`, `LaunchCommit`, `LaunchCapture`, `LaunchCaptureResult`, `LaunchSupportCircle`, `LaunchGoals`, `LaunchVisionStatement`, `LaunchGratitude`, `LaunchAnalytics`, `LaunchRoadmap`, `LaunchProfile`, `LaunchSettings`, `LaunchWhatsNew`, `LaunchHelp`.
- Swap hardcoded `bg-purple-*`, `from-indigo-*`, `text-slate-*` etc. for launch tokens (`launch-ink`, `launch-moss`, `launch-gold`, `launch-ember`, `launch-cream`, `launch-ivory`).
- Headings use serif display class already defined in `launch-theme`; body stays on the theme's sans.
- Cards: cream surface + moss border + gold accents. Primary CTAs: ember. Secondary: moss outline.
- Preserve MyRHYTHM-G chip colors and assessment letter colors — those are semantic, not decorative.

Verify with Playwright screenshots of Home, Calendar, Memory Bridge, Calibrate.

---

## 2) Transcript Library + Action Scheduling home (Memory Bridge)

Today the transcript is saved on `meeting_recordings.transcription` but is only reachable through a download button on the recording card. There's an unused `TranscriptsTab` component. Actions extracted from a recording go to `extracted_actions` / `daily_actions` but the user can't see the suggested start/finish dates in one place.

### 2a. New route `/launch/memory-bridge/library`

Tabbed view inside `LaunchMemoryBridge` (or a linked sub-page) with three tabs:

1. **Recordings** — existing list.
2. **Transcripts** — wire up `TranscriptsTab` + `TranscriptViewer`. Search across transcripts, filter by date and participants, open full transcript in a modal, copy/download, "Re-extract actions" button.
3. **Actions** — grouped by recording, showing every extracted action with:
   - Title, owner, "in the loop" chips
   - **Suggested Start** and **Suggested Complete By** (see 2b)
   - Status (draft / scheduled / done)
   - Row actions: Edit, Reschedule, Send to Calendar, Mark done

Each recording card gets a "View transcript" and "View actions" link so the entry point is obvious.

### 2b. Suggested dates based on Brain Health make-up + real availability

Add two columns to `extracted_actions` (nullable): `suggested_start_date date`, `suggested_due_date date`, `suggested_time_of_day text` (morning/mid/afternoon/evening), `suggested_reason text`.

Populate them at extraction time inside the existing `process-meeting-audio` edge function using:

- **Assessment snapshot** (`assessment_results` latest row) — MYRHYTHM letter scores drive lead-time. Lower M/H/Y (memory/focus/energy) → longer lead-time, shorter sessions, morning slots. Higher R (rhythm) → tighter cadence acceptable.
- **User schedule preferences** (`user_schedule_preferences`) — working hours, energy peaks, days off.
- **Actual calendar availability** (`calendar_events` + `external_calendar_events`) — first free slot ≥ 30 min that matches the preferred time-of-day, within the next 7/14/30 days depending on action urgency keywords.
- **MyRHYTHM-G state** (`growth_states` last 7 days) — if user is in "messy middle" states, push non-urgent items out and cap to 1 new commitment per day.

Return a short human reason ("Placed Tue morning — your steadiest window this week") saved in `suggested_reason` and shown in the Actions tab as a small caption. This keeps the "personal PA" tone without medical claims.

### 2c. Send-to-calendar respects suggestions

When the user clicks "Send to Calendar" on an action row, prefill the event modal with `suggested_start_date` + `suggested_time_of_day` mapped to a concrete time. User can accept or edit before saving. The existing invite/reminder/recurrence UI stays.

### 2d. Home surfaces new location

Add a "Your Memory Bridge library" card on `/launch/home` showing counts: recordings this week, unread transcripts, actions awaiting scheduling. Click → `/launch/memory-bridge` opened on the relevant tab.

---

## Technical notes

- Migration: add `suggested_start_date`, `suggested_due_date`, `suggested_time_of_day`, `suggested_reason` to `public.extracted_actions`. No new table. Reuse existing RLS.
- New helper `src/lib/scheduling/suggestActionDates.ts` — pure function used both in edge function (via inline copy or shared logic) and client-side "Re-suggest" button.
- Do not rename existing columns. `daily_actions` remains the source of truth once scheduled.
- No changes to MyRHYTHM-G, Support Circle roles, or 4C loop copy.

## Out of scope

- Discharge Bridge Kit v0.2 (already deferred).
- New AI models. Reuse current Lovable AI Gateway wiring.
- Any change to pricing / access-code / Stripe test surface.
