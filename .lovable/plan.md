# Next Step Summary: table by default, priority editable

## What changes

**1. Table is the default view**

"My Next Step Summary" currently opens in Cards view, with a Cards/Table toggle in the header. It will open in **Table** view instead — the scannable row-per-action grid (Priority · Action · Assigned · Due · Status · Watchers).

- The Cards/Table toggle stays, so cards are one tap away.
- The chosen view is remembered, so if you switch to Cards it stays on Cards next time you open a summary.

**2. Priority becomes changeable**

Today the table shows priority as a read-only coloured dot ("High / Medium / Low"). It becomes an inline dropdown, exactly like the Status column already is:

- Tap the priority cell → choose High / Medium / Low.
- The colour dot updates instantly and the change saves straight away.
- A brief confirmation toast, and an error toast with the original value restored if the save fails.

Cards view keeps its existing priority control, so both views can change it.

## Technical notes

- `src/components/memoryBridge/ActionsViewer.tsx`: default `viewMode` to `'table'`, persist the preference in `localStorage`, and pass a new `onPriorityChange` handler that writes `priority_level` to `extracted_actions` with optimistic local state (mirrors the existing `handleStatusChange`).
- `src/components/memoryBridge/ActionsTableView.tsx`: replace the read-only `PriorityIndicator` cell with a `Select` (High = 1, Medium = 3, Low = 5) that keeps the coloured dot inside the trigger.
- `src/components/memoryBridge/RecordingDetailsView.tsx` shows the same summary heading — I'll check it uses the same viewer and apply the same default there.
- No schema, backend, or extraction-logic changes.
