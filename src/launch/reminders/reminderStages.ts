export type ReminderLevel = 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
export type ReminderStage = 'prep' | 'due' | 'followup' | 'still_open' | 'none';

export interface StageEvent {
  date: string; // YYYY-MM-DD (local)
  time: string | null; // HH:mm
  reminder_level?: ReminderLevel | null;
  reminder_status?: string | null;
  snoozed_until?: string | null;
  prep_sent_at?: string | null;
  due_sent_at?: string | null;
  followup_sent_at?: string | null;
}

export const FOLLOWUP_MINUTES = 30;
export const STILL_OPEN_HOUR = 18;
const CLOSED = ['done', 'let_go', 'cancelled'];

export function startOf(e: StageEvent): Date {
  const [y, m, d] = e.date.split('-').map(Number);
  const [hh, mm] = (e.time || '09:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

/** Get-ready moment: 18:00 the evening before, or 2 hours before for items that start in the evening. */
export function prepAt(e: StageEvent): Date {
  const start = startOf(e);
  const eve = new Date(start); eve.setDate(eve.getDate() - 1); eve.setHours(STILL_OPEN_HOUR, 0, 0, 0);
  const twoBefore = new Date(start.getTime() - 2 * 3600_000);
  return start.getHours() >= 12 ? twoBefore : eve;
}

/** The single reminder stage due now for an item, or 'none'. */
export function stageFor(e: StageEvent, now: Date): ReminderStage {
  const level = e.reminder_level ?? 'steady';
  if (level === 'off' || CLOSED.includes(e.reminder_status ?? '')) return 'none';
  const start = startOf(e);
  const dueAt = e.snoozed_until ? new Date(e.snoozed_until) : start;
  const answered = e.reminder_status === 'missed';
  const sameDay = now.toDateString() === start.toDateString();

  if (now < start && !e.snoozed_until) {
    const usesPrep = level !== 'gentle';
    if (usesPrep && !e.prep_sent_at && e.reminder_status !== 'ready' && now >= prepAt(e)) return 'prep';
    return 'none';
  }
  if (now >= dueAt && !e.due_sent_at) return 'due';
  const followAt = new Date(dueAt.getTime() + FOLLOWUP_MINUTES * 60_000);
  if (level === 'strong' && e.due_sent_at && !e.followup_sent_at && now >= followAt && !answered) return 'followup';
  if (now >= start && (now.getHours() >= STILL_OPEN_HOUR || !sameDay)) return 'still_open';
  return 'none';
}
