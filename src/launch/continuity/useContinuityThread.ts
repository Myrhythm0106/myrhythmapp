import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePersona } from '@/launch/persona/usePersona';
import type { ContinuityThreadRow, ContinuitySnapshot, CarryForwardItem } from './types';

const todayStr = () => new Date().toISOString().slice(0, 10);

export function useContinuityThread() {
  const { user } = useAuth();
  const { persona } = usePersona();
  const [latest, setLatest] = useState<ContinuityThreadRow | null>(null);
  const [history, setHistory] = useState<ContinuityThreadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('continuity_thread')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(30);
    if (!error && data) {
      setHistory(data as unknown as ContinuityThreadRow[]);
      setLatest((data[0] as unknown as ContinuityThreadRow) ?? null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const recordSnapshot = useCallback(
    async (snapshot: Partial<ContinuitySnapshot>, carry: CarryForwardItem[] = []) => {
      if (!user) return;
      const merged: ContinuitySnapshot = {
        energyBand: 'unknown',
        openCommits: 0,
        lastWins: [],
        lastMisses: [],
        nextAnchor: null,
        ...(latest?.snapshot ?? {}),
        ...snapshot,
      };
      const { data, error } = await supabase
        .from('continuity_thread')
        .insert({
          user_id: user.id,
          thread_date: todayStr(),
          persona,
          snapshot: merged as any,
          carry_forward: (carry.length ? carry : latest?.carry_forward ?? []) as any,
        })
        .select()
        .single();
      if (!error && data) {
        const row = data as unknown as ContinuityThreadRow;
        setLatest(row);
        setHistory(prev => [row, ...prev].slice(0, 30));
      }
      return data;
    },
    [user, persona, latest],
  );

  const daysSinceLastActivity = (() => {
    if (!latest) return 999;
    const last = new Date(latest.updated_at).getTime();
    const diff = Date.now() - last;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })();

  return { latest, history, loading, recordSnapshot, reload: load, daysSinceLastActivity };
}
