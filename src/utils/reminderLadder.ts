import { supabase } from '@/integrations/supabase/client';
import { parseDateOnly } from '@/utils/dateOnly';

/** Negative = days before due, 0 = due now, positive = days late. */
export const REMINDER_RUNGS: Array<{ offset: number; label: string; when: 'before' | 'due' | 'after' }> = [
  { offset: -7, label: '7 days before', when: 'before' },
  { offset: -5, label: '5 days before', when: 'before' },
  { offset: -3, label: '3 days before', when: 'before' },
  { offset: -1, label: '1 day before', when: 'before' },
  { offset: 0, label: 'Due now', when: 'due' },
  { offset: 1, label: '1 day late', when: 'after' },
  { offset: 3, label: '3 days late', when: 'after' },
  { offset: 5, label: '5 days late', when: 'after' },
  { offset: 7, label: '7 days late', when: 'after' }
];

export type ReminderPreset = 'gentle' | 'steady' | 'strong' | 'off';

export const REMINDER_PRESETS: Record<ReminderPreset, number[]> = {
  off: [],
  gentle: [-1, 0],
  steady: [-3, -1, 0, 1],
  strong: REMINDER_RUNGS.map(r => r.offset)
};

export const presetLabel: Record<ReminderPreset, string> = {
  off: 'No reminders',
  gentle: 'Gentle',
  steady: 'Steady',
  strong: 'Strong'
};

/** Default preset from priority: 1–2 high → strong, 3 → steady, else gentle. */
export function presetForPriority(priorityLevel?: number): ReminderPreset {
  if (!priorityLevel) return 'steady';
  if (priorityLevel <= 2) return 'strong';
  if (priorityLevel <= 3) return 'steady';
  return 'gentle';
}

export function matchPreset(offsets: number[]): ReminderPreset | null {
  const sorted = [...offsets].sort((a, b) => a - b).join(',');
  const entry = (Object.keys(REMINDER_PRESETS) as ReminderPreset[]).find(
    key => [...REMINDER_PRESETS[key]].sort((a, b) => a - b).join(',') === sorted
  );
  return entry || null;
}

function dueAtFor(dueDate: string | null | undefined, offset: number): string | null {
  const base = parseDateOnly(dueDate);
  if (!base) return null;
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export async function loadActionReminders(actionId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('action_reminders')
    .select('offset_days')
    .eq('action_id', actionId);

  if (error) {
    console.error('[reminders] load failed', error);
    return [];
  }
  return (data || []).map(r => r.offset_days);
}

/** Replace the ladder for an action with the given offsets. */
export async function saveActionReminders(
  actionId: string,
  userId: string,
  offsets: number[],
  dueDate: string | null | undefined
): Promise<boolean> {
  const { error: deleteError } = await supabase
    .from('action_reminders')
    .delete()
    .eq('action_id', actionId);

  if (deleteError) {
    console.error('[reminders] clear failed', deleteError);
    return false;
  }

  if (offsets.length === 0) return true;

  const rows = offsets.map(offset => ({
    user_id: userId,
    action_id: actionId,
    offset_days: offset,
    due_at: dueAtFor(dueDate, offset)
  }));

  const { error } = await supabase.from('action_reminders').insert(rows);
  if (error) {
    console.error('[reminders] insert failed', error);
    return false;
  }
  return true;
}

/** Keep reminder timestamps in step with a changed due date. */
export async function rescheduleActionReminders(actionId: string, dueDate: string | null | undefined) {
  const offsets = await loadActionReminders(actionId);
  if (offsets.length === 0) return;

  await Promise.all(
    offsets.map(offset =>
      supabase
        .from('action_reminders')
        .update({ due_at: dueAtFor(dueDate, offset), sent_at: null })
        .eq('action_id', actionId)
        .eq('offset_days', offset)
    )
  );
}
