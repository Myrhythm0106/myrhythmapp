# Download My Next Step Summary as Excel or Google Sheets

# Next Step Summary: executive summary intro + Excel / Google Sheets download

Two additions to the Next Step Summary: an executive summary of the conversation at the top, and a board-ready spreadsheet download.

## 1. Executive summary intro

A short briefing panel above the actions table, so the reader understands the conversation before reading the list:

- **What this was** — conversation title, date, participants, and context in one line.
- **Summary paragraph** — a plain-language recap of what was discussed and agreed, generated from the transcript (reusing the existing `buildExecutiveSummary` logic already proven on the Capture Brief screen, so no new AI cost or model work).
- **Key themes and decisions** — up to five quiet chips; open questions listed only if any exist.
- **At a glance** — total actions, how many already have proposed dates, how many are scheduled, how many are complete.
- Collapsible ("Read more") so it never overwhelms the screen; expanded by default on desktop, collapsed on mobile.

Then, immediately beneath it, the actions table as it is today.

## 2. Proposed dates that can be scheduled in one tap

Every action shows a **proposed date and time** where one isn't set yet — the energy-aware suggestion the app already computes. These are visibly marked as proposals (dashed outline, "Proposed") rather than committed entries.

- Tap a proposed date to accept it, or edit it inline.
- A single **Schedule all proposed dates** button in the summary panel commits every accepted proposal to the calendar at once, using the existing scheduling path (so Support Circle invitations, owner emails, and reminder ladders all fire as they do now).
- Nothing reaches the diary until you accept — review stays in your hands.

## 3. Download as Excel or Google Sheets

A **Download** button in the Next Step Summary header, with two choices:

- **Excel (.xlsx)** — a formatted workbook that opens in Excel, Numbers, and Google Sheets (File → Import, or just drag into Drive).
- **CSV** — plain fallback for any system.

No separate Google Sheets integration is needed: .xlsx opens natively in Google Sheets, and the download stays offline and private (nothing leaves your device).


## Board-ready by default

The workbook is written as a document you could hand to a board or senior management team without touching it:

- **Executive Summary sheet** — the same briefing as on screen: title, date, participants, context, summary paragraph, themes, decisions, open questions, and the at-a-glance counts. Emerald/ivory MyRhythm styling, Calibri throughout.
- **Actions sheet** — the exhibit table itself: emerald header band in white bold text, frozen header row, auto-filter enabled, banded rows, disciplined column widths, wrapped text on long columns, real date values (right-aligned, `dd mmm yyyy`, sortable), squared status/priority labels rather than emoji, and proposed dates flagged as "Proposed" so a reader never mistakes them for commitments.
- **Print setup** — landscape, fit-to-width on one page, repeating header row on every page, page numbers, and the standard confidentiality footer ("MyRhythm · Confidential — Not medical advice.") on every sheet.
- No stray gridlines, no truncated cells, no raw database values (`not_started` reads as "Not started").


## What's in the sheet

One row per action, columns matching the on-screen table:

Priority · Action · How I'll know I'm done · Owner · Owner email · Who's involved (signs off / ask first / keep in the loop) · Start date · Finish date · Proposed date · Due in · Status · Reminder level · Reference code · Source conversation


## Technical notes

- New `ExecutiveSummaryPanel.tsx` in `src/components/memoryBridge/`, fed by the existing `buildExecutiveSummary` / `extractDecisions` / `extractThemes` helpers in `capture-brief/model/synthesize.ts`; rendered above the table in `ActionsViewer.tsx`.
- Proposed dates come from `enrichWithSchedulingSuggestions`; "Schedule all proposed dates" calls the existing `scheduleExtractedActions` in `capture-brief/model/scheduleFromMeeting.ts`, so invites, owner emails, and reminders behave exactly as today.
- New file `src/components/memoryBridge/exporters/actionsXlsx.ts` using the `exceljs` + `file-saver` pattern already proven in `capture-brief/exporters/xlsx.ts`; loaded via dynamic `import()` so it doesn't weigh down the page.

- CSV built inline (BOM + quoted fields), same pattern as `src/components/roadmap/roadmapExports.ts`.
- Header control added to `ActionsTableView.tsx` next to the existing actions, as a `DropdownMenu` with 44px+ items; exports whatever rows are currently shown (respecting any active filter/order, including drag-reordered priority).
- Reads existing fields on `NextStepsItem` (`owner_email`, `accountable`/`consulted`/`informed`, `start_date`, `end_date`, `reference_code`, reminder ladder). No schema change, no backend work.
- Filename: `MyRhythm_Next_Steps_<conversation>_<YYYY-MM-DD>`.
- Before shipping, the generated workbook is opened and each sheet inspected for clipped text, wrong widths, or broken formatting, and fixed until clean.
