import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, Check, Shield, CreditCard, ArrowRight, ArrowLeft, Loader2, Sparkles, KeyRound, Copy, ChevronDown, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { friendsFamilyConfig, isFriendsFamilyCode } from '@/config/pricing';
import { setResumePoint, clearResumePoint } from '@/launch/onboarding/resumePoint';

const STRIPE_MODE = (import.meta.env.VITE_STRIPE_MODE || 'live').toLowerCase();
const IS_TEST_MODE = STRIPE_MODE === 'test';

const plans = [
  { id: 'monthly', name: 'Monthly', price: '£10', interval: 'month', popular: false },
  { id: 'yearly', name: 'Yearly', price: '£84', interval: 'year', popular: true, savings: 'Save 30%' },
];

const features = [
  'Memory Bridge - Voice to Action',
  'Support Circle - Shared accountability',
  'Smart Calendar with energy-based scheduling',
  'Gratitude journal & mood tracking',
  'Brain games & cognitive exercises',
  'Progress analytics & insights',
  'Long recordings, with retention settings I control',
];

const testCards = [
  { label: 'Success', number: '4242 4242 4242 4242' },
  { label: 'Declined', number: '4000 0000 0000 0002' },
  { label: '3D Secure challenge', number: '4000 0025 0000 3155' },
  { label: 'Insufficient funds', number: '4000 0000 0000 9995' },
];

const redeemErrorCopy: Record<string, string> = {
  not_authenticated: 'Please sign in first, then try again.',
  invalid_code: "That code doesn't look right. Check spelling and try again.",
  inactive_code: 'That code has been switched off.',
  expired_code: 'That code has expired.',
  code_exhausted: 'That code has already been used the maximum number of times.',
};

export default function LaunchPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromReport = Boolean((location.state as { fromReport?: boolean } | null)?.fromReport);
  const [snapshot, setSnapshot] = useState<{ total: number; windowStart?: string; windowEnd?: string } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const isFF = isFriendsFamilyCode(code);

  // Remember the plan they picked so nothing is retyped after a sign-in detour.
  React.useEffect(() => {
    const remembered = localStorage.getItem('myrhythm_selected_plan');
    if (remembered === 'monthly' || remembered === 'yearly') setSelectedPlan(remembered);
    setResumePoint('/launch/payment');
  }, []);

  // Carry the snapshot context through when arriving from the report.
  React.useEffect(() => {
    if (!cameFromReport) return;
    try {
      const saved = localStorage.getItem('myrhythm_launch_mode');
      if (!saved) return;
      const data = JSON.parse(saved);
      const score = data?.brainHealthScore ?? data?.assessmentResults?.brainHealthScore;
      if (score && typeof score.total === 'number') {
        const pw = data?.assessmentResults?.productivityWindow ?? score.productivityWindow ?? null;
        setSnapshot({
          total: score.total,
          windowStart: pw?.productiveStart,
          windowEnd: pw?.productiveEnd,
        });
      }
    } catch { /* noop */ }
  }, [cameFromReport]);

  React.useEffect(() => {
    localStorage.setItem('myrhythm_selected_plan', selectedPlan);
  }, [selectedPlan]);

  // Waits for auth to settle instead of bouncing on a not-yet-loaded session.
  const requireSession = async () => {
    let session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      await new Promise((r) => setTimeout(r, 600));
      session = (await supabase.auth.getSession()).data.session;
    }
    if (!session) {
      setNeedsAuth(true);
      return null;
    }
    setNeedsAuth(false);
    return session;
  };

  const handleRedeemCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error('Enter an access code first');
      return;
    }
    setIsRedeeming(true);
    try {
      const session = await requireSession();
      if (!session) return;
      const { data, error } = await supabase.rpc('redeem_access_code', { p_code: trimmed });
      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result?.success) {
        toast.error(redeemErrorCopy[result?.error || ''] || 'Could not redeem that code.');
        return;
      }
      toast.success("You're in! Welcome, Founding Member.");
      clearResumePoint();
      navigate('/launch/home?welcome=1');
    } catch (err: any) {
      console.error('Redeem error:', err);
      toast.error(err.message || 'Could not redeem that code.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleStartTrial = async () => {
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const session = await requireSession();
      if (!session) return;
      const userType = localStorage.getItem('myrhythm_user_type') || 'wellness';
      const interval = selectedPlan === 'yearly' ? 'year' : 'month';
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: 'premium', interval, userType },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError("Checkout couldn't start just now. Nothing was charged. You can try again — or skip payment entirely with an access code below.");
    } finally {
      setIsLoading(false);
    }
  };


  const copyCard = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num.replace(/\s/g, ''));
      toast.success('Card number copied');
    } catch {
      toast.error('Copy failed — select and copy manually');
    }
  };

  return (
    <div className="h-full min-h-0 bg-launch-cream-light flex flex-col overflow-hidden pt-safe pb-safe px-safe">
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(cameFromReport ? '/launch/welcome' : '/start')}
            className="mb-4 min-h-[44px] px-0 text-sm font-medium text-launch-ink/75 hover:text-launch-ink"
            aria-label={cameFromReport ? 'Back to my report' : 'Back to MyRhythm'}
          >
            <ArrowLeft className="h-4 w-4" />
            {cameFromReport ? 'Back to my report' : 'Back to MyRhythm'}
          </Button>

          {cameFromReport && snapshot && (
            <div className="mb-8 rounded-2xl border border-launch-gold/40 bg-launch-ivory px-5 py-5">
              <p className="font-worksans text-xs font-bold uppercase tracking-normal text-launch-teal">
                My snapshot is ready
              </p>
              <p className="mt-2 font-instrument text-3xl text-launch-ink-deep">
                {snapshot.total}/100
                {snapshot.windowStart && snapshot.windowEnd && (
                  <span className="font-worksans text-base font-medium text-launch-ink-deep/70">
                    {' · best window '}
                    {snapshot.windowStart}–{snapshot.windowEnd}
                  </span>
                )}
              </p>
              <p className="mt-3 font-worksans text-sm leading-6 text-launch-ink-deep/75">
                My snapshot stays mine, free. Membership adds the full plan, daily follow-through, and
                Support Circle — completing what the snapshot started.
              </p>
            </div>
          )}

          {needsAuth && (
            <div
              className="mb-6 rounded-2xl border-2 border-launch-gold/50 bg-white px-4 py-4"
              role="alert"
            >
              <p className="font-semibold text-launch-ink">Confirm your details to continue</p>
              <p className="mt-1 text-sm text-launch-ink/70">
                My plan is saved. Sign in and I'll come straight back to this page — nothing to retype.
              </p>
              <Button
                className="mt-3 min-h-[56px] w-full"
                onClick={() => navigate('/launch/register?next=/launch/payment')}
              >
                Confirm and continue
              </Button>
            </div>
          )}


          {checkoutError && (
            <div
              className="mb-6 rounded-2xl border-2 border-launch-ember/50 bg-white px-4 py-4"
              role="alert"
            >
              <p className="font-semibold text-launch-ink">Checkout didn't start</p>
              <p className="mt-1 text-sm text-launch-ink/70">{checkoutError}</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Button
                  className="min-h-[56px] sm:flex-1"
                  onClick={handleStartTrial}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Try again'}
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[56px] sm:flex-1 border-launch-gold/40"
                  onClick={() => {
                    setCheckoutError(null);
                    document.getElementById('access-code-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  Use an access code instead
                </Button>
              </div>
            </div>
          )}

          {IS_TEST_MODE && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border-2 border-launch-ember/40 bg-launch-ember/10 px-4 py-3 flex items-start gap-3"
              role="status"
              aria-live="polite"
            >
              <FlaskConical className="h-5 w-5 text-launch-ember mt-0.5 flex-shrink-0" />
              <div className="text-sm text-launch-ink">
                <p className="font-semibold">Test Mode — no real money moves</p>
                <p>Use an access code to skip payment, or use a Stripe test card below. Real cards will be declined.</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 border-b border-launch-gold/30 pb-8"
          >
            <p className="font-worksans text-xs font-bold uppercase tracking-normal text-launch-teal">
              Founding Edition · 500 places
            </p>
            <h1 className="mt-4 font-instrument text-4xl leading-[1.05] text-launch-ink-deep md:text-6xl">
              Become a Founding Member.
            </h1>
            <p className="mt-5 max-w-2xl font-worksans text-lg leading-8 text-launch-ink-deep/75">
              £10 a month, for as long as I stay a member. My first 7 days are free — a card is needed to start,
              nothing is charged for 7 days, and I can cancel any time from my account.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                aria-pressed={selectedPlan === plan.id}
                className={`min-h-[56px] rounded-2xl border bg-launch-ivory p-7 text-left transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-launch-teal shadow-[0_18px_40px_-26px_hsl(var(--launch-ink-deep)/0.6)] ring-1 ring-launch-teal'
                    : 'border-launch-gold/40 hover:border-launch-gold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-worksans text-sm font-bold uppercase tracking-normal text-launch-ink-deep/70">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Badge variant="outline" className="border-launch-gold/50 bg-launch-gold/15 font-worksans text-launch-ink-deep">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-instrument text-5xl text-launch-ink-deep">{plan.price}</span>
                  <span className="font-worksans text-launch-ink-deep/60">/{plan.interval}</span>
                </div>
                {plan.id === 'yearly' && (
                  <p className="mt-2 font-worksans text-sm text-launch-teal">£7 a month when paid yearly</p>
                )}
                {plan.id === 'monthly' && (
                  <p className="mt-2 font-worksans text-sm text-launch-ink-deep/60">Founding rate, held for life</p>
                )}
              </button>
            ))}
          </motion.div>


          {/* Access code panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card id="access-code-panel" className="bg-launch-ivory border-2 border-launch-gold/30 shadow-md mb-6">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="h-5 w-5 text-launch-moss" />
                  <h3 className="font-semibold text-launch-ink">Have an access code?</h3>
                </div>
                <p className="text-sm text-launch-ink/70 mb-3">
                  Skip payment and unlock full access as a Founding Member.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. TESTER01"
                    className="uppercase tracking-wide"
                    aria-label="Access code"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRedeemCode(); }}
                  />
                  <Button
                    onClick={handleRedeemCode}
                    disabled={isRedeeming || !code.trim()}
                    className="bg-launch-teal hover:bg-[hsl(var(--launch-teal)/0.88)] text-white sm:min-w-[140px]"
                  >
                    {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Redeem code'}
                  </Button>
                </div>

                {isFF && (
                  <div
                    className="mt-4 rounded-xl border-2 border-launch-moss/40 bg-launch-moss/10 px-4 py-3"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-launch-gold/20 text-launch-ink border-launch-gold/40">
                        {friendsFamilyConfig.badge}
                      </Badge>
                      <span className="text-sm font-semibold text-launch-ink">
                        £{friendsFamilyConfig.price.monthly.toFixed(2)}/month
                        {' · '}£{friendsFamilyConfig.price.yearly.toFixed(0)}/year
                      </span>
                    </div>
                    <p className="text-sm text-launch-ink/70">
                      {friendsFamilyConfig.tagline}. Invite-only — {friendsFamilyConfig.maxSeats} seats in total.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-launch-ivory border border-launch-gold/30 shadow-xl mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-launch-ink mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-launch-moss" />
                  Everything included in your trial:
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-launch-moss flex-shrink-0" />
                      <span className="text-sm text-launch-ink/80">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {IS_TEST_MODE && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-4"
            >
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-dashed border-launch-ember/40 bg-launch-ember/10 hover:bg-launch-ember/20">
                    <span className="flex items-center gap-2 text-launch-ink">
                      <FlaskConical className="h-4 w-4" />
                      Show Stripe test cards
                    </span>
                    <ChevronDown className="h-4 w-4 text-launch-ember" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="bg-launch-ivory border border-launch-gold/30">
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-launch-ink mb-2">
                        Any future expiry date, any 3-digit CVC, any postcode. Tap to copy.
                      </p>
                      {testCards.map((c) => (
                        <button
                          key={c.number}
                          onClick={() => copyCard(c.number)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-launch-cream-light hover:bg-launch-gold/10 border border-launch-gold/30 text-left transition"
                        >
                          <div>
                            <p className="font-mono text-sm text-launch-ink">{c.number}</p>
                            <p className="text-xs text-launch-ink/50">{c.label}</p>
                          </div>
                          <Copy className="h-4 w-4 text-launch-ember" />
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-4 pb-8 bg-launch-cream-light border-t border-launch-gold/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="min-h-16 w-full rounded-md bg-launch-teal px-12 font-worksans text-lg font-bold text-primary-foreground shadow-[0_18px_40px_-20px_hsl(var(--launch-ink-deep)/0.6)] hover:bg-launch-ink md:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Start my 7 free days
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-launch-ink/50">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-launch-moss" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-launch-moss" />
              <span>No charge for 7 days</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-launch-moss" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
