# Rebalance the Next Step Summary — actions get the space, summary reveals progressively

## Confirmed cause (read in code)

- **Dialog header is tall.** In `ActionsViewer.tsx` the header stacks eyebrow + title + 4 buttons + Cards/Table toggle + a separate Open/Archived filter row + helper text (lines 807–905). Before any content, a large share of the 95vh dialog is already spent.
- **Summary renders its full narrative.** `ExecutiveSummaryPanel` shows the whole "Meeting overview" paragraph plus the count strip at all times (lines 107–124). Only themes/decisions/questions are behind an expander — so a long narrative pushes the actions table into a small leftover strip.
- **Commit page has the same imbalance.** `/launch/commit` renders the full summary panel above the actions (lines 365–406), so the exhibit starts below the fold.

## What changes

### 1. Progressive disclosure inside the summary panel (`ExecutiveSummaryPanel.tsx`)
- **Narrative:** clamp to 2 lines with a quiet "Read more / Show less" toggle. The first sentence or two is always visible — enough to orient, never a wall.
- **Themes:** show the first 3 chips + a "+N more" expander.
- **Decisions / Open questions:** each shows its first item as a one-line preview with the count ("3 decisions captured"), expanding to the full list on tap.
- Counts strip and title band stay always visible — they are the orientation, not the bulk.

### 2. A compact "summary strip" mode for the dialog
- In the dialog, the summary opens **collapsed to a single strip**: title, date, the four count pills, and a "Show summary" expander. Expanding reveals the panel (with the disclosure rules above) inside the existing capped-height scroll zone.
- Result: the actions exhibit is the first and largest thing in the dialog; the summary is one tap away.

### 3. Slim the dialog header (`ActionsViewer.tsx`)
- Merge the Open/Archived filter into the same row as the Cards/Table toggle.
- Keep exactly one primary action: **Review & schedule**. Move "Add Watchers to All" and "Capture notes" into a single "More actions" menu (respects the max-3-choices guardrail).
- Remove the helper-text line — the exhibit speaks for itself.

### 4. Commit page: actions move up (`LaunchCommit.tsx`)
- The summary panel uses the same 2-line narrative clamp and disclosure, so the actions exhibit lands within the first screen on laptop and close to it on phone.
- Add a slim anchor link under the summary ("Skip to my next steps ↓") that scrolls to the exhibit — one tap, reassuring for users who find long pages hard to navigate.

### 5. Nothing else moves
- Every edit, save handler, scheduling, export, reminder and watcher flow stays identical. Presentation and disclosure only. No schema changes.

## Technical notes

- `src/components/memoryBridge/ExecutiveSummaryPanel.tsx`: add `summaryExpanded`-style local state for the narrative clamp (`line-clamp-2` + toggle), theme chip cap, and per-section previews for decisions/open questions. New optional prop `defaultCollapsedStrip` renders the compact strip variant used by the dialog.
- `src/components/memoryBridge/ActionsViewer.tsx`: pass the strip variant; consolidate header controls; merge archive filter into the view-toggle row.
- `src/pages/launch/LaunchCommit.tsx`: add the skip link; panel props unchanged otherwise.
- Tailwind `line-clamp` is available in the project's Tailwind v3 setup.

## Verification

- Dialog on laptop and phone: actions exhibit visible immediately and dominant; summary strip expands/collapses; narrative "Read more" works; themes/decisions/questions previews expand.
- `/launch/commit`: actions within first screen, skip link scrolls, all table interactions unchanged.
- TypeScript clean; visual check at phone and laptop widths.
