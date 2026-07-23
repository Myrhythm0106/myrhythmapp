import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MembershipStatus {
  hasMembership: boolean;
  isFoundingComped: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
  trialEnd: string | null;
  loading: boolean;
}

/**
 * Membership = paid subscription, active trial with card on file, or redeemed
 * founding access code. Used to gate premium UI (e.g. the You-Are-Here dial)
 * so unpaid registered users see a clean header.
 */
export function useMembershipStatus(): MembershipStatus {
  const { user } = useAuth();
  const [state, setState] = useState<MembershipStatus>({
    hasMembership: false,
    isFoundingComped: false,
    trialActive: false,
    trialDaysLeft: 0,
    trialEnd: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setState({
        hasMembership: false,
        isFoundingComped: false,
        trialActive: false,
        trialDaysLeft: 0,
        trialEnd: null,
        loading: false,
      });
      return;
    }

    (async () => {
      try {
        const [{ data: profile }, { data: sub }] = await Promise.all([
          supabase
            .from('profiles')
            .select('founding_comped')
            .eq('id', user.id)
            .maybeSingle(),
          supabase
            .from('subscriptions')
            .select('status, trial_end, current_period_end')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const isFoundingComped = !!profile?.founding_comped;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const trialEnd = sub?.trial_end ?? null;
        const trialEndDate = trialEnd ? new Date(trialEnd) : null;
        const trialActive =
          sub?.status === 'trial' &&
          !!trialEndDate &&
          trialEndDate.getTime() >= today.getTime();
        const trialDaysLeft = trialEndDate
          ? Math.max(
              0,
              Math.ceil(
                (trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              )
            )
          : 0;

        const paidActive =
          sub?.status === 'active' ||
          sub?.status === 'trialing' ||
          sub?.status === 'past_due';

        const hasMembership = isFoundingComped || trialActive || paidActive;

        if (cancelled) return;
        setState({
          hasMembership,
          isFoundingComped,
          trialActive,
          trialDaysLeft,
          trialEnd,
          loading: false,
        });
      } catch (err) {
        console.warn('[useMembershipStatus] fallback (query failed):', err);
        if (cancelled) return;
        // Fallback to localStorage flags written by legacy code paths.
        const localActive =
          typeof window !== 'undefined' &&
          (localStorage.getItem('subscription_active') === 'true' ||
            localStorage.getItem('mvp_trial_started') === 'true');
        setState({
          hasMembership: localActive,
          isFoundingComped: false,
          trialActive: localActive,
          trialDaysLeft: 0,
          trialEnd: null,
          loading: false,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return state;
}
