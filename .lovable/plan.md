# Clear Save + Next on calendar, and a year view you can tap into

## 1. Save and Next where people type
Today the calendar's "My Vision in ACTion" banner saves silently as you type, so there is no visible Save — people can't tell it worked.

On the calendar banner (day, week, month and year):
- When editing the vision or Core / Key / Stretch Goals, show two buttons at the bottom: **Save** (teal) and **Save and next** (moves to the next sensible place — e.g. from the vision to Core Goal, then Key, then Stretch, then back to the calendar).
- After saving: "Saved ✓ 11:42" next to the buttons. Gentle auto-save stays on as a safety net, so nothing is ever lost if someone forgets.
- If someone leaves with unsaved typing, a calm "Save your changes?" prompt (Save / Leave without saving).

Same rule applied across the other /launch screens where people type: each will have a visible **Save** and, where there is a natural next step, **Next**. I'll check every typing screen (Settings, Vision, Support Circle invite, Memory Bridge details, Next Step Summary edits, reminders, About me) and add only what's missing — no screen gets more than three main buttons.

## 2. Year view: see how busy each day is
Today the year view only shows 12 month buttons with no detail.

New year view:
- Each month card shows its total: "14 actions".
- Under the month name, a small grid of that month's days. Days with actions show a small number badge (e.g. **3**); busier days get a slightly stronger tint. Today is ringed.
- Tap any day → a calm panel slides up: date, list of the actions and reminders due (time, title, status), with **Open this day** (goes to Day view) and **Close**.
- Tap the month name → Month view, as now.
- On phones, months stack 1–2 per row so numbers stay readable; touch targets at least 44px, badges never smaller than readable text.

## Technical details
- `LaunchCommitmentBanner.tsx`: add explicit save/next buttons calling the existing `usePlanningScope` flush; add saved timestamp and unsaved-leave guard.
- `LaunchCalendar.tsx`: pass `events` and `reminders` to `LaunchYearView`.
- `LaunchYearView.tsx`: per-month counts and mini day grid using `date-fns`; day-detail sheet using existing sheet/dialog component; "Open this day" calls existing `handleDaySelect`.
- Audit /launch typing screens via search for inputs without a visible save; add a shared small `LaunchSaveBar` (Save / Save and next / saved time) where missing.
- No database changes.
