# Fix off-by-one dates in Next Step Summary

## What's happening

When you pick 25 Aug as a start date, the app saves the right day but displays 24 Aug. Same for the finish date (27 Aug shows as 26 Aug).

The date you pick is written correctly as a plain calendar date (`2026-08-25`). The problem is on the way back out: that text is turned into a date using the browser's default rule, which treats a bare date as midnight **UTC**. Your device is 5 hours behind UTC, so midnight UTC lands on the previous evening — and the display shows the day before. The stored data is fine; only the reading and display are wrong.

## The fix

Add one small shared helper that parses a `yyyy-MM-dd` value as a **local** calendar date, and use it everywhere a plain date string is turned into a `Date` for display or comparison.

Places to correct:

- Next Step Summary table (`ActionsTableView`)
  - the start/finish cell values shown in the row
  - the value pre-selected when the date popover opens (so the calendar highlights the right day)
  - the "Due in" countdown, which currently loses a day the same way
- Sibling surfaces that read the same fields, so the fix isn't only in one table:
  - Memory Bridge review step and commit summary
  - the scheduling helpers that compute "due within 2 days" and format the chosen date

Selection and saving are already correct and stay unchanged.

## Verification

- Pick 25 Aug as start and 27 Aug as finish; both cells should read Aug 25 and Aug 27, and re-opening each picker should highlight those days.
- "Due in" should count from the finish day shown.
- Confirm the same rows read correctly after a page refresh and on mobile.

## Technical notes

- New helper (e.g. `src/utils/dateOnly.ts`): `parseDateOnly(value)` returning `new Date(y, m-1, d)` (or `date-fns` `parseISO` on the date part), plus a `formatDateOnly` wrapper for display.
- Replace `new Date(dateStr)` for date-only strings in the files listed above; leave timestamp fields (`created_at`, `logged_at`, `updated_at`) untouched since those are true ISO instants.
- No database or schema changes; no change to what gets written.
