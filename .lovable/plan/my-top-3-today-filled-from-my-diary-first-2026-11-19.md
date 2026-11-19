# My top 3 today: filled from my diary first

## What changes for me
When I open Home, **My top 3 today** is already filled from today's diary. I don't have to type anything.

How the 3 are picked, in this order:
1. Diary items I starred as a priority (the star button already in my diary's day view).
2. Next steps that came from a recorded conversation.
3. Everything else still to do today, earliest first.

Things already done, cancelled or moved to another day are left out.

## How it behaves
- Each line shows the time and title, for example "10:30 · GP appointment".
- Ticking it marks it done in the diary as well, so Home and the diary always agree. One tap undoes it.
- Tapping the title opens that item in today's diary.
- A small "Swap" option lets me replace one with another of today's diary items.
- If my diary has fewer than 3 items, the empty spaces say "Add one thing that matters today". Anything I type there goes into today's diary as an all-day item, so the diary stays the one place everything lives.
- If today is empty: "Nothing in my diary yet today" with one button, **Plan my day**.
- What's next stays underneath. It won't repeat an item that's already in my top 3.

## Rules to test
- Never more than 3.
- Starred items come first, then items from conversations, then the rest by time.
- Done, cancelled and moved items never appear.
- Ticking an item here marks it done in the diary.

## Technical details
- New pure function `pickTopThree(events, starredIds)` in `src/launch/today/topThree.ts` (replaces the device-only list), with vitest cases for the rules above.
- `TopThreeToday` uses `useLaunchCalendarEvents(today, today)` plus `useLaunchPriorityHighlights()`. Ticking calls `updateStatus(id, 'done' | 'pending')`. Swaps are stored per user per date on this device only.
- Adding an item uses the existing calendar insert, with `source: 'manual'` and today's date.
- `NextActionStrip` gets an `excludeIds` prop so it skips anything already in the top 3.
- No database changes.
