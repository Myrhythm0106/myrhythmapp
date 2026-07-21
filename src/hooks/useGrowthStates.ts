import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { GrowthLetter } from '@/launch/growth/states';

export interface GrowthStateRow {
  id: string;
  user_id: string;
  goal_id: string | null;
  letter: GrowthLetter;
  note: string | null;
  logged_at: string;
  created_at: string;
}

/**
 * Read/write today's MyRHYTHM-G state for the current user.
 * If `ownerId` is provided (Support Circle read-only view), we read that owner's rows
 * — RLS enforces whether the current viewer is allowed to see them.
 */
export function useGrowthStates(ownerId?: string) {
  const { user } = useAuth();
  const effectiveOwner = ownerId ?? user?.id;

  const [today, setToday] = useState<GrowthStateRow | null>(null);
  const [history, setHistory] = useState<GrowthStateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!effectiveOwner) { setLoading(false); return; }
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const { data, error } = await (supabase as any)
      .from('growth_states')
      .select('*')
      .eq('user_id', effectiveOwner)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: false });
    if (!error && data) {
      const rows = data as GrowthStateRow[];
      setHistory(rows);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      setToday(
        rows.find(r => new Date(r.logged_at) >= startOfToday) ?? null
      );
    }
    setLoading(false);
  }, [effectiveOwner]);

  useEffect(() => { load(); }, [load]);

  const logState = useCallback(
    async (letter: GrowthLetter, note?: string) => {
      if (!user?.id || ownerId) return; // read-only when viewing another owner
      setSaving(true);
      // Upsert-by-day: if today already has an entry, update it; else insert.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const { data: existing } = await (supabase as any)
        .from('growth_states')
        .select('id')
        .eq('user_id', user.id)
        .gte('logged_at', startOfToday.toISOString())
        .maybeSingle();
      if (existing?.id) {
        await (supabase as any)
          .from('growth_states')
          .update({ letter, note: note ?? null, logged_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await (supabase as any)
          .from('growth_states')
          .insert({ user_id: user.id, letter, note: note ?? null });
      }
      setSaving(false);
      await load();
    },
    [user?.id, ownerId, load]
  );

  return { today, history, loading, saving, logState, reload: load };
}
