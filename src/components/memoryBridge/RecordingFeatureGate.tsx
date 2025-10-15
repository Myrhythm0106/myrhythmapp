import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface RecordingFeatureGateProps {
  children: React.ReactNode;
  recordingCount: number;
}

export function RecordingFeatureGate({ children, recordingCount }: RecordingFeatureGateProps) {
  const navigate = useNavigate();
  const { tier, features, subscriptionData } = useSubscription();

  // Unlimited recordings for premium tiers
  if (features.memoryBridgeRecordings === -1) {
    return <>{children}</>;
  }

  // Check if limit reached
  const monthlyLimit = features.memoryBridgeRecordings;
  const hasReachedLimit = recordingCount >= monthlyLimit;

  if (hasReachedLimit) {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Lock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-center">
            Recording Limit Reached
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You've used all {monthlyLimit} recordings this month with the free plan.
            </p>
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Upgrade to get:</h4>
              <ul className="text-sm text-left space-y-1">
                <li>✓ Unlimited recordings</li>
                <li>✓ Full "Next Steps" extraction</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Support circle (up to 5 members)</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/subscribe')}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>

          {subscriptionData.trial_active && (
            <p className="text-xs text-center text-muted-foreground">
              {subscriptionData.trial_days_left} days left in your trial
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show remaining recordings count
  const remainingRecordings = monthlyLimit - recordingCount;

  return (
    <div className="space-y-4">
      {tier === 'free' && remainingRecordings <= 1 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-orange-900">
                  {remainingRecordings} recording{remainingRecordings !== 1 ? 's' : ''} left this month
                </p>
                <p className="text-sm text-orange-700">
                  Upgrade for unlimited recordings
                </p>
              </div>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => navigate('/subscribe')}
                className="border-orange-300"
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {children}
    </div>
  );
}
