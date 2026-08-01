import React, { useEffect, useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FlaskConical, ChevronDown, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CONSENT_VERSION = 'v1';

/**
 * Research contribution toggle. Off by default, reversible at any time.
 * Withdrawing deletes the person's contributed rows.
 */
export function ResearchConsentCard() {
  const { user } = useAuth();
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('research_consent')
        .select('granted')
        .eq('user_id', user.id)
        .maybeSingle();
      if (active) {
        setGranted(Boolean(data?.granted));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const handleToggle = async (next: boolean) => {
    if (!user || saving) return;
    setSaving(true);
    try {
      if (next) {
        const { error } = await supabase.from('research_consent').upsert(
          {
            user_id: user.id,
            granted: true,
            consent_version: CONSENT_VERSION,
            granted_at: new Date().toISOString(),
            withdrawn_at: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
        if (error) throw error;
        setGranted(true);
        toast.success('Thank you — your patterns will help others.');
      } else {
        const { error } = await supabase.rpc('withdraw_research_consent');
        if (error) throw error;
        setGranted(false);
        toast.success('Withdrawn. Your contributed rows have been deleted.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not update that. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LaunchCard className="bg-launch-ivory border-launch-gold/30">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <FlaskConical className="h-5 w-5 text-launch-gold mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-launch-ink">Contribute to research</h3>
            <p className="text-sm text-launch-ink/70 mt-1">
              Share the <span className="font-medium">shape</span> of how you use MyRhythm — never your words.
              Off unless you turn it on. You can turn it off at any time.
            </p>
          </div>
          <Switch
            checked={granted}
            disabled={loading || saving}
            onCheckedChange={handleToggle}
            aria-label="Contribute anonymous patterns to research"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-launch-ink/70 hover:text-launch-ink min-h-[44px]"
          aria-expanded={showDetail}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${showDetail ? 'rotate-180' : ''}`} />
          {showDetail ? 'Hide the detail' : 'What exactly is shared?'}
        </button>

        {showDetail && (
          <div className="space-y-4 text-sm text-launch-ink/80 border-t border-launch-gold/20 pt-4">
            <div>
              <p className="font-semibold text-launch-ink mb-1.5">What travels</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Counts — how often you captured, committed, rescheduled or celebrated</li>
                <li>Rhythm — which days you were active, how long between plan and action</li>
                <li>Broad bands — an age band, a stage band, a months-since band</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-launch-ink mb-1.5">What never travels</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Recordings, transcripts, action titles, notes or any text you wrote</li>
                <li>Your name, email, exact age, exact dates or anything about your Support Circle</li>
                <li>Your account ID — rows carry a one-way pseudonym that cannot be reversed</li>
              </ul>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-launch-gold/10 border border-launch-gold/30 p-3">
              <ShieldCheck className="h-4 w-4 text-launch-gold mt-0.5 shrink-0" />
              <p className="text-launch-ink/80">
                Nothing is ever reported for a group of fewer than 20 people, so no pattern can be traced back
                to one person. MyRhythm does not diagnose, treat or make medical claims — this data describes
                everyday behaviour, confidence and quality of life only.
              </p>
            </div>
          </div>
        )}
      </div>
    </LaunchCard>
  );
}
