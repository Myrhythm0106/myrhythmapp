# Make the Executive Summary always show up

You can't see the Executive summary at all. Today it is built in one place only — inside the "My next step summary" viewer — and it is skipped whenever any part of that load sequence fails. So depending on how you opened the actions, it silently disappears.

## What's going on

- The summary is assembled during a single load routine that also calls an AI scheduling-suggestion step. If that step (or any earlier query) throws, the whole block aborts: actions may still show from cache, but the summary stays empty and nothing tells you why.
- The summary panel only exists in the actions viewer dialog. Other entry points to your next steps (Memory Bridge page section, Recordings tab, Next Steps hub) route through it, but any recording whose meeting record is missing shows actions with no summary at all.
- The PDF export takes the same summary object, so when it is empty the exported page 1 is thin too.

## The fix

1. **Split summary building from the AI enrichment.** Build and show the Executive summary from the transcript, participants, decisions, themes and open questions first. Proposed-date enrichment then layers in afterwards and can fail without taking the summary down.
2. **Always render the panel.** When actions exist, the Executive summary block is always present. If the transcript is thin, it shows an honest short summary plus the counts, never nothing.
3. **Visible loading and fallback states.** A skeleton while building, and a plain "Summary is still being prepared — Retry" state if it fails, instead of an invisible gap.
4. **Pin it to the top.** The panel sits above the actions table, expanded by default, with a clear "Executive summary" heading, so it is the first thing you read before the exhibit.
5. **Keep exports in sync.** PDF, Excel and CSV all read the same guaranteed summary object, so page 1 of the board pack always carries the narrative, context, themes, decisions, open questions and counts.

## Technical notes

- `src/components/memoryBridge/ActionsViewer.tsx`: refactor the `fetchActions` effect into two stages — (a) fetch recording + actions and `setSummaryModel` immediately, (b) run `enrichWithSchedulingSuggestions` in its own try/catch and merge proposed dates. Add `summaryError` and `summaryLoading` state.
- Add a fallback path when `meeting_recordings` has no row for the `recording_id`: build a minimal `MeetingSummaryModel` from the recording title/date and the actions themselves.
- `src/components/memoryBridge/ExecutiveSummaryPanel.tsx`: add skeleton and error/retry variants; keep the existing Emerald/exhibit styling.
- No database or schema changes.

## Verification

- Open a recording's next step summary from Memory Bridge, the Recordings tab and the Next Steps hub — summary present in all three.
- Simulate a failing enrichment call — summary still renders, actions still render.
- Export the board-ready PDF and confirm page 1 carries the full summary before the actions exhibit on page 2.
