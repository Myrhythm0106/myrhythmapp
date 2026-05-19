# Real Capture, Extraction & SMART Reminders for the MVP Prototype

## The problem

The `/prototype/*` flow today is a **visual mock**:
- `PrototypeCapture` runs a fake timer and writes `getSampleActs()` — nothing is recorded, transcribed, or extracted from what you actually say.
- Review always shows the same sample ACTs.
- Schedule has no real reminders — no notifications, no escalation, no SMART rules.

You wanted a real personal assistant: **say it → it hears it → it extracts it → it schedules it → it reminds you intelligently**.

## What already exists we can reuse

- `supabase/functions/assemblyai-token` + `assemblyai-webhook` — real transcription
- `supabase/functions/extract-acts-incremental` — real LLM extraction
- `useMemoryBridge`, `useRealtimeACTs`, `useRealtimeTranscription` — orchestration
- `useSmartReminders` + `event_reminders` + `cross_device_notifications` + `SmartReminderToast` — reminder backbone

The prototype just needs to call these, not reinvent them.

## Plan

### Step 1 — Real recording in `PrototypeCapture`
- Replace fake timer with `MediaRecorder` capturing mic audio.
- Upload blob to `voice-recordings` bucket; create `voice_recordings` row.
- Start meeting via `useMemoryBridge.startMeetingRecording`.
- Stream to AssemblyAI via existing `assemblyai-token` function, show live partial transcript on screen.

### Step 2 — Real extraction → prototype store
- On stop, finalize transcript and invoke `extract-acts-incremental`.
- Map `ExtractedAction[]` into `PrototypeAct` shape so Review/Schedule keep working unchanged.
- Real "Extracting…" state tied to the function call.

### Step 3 — SMART reminders on Schedule
On confirm-schedule for an ACT:
- Insert `calendar_events` row.
- Use `useSmartReminders.createDefaultReminders(eventId)` for default 15-min-before + morning-of.
- Add per-card reminder editor with SMART defaults:
  - **High priority** → also add 1-day-before
  - **Low priority** → only morning-of
  - **Low-energy window** → extra 30-min-before nudge
  - **Attendees > 0** → 1-hour-before
- Channels: in-app toast (already wired) + push/email checkboxes.
- Snooze 5/15/60 min + Done actions (already supported).

### Step 4 — New `/prototype/reminders` screen
- Shows every reminder that will fire, grouped by ACT.
- Edit time, channel, remove. "Looks good →" to Done.

### Step 5 — Done screen update
- Counts: ACTs scheduled, reminders armed, people invited.
- "Test a reminder now" fires a sample notification so you see the toast live.

## Auth gate with always-on override

- `/prototype/capture` checks `useAuth()`. If no session, redirect to `/auth?next=/prototype/capture`.
- **Bypass mechanisms** (so you never get friction):
  1. **Query flag** — `?bypass=1` on any `/prototype/*` URL skips auth and forces the sample-meeting path.
  2. **Persistent dev toggle** — small "Bypass auth" switch in the prototype top bar (next to "← Full app"). Toggle state is stored in `localStorage` under `prototype:bypassAuth`. While ON, no auth gate, no redirects — sample data is used for capture/extraction so the rest of the flow stays demoable.
  3. **Env fallback** — if `VITE_MOCK_SECURITY === 'true'` the gate is automatically off (matches existing mock-auth pattern).
- When bypass is active, a small amber chip "Bypass ON — using sample data" is shown so it's obvious why real recording isn't running.

## Technical details

- Frontend: edit `PrototypeCapture.tsx`, `PrototypeSchedule.tsx`, `PrototypeDone.tsx`, `PrototypeLayout.tsx` (add bypass toggle + auth guard); new `PrototypeReminders.tsx` + small `ReminderEditor` under `src/components/prototype/`.
- Hooks reused: `useMemoryBridge`, `useRealtimeTranscription`, `useRealtimeACTs`, `useSmartReminders`, `useAuth`.
- No new edge functions. No schema migrations — all required tables already exist.
- No deletions — existing prototype files are extended.

Ready to build on approval.
