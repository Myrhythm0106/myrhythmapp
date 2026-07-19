
# Memory Bridge + Calendar — PA-Readiness Build

Ship PR-A + PR-B + PR-C in one pass. Google/Outlook sync surfacing follows in a separate pass after user confirmation.

## PR-A · Wire calendar to real data (critical)
- **Migration** on `calendar_events`: add `status` (text, default 'pending'), `carried_from` (date), `end_time` (time), `source` (text, default 'manual'), plus index on `(user_id, date)`.
- Update `src/utils/calendarIntegration.ts` `convertActionToCalendarEvent` to set `source = 'memory_bridge'` when writing extracted-action events.
- New hook `src/hooks/useLaunchCalendarEvents.ts`: fetch events for visible date range from `calendar_events`, plus `addEvent`, `updateStatus`, `carryOver`, `reschedule` mutations.
- Refactor `src/pages/launch/LaunchCalendar.tsx` to use the hook (remove hardcoded mock array; wire mutations to Supabase).
- Update `LaunchDayView` event card to show a small "From Memory Bridge" chip when `source === 'memory_bridge'`.

## PR-B · Daily Brief header (PA feel)
- New component `src/components/launch/calendar/LaunchDailyBrief.tsx`:
  - "Good morning, {first name}. Today you have {N} things. Focus: {top-priority title}. Energy: {latest mood/energy entry, if any}."
  - Reads from `profiles` (name), current-day `calendar_events`, latest `mood_entries` row. Read-only, one render.
- Render only on day view (top of `LaunchDayView`, above the commitment banner).

## PR-C · Real reschedule modal
- New component `src/components/launch/calendar/LaunchRescheduleModal.tsx`: date + time picker (shadcn Popover + Calendar + native `<input type="time">`).
- Wire `handleEventReschedule` in `LaunchCalendar.tsx` to open it and call `useLaunchCalendarEvents.reschedule(eventId, newDate, newTime)` on submit.
- Remove the "coming soon" toast.

## Out of scope for this pass
- Google/Outlook sync surfacing inside `/launch/calendar` — will follow immediately after user confirms PR-A/B/C.
- Drag-to-reschedule on week view.

## Technical notes
- No changes to Memory Bridge, routing, dial, or auth.
- One migration; existing rows get `status='pending'`, `source='manual'` automatically via defaults.
- Realtime not added — refetch on view/date change and after mutations is sufficient for launch.

Proceeding now.
