## Objective

Ship the MVP around one shareable testing link with a single headline flow:

**Capture → Actions → Decisions → Smart Commit (optional milestones + optional health-aware SMART scheduling, always user-overridable) → Support Circle visibility & remote record.**

Then stop building and start testing.

## Shareable testing link

`https://myrhythmapp.lovable.app/start` → 1-screen "Test in 4 minutes" → `/launch/home`.

---

## 1. Smart Commit — opt-in SMART + always overridable

### User control (new)

Three independent toggles, available **per action** AND as **global defaults** in Settings → Scheduling:

| Toggle | Default | What it does |
|---|---|---|
| **Auto-generate milestones** | ON | Builds the milestone ladder backwards from the due date. OFF = just start + due date, no sub-tasks. |
| **SMART scheduling** | ON | Lets MyRhythm pick date/time using calendar + energy + health layers. OFF = blank slots, user picks everything. |
| **Health-aware adjustments** | ON | Applies brain-health and overall-health rules (post-therapy buffer, low-sleep shift, med windows). OFF = SMART runs without health layer. |

Per-action UI on `SmartCommitSlot.tsx`:

```text
[ Smart scheduling: ●ON  ] [ Milestones: ●ON ] [ Health-aware: ●ON ]   ⓘ
```

Tap any chip → toggles off for this action only. "Make this my default" link writes back to Settings.

### Override on every suggested date/time

Every milestone row and the parent Start/Due fields are **directly editable**:

```text
[●] First draft   [ Wed 10 Jun ▾ ]  [ 10:30 ▾ ]   🔔 1d ▾   ●ok
                  ↑ tap = native date picker
                                    ↑ tap = time picker
```

- Edited rows get a small "edited" pill and lock against auto-recalculation until the user taps "Reset to SMART".
- "Recalculate from today" never overwrites edited rows unless the user confirms.
- Any user-entered date/time bypasses the health layer with no warning beyond a soft hint chip ("outside your usual focus window") — never a block.

### Milestone generation rules (only when "Milestones" is ON)

```text
lead = dueDate − today
≥ 14d → 4 milestones at 25/50/75/90%
 7–13d → 3 milestones at 33/66/90%
 3–6d  → 2 milestones at 50/90%
 ≤ 2d  → 1 "Start now" + dueDate
```

Labels by action type (Deliverable, Decision, External meeting, Follow-up, Generic).

### Health-aware SMART scheduling (only when both "SMART" and "Health-aware" are ON)

Layered scorer; each layer can shift, downgrade, or reject a slot:

1. Calendar conflicts (hard reject)
2. `user_schedule_preferences` (most/least productive, unavailable)
3. Energy windows (`useEnergyTracking`)
4. **Brain-health:** post-clinical 2h buffer; symptom severity cap; 3-high-load/day cap; recovery-stage modifier
5. **Overall health:** `<6h` sleep → +90min shift + lower load; med windows blocked; clinical pre/post buffers
6. SMART preferences (preferred start, max sessions/day, min break)

User-facing reason chips ("Strong-focus window, post-therapy buffer respected"). Never medical language. Settings disclaimer: *"MyRhythm uses your logged signals to suggest timing. It does not diagnose, treat, or replace clinical advice."*

### Data model

```ts
export interface SchedulingPreferences {
  smartSchedulingEnabled: boolean;     // default true
  milestonesEnabled: boolean;          // default true
  healthAwareEnabled: boolean;         // default true
}

export interface ActionMilestone {
  id: string;
  label: string;
  date: string;
  time?: string;
  percentOfLeadTime: number;
  status: 'pending' | 'done' | 'missed';
  reminderMinutesBefore: number;
  scheduleReason?: string;
  conflictLevel?: 'none' | 'low' | 'high';
  loadTier?: 'low' | 'med' | 'high';
  healthAdjustments?: string[];
  userEdited?: boolean;                // locks against auto-recalc
}

export interface BriefAction {
  // existing…
  milestones?: ActionMilestone[];
  milestonePlanSource?: 'auto' | 'user' | 'mixed';
  schedulingPreferences?: Partial<SchedulingPreferences>;  // per-action override
}
```

### UI changes

- `SmartCommitSlot.tsx`: three toggle chips; editable date/time on every row; "edited" pill; "Reset to SMART" per row; "Why this time?" expander.
- `LaunchSettings.tsx` → Scheduling section: three global toggles, disclaimer, per-layer notes.
- Exports unchanged: render whatever the user committed to (auto or edited), with reason column when present.

---

## 2. Support Circle visibility + remote-record permission

(Unchanged.)

- New permission `permissions.can_request_recording: boolean`.
- "Upcoming events {owner} may want recorded" card for members with `actions` permission.
- **Remind {owner}** (always) and **Start recording on her behalf** (with permission).
- Remote-start → `meeting_recordings` row for owner + `cross_device_notifications` + realtime banner with Take over / Let helper record / Cancel.
- Owner gets a non-dismissable active-recording banner; `accountability_alerts` audit row on every remote start.
- Helper's device captures audio (no cross-device streaming in MVP).

### One migration

```sql
CREATE POLICY "Support members can start recordings with permission"
ON public.meeting_recordings FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.user_id = meeting_recordings.user_id
      AND scm.member_email = public.get_current_user_email()
      AND scm.status = 'active'
      AND COALESCE((scm.permissions ->> 'can_request_recording')::boolean, false) = true
  )
);

CREATE POLICY "Support members can view owner calendar"
ON public.calendar_events FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.support_circle_members scm
    WHERE scm.user_id = calendar_events.user_id
      AND scm.member_email = public.get_current_user_email()
      AND scm.status = 'active'
      AND COALESCE((scm.permissions ->> 'actions')::boolean, false) = true
  )
);
```

---

## 3. Locked from prior plans

- Nav (5): Home · Capture · Commit · Support · Settings.
- Trust strip: Edition badge · "Private by default · 30-day retention · Not a medical device."
- `/start` route; `/` and `/mvp` redirect to `/start`.
- `/prototype` kept with "Open MyRhythm for daily use" banner.
- One Record FAB (`MemoryBridgeFloatingButton` with `quickStart`).
- PWA manifest: `start_url: /launch/memory?quick=1` → 2 taps cold → recording.
- Hidden from nav: Analytics, Roadmap, What's New, Vision, Feature Store, Goals dashboard, capability marketing, persona/stage switching, Founder financials.

---

## Acceptance criteria

1. New tester finishes a capture brief in <4 min from `/start`.
2. Each of the three scheduling toggles (Smart / Milestones / Health-aware) can be flipped globally **and** per-action; state persists.
3. Turning SMART off leaves blank date/time fields the user fills manually; nothing else changes.
4. Turning Milestones off leaves only start + due; the action saves cleanly.
5. Turning Health-aware off makes SMART schedule with calendar + energy + preferences only (no health rules) — verifiable via reason chip.
6. Every suggested date and time is directly editable; edits stick and are not overwritten by "Recalculate" unless confirmed.
7. "Reset to SMART" on an edited row restores the recommendation.
8. Settings has a clear disclaimer; no medical-claim language anywhere.
9. Support member with `can_request_recording = true` starts a recording for the owner; owner gets realtime banner within 3s.
10. Nav has exactly 5 items.

## Files likely touched

- `src/App.tsx` — `/start`, redirects.
- `src/pages/launch/{LaunchStart,LaunchSettings,LaunchSupport}.tsx`.
- `src/components/launch/{LaunchNav,LaunchLayout}.tsx`.
- `src/components/memoryBridge/MemoryBridgeFloatingButton.tsx`.
- `src/components/memoryBridge/capture-brief/model/{types.ts,milestones.ts (new),healthAwareScheduler.ts (new),scheduleActions.ts}`.
- `src/components/memoryBridge/capture-brief/SmartCommitSlot.tsx` — toggle chips, inline editors, override pills.
- `src/hooks/useSchedulingPreferences.ts` (new) — read/write the three toggles.
- `src/utils/smartScheduler.ts` — accept `{ healthAware: boolean }` flag.
- `src/components/support-circle/*` — upcoming-events card, permission toggle, active-recording banner.
- `src/hooks/memoryBridge/useMemoryBridge.ts` — realtime `recording_started_remotely`.
- `public/manifest.webmanifest` + `index.html`.
- `src/routes/MemoryBridge.tsx` — read `?quick=1`.
- One migration (two RLS policies above).

## Out of scope

- Native shells, lock-screen widgets, hot-word capture.
- Cross-device live audio streaming.
- Custom-domain TLS fix.
- New symptom/sleep/medication logging UI (uses existing signals; missing signals silently no-op).
- Visual redesign beyond a restraint pass.

## Test today

`https://myrhythmapp.lovable.app/launch/memory` — Capture → Actions → Decisions → Smart Commit already runs. Toggles, milestones, health-aware scheduling, remote record and PWA install land with this build.