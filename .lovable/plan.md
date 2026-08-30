# Put the Executive Summary on the actual Next Steps page

## Confirmed cause

The signed-in Next Steps route is `/launch/commit`. That page currently renders a static Commit capability overview and does not import or render the Executive Summary, recordings, or extracted actions. The earlier fixes were added to recording dialogs, so they could never appear on the page you are viewing.

## What will change

1. **Replace the static Commit overview with the real Next Steps workspace.** `/launch/commit` will become the usable Next Steps page rather than a feature-description page.
2. **Show the latest conversation brief immediately.** The newest processed conversation will be selected by default and its professional Executive Summary will appear above its actions—without requiring another hidden click.
3. **Add a simple conversation selector.** A compact selector will let you move between saved conversations while keeping the page calm and within the three-choice rule.
4. **Reuse the established professional summary and actions.** The page will use the existing `ExecutiveSummaryPanel` and consultancy-grade actions table, preserving dates, owners, RACI/everyday involvement, reminders, scheduling, and board-ready exports.
5. **Handle every state visibly.** Loading, no recordings, incomplete meeting data, and query failure will each show a clear summary-area state rather than an empty gap.
6. **Keep the overview without blocking the work.** The current Commit capability content will be moved into a secondary “About Commit” disclosure; nothing will be deleted.

## Technical details

- Refactor `src/pages/launch/LaunchCommit.tsx` to query the signed-in user’s processed meeting recordings and select the latest by default.
- Render the selected recording through the existing summary/actions flow, supporting both voice-recording IDs and meeting-recording IDs.
- Keep all signed-in and legacy Next Steps redirects pointing to `/launch/commit`.
- No database or schema changes.

## Verification

- Open the You-Are-Here dial → Commit/Next Steps and confirm the professional Executive Summary is visible in the first screen of useful content.
- Switch conversations and confirm the summary and actions update together.
- Verify loading, empty, incomplete-record, and error states.
- Check desktop and phone layouts, then confirm Excel/CSV/PDF exports still use the selected conversation’s summary.
