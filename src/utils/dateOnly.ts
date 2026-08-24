import { format } from 'date-fns';

/**
 * Parse a plain calendar date ("yyyy-MM-dd") as a LOCAL date.
 *
 * `new Date("2026-08-25")` is parsed by JS as midnight UTC, which renders as
 * the previous day for anyone west of UTC. Every date-only field in the app
 * (start_date, end_date, completion_date, scheduled_date...) must go through
 * this helper instead.
 */
export function parseDateOnly(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) {
    const fallback = new Date(value);
    return isNaN(fallback.getTime()) ? undefined : fallback;
  }
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return isNaN(date.getTime()) ? undefined : date;
}

/** Serialise a Date back to a plain calendar date string, in local time. */
export function toDateOnly(date: Date | null | undefined): string | null {
  if (!date || isNaN(date.getTime())) return null;
  return format(date, 'yyyy-MM-dd');
}

/** Format a date-only string for display; returns `fallback` when empty/invalid. */
export function formatDateOnly(
  value: string | null | undefined,
  pattern = 'MMM d',
  fallback = '—',
): string {
  const parsed = parseDateOnly(value);
  if (!parsed) return fallback;
  try {
    return format(parsed, pattern);
  } catch {
    return fallback;
  }
}

/** Add days to a date-only string and return a date-only string. */
export function addDaysToDateOnly(value: string, days: number): string {
  const parsed = parseDateOnly(value) ?? new Date();
  parsed.setDate(parsed.getDate() + days);
  return format(parsed, 'yyyy-MM-dd');
}
