import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { toast } from 'sonner';

type Sub = { plan_type: string; status: string; current_period_end: string | null; cancel_at_period_end: boolean | null; trial_end: string | null };

function planName(plan: string): string {
  const p = plan.toLowerCase();
  if (p.includes('friend') || p.includes('ff')) return 'Friends & Family member';
  if (p.includes('found')) return 'Founding Member';
  if (p === 'free') return 'Free snapshot';
  return 'Regular member';
}

export function LaunchMembershipCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sub, setSub] = useState<Sub | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('subscriptions')
      .select('plan_type,status,current_period_end,cancel_at_period_end,trial_end')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { setSub(data as Sub | null); setLoading(false); });
  }, [user]);

  const active = !!sub && ['active', 'trial', 'trialing'].includes(sub.status);
  const date = sub?.current_period_end || sub?.trial_end;
  const dateText = date ? new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const manage = async () => {
    setOpening(true);
    const { data, error } = await supabase.functions.invoke('customer-portal');
    setOpening(false);
    if (error || !data?.url) { toast.error("I couldn't open payment settings just now. Please try again in a moment."); return; }
    window.open(data.url, '_blank', 'noopener');
  };

  return (
    <div id="membership" className="scroll-mt-24">
    <LaunchCard variant="featured" className="mb-6 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-launch-gold/20 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5 text-launch-ink" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-launch-ink/60">My membership</p>
          {loading ? (
            <p className="flex items-center gap-2 text-launch-ink"><Loader2 className="h-4 w-4 animate-spin" /> Checking my plan…</p>
          ) : active ? (
            <>
              <p className="font-semibold text-launch-ink text-lg">{planName(sub!.plan_type)}</p>
              {dateText && (
                <p className="text-sm text-launch-ink/70">
                  {sub!.cancel_at_period_end ? `Ends on ${dateText}` : sub!.status.startsWith('trial') ? `Trial ends on ${dateText}` : `Renews on ${dateText}`}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-launch-ink text-lg">Free snapshot</p>
              <p className="text-sm text-launch-ink/70">My snapshot and chosen focus are free. Membership is optional.</p>
            </>
          )}
        </div>
      </div>
      {!loading && (
        <div className="mt-4">
          {active ? (
            <LaunchButton variant="secondary" className="w-full min-h-[56px]" onClick={manage} disabled={opening}>
              {opening ? 'Opening…' : 'Manage payment'}
            </LaunchButton>
          ) : (
            <LaunchButton className="w-full min-h-[56px]" onClick={() => navigate('/launch/payment')}>
              See membership options
            </LaunchButton>
          )}
        </div>
      )}
    </LaunchCard>
    </div>
  );
}
