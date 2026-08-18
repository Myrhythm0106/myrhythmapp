# Editable fields in the Next Step Summary table

Priority and Status already save inline. This makes the rest of the meaningful columns editable in the same instant-save way, plus a clearer Start / Finish / Due in span.

## What becomes editable

| Column | How it edits | Saves to |
| --- | --- | --- |
| Action | Tap the text → inline text box, Enter or blur saves, Esc cancels | action text |
| I'll know I'm done when | Tap the tick line under the action → inline text box, plus a short list of suggested examples to pick from and then edit | success criteria |
| Assigned | Tap → inline text box (name or "Me") | assigned to |
| Start | Tap → date picker, with a "Clear" option | start date |
| Finish | Tap → date picker, with a "Clear" option (formerly Due) | completion / end date |
| Due in | Tap → small number input + quick-pick chips; picks move Finish to that many days from today | completion / end date |
| Watchers | Tap the avatars → the existing Loop-in picker to add/remove people | assigned watchers |
| Priority | Already editable (High / Medium / Low) | — |
| Status | Already editable | — |

Read-only stays read-only: the row grip (drag to reorder) and the "..." menu.

## Suggested success criteria

Actions often arrive with no "I'll know I'm done when…" line, and writing one from scratch is the hardest part. So when that cell is empty (or being edited) it offers 3-4 ready-made examples, chosen from the wording of the action itself:

- Call/email type → "I'll know I'm done when I've spoken to them and noted what we agreed."
- Appointment/booking → "I'll know I'm done when the date is confirmed and in my calendar."
- Prepare/write/create → "I'll know I'm done when the draft is finished and saved."
- Send/share → "I'll know I'm done when it's sent and I've had a reply."
- Anything else (fallback) → "I'll know I'm done when I've finished it and ticked it off." / "…when I've told one person it's done."

Tapping an example drops the wording into the box, where it can be edited before saving — nothing is applied automatically, and the examples disappear once a criteria is set (with a small "Suggestions" link to bring them back).

## Due in wording and colour

- No finish date → "—"
- Today → "Today" (amber)
- Tomorrow → "Tomorrow" (amber)
- Future → "in N days" / "in N weeks" (neutral)
- Past → "N days ago" (red)
- Action already done → shows a muted tick instead of a countdown, no red

Because it is derived from Finish, nothing extra is stored and it stays correct without a refresh. But the user can edit it directly, which just rewrites the Finish date.

## Behaviour

- One tap enters edit mode on that cell only; nothing else on the page moves.
- Changes save the moment you finish (Enter, pick a date, or tap away) — no Save button.
- A quiet confirmation appears; if a save fails the old value comes straight back with a clear message.
- Empty action text is rejected (it's the one required field) — the previous wording is restored.
- Every edit target is at least 44px tall so it works on a phone.
- Cards view is unchanged and keeps its own controls.

## Technical notes

- `src/components/memoryBridge/ActionsTableView.tsx`: add a small local `EditableCell` (text) and a date-picker cell using the existing `Popover` + `Calendar`; rename the Due column to Finish, add a Start column, and add a "Due in" cell that renders the derived label and, on tap, a small number input + quick-pick chips (Today / Tomorrow / In 3 days / Next week). Wire the watcher cell to open the existing Loop-in picker. New optional props: `onTextChange`, `onSuccessCriteriaChange`, `onAssignedChange`, `onStartDateChange`, `onDueDateChange`, `onWatchersChange`.
- New `src/components/memoryBridge/successCriteriaSuggestions.ts`: pure keyword-match helper returning 3-4 suggested criteria strings for a given action text (no AI call, instant, offline-safe). Rendered as tappable chips under the edit box.
- New tiny due-in helper (date-fns `differenceInCalendarDays`) colocated in the table file for the label and quick-pick days.
- `src/components/memoryBridge/ActionsViewer.tsx`: reuse the existing optimistic pattern from `handlePriorityChange` — one generic `handleFieldChange(actionId, field, value)` writing to `extracted_actions` with rollback + toast; pass the handlers down. `handleWatchersChange` already exists and gets reused. `start_date` and `completion_date` / `end_date` are the stored fields.
- No schema, backend, or extraction-logic changes.
