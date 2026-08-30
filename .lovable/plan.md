# Board-ready PDF export + how calendar sync works

## What you get

A **Download → PDF** option next to the existing Excel and CSV options on My Next Step Summary. It produces a single, print-ready document a board or senior manager can read without any app context:

1. Cover block — meeting title, date, participants, reference code, confidentiality line.
2. Executive Summary — the same synthesis shown in the panel: summary paragraph, key themes, decisions, open questions.
3. At-a-glance counts — total actions, scheduled, proposed dates awaiting acceptance, overdue, complete.
4. Actions exhibit — a properly laid-out table: reference, action, owner (name + email), who's involved in everyday language, start, due, status, reminder level.
5. Appendix — full detail for any action whose text was truncated in the table, plus the source conversation reference.

Formatting is A4 landscape for the actions table, repeating column headers on each page, page numbers, and the standard MyRhythm confidentiality footer on every page.

## How calendar sync works (no change to the current mechanism)

The PDF is a snapshot, not a sync channel — the calendar is driven by the app, exactly as it works today:

- Each action carries a start and due date. When a date is **proposed**, nothing is in the diary yet; the PDF shows it clearly marked "Proposed".
- Accepting a proposed date (per-row Accept, or "Schedule all proposed dates" on the Executive Summary panel) runs the existing scheduling path, which creates the calendar event, attaches the action's reference code so the diary entry traces back to the conversation, and sends invites to the owner and anyone marked "signs it off" or "ask first". Support Circle members without calendar permission are added as watchers instead.
- Reminders you set on the action are attached to that event and fire on the existing schedule.
- Re-exporting the PDF after scheduling shows those rows as "Scheduled" with the confirmed dates, so the document and the diary stay consistent.

Two optional additions if you want the PDF itself to be actionable — say the word and I'll include them:

- **.ics companion file** downloaded alongside the PDF, so a recipient who is not a MyRhythm user can drop the accepted actions into Outlook or Google Calendar directly.
- **QR / short reference** on each row that opens the action in MyRhythm.

Neither is in scope unless you ask; the base plan is the PDF only.

## Technical notes

- New `src/components/memoryBridge/exporters/actionsPdf.ts` using `jsPDF` + `jspdf-autotable`, already used by `capture-brief/exporters/pdf.ts`; reuse its header/footer/section helpers and the Emerald Prestige palette.
- Reuse the existing `MeetingSummaryModel` and `NextStepsItem` shapes that `actionsXlsx.ts` consumes, so the PDF, Excel and CSV are generated from one data model — no duplicate field logic.
- Expose `buildActionsPdf(model, actions)` returning a Blob for testability, plus `exportActionsPdf(...)` that saves it.
- Wire a PDF item into the existing Download menu in `ActionsTableView.tsx`; no changes to `ActionsViewer.tsx` data fetching.
- Verify by generating a representative PDF in the sandbox, rendering pages to images, and reviewing every page for overlap, clipping, column alignment and margins before shipping.
