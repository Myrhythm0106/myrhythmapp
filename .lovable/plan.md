# Start date, Finish date and "Due in" in My Next Step Summary

The table currently has a single "Due" column. This splits it into a proper span with a live countdown.

## Columns

| Column | Behaviour |
| --- | --- |
| Start | Tap to pick a date; "Clear" option. Saved as the action's start date. |
| Finish | The existing Due date, renamed. Tap to pick a date; "Clear" option. |
| Due in | Editable countdown: shows "Today", "in 4 days", "3 days ago" — tap to set it yourself. |

Both date cells sort and save the same instant way as the other editable cells (pick a date, it saves, quiet confirmation, old value returns if the save fails).

## Due in wording and colour

- No finish date → "—"
- Today → "Today" (amber)
- Tomorrow → "Tomorrow" (amber)
- Future → "in N days" / "in N weeks" (neutral)
- Past → "N days ago" (red)
- Action already done → shows a muted tick instead of a countdown, no red.

## Editing "Due in"

Tapping it opens a small box where you type a number of days (or pick one of "Today / Tomorrow / In 3 days / Next week"). Saving moves the Finish date to that many days from today, so Finish and Due in always agree — change either one and the other updates immediately. Clearing it removes the Finish date.


## Technical notes

- `src/components/memoryBridge/ActionsTableView.tsx`: rename the current Due column to Finish, add a Start column reusing the existing `EditableDueDate` component (bound to `start_date`), and add a "Due in" cell that renders the derived label and, on tap, a small number input plus quick-pick chips which write back a computed Finish date via `onDueDateChange`. New optional prop `onStartDateChange`. Keep the sort control on Finish, add one on Start.
- `src/components/memoryBridge/ActionsViewer.tsx`: pass `onStartDateChange` through the existing generic field-change handler (`start_date` on `extracted_actions`) — same optimistic update plus rollback as the other fields.
- New tiny helper for the countdown label (date-fns `differenceInCalendarDays`), colocated in the table file.
- Cards view and the mobile layout keep their current fields; no schema or backend change (`start_date`, `end_date`, `completion_date` already exist).
