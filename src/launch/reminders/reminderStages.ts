import { addDays, format } from 'date-fns';

export type ReminderLevel = 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
export type ReminderStage = 'prep' | 'due' | 'followup' | 'still_open' | 'none';
export type ReminderAnswer = 'ready' | 'done' | 'snooze10' | 'snooze60' | 'tomorrow' | 'cant' | 'let_go';

export interface StageEvent {
  date: string; // YYYY-MM-DD (local)
  time: string | null; // HH:mm
  status?: string | null; // diary status: pending | done | carried | cancelled
  reminder_level?: ReminderLevel | null;
  reminder_status?: string | null;
  snoozed_until?: string | null;
  prep_sent_at?: string | null;
  due_sent_at?: string | null;
  followup_sent_at?: string | null;
}

export const FOLLOWUP_MINUTES = 30;
export const STILL_OPEN_HOUR = 18;
const CLOSED_REMINDER = ['done', 'let_go', 'cancelled'];
/** Diary statuses that mean the item is finished or moved, wherever it was ticked. */
const CLOSED_ITEM = ['done', 'completed', 'carried', 'cancelled'];

export function startOf(e: StageEvent): Date {
  const [y, m, d] = e.date.split('-').map(Number);
  const [hh, mm] = (e.time || '09:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

/** Get-ready moment: 18:00 the evening before for morning items, or 2 hours before for items from midday on. */
export function prepAt(e: StageEvent): Date {
  const start = startOf(e);
  const eve = new Date(start); eve.setDate(eve.getDate() - 1); eve.setHours(STILL_OPEN_HOUR, 0, 0, 0);
  const twoBefore = new Date(start.getTime() - 2 * 3600_000);
  return start.getHours() >= 12 ? twoBefore : eve;
}

/** The single reminder stage due now for an item, or 'none'. */
export function stageFor(e: StageEvent, now: Date): ReminderStage {
  const level = e.reminder_level ?? 'steady';
  if (level === 'off' || CLOSED_REMINDER.includes(e.reminder_status ?? '') || CLOSED_ITEM.includes(e.status ?? '')) return 'none';
  const start = startOf(e);
  const snoozedTo = e.snoozed_until ? new Date(e.snoozed_until) : null;
  if (snoozedTo && now < snoozedTo) return 'none';

  if (now < start) {
    const usesPrep = level !== 'gentle';
    if (usesPrep && !e.prep_sent_at && e.reminder_status !== 'ready' && now >= prepAt(e)) return 'prep';
    return 'none';
  }

  const endOfDay = now.getHours() >= STILL_OPEN_HOUR || now.toDateString() !== start.toDateString();
  // A snooze the person asked for always gets its card; otherwise late items wait in Still open.
  if (!e.due_sent_at && (snoozedTo || !endOfDay)) return 'due';
  if (endOfDay) return 'still_open';
  const followAt = new Date((snoozedTo ?? start).getTime() + FOLLOWUP_MINUTES * 60_000);
  if (level === 'strong' && e.due_sent_at && !e.followup_sent_at && now >= followAt) return 'followup';
  return 'none';
}

/** The exact changes saved for each answer. Done uses the diary's own 'done' status so Home and calendar agree. */
export function answerPatch(item: StageEvent, answer: ReminderAnswer, now: Date): Record<string, unknown> {
  const ts = now.toISOString();
  const shown = { prep_sent_at: item.prep_sent_at ?? ts, due_sent_at: item.due_sent_at ?? ts, followup_sent_at: item.followup_sent_at ?? ts };
  switch (answer) {
    case 'ready': return { reminder_status: 'ready', prep_sent_at: ts };
    case 'done': return { ...shown, reminder_status: 'done', status: 'done', snoozed_until: null, responded_at: ts };
    case 'let_go': return { ...shown, reminder_status: 'let_go', snoozed_until: null, responded_at: ts };
    case 'snooze10':
    case 'snooze60': {
      const mins = answer === 'snooze10' ? 10 : 60;
      return { reminder_status: 'snoozed', snoozed_until: new Date(now.getTime() + mins * 60_000).toISOString(), due_sent_at: null, followup_sent_at: null, prep_sent_at: item.prep_sent_at ?? ts };
    }
    case 'tomorrow':
    case 'cant': {
      const [y, m, d] = item.date.split('-').map(Number);
      const date = format(addDays(new Date(y, m - 1, d), 1), 'yyyy-MM-dd');
      // Just decided: no instant "get ready" pop-up if tomorrow's prep moment has already passed.
      const prepPassed = now >= prepAt({ ...item, date });
      return { date, reminder_status: 'pending', snoozed_until: null, prep_sent_at: prepPassed ? ts : null, due_sent_at: null, followup_sent_at: null };
    }
  }
}
