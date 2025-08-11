import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useRecordingLimits } from '@/hooks/memoryBridge/useRecordingLimits';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AlertTriangle, Crown, Clock, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function RecordingLimitsWarning() {
  const { usage, limits, getDeletionCountdown } = useRecordingLimits();
  const { tier } = useSubscription();
  
  const daysLeft = getDeletionCountdown();
  const isFreeTier = tier === 'free';
  
  if (!isFreeTier || !usage || daysLeft === null) {
    return null;
  }

  const handleSwipeUpgrade = () => {
    toast.success('Swipe to upgrade and save your recordings permanently!');
  };

  const handleSwipeSave = () => {
    toast.info('Upgrade now to save this recording forever');
  };

  if (daysLeft <= 2) {
    return (
      <SwipeableContainer
        onSwipeRight={{
          label: 'Save Forever',
          icon: <Heart className="h-4 w-4" />,
          color: '#ef4444',
          action: handleSwipeSave
        }}
        enableHorizontalSwipe={true}
        className="mb-4"
      >
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 text-sm">
                  ⚠️ Recordings Will Be Deleted in {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'}!
                </h3>
                <p className="text-red-700 text-xs mt-1">
                  Your empowerment sessions will be permanently deleted unless you upgrade.
                </p>
                <div className="bg-white/50 rounded-lg p-3 mt-3 border border-red-200">
                  <p className="text-xs text-red-600 font-medium">
                    💡 Swipe right to save permanently • Upgrade to Taste & See
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeableContainer>
    );
  }

  if (daysLeft <= 5) {
    return (
      <SwipeableContainer
        onSwipeRight={{
          label: 'Upgrade',
          icon: <Crown className="h-4 w-4" />,
          color: '#f59e0b',
          action: handleSwipeUpgrade
        }}
        enableHorizontalSwipe={true}
        className="mb-4"
      >
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 text-sm">
                  {daysLeft} Days Until Your Sessions Are Deleted
                </h3>
                <p className="text-amber-700 text-xs mt-1">
                  Free tier recordings are automatically deleted after 7 days.
                </p>
                <div className="bg-white/50 rounded-lg p-2 mt-2 border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium">
                    💡 Swipe right to keep them forever with Taste & See
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeableContainer>
    );
  }

  return null;
}