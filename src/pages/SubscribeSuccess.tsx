import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Gift, Loader2, ArrowRight, Target, User, Compass, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { trackSubscriptionAnalytics } from '@/utils/analytics';

const SubscribeSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer'>('guided');
  const [selectedAssessment, setSelectedAssessment] = useState<'brief' | 'comprehensive'>('brief');
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
              'yearly',
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

  const handleStartAssessment = () => {
    // Navigate to assessment with selected parameters
    navigate(`/mvp/assessment-flow?type=${selectedAssessment}&path=${selectedPath}&flow=post-payment`);
  };

  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewLifeTimeline = () => {
    navigate('/life-empowerment-guide');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-slate-800">
            🎉 Congratulations!
          </CardTitle>
          <p className="text-lg text-slate-600 mt-2">
            {isFoundingMember ? 'Welcome, Founding Member!' : 'Your MyRhythm subscription is now active!'}
          </p>
          {isFoundingMember && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 mx-auto mt-2 flex items-center gap-1 w-fit">
              <Gift className="h-3 w-3" />
              Founding Member - 20% Savings
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Path Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 text-center">Choose Your Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPath('guided')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedPath === 'guided'
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Guided</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <p className="text-sm">Step-by-step support with personalized guidance</p>
              </button>
              
              <button
                onClick={() => setSelectedPath('explorer')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedPath === 'explorer'
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="h-5 w-5" />
                  <span className="font-medium">Explorer</span>
                </div>
                <p className="text-sm">Freedom to discover features at your own pace</p>
              </button>
            </div>
          </div>

          {/* Assessment Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 text-center">Start Your Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedAssessment('brief')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedAssessment === 'brief'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Brief Assessment</span>
                </div>
                <p className="text-sm">5-10 minutes • Quick insights</p>
              </button>
              
              <button
                onClick={() => setSelectedAssessment('comprehensive')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedAssessment === 'comprehensive'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Comprehensive</span>
                </div>
                <p className="text-sm">15-20 minutes • Detailed analysis</p>
              </button>
            </div>
          </div>

          {/* Next Steps Preview */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              What happens next?
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span>Complete your {selectedAssessment} assessment ({selectedPath} approach)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span>Set up your personalized dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span>Connect with your support community (3 members included)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span>Start building your daily rhythm</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleStartAssessment}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg text-lg py-3"
            >
              Start {selectedAssessment === 'brief' ? 'Brief' : 'Comprehensive'} Assessment
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleViewLifeTimeline}
                variant="outline"
                className="flex-1"
              >
                View Life Timeline
              </Button>
              
              <Button 
                onClick={handleContinueToDashboard}
                variant="ghost"
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Continue to Dashboard
              </Button>
            </div>
          </div>

          {subscriptionData && (
            <div className="text-center text-sm text-slate-500 pt-4 border-t">
              Plan: {subscriptionData.subscription_tier || 'Premium'} • 
              Status: {subscriptionData.subscribed ? 'Active' : 'Pending'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribeSuccess;