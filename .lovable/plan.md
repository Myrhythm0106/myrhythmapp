# Download My Next Step Summary as Excel or Google Sheets

Yes. Today the Next Step Summary table has no download at all — the only spreadsheet export lives on the Capture Brief screen. This adds a proper Download control to the summary itself.

## What you'll get

A **Download** button in the Next Step Summary header, with two choices:

- **Excel (.xlsx)** — a formatted workbook that opens in Excel, Numbers, and Google Sheets (File → Import, or just drag into Drive).
- **CSV** — plain fallback for any system.

No separate Google Sheets integration is needed: .xlsx opens natively in Google Sheets, and the download stays offline and private (nothing leaves your device).

## What's in the sheet

One row per action, columns matching the on-screen table:

Priority · Action · How I'll know I'm done · Owner · Owner email · Who's involved (signs off / ask first / keep in the loop) · Start date · Finish date · Due in · Status · Reminder level · Reference code · Source conversation

Plus a small header block at the top: conversation title, date, participants, and the count of actions — so a printed or shared sheet stands on its own.

Formatting: MyRhythm emerald header row, frozen top rows, sensible column widths, wrapped text on the long columns, dates as real dates (sortable, not text), and the standard confidentiality footer line.

## Technical notes

- New file `src/components/memoryBridge/exporters/actionsXlsx.ts` using the `exceljs` + `file-saver` pattern already proven in `capture-brief/exporters/xlsx.ts`; loaded via dynamic `import()` so it doesn't weigh down the page.
- CSV built inline (BOM + quoted fields), same pattern as `src/components/roadmap/roadmapExports.ts`.
- Header control added to `ActionsTableView.tsx` next to the existing actions, as a `DropdownMenu` with 44px+ items; exports whatever rows are currently shown (respecting any active filter/order, including drag-reordered priority).
- Reads existing fields on `NextStepsItem` (`owner_email`, `accountable`/`consulted`/`informed`, `start_date`, `end_date`, `reference_code`, reminder ladder). No schema change, no backend work.
- Filename: `MyRhythm_Next_Steps_<conversation>_<YYYY-MM-DD>`.
