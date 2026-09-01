import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfDay, endOfDay } from 'date-fns';

export interface LaunchActionReminder {
  id: string;
  actionId: string;
  dueAt: Date;
  offsetDays: number;
  actionText: string;
  priorityLevel: number | null;
  sent: boolean;
}

type Row = {
  id: string;
  action_id: string;
  due_at: string;
  offset_days: number;
  sent_at: string | null;
  extracted_actions: {
    action_text: string | null;
    priority_level: number | null;
    status: string | null;
    
    archived_at: string | null;
  } | null;
};

const HIDDEN_STATUSES = new Set(['completed', 'done', 'cancelled', 'dismissed', 'archived']);

/**
 * Reminder nudges (from `action_reminders`) that fall inside the visible calendar
 * range. These are read-only markers — nothing is written into `calendar_events`.
 */
export function useLaunchActionReminders(rangeStart: Date, rangeEnd: Date, enabled = true) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<LaunchActionReminder[]>([]);
  const [loading, setLoading] = useState(false);

  const fromIso = startOfDay(rangeStart).toISOString();
  const toIso = endOfDay(rangeEnd).toISOString();

  const fetchReminders = useCallback(async () => {
    if (!user || !enabled) {
      setReminders([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('action_reminders')
      .select(
        'id, action_id, due_at, offset_days, sent_at, extracted_actions!inner(action_text, priority_level, status, archived_at)'
      )
      .eq('user_id', user.id)
      .gte('due_at', fromIso)
      .lte('due_at', toIso)
      .order('due_at', { ascending: true });

    if (error) {
      console.error('[reminders] calendar load failed', error);
      setReminders([]);
      setLoading(false);
      return;
    }

    const rows = (data as unknown as Row[]) || [];
    setReminders(
      rows
        .filter(r => {
          const a = r.extracted_actions;
          if (!a) return false;
          if (a.archived_at) return false;
          if (a.status && HIDDEN_STATUSES.has(a.status.toLowerCase())) return false;
          if (a.completion_status && HIDDEN_STATUSES.has(a.completion_status.toLowerCase())) return false;
          return true;
        })
        .map(r => ({
          id: r.id,
          actionId: r.action_id,
          dueAt: new Date(r.due_at),
          offsetDays: r.offset_days,
          actionText: r.extracted_actions?.action_text || 'Next step',
          priorityLevel: r.extracted_actions?.priority_level ?? null,
          sent: !!r.sent_at,
        }))
    );
    setLoading(false);
  }, [user, enabled, fromIso, toIso]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { reminders, loading, refresh: fetchReminders };
}

/** "3 days before" / "Due now" / "1 day late" — phrased for the calendar. */
export function reminderOffsetLabel(offsetDays: number): string {
  if (offsetDays === 0) return 'Due today';
  if (offsetDays < 0) {
    const n = Math.abs(offsetDays);
    return `Due in ${n} day${n === 1 ? '' : 's'}`;
  }
  return `${offsetDays} day${offsetDays === 1 ? '' : 's'} late`;
}
