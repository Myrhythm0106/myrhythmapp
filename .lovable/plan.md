# Continue Emerald Prestige theming + Memory Bridge transcript & action-scheduling home

Adds a selectable "Send to Calendar" flow so users can pick which actions to schedule, or accept all.

---

## 1) Continue Emerald Prestige across authenticated /launch/* screens

Visual repaint only — no logic changes — on: `LaunchHome`, `LaunchCalendar`, `LaunchMemoryBridge`, `LaunchCalibrate`, `LaunchCommit`, `LaunchCapture`, `LaunchCaptureResult`, `LaunchSupportCircle`, `LaunchGoals`, `LaunchVisionStatement`, `LaunchGratitude`, `LaunchAnalytics`, `LaunchRoadmap`, `LaunchProfile`, `LaunchSettings`, `LaunchWhatsNew`, `LaunchHelp`.

Swap hardcoded purple/indigo/slate for launch tokens (`launch-ink`, `launch-moss`, `launch-gold`, `launch-ember`, `launch-cream`, `launch-ivory`). Cards = cream + moss border + gold accents. Primary CTAs = ember. Secondary = moss outline. MyRHYTHM-G chips and assessment letter colors preserved (semantic).

Verify with Playwright screenshots of Home, Calendar, Memory Bridge, Calibrate.

---

## 2) Transcript Library + Action Scheduling home (Memory Bridge)

### 2a. Tabbed view on `/launch/memory-bridge`
Three tabs: **Recordings**, **Transcripts** (wire up existing `TranscriptsTab` + `TranscriptViewer` with search/filter/edit), **Actions** (grouped by recording with title, owner, "in the loop", Suggested Start, Suggested Complete By, status, row actions).

### 2b. Full user editability
- Inline edit `title`, `suggested_start_date`, `suggested_due_date`, `suggested_time_of_day`, `suggested_reason`, "in the loop" list.
- Row-level Delete (soft archive: `status='archived'`, hidden with "Show archived" toggle).
- "Add action manually" button per recording.
- "Re-suggest dates" per row (doesn't overwrite user-edited fields — tracked via `user_edited` flag).
- Transcript editor: pencil to correct; original preserved in `original_transcript`.

### 2c. Suggested dates derivation
At extraction time, `process-meeting-audio` computes suggestions from: latest `assessment_results`, `user_schedule_preferences`, real availability in `calendar_events` + `external_calendar_events`, and last 7 days of `growth_states`. A human sentence saved to `suggested_reason` ("Placed Tuesday morning — your steadiest window this week"). No medical claims.

### 2d. Send to Calendar — selectable, with "select all"
Every surface that sends actions to the calendar (Actions tab, `PostExtractionDialog`, per-recording bulk bar) shares one **SendToCalendarSheet** with:

- A checkbox list of the recording's actions. Each row shows title, suggested date/time, "in the loop" chips, and an inline edit pencil so the user can adjust before sending.
- Header **"Select all"** / **"Select none"** toggle and a live count ("3 of 7 selected").
- Per-row **Skip / Include** and a per-row **Edit date & time** popover (prefilled with suggestions).
- Optional bulk override: "Apply the same reminder cadence to selected" (Gentle / Steady / Strong) and "Loop in the same people".
- Primary CTA **"Send selected to Calendar"** (disabled until ≥1 selected). Secondary **"Send all"** shortcut that ticks everything.
- On confirm: only checked rows create `calendar_events` (+ `event_reminders`, `event_invitations` where set); skipped rows stay in the Actions tab as `status='pending'` so the user can send them later.
- The existing `PostExtractionDialog` "Accept & Schedule All" opens this sheet with everything preselected — the user can then untick any they don't agree with before confirming.

### 2e. Home surface
New "Your Memory Bridge library" card on `/launch/home` showing recordings this week, unread transcripts, and actions awaiting scheduling. Click → `/launch/memory-bridge` on the relevant tab.

---

## Technical notes

- Migration: add `suggested_start_date`, `suggested_due_date`, `suggested_time_of_day`, `suggested_reason`, `user_edited boolean default false` to `extracted_actions`; add `original_transcript text` to `meeting_recordings`. Reuse existing RLS.
- New `src/lib/scheduling/suggestActionDates.ts` shared by edge function and client "Re-suggest".
- New `src/components/memoryBridge/SendToCalendarSheet.tsx` — the shared selectable scheduler.
- Refactor `commitAllRecommended` to accept an explicit `actionIds` array; existing single-action `commitAction` unchanged.
- `daily_actions` remains source of truth once scheduled.
- No changes to MyRHYTHM-G, Support Circle roles, 4C loop copy, pricing, or access-code flow.

## Out of scope
- Discharge Bridge Kit v0.2 (deferred).
- New AI models — reuse Lovable AI Gateway wiring.
