import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrialStatusProps {
  className?: string;
}

export function TrialStatus({ className }: TrialStatusProps) {
  const [trialInfo, setTrialInfo] = useState<{
    daysRemaining: number;
    endDate: string;
    planType: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTrialStatus();
  }, []);

  const checkTrialStatus = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: trials, error } = await supabase
        .from('trial_subscriptions')
        .select('trial_end_date, plan_type')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching trial status:', error);
        return;
      }

      if (trials && trials.length > 0) {
        const trial = trials[0];
        const endDate = new Date(trial.trial_end_date);
        const today = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysRemaining > 0) {
          setTrialInfo({
            daysRemaining,
            endDate: endDate.toLocaleDateString(),
            planType: trial.plan_type
          });
        }
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  if (loading || !trialInfo) {
    return null;
  }

  return (
    <Card className={`border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-900">Free Trial Active</span>
                <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                  {trialInfo.daysRemaining} days left
                </Badge>
              </div>
              <p className="text-sm text-amber-700">
                Your {trialInfo.planType} trial ends on {trialInfo.endDate}
              </p>
            </div>
          </div>
          <Button
            onClick={handleManageSubscription}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}