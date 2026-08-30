# Put the Executive Summary on the actual Next Steps page

## Confirmed cause

The signed-in Next Steps route is `/launch/commit`. That page currently renders a static Commit capability overview and does not import or render the Executive Summary, recordings, or extracted actions. The earlier fixes were added to recording dialogs, so they could never appear on the page you are viewing.

## What will change — SMART, professional, never overwhelming

1. **Replace the static Commit overview with the real Next Steps workspace.** `/launch/commit` becomes the usable page, not a feature description.
2. **One thing first: the brief.** The newest processed conversation is selected automatically and its professional Executive Summary is the first thing on screen — no extra click, no hunting.
3. **Progressive disclosure, not a wall.** The summary opens with the narrative and the four counts only. Themes, decisions and open questions sit behind quiet expanders. The actions table sits below the fold, so the first screen is read, not scanned.
4. **Three choices maximum on the page.** Exactly one primary action (Schedule proposed dates), plus a compact conversation selector and a single Export control. Everything else stays inside the actions table where it already lives.
5. **Consultancy-grade presentation, unchanged tokens.** Existing Emerald/exhibit styling, Sora/Manrope typography and the current `ExecutiveSummaryPanel` and actions table are reused exactly — owners, everyday involvement labels, dates, reminders, reference codes and board-ready exports all carry over.
6. **Honest states, never a blank gap.** Loading, no recordings yet, incomplete meeting record and query failure each render a clear, calm state with one recovery action.
7. **Nothing lost.** The current Commit capability copy moves into a collapsed "About Commit" section at the foot of the page.

## Why this is SMART

- **Specific:** the Executive Summary appears on `/launch/commit` above the actions.
- **Measurable:** visible within the first screen, no scroll and no extra tap, on phone and laptop.
- **Achievable:** reuses components that already exist and already render correctly elsewhere.
- **Relevant:** this is the page the Next Steps navigation actually lands on.
- **Time-bound:** one focused pass, no schema changes.

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
