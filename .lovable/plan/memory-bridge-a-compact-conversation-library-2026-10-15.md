# Memory Bridge — a compact conversation library

## Aim
Keep Memory Bridge calm and professional as saved conversations grow: easy to record, easy to find an earlier conversation, and easy to open only what is needed. Use the approved **Compact conversation library** direction and preserve the visual standard of `/start`.

## Confirmed starting point
- Saved conversations currently render as a single list of cards, newest first, with a heading separating the first conversation from the rest.
- Each conversation already remembers its open/closed detail choice on this device.
- The recording query has no explicit paging controls. A compact display improves browsing, but does not by itself guarantee complete access to arbitrarily large histories.

## Proposed experience
### 1. A clear library beneath recording
- Keep the recording workspace prominent and unchanged.
- Use **My conversations** as the stable library heading with a saved-conversation count.
- Provide one small **Last conversation** shortcut that takes the person to that record in the library—no duplicate record card or competing controls.

### 2. Find a conversation without scrolling through everything
- A clearly labelled search field: **Find a conversation**, searching saved titles and reference codes only; do not imply that transcript text is searched.
- A simple date filter, tucked behind **Filter**, plus a clear reset option.
- Newest first by default; group rows under readable month-and-year headings.
- Empty search results offer **Clear search** rather than leaving the person stuck.

### 3. Compact, readable rows—not a wall of cards
- Each row shows title, date, duration when available, and a plain next-step count or saved/processing status.
- Reference codes and secondary controls move into details; keep original-word links accessible inside each action.
- Use generous spacing, clear dividers and existing ivory/ink/teal/gold styling—not tiny text or an overcrowded spreadsheet.
- Keep rows closed by default and retain the user's existing remembered choices. Opening one conversation must not expand unrelated records.

### 4. A manageable amount at once
- Show 10 conversations per page with labelled **Previous** and **Next**, page position and visible result count.
- Search/filter changes return to the first page. After deletion, keep the page valid and remove the deleted row immediately using the existing successful-deletion behavior.
- Explicit links and the Last conversation shortcut reveal the correct page and record, including when it is outside the current search.
- On phones, metadata wraps neatly; no sideways scrolling and no extra page scrollbar.

## Technical scope
- Extract focused library presentation and filtering/grouping helpers; keep recorder, processing, saving, deletion and transcript contracts in their existing locations.
- Reuse the shared conversation disclosure and action-origin mechanisms. No changes to permissions, storage, audio retention or extraction behavior.
- Paginate the currently fetched records in this presentation-only phase. Validate loading/error behavior and count wording so partial or failed loads are not presented as a complete library. If the service caps fetched history, report that limitation; server-side paging/search is separate work requiring approval.
- Search only available title/reference metadata; do not fetch or expose removed transcript text for search.

## Checks before completion
- Test realistic sample libraries of 0, 1, 25 and 200 conversations, including long titles and missing duration.
- Check search, date filtering, reset, paging, remembered details, explicit opens and deletion on the last page.
- Confirm actions still open their accurate, retention-aware original-word links.
- Check desktop, Android-sized and 320px screens, keyboard navigation and 200% zoom.
- Verify the real signed-in flow where access permits; label sample-data checks and any unavailable authenticated checks honestly.

## Not included
Folders, automatic categories, new recording behavior, automatic action changes, transcript-wide search, or a new navigation system.