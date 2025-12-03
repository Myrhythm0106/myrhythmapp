import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Check, Shield, CreditCard, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£10',
    interval: 'month',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£84',
    interval: 'year',
    popular: true,
    savings: 'Save 30%',
  },
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

export default function LaunchPayment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

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
        body: {
          plan: 'premium',
          interval,
          userType,
        },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-brand-teal-500 via-brand-emerald-500 to-brand-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Start Your 7-Day Free Trial
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Try MyRhythm risk-free. Your card won't be charged for 7 days. Cancel anytime.
          </p>
        </motion.div>

        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-2 border-brand-emerald-500 shadow-lg bg-white'
                  : 'border-2 border-transparent hover:border-gray-200 bg-white/80'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  {plan.popular && (
                    <Badge className="bg-brand-emerald-100 text-brand-emerald-700">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                {plan.id === 'yearly' && (
                  <p className="text-sm text-brand-emerald-600 mt-1">
                    £7/month when billed yearly
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-emerald-500" />
                Everything included in your trial:
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 hover:from-brand-emerald-600 hover:to-brand-teal-600 text-white px-12 py-6 text-lg shadow-lg"
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

          {/* Trust signals */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>No charge for 7 days</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
