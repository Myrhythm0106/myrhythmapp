# Memory Bridge: make it one smooth, professional flow

## What I checked

- `src/pages/launch/LaunchMemoryBridge.tsx` is a single 948-line screen holding recording, restore, loop-in, save, per-recording playback, extraction, results dialog and celebration.
- There are ~58 components under `src/components/memoryBridge/` — several do the same job (`ActionsViewer`, `ActsReviewTable`, `ActionsTableView`, `NextStepsReview`, `NextStepsGridView`, `ExtractedActionsReview`, `EnhancedActionCard`, `MemoryBridgeResultsModal`, `PostExtractionDialog`, `QuickCaptureResultsScreen`).
- There are **two independent scheduling paths**: `convertActionToCalendarEvent` in `src/utils/calendarIntegration.ts` (used by the "Accept & schedule all" dialog) and `commitAction`/`commitAllRecommended` in `capture-brief/model/commitActions.ts` (used by the Capture Brief table). They write different columns and only the second one emails invitees, so the same button appears to behave differently depending on which surface you're on.
- The extractor fix from earlier is in place; actions are saved with confidence flags.

## Diagnosis

Memory Bridge doesn't feel professional because it is three half-flows layered on top of each other, not because any one piece is broken. The recorder, the results dialog and the Capture Brief each own their own version of "here are your actions, schedule them", with different data writes and different feedback. That's what produces inconsistent results ("0 actions scheduled"), missing invites, and the sense that nothing is quite finished.

## The shape I recommend — one linear journey, four steps

```text
1 RECORD      big mic, timer, allowance, mic level        -> nothing else on screen
2 PROCESSING  honest progress: uploading / transcribing / finding next steps
3 REVIEW      one table: what I said I'd do, editable      -> the only actions surface
4 COMMIT      dates + who's involved -> diary + invites    -> one confirmation
```

Everything else becomes secondary, reachable from a "Past captures" list.

## What I'll change

### A. Collapse to one actions surface
Keep the Capture Brief table (`ActionsTableView` + `commitActions.ts`) as the single review-and-schedule surface. Route the post-recording dialog straight into it instead of into its own mini-review. Archive the duplicate viewers rather than delete them.

### B. One scheduling engine
Retire `convertActionToCalendarEvent` as an entry point and make every "schedule" button go through `commitAction`, so every scheduled action reliably gets: calendar event, reminders, invitations, emails, and the `extracted_actions` row updated. No more path where invites silently don't send.

### C. Honest, professional processing feedback
Replace the spinner with staged status (uploaded → transcribing X% → extracting → done), driven by the polling that already exists in `processSavedRecording.ts`, plus a clear failure state with one retry button. Long recordings should be safe to leave and come back to.

### D. Slim the recorder screen
Recorder page shows only: mic, timer, allowance, mic level, Stop. Loop-in, document import and past recordings move below the fold or to a second tab, so step 1 is one decision.

### E. One confirmation
After committing, a single summary: what's in the diary, when the reminders fire, who was told, and Undo. Same summary whether one action or all.

### F. Split the page file
Break `LaunchMemoryBridge.tsx` into `RecordStep`, `ProcessingStep`, `ReviewStep` and a small `PastCaptures` list so each step is testable and changes stop causing side effects elsewhere.

## Deliberately not doing

- No new AI features, no new tables. The extraction quality work is already done; this pass is about the path around it.
- Nothing gets deleted — superseded components move to `src/_archive/memoryBridge/`.

## Technical notes

- `commitActions.ts` becomes the only writer for scheduled actions; `calendarIntegration.ts` keeps its helper functions for the Calendar page but loses its Memory Bridge caller.
- Staged progress reads the existing `transcription_jobs` / polling loop — no schema change.
- Archived components are moved with `mv`, imports updated, so nothing is lost.

## Suggested order

1. One scheduling engine (B) — fixes the "0 actions scheduled" class of bug.
2. Single review surface (A) + confirmation (E).
3. Processing feedback (C).
4. Recorder slimming (D) and file split (F).
