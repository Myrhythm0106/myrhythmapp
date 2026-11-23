import { useCallback, useEffect, useRef, useState } from 'react';
import { addDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { answerPatch, stageFor, type ReminderAnswer, type ReminderStage, type StageEvent } from './reminderStages';
import { announceDiaryChange, onDiaryChange } from './diarySync';

export type { ReminderAnswer } from './reminderStages';

export interface ReminderItem extends StageEvent {
  id: string;
  title: string;
  description?: string | null;
  watchers?: string[] | null;
}

const COLS = 'id,title,description,date,time,status,watchers,reminder_level,reminder_status,snoozed_until,prep_sent_at,due_sent_at,followup_sent_at';

export function useReminderEngine() {
  const { user } = useAuth();
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [now, setNow] = useState(() => new Date());
  const source = useRef(`reminders-${Math.random().toString(36).slice(2)}`).current;

  const load = useCallback(async () => {
    if (!user) return;
    const today = new Date();
    const { data } = await supabase
      .from('calendar_events')
      .select(COLS)
      .eq('user_id', user.id)
      .gte('date', format(today, 'yyyy-MM-dd'))
      .lte('date', format(addDays(today, 1), 'yyyy-MM-dd'))
      .neq('status', 'cancelled')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    setItems((data as unknown as ReminderItem[]) ?? []);
  }, [user]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => onDiaryChange(source, () => { setNow(new Date()); load(); }), [load, source]);
  useEffect(() => {
    const t = setInterval(() => { setNow(new Date()); load(); }, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const staged = items.map((i) => ({ item: i, stage: stageFor(i, now) as ReminderStage }));
  const current = staged.find((s) => s.stage === 'prep' || s.stage === 'due' || s.stage === 'followup') ?? null;
  const stillOpen = staged.filter((s) => s.stage === 'still_open').map((s) => s.item);

  const patch = async (id: string, values: Record<string, unknown>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...values } as ReminderItem : i)));
    setNow(new Date());
    const { error } = await supabase.from('calendar_events').update(values as never).eq('id', id);
    if (error) { await load(); return false; }
    announceDiaryChange(source);
    return true;
  };

  /** Marks the stage as shown without an answer (e.g. card closed). */
  const markShown = (id: string, stage: ReminderStage) => {
    const col = stage === 'prep' ? 'prep_sent_at' : stage === 'due' ? 'due_sent_at' : 'followup_sent_at';
    return patch(id, { [col]: new Date().toISOString() });
  };

  const respond = (item: ReminderItem, answer: ReminderAnswer) => patch(item.id, answerPatch(item, answer, new Date()));

  return { current, stillOpen, respond, markShown, reload: load };
}
