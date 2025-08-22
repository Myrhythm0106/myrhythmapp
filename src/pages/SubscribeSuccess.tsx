import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Gift, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { trackSubscriptionAnalytics } from '@/utils/analytics';

const SubscribeSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const analytics = trackSubscriptionAnalytics();

  const sessionId = searchParams.get('session_id');
  const isFoundingMember = searchParams.get('fm') === '1';

  useEffect(() => {
    const refreshSubscription = async () => {
      try {
        // Call check-subscription to refresh the user's subscription status
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          toast.error('Error verifying subscription status');
        } else {
          setSubscriptionData(data);
          
          // Track successful checkout
          if (data) {
            analytics.checkoutSuccess(
              data.subscription_tier || 'unknown',
              'yearly', // We'll assume yearly for now, could be enhanced
              isFoundingMember,
              isFoundingMember ? 20 : 0
            );
          }
          
          toast.success(
            isFoundingMember 
              ? 'Welcome, Founding Member! Your subscription is now active.' 
              : 'Subscription activated successfully!'
          );
        }
      } catch (error) {
        console.error('Subscription refresh failed:', error);
        toast.error('Error verifying subscription');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      refreshSubscription();
    } else {
      setLoading(false);
    }
  }, [sessionId, isFoundingMember]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Processing your subscription...</h2>
            <p className="text-sm text-slate-600 text-center">
              Please wait while we verify your payment and set up your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-slate-800">
            {isFoundingMember ? 'Welcome, Founding Member!' : 'Subscription Activated!'}
          </CardTitle>
          {isFoundingMember && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 mx-auto mt-2 flex items-center gap-1 w-fit">
              <Gift className="h-3 w-3" />
              Founding Member
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Your MyRhythm journey starts now!
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {isFoundingMember 
                ? 'Thank you for being an early supporter. You\'ve unlocked exclusive Founding Member benefits and 20% savings!'
                : 'Your subscription has been activated and you now have access to all premium features.'
              }
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-2">What's next?</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Complete your LEAP assessment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Set up your Support Circle (3 members included)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Explore Memory Bridge and goal setting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Start building your daily rhythm
              </li>
            </ul>
          </div>

          {subscriptionData && (
            <div className="text-center text-sm text-slate-500">
              Plan: {subscriptionData.subscription_tier || 'Premium'} • 
              Status: {subscriptionData.subscribed ? 'Active' : 'Pending'}
            </div>
          )}

          <Button 
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg"
          >
            Continue to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribeSuccess;