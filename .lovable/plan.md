# Memory Bridge: review and edit before anything reaches my diary

## What I checked

- `src/pages/launch/LaunchMemoryBridge.tsx` (929 lines) opens `PostExtractionDialog` as soon as extraction finishes.
- `PostExtractionDialog.tsx` shows a read-only list with tick boxes, an "I confirm this is accurate" check, and "Accept & schedule all". Nothing on that screen is editable — text, owner, date and time are all display-only.
- Scheduling then runs through `scheduleExtractedActions` (`capture-brief/model/scheduleFromMeeting.ts`), which re-reads the rows from the database and picks a slot itself: proposed date → AI suggestion → tomorrow 09:00. So the date a user thinks they agreed to is decided *after* they press the button, not before.
- A full editing table already exists (`ActionsTableView.tsx`, 717 lines: editable text, success criteria, owner, priority, start/finish dates, watchers) but it lives further downstream in `ActionsViewer`, after actions are already committed.

That gap is the whole problem: today the only "review" is a confirmation tick, and the schedule is decided by the app.

## 1. Edit-before-save step

Replace the confirmation dialog with a real **Review step** — the last screen before anything is written to the calendar.

For each extracted next step, editable in place:
- what I said I'd do (text)
- who owns it
- **start date + time** (the agreed slot, pre-filled with the suggestion and clearly labelled as a suggestion until I touch it)
- finish / due date
- priority
- who gets looped in (Support Circle + ad-hoc email)
- an include / exclude toggle, plus "remove this one"
- add a step the recording missed

Header shows the count of what will be scheduled; footer has one primary action: **Add these to my diary**. Nothing is inserted until that press. Low-confidence or derived items are visually flagged "suggested — check this" so a derived step is never mistaken for a promise I made.

Technically: reuse the existing editing controls from `ActionsTableView` rather than inventing new ones, hold edits in local state, and pass explicit per-action overrides (text, date, time, due date, people, priority) into `scheduleExtractedActions` so it commits exactly what I agreed to instead of re-deciding the slot. Excluded rows stay in `extracted_actions` as unscheduled, so nothing is lost.

The existing `CommitSummarySheet` stays as the single confirmation afterwards (what's in the diary, who was told, Undo).

## 2. Candid answer on the design bar

Not yet — and the reason is structural, not cosmetic. The pieces are good; there are simply too many of them doing the same job. There are three separate "here are your actions" surfaces (`PostExtractionDialog`, `ActionsViewer`, `ActionsTableView`), so the experience changes depending on which door you came through. A studio-grade flow has exactly one of each screen:

```text
1 RECORD    mic, timer, allowance        one decision
2 PROCESS   uploading / transcribing / finding next steps
3 REVIEW    edit everything, agree dates  <- this plan
4 CONFIRM   what's in my diary, undo
```

This plan builds step 3 properly and makes it the *only* review surface: the post-extraction dialog is retired, and `ActionsViewer` opens the same Review component when you revisit a past capture. Superseded pieces move to `src/_archive/memoryBridge/`, nothing is deleted.

Also part of this pass: consistent language ("my next steps", "add to my diary"), no dead-end states, and the review screen never showing more than it needs at once — long lists collapse detail behind a per-row expand.

## 3. Laptop, tablet and phone

One component, two layouts:
- **Laptop / tablet landscape (≥1024px):** table layout, columns for step / owner / start / due / priority / people, inline editing, sticky footer bar.
- **Phone and small tablet:** the same rows as stacked cards — the step text large and tappable, date and time as one tap-to-change chip pair, everything else behind a "More" expander. Sticky bottom bar with the single primary action so it's always thumb-reachable.
- Every tap target at least 56px, 16px minimum body text, date/time use native-feeling pickers on touch, and the review screen scrolls without the header eating the viewport.

Verified on desktop, tablet and phone widths in the preview before I call it done.

## Technical notes

- `scheduleFromMeeting.ts` gains an optional `overrides: Map<actionId, {text, date, time, dueDate, priority, people}>` argument; when present it skips the smart-scheduler fallback for that row.
- Edits are also written back to `extracted_actions` so the review reflects reality if you come back later.
- New `src/components/memoryBridge/review/ReviewStep.tsx` plus a small `ReviewRow` (table) and `ReviewCard` (mobile). No schema change, no new AI calls.
