import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BlockColor, BlockType, RepeatRule } from '@/launch/scheduling/defaults';

export interface TimeBlock {
  id: string;
  user_id: string;
  day_of_week: number | null;
  date: string | null;
  start_time: string; // HH:mm:ss
  end_time: string;
  name: string;
  block_type: BlockType;
  color: BlockColor;
  meetings_allowed: boolean;
  repeat_rule: RepeatRule;
  is_active: boolean;
}

export type NewTimeBlock = Omit<TimeBlock, 'id' | 'user_id'>;

export function useTimeBlocks() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) { setBlocks([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('time_blocks')
      .select('*')
      .eq('user_id', user.id)
      .order('day_of_week', { ascending: true, nullsFirst: false })
      .order('start_time', { ascending: true });
    if (error) console.warn('load time_blocks', error);
    setBlocks((data as any[]) ?? []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (b: NewTimeBlock) => {
    if (!user?.id) return null;
    const { data, error } = await supabase
      .from('time_blocks')
      .insert({ ...b, user_id: user.id })
      .select('*')
      .maybeSingle();
    if (error) { console.warn('create block', error); return null; }
    if (data) setBlocks(prev => [...prev, data as any]);
    return data as TimeBlock | null;
  }, [user?.id]);

  const update = useCallback(async (id: string, patch: Partial<TimeBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } as TimeBlock : b));
    const { error } = await supabase.from('time_blocks').update(patch).eq('id', id);
    if (error) { console.warn('update block', error); refresh(); }
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    const { error } = await supabase.from('time_blocks').delete().eq('id', id);
    if (error) { console.warn('delete block', error); refresh(); }
  }, [refresh]);

  const clearAll = useCallback(async () => {
    if (!user?.id) return;
    setBlocks([]);
    const { error } = await supabase.from('time_blocks').delete().eq('user_id', user.id);
    if (error) { console.warn('clear blocks', error); refresh(); }
  }, [user?.id, refresh]);

  return { blocks, loading, create, update, remove, clearAll, refresh };
}
