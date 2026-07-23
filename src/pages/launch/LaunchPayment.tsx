import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Check, Shield, CreditCard, ArrowRight, ArrowLeft, Loader2, Sparkles, KeyRound, Copy, ChevronDown, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  'Unlimited recordings & storage',
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
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeemCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error('Enter an access code first');
      return;
    }
    setIsRedeeming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in first');
        navigate('/launch/register');
        return;
      }
      const { data, error } = await supabase.rpc('redeem_access_code', { p_code: trimmed });
      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result?.success) {
        toast.error(redeemErrorCopy[result?.error || ''] || 'Could not redeem that code.');
        return;
      }
      toast.success("You're in! Welcome, Founding Member.");
      navigate('/launch/welcome');
    } catch (err: any) {
      console.error('Redeem error:', err);
      toast.error(err.message || 'Could not redeem that code.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to continue');
        navigate('/launch/register');
        return;
      }
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
      toast.error(err.message || 'Failed to start checkout');
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
    <div className="min-h-screen h-screen bg-launch-cream-light flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/launch/welcome')}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-launch-ink/70 hover:text-launch-ink transition-colors"
            aria-label="Back to your results"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to your results
          </button>

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
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-launch-ink rounded-2xl ring-1 ring-launch-gold/50 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-launch-ink mb-2 font-display">
              Start your 7-day free trial
            </h1>
            <p className="text-lg text-launch-ink/70 max-w-xl mx-auto">
              Card required to start — you won't be charged for 7 days, and you can cancel anytime from Account.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-4 mb-6"
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-2 border-launch-moss shadow-lg bg-launch-ivory'
                    : 'border-2 border-transparent hover:border-launch-gold/40 bg-launch-ivory'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-launch-ink">{plan.name}</h3>
                    {plan.popular && (
                      <Badge variant="outline" className="bg-launch-gold/20 text-launch-ink border-launch-gold/40 hover:bg-launch-gold/30">{plan.savings}</Badge>
                    )}


                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-launch-ink">{plan.price}</span>
                    <span className="text-launch-ink/50">/{plan.interval}</span>
                  </div>
                  {plan.id === 'yearly' && (
                    <p className="text-sm text-launch-moss mt-1">£7/month when billed yearly</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Access code panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-launch-ivory border-2 border-launch-gold/30 shadow-md mb-6">
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
                    className="bg-launch-ink hover:bg-launch-ink/90 text-launch-cream sm:min-w-[140px]"
                  >
                    {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Redeem code'}
                  </Button>
                </div>
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

      <div className="flex-shrink-0 px-4 py-4 pb-8 bg-launch-cream-light border-t border-launch-gold/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full md:w-auto bg-launch-ink hover:bg-launch-ink/90 text-launch-cream px-12 py-6 text-lg shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Start 7-Day Free Trial
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
