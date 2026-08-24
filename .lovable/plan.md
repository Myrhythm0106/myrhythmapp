# Show reminders on the Calendar

Right now reminders live only on the Next Step and fire as notifications. This makes them visible on the Calendar too — as light "nudge" markers, not as duplicate events you have to manage.

## What you'll see

- **Day view**: nudge rows sit in the timeline alongside events, styled differently (dashed left edge, bell icon, muted tint) so they never look like another commitment. Label reads like "Nudge · Book physio — due in 3 days".
- **Week view**: a small bell dot on each day that carries one or more nudges, with a count when there is more than one.
- **Month view**: a tiny bell marker on the day cell, same rule.
- **Tap a nudge**: opens the underlying Next Step so you can tick it off, change the date, or switch the ladder (Gentle / Steady / Strong / Off) — changing it there updates the calendar markers immediately.
- **Toggle**: a "Show reminders" switch in the calendar header, remembered between visits, so the grid can be kept clean when you want only real commitments.

## Rules

- Reminders are never written into `calendar_events` — no duplicate rows, no risk of them being rescheduled or carried over by mistake.
- Archived or completed Next Steps show no nudges.
- The action itself, if it was scheduled to the calendar, still shows as a normal event; the nudges sit around it.

## Technical notes

- New hook `useLaunchActionReminders(rangeStart, rangeEnd)`: reads `action_reminders` joined to `extracted_actions` for the signed-in user where `due_at` falls in the visible range, `sent_at is null` is not required (past nudges show as dimmed), and the parent action is not archived/completed. Returns `{ id, actionId, dueAt, offsetDays, actionText, priorityLevel }`.
- `LaunchCalendar.tsx` merges that list with `events` and passes a separate `reminders` prop into `LaunchDayView`, `LaunchWeekView`, `LaunchMonthView` — event props stay unchanged so nothing existing breaks.
- Day view renders reminders in the same time-sorted list using `due_at`'s local time (09:00 by the current ladder logic), with a visually distinct row variant.
- Offset labelling reuses `REMINDER_RUNGS` from `src/utils/reminderLadder.ts`.
- Tapping a nudge routes to the Next Step Summary with the action id in the query string so `ActionsTableView` can highlight/expand that row.
- Toggle state stored in `localStorage` under a `launch.calendar.showReminders` key.
- No database migration needed.
