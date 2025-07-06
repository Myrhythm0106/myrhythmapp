
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Crown, CreditCard, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

export function TrialStatusCard() {
  const { subscriptionData, openCustomerPortal, isLoading } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      const portalUrl = await openCustomerPortal();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Unable to open subscription management. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptionData.subscribed && !subscriptionData.trial_active) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Crown className="h-5 w-5" />
            Active Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 mb-4">
            Your {subscriptionData.subscription_tier} plan is active and ready to help you build momentum.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManageSubscription}
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (subscriptionData.trial_active) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Clock className="h-5 w-5" />
            Free Trial Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 mb-2">
            <strong>{subscriptionData.trial_days_left} days</strong> remaining in your free trial
          </p>
          <p className="text-xs text-blue-600 mb-4">
            Enjoy full access to all MyRhythm features. Your subscription will start automatically when the trial ends.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManageSubscription}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Trial Expired
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-orange-700 mb-4">
          Your free trial has ended. Subscribe to continue your MyRhythm journey and unlock all features.
        </p>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleManageSubscription}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Crown className="h-4 w-4 mr-2" />
          Subscribe Now
        </Button>
      </CardContent>
    </Card>
  );
}
