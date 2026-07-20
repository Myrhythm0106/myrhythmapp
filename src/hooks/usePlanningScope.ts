import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  startOfWeek as dfStartOfWeek,
  startOfMonth,
  startOfYear,
  format,
} from 'date-fns';

export type PlanningScope = 'day' | 'week' | 'month' | 'year';
export type PlanningSource = 'user' | 'ai_assisted';

export interface PlanningRow {
  id: string;
  user_id: string;
  scope: PlanningScope;
  period_start: string; // yyyy-MM-dd
  vision_text: string | null;
  core: string | null;
  key: string | null;
  stretch: string | null;
  parent_id: string | null;
  source: PlanningSource;
  updated_at: string;
}

/**
 * Given a user's planning-day preference (0=Sun … 6=Sat, null = default Sun),
 * return the period_start date for a given scope and reference date.
 */
export function periodStartFor(
  scope: PlanningScope,
  date: Date,
  planningDayOfWeek: number | null | undefined,
): Date {
  switch (scope) {
    case 'day':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    case 'week': {
      const dow = ((planningDayOfWeek ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
      return dfStartOfWeek(date, { weekStartsOn: dow });
    }
    case 'month':
      return startOfMonth(date);
    case 'year':
      return startOfYear(date);
  }
}

const ymd = (d: Date) => format(d, 'yyyy-MM-dd');

export function usePlanningScope(
  scope: PlanningScope,
  date: Date,
  planningDayOfWeek: number | null | undefined,
) {
  const { user } = useAuth();
  const [row, setRow] = useState<PlanningRow | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const periodStart = periodStartFor(scope, date, planningDayOfWeek);
  const periodStartStr = ymd(periodStart);

  const load = useCallback(async () => {
    if (!user) {
      setRow(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('planning_scopes')
      .select('*')
      .eq('user_id', user.id)
      .eq('scope', scope)
      .eq('period_start', periodStartStr)
      .maybeSingle();
    setRow((data as PlanningRow) ?? null);
    setLoading(false);
  }, [user, scope, periodStartStr]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (
      patch: Partial<Pick<PlanningRow, 'vision_text' | 'core' | 'key' | 'stretch' | 'source' | 'parent_id'>>,
    ) => {
      if (!user) return;
      const payload = {
        user_id: user.id,
        scope,
        period_start: periodStartStr,
        ...patch,
      };
      const { data, error } = await supabase
        .from('planning_scopes')
        .upsert(payload, { onConflict: 'user_id,scope,period_start' })
        .select()
        .single();
      if (!error && data) setRow(data as PlanningRow);
    },
    [user, scope, periodStartStr],
  );

  /** Debounced autosave for text fields. */
  const saveDebounced = useCallback(
    (patch: Parameters<typeof save>[0]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => save(patch), 400);
    },
    [save],
  );

  return { row, loading, save, saveDebounced, reload: load, periodStart };
}

/** Reads user's planning day preference from profiles. Defaults to 0 (Sunday). */
export function usePlanningDay() {
  const { user } = useAuth();
  const [dayOfWeek, setDayOfWeek] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('planning_day_of_week')
      .eq('id', user.id)
      .maybeSingle();
    setDayOfWeek(((data as any)?.planning_day_of_week ?? 0) as number | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (next: number | null) => {
      if (!user) return;
      setDayOfWeek(next);
      await supabase
        .from('profiles')
        .update({ planning_day_of_week: next } as any)
        .eq('id', user.id);
    },
    [user],
  );

  return { dayOfWeek, setDayOfWeek: update, loading };
}
