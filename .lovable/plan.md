# Fix: Executive Summary is trapping the actions — no expand, no scroll

## Confirmed cause (read in code)

In `src/components/memoryBridge/ActionsViewer.tsx` (the "My next step summary" dialog):

- The dialog is `max-h-[95vh] overflow-hidden flex flex-col` (line 805).
- The Executive Summary section is `shrink-0` (line 908) and renders the panel **fully expanded** — narrative, themes, decisions, open questions, counts. When that content is taller than the dialog, it cannot shrink, so it pushes the actions area (`ScrollArea`, line 924) down to zero height.
- Result: the actions are clipped by `overflow-hidden` — you can't scroll to them, can't expand rows, and the page looks frozen below the summary.
- The `collapsibleDetails` prop already exists on `ExecutiveSummaryPanel` and is used on the Commit page, but the dialog does **not** pass it — so the dialog always renders the full expanded summary.

## The fix

1. **Collapse the summary detail in the dialog by default.** Pass `collapsibleDetails` to the panel inside `ActionsViewer.tsx`, so the dialog shows the narrative + counts with a quiet "Show detail" expander — matching the Commit page behaviour.
2. **Cap the summary's height in the dialog.** Give the summary section a bounded height (e.g. `max-h-[40vh] overflow-y-auto shrink-0`) so it can never consume the whole dialog, even when expanded.
3. **Guarantee the actions area keeps space.** Keep the actions region as `flex-1 min-h-0` and verify it scrolls: if the Radix `ScrollArea` still misbehaves inside the flex column, replace it with a plain `overflow-y-auto` container of the same styling — identical look, reliable scrolling.
4. **Sticky header stays.** The exhibit header and bulk-action bar remain fixed at the top; only summary + actions scroll within their own zones.
5. **Commit page sanity check.** Confirm `/launch/commit` (page scroll, no dialog) scrolls and expands correctly — expected already fine, verified visually.

## Technical notes

- `src/components/memoryBridge/ActionsViewer.tsx`: add `collapsibleDetails` to the `ExecutiveSummaryPanel` call (~line 914); change the summary wrapper at line 908 to `shrink-0 max-h-[40vh] overflow-y-auto pr-4`; swap `ScrollArea` for `overflow-y-auto` div at line 924 if needed.
- `src/components/memoryBridge/ExecutiveSummaryPanel.tsx`: no changes expected (prop already exists).
- No schema changes. No copy changes. Emerald/exhibit styling untouched.

## Verification

- Open a processed recording's "Open Executive Summary & Actions" from Memory Bridge, Recordings tab, and `/launch/commit`.
- Confirm: summary visible at top, "Show detail" expands/collapses it, actions table is always reachable and scrolls, rows expand, and editing/scheduling controls still work.
- Check phone (small viewport, 95vh dialog) and laptop.
