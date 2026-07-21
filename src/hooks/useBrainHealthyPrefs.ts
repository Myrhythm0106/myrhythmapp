import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BRAIN_HEALTHY_DEFAULTS, BrainHealthyPrefs, ProtectedWindow } from '@/launch/scheduling/defaults';

const PREF_TYPE = 'brain_healthy';

type Row = Partial<BrainHealthyPrefs> & { id?: string; user_id?: string };

function fromRow(row: Row | null | undefined): BrainHealthyPrefs {
  if (!row) return BRAIN_HEALTHY_DEFAULTS;
  return {
    ...BRAIN_HEALTHY_DEFAULTS,
    ...row,
    protected_windows: Array.isArray(row.protected_windows)
      ? (row.protected_windows as ProtectedWindow[])
      : BRAIN_HEALTHY_DEFAULTS.protected_windows,
  } as BrainHealthyPrefs;
}

export function useBrainHealthyPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<BrainHealthyPrefs>(BRAIN_HEALTHY_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) { setLoading(false); return; }
      setLoading(true);
      const { data, error } = await supabase
        .from('user_schedule_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('preference_type', PREF_TYPE)
        .maybeSingle();
      if (cancelled) return;
      if (error) console.warn('load brain-healthy prefs', error);
      if (data) {
        setRowId(data.id);
        setPrefs(fromRow(data as any));
      } else {
        setPrefs(BRAIN_HEALTHY_DEFAULTS);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const update = useCallback(async (patch: Partial<BrainHealthyPrefs>) => {
    setPrefs(prev => ({ ...prev, ...patch }));
    if (!user?.id) return;
    const payload: any = {
      user_id: user.id,
      preference_type: PREF_TYPE,
      ...patch,
    };
    if (rowId) {
      const { error } = await supabase
        .from('user_schedule_preferences')
        .update(payload)
        .eq('id', rowId);
      if (error) console.warn('update brain-healthy prefs', error);
    } else {
      const { data, error } = await supabase
        .from('user_schedule_preferences')
        .insert(payload)
        .select('id')
        .maybeSingle();
      if (error) console.warn('insert brain-healthy prefs', error);
      if (data?.id) setRowId(data.id);
    }
  }, [user?.id, rowId]);

  const reset = useCallback(async () => {
    await update(BRAIN_HEALTHY_DEFAULTS);
  }, [update]);

  return { prefs, update, reset, loading, defaults: BRAIN_HEALTHY_DEFAULTS };
}
