import { useCallback, useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { stageFor, type ReminderStage, type StageEvent } from './reminderStages';

export interface ReminderItem extends StageEvent {
  id: string;
  title: string;
  description?: string | null;
  watchers?: string[] | null;
}
export type ReminderAnswer = 'ready' | 'done' | 'snooze10' | 'snooze60' | 'tomorrow' | 'cant' | 'let_go';

const COLS = 'id,title,description,date,time,watchers,reminder_level,reminder_status,snoozed_until,prep_sent_at,due_sent_at,followup_sent_at';

export function useReminderEngine() {
  const { user } = useAuth();
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    if (!user) return;
    const today = new Date();
    const { data } = await supabase
      .from('calendar_events')
      .select(COLS)
      .eq('user_id', user.id)
      .gte('date', format(today, 'yyyy-MM-dd'))
      .lte('date', format(addDays(today, 1), 'yyyy-MM-dd'))
      .neq('status', 'cancelled');
    setItems((data as unknown as ReminderItem[]) ?? []);
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); load(); }, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const staged = items.map((i) => ({ item: i, stage: stageFor(i, now) as ReminderStage }));
  const current = staged.find((s) => s.stage === 'prep' || s.stage === 'due' || s.stage === 'followup') ?? null;
  const stillOpen = staged.filter((s) => s.stage === 'still_open').map((s) => s.item);

  const patch = async (id: string, values: Record<string, unknown>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...values } as ReminderItem : i)));
    await supabase.from('calendar_events').update(values as any).eq('id', id);
  };

  /** Marks the stage as shown without an answer (e.g. card dismissed). */
  const markShown = (id: string, stage: ReminderStage) => {
    const col = stage === 'prep' ? 'prep_sent_at' : stage === 'due' ? 'due_sent_at' : 'followup_sent_at';
    return patch(id, { [col]: new Date().toISOString() });
  };

  const respond = async (item: ReminderItem, answer: ReminderAnswer) => {
    const ts = new Date().toISOString();
    const shown = { prep_sent_at: item.prep_sent_at ?? ts, due_sent_at: item.due_sent_at ?? ts, followup_sent_at: item.followup_sent_at ?? ts };
    switch (answer) {
      case 'ready': return patch(item.id, { reminder_status: 'ready', prep_sent_at: ts });
      case 'done': return patch(item.id, { ...shown, reminder_status: 'done', status: 'completed', responded_at: ts });
      case 'let_go': return patch(item.id, { ...shown, reminder_status: 'let_go', responded_at: ts });
      case 'snooze10':
      case 'snooze60': {
        const mins = answer === 'snooze10' ? 10 : 60;
        return patch(item.id, { reminder_status: 'snoozed', snoozed_until: new Date(Date.now() + mins * 60_000).toISOString(), due_sent_at: null, followup_sent_at: null, prep_sent_at: item.prep_sent_at ?? ts });
      }
      case 'tomorrow':
      case 'cant': {
        const next = addDays(new Date(`${item.date}T00:00:00`), 1);
        await patch(item.id, { date: format(next, 'yyyy-MM-dd'), reminder_status: 'pending', snoozed_until: null, prep_sent_at: null, due_sent_at: null, followup_sent_at: null });
        return load();
      }
    }
  };

  return { current, stillOpen, respond, markShown, reload: load };
}
