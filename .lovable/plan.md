# Connect the YES plan to the calendar

## What you will see

**1. "This week in my YES plan" on the day view**
- A calm card in My Daily Rhythm on each day view, e.g. "Week 1 of 3 · Y — Your Starting Point".
- It shows the 1–3 small actions for that week, taken from the person's own answers (the same lines as the snapshot's YES plan). For example, "Reminder the evening before appointments" or "A short walk at a time that suits me".
- Actions are placed at sensible times based on their answers: memory actions in the morning, movement in their best time, wind-down in the evening, and nothing important in their energy dip.
- Each action has **Add to my day**, which turns it into a normal calendar item (with priority star and reminders as usual), and **Not today**. Nothing is added to the calendar without that tap.
- The card stays separate from the schedule, so everyday plans and YES actions don't blur together.
- After week 3, a closing card appears: "My first 3 weeks are done", with links to Continue my full picture or See how I'm tracking.

**2. When the 3 weeks start**
- Day 1 is the day they tap **Start week 1** on the snapshot. If they never tap it, day 1 is the day they finished the questions.
- Week 1 = days 1–7, week 2 = days 8–14, week 3 = days 15–21. The week and month views show a small "YES · Week 2" marker on those days.

**3. Vision banner follows the timeframe**
- The banner reads the timeframe chosen on the Vision page (This year / 3 years / Long term) and shows that vision, labelled e.g. "My Vision in ACTion · 3-year vision".
- A small switch on the banner lets the person change timeframe there too. The Vision page and the banner stay in step.
- If the chosen timeframe has no vision yet, the banner shows "This year" and offers **Write my 3-year vision**, which links to the Vision page.
- During the YES weeks, one quiet line under the vision links the two, e.g. "This week's YES step: Everyday Energy".

## Kept as-is
Core, Key and Stretch Goals, Save and Save and next, priority stars, and how calendar items are stored, synced and reminded. No new database tables. YES progress and the timeframe stay saved on this device, the same as the vision today.

## Technical details
- `src/launch/framework/yes.ts`: add `getYesStart()` / `setYesStart()` (device-local key; fallback to the snapshot's `completedAt`) and `getYesWeek(date)` returning 1–3, `'done'` or null.
- New `src/launch/yes/yesActions.ts`: move the week-line logic out of `YesPlanCard` into `buildYesActions(answers, productivityWindow)` → `{ week, id, title, suggestedTime }[]`. `YesPlanCard` and the calendar both use it, and `YesPlanCard`'s "Start week 1" calls `setYesStart()`.
- New `LaunchYesWeekCard.tsx` rendered in `LaunchDayView` inside My Daily Rhythm. "Add to my day" uses the existing calendar action-creation path in `LaunchCalendar.tsx`, and dismissals are stored per user, date and action.
- Week and month views: small marker based on `getYesWeek`.
- `useLaunchSavedVision`: read `levels[level]` from `myrhythm.visionStatement.v1`, return `{ vision, level, setLevel }`, and dispatch the existing change event when the level changes. `LaunchVisionStatement` already writes `level`.
- `LaunchCommitmentBanner`: timeframe label and switch, empty-timeframe link, and YES line.
- Checks: typecheck; 393px Playwright on day view (card, Add to my day, Not today) and banner timeframe switching.
