import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  getRecordingLimits,
  resolveRecordingTier,
  type RecordingTier,
  type RecordingTierLimits,
} from '@/config/recordingLimits';

export type AllowancePeriod = 'week' | 'month';

const PERIOD_KEY = 'mb_allowance_period';

export function readStoredPeriod(): AllowancePeriod {
  try {
    const raw = localStorage.getItem(PERIOD_KEY);
    return raw === 'week' || raw === 'month' ? raw : 'month';
  } catch {
    return 'month';
  }
}

export function storePeriod(period: AllowancePeriod) {
  try {
    localStorage.setItem(PERIOD_KEY, period);
  } catch {
    /* noop */
  }
}

function periodStart(period: AllowancePeriod): Date {
  const now = new Date();
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  // Week starts Monday
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

function periodResetLabel(period: AllowancePeriod): string {
  if (period === 'week') return 'resets Monday';
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `resets ${next.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}`;
}

export interface RecordingAllowance {
  tier: RecordingTier;
  limits: RecordingTierLimits;
  period: AllowancePeriod;
  setPeriod: (p: AllowancePeriod) => void;
  /** Minutes recorded in the selected period */
  usedMinutes: number;
  /** Allowance for the selected period, in minutes */
  allowanceMinutes: number;
  remainingMinutes: number;
  fractionUsed: number;
  recordingCount: number;
  resetLabel: string;
  isLoading: boolean;
  refresh: () => void;
}

export function useRecordingAllowance(): RecordingAllowance {
  const { user } = useAuth();
  const { tier: contextTier, subscriptionData } = useSubscription() as {
    tier?: string;
    subscriptionData?: { subscription_tier?: string; is_trial_active?: boolean };
  };

  const [period, setPeriodState] = useState<AllowancePeriod>(() => readStoredPeriod());
  const [usedMinutes, setUsedMinutes] = useState(0);
  const [recordingCount, setRecordingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const tier = resolveRecordingTier({
    tier: contextTier,
    planType: subscriptionData?.subscription_tier,
    isTrialing: subscriptionData?.is_trial_active,
  });
  const limits = getRecordingLimits(tier);

  const setPeriod = useCallback((p: AllowancePeriod) => {
    setPeriodState(p);
    storePeriod(p);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const start = periodStart(period).toISOString();
        const { data, error } = await supabase
          .from('voice_recordings')
          .select('duration_seconds')
          .eq('user_id', user.id)
          .gte('created_at', start);

        if (error) throw error;
        if (cancelled) return;

        const seconds = (data || []).reduce((sum, r) => sum + (r.duration_seconds || 0), 0);
        setUsedMinutes(Math.round(seconds / 60));
        setRecordingCount((data || []).length);
      } catch (err) {
        console.warn('useRecordingAllowance: could not load usage', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, period, nonce]);

  const allowanceMinutes = period === 'week' ? limits.weeklyMinutes : limits.monthlyMinutes;
  const remainingMinutes = Math.max(0, allowanceMinutes - usedMinutes);
  const fractionUsed = allowanceMinutes > 0 ? Math.min(1, usedMinutes / allowanceMinutes) : 0;

  return {
    tier,
    limits,
    period,
    setPeriod,
    usedMinutes,
    allowanceMinutes,
    remainingMinutes,
    fractionUsed,
    recordingCount,
    resetLabel: periodResetLabel(period),
    isLoading,
    refresh: () => setNonce(n => n + 1),
  };
}
