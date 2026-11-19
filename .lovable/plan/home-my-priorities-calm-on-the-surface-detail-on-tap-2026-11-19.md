# Home: my priorities, calm on the surface, detail on tap

## The idea
Home shows only what matters for staying on track today, chosen from what I've said matters to me. Everything else stays folded away until I ask for it. Tapping any item opens it in its original form (the diary entry, or the step from my conversation), where I can change it and save, and Home updates straight away.

## What I see first (one screen, no scrolling on a phone)

```text
 Thursday 19 November
 Good morning, Annabel.
 "Today I choose ..." (one quiet line)

 MY PRIORITIES TODAY                       1 of 3 done
 ------------------------------------------------------
 (o) Call Dr Patel                 10:30   Health    >
 ( ) Send report to Sam            14:00   Work      >
 ( ) Pick up the kids              16:30   Family    >

 NEXT: Team check-in · 11:00 · in 57 min           >

 [ Record a conversation ]     [ See my day ]

 v More for today (3)          <- folded by default
```

- **My priorities today:** up to 3, picked automatically from my diary. Items I've starred come first, then my priority areas from my questions and steps from my conversations. Each row is one line with a gentle label (Health, Work, Family, Home) and a tick.
- **Next:** a single line with a quiet countdown. It is not a big card.
- **Two actions only:** Record and See my day.
- **More for today (folded):** opens to show promises waiting for a time, my best focus time, and anything a Support Circle member has suggested. It only appears when there is something inside, and it remembers whether I left it open or closed.

## Two ways to view: Dashboard or List (my choice, remembered)
A quiet switch at the top, **Dashboard | List**, lets me choose. It is remembered on this device and can be changed any time.

**Dashboard (consultancy-style executive view, the default):**
```text
 MY PRIORITIES TODAY                          On track  [====--] 1 of 3
 +---------------------+ +---------------------+ +---------------------+
 | HEALTH       10:30  | | WORK         14:00  | | FAMILY       16:30  |
 | Call Dr Patel       | | Send report to Sam  | | Pick up the kids    |
 | * On track      >   | | * Due soon      >   | | * Later         >   |
 +---------------------+ +---------------------+ +---------------------+
 NEXT  Team check-in · 11:00 · in 57 min                              >
 THIS WEEK  12 planned · 7 done · 2 waiting for a time   (thin bar)   >
```
- Three priority cards, each with a small category kicker, the time, and a status dot with a word (On track, Due soon, Overdue).
- One "status summary" line for today and one for the week, like a client status report: thin bars, small figures, no clutter.
- Muted palette with gold hairlines, sharp type, generous white space and clear hierarchy.

**List (simple and calm):**
- The same three priorities and Next as plain rows (time, title, small label, tick), with nothing else on the surface.

Both views use the same data, tap into the same detail sheet, and keep the same "More for today" fold.

## Calendar, revealed in layers
- **Layer 1 (always visible, one slim line):** a 7-day week strip under the priorities. It shows Mon to Sun with a small dot for each day that has commitments, and today highlighted.
- **Layer 2 (tap a day):** that day's agenda expands in place as a short timeline: times, titles, and free gaps shown as quiet spaces. Tap again to fold it.
- **Layer 3 (tap an item):** opens the same detail sheet to view, edit and save.
- **Layer 4 (when I want everything):** "Open full calendar" goes to the month and week views.
- Nothing calendar-related takes up the screen unless I open it.

## Yesterday · Today · Tomorrow (remember and prepare)
Home stays on today. Next to the date are two small arrows (on a phone I can also swipe): **< Yesterday | Today | Tomorrow >**. Nothing extra sits on the screen until I use them.
- **Yesterday (remember):** what I did (ticked), what moved, and the conversations I recorded, with "Carry over" on anything left undone.
- **Tomorrow (prepare):** what's booked, my first commitment, and "Get ready" items such as notes from a linked conversation. One tap adds a prep step to today.
- A small "Back to today" brings me home. In the week strip, yesterday and tomorrow are softly marked either side of today, so the three days are visible together in one slim line.

## Calendar views and My Vision, one tap in
- The week strip has a small, elegant view chooser: **Day · Week · Month · Year · Vision**. Each opens the full calendar straight in that view (the calendar already has Day, Week, Month and Year).
- **Vision** opens My Vision in ACTion: the life I'm building, with the goals and this week's priorities that serve it. On Home, one quiet line shows "Serving my vision: <short vision line>" and only appears when I've written one.
- Inside the calendar, the same chooser sits at the top, so I can move between Day, Week, Month, Year and Vision without going back. Tapping any item opens the same detail sheet to edit and save.
- The calendar views keep their current content. They get the same calm restyle (ivory, gold hairlines, serif headings) so it feels like one product.

## Calm screen rules (no overwhelm)
- On first view, only the greeting, up to 3 priorities, Next, the week strip and two actions are visible.
- Everything else is one tap away and folds back when I'm done. My choices are remembered.
- One focal point per section, plenty of space, and no more than about 7 visible items above the fold.

## Tap to see the detail, change it, save it
- Tapping a priority or Next opens a calm sheet that slides up (from the side on a computer) showing the item as it was created:
  - **Diary item:** title, date, time, notes, who's involved, reminders, "Keep private".
  - **Step from a conversation:** the step in my words, who owns it, the due date, and "Where this came from" (the original words and reference code, folded by default).
- Every field can be edited in place. **Save** updates the original record and Home refreshes immediately, with a quiet "Saved" and Undo. **Cancel** leaves everything as it was.
- Only the essentials show at first. "More details" reveals the rest (reminders, people, source) when I want it.

## Look and feel
- Warm ivory page, one soft glass card, fine gold hairlines, a serif greeting and calm sans-serif text. It feels elegant and professional, not a dark slab and not dense.
- No big numbers, countdown cards or tile grids. At most 3 priorities, 2 actions and 1 folded section, and every tap target is at least 56px.
- It reads naturally in "I/my" wording and never sounds clinical or like a test.

## Support Circle
The view-only version for permitted members uses the same calm layout (priorities and Next only, private items shown as "Busy", no editing).

## Checks
- Screenshots at desktop and phone sizes, signed in with sample diary items and a conversation step.
- Edit a priority in the sheet, save it, and confirm Home and the diary both show the change; then Undo.
- The existing top-3 tests still pass, plus a new test that edits save back to the original record.

## Paused (not lost)
The batch undo, put-back and guest-invite plan is saved and comes back next, once Home is right.

## Technical details
- `HomeWeekStrip` and its inline `HomeDayAgenda` use `useLaunchCalendarEvents(weekStart, weekEnd)`; the expanded day is session state; "Open full calendar" links to /launch/calendar.
- The view chooser links to `/launch/calendar?view=day|week|month|year`, and Vision links to the existing vision page; a shared `CalendarViewChooser` is used on Home and at the top of LaunchCalendar; visual restyle only, with no change to calendar logic.
- `HomeViewToggle` (Dashboard | List) is stored per user on the device; the `HomePriorityCards` and `HomePriorityList` renderers share one data source. `HomeStatusLine` covers today and this week (counts from the week's events and unscheduled `extracted_actions`).
- Replace `HomeBriefingBand`, `HomeUpNext` and `HomeAtAGlance` with `HomePriorities` (restyled `TopThreeToday` rows with a category label from the event type or linked action category), `HomeNextLine` and `HomeMoreToday` (a disclosure whose open state is stored per user on the device).
- New `PriorityDetailSheet` (shadcn Sheet; side on desktop, bottom on mobile). It loads the `calendar_events` row and, when `extracted_action_id` is set, the `extracted_actions` row. Saves go through the existing `useLaunchCalendarEvents` update/reschedule helpers and an `extracted_actions` update; Undo restores the previous values.
- Home and the sheet share one `useLaunchCalendarEvents(today)` instance passed down, so a save refreshes Home immediately.
- Keep the `suggestSlots` logic and the circle diary data path unchanged. Remove the unused dashboard CSS tokens.
- Record the rule in AGENTS.md: Home shows at most 3 priorities plus Next, with details edited in one shared sheet against the original record.
