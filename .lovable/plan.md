# Editable fields in the Next Step Summary table

Priority and Status already save inline. This makes the rest of the meaningful columns editable in the same instant-save way.

## What becomes editable

| Column | How it edits | Saves to |
| --- | --- | --- |
| Action | Tap the text → inline text box, Enter or blur saves, Esc cancels | action text |
| I'll know I'm done when | Tap the tick line under the action → inline text box, plus a short list of suggested examples to pick from and then edit | success criteria |
| Assigned | Tap → inline text box (name or "Me") | assigned to |
| Due | Tap → date picker, with a "Clear" option | due/completion date |
| Watchers | Tap the avatars → the existing Loop-in picker to add/remove people | assigned watchers |
| Priority | Already editable (High / Medium / Low) | — |
| Status | Already editable | — |

Read-only stays read-only: the row grip (drag to reorder) and the "..." menu.

## Behaviour

- One tap enters edit mode on that cell only; nothing else on the page moves.
- Changes save the moment you finish (Enter, pick a date, or tap away) — no Save button.
- A quiet confirmation appears; if a save fails the old value comes straight back with a clear message.
- Empty action text is rejected (it's the one required field) — the previous wording is restored.
- Every edit target is at least 44px tall so it works on a phone.
- Cards view is unchanged and keeps its own controls.

## Technical notes

- `src/components/memoryBridge/ActionsTableView.tsx`: add a small local `EditableCell` (text) and a date-picker cell using the existing `Popover` + `Calendar`; wire the watcher cell to open the existing Loop-in picker. New optional props: `onTextChange`, `onSuccessCriteriaChange`, `onAssignedChange`, `onDueDateChange`, `onWatchersChange`.
- `src/components/memoryBridge/ActionsViewer.tsx`: reuse the existing optimistic pattern from `handlePriorityChange` — one generic `handleFieldChange(actionId, field, value)` writing to `extracted_actions` with rollback + toast; pass the handlers down. `handleWatchersChange` already exists and gets reused.
- No schema, backend, or extraction-logic changes.
