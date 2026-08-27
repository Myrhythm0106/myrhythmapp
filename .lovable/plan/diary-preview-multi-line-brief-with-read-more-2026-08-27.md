# Diary preview: multi-line brief with "Read more"

## Goal
Make calendar/diary event cards show a scannable multi-line brief (description) with an expandable "Read more" toggle, so users can preview context before opening the full event.

## What I'll change

1. **Collect the brief when adding events**
   - Add a multi-line "Brief / notes" textarea to `LaunchAddEventModal`.
   - Pass `description` through `onAdd` and persist it to `calendar_events.description` in `LaunchCalendar.tsx` and `useLaunchCalendarEvents.addEvent`.

2. **Build a reusable expandable brief component**
   - Create `src/components/launch/calendar/ExpandableBrief.tsx`.
   - Shows up to ~3 lines by default; expands to full text when the user taps "Read more".
   - Collapses back to preview with "Show less".
   - Uses current theme tokens (no hardcoded colours), minimum 56 px tap target for the toggle.

3. **Show the brief in diary previews**
   - `LaunchDayView`: render `ExpandableBrief` under each event title/type row.
   - `LaunchWeekView`: render a one-line truncated preview in the "Today's Preview" list; keep it compact but informative.
   - Leave `LaunchMonthView` compact (dot indicators only) so the grid stays scannable.

4. **Handle missing / empty briefs gracefully**
   - When no description exists, the preview shows no empty placeholder and takes no extra space.

## What I will not change
- No schema migrations needed; `calendar_events.description` already exists.
- No changes to event status, reminders, invitations, or recurrence logic.
- No backend work.

## Verification
- Add a new event with a multi-line brief and confirm it appears collapsed in day view.
- Tap "Read more" and confirm full text expands in place.
- Confirm existing events without a brief still render cleanly.
- Check phone (< 768 px) and desktop widths.
