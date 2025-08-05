import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { RecordingLimitDialog } from './RecordingLimitDialog';
import { Mic, TrendingUp, Crown, AlertTriangle } from 'lucide-react';

interface RecordingUsageTrackerProps {
  onUpgradePrompt?: () => void;
}

export function RecordingUsageTracker({ onUpgradePrompt }: RecordingUsageTrackerProps) {
  const { tier, features, upgradeRequired } = useSubscription();
  const [currentUsage, setCurrentUsage] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const monthlyLimit = features.monthlyRecordings;
  const isUnlimited = monthlyLimit === -1;
  const usagePercentage = isUnlimited ? 0 : (currentUsage / monthlyLimit) * 100;

  useEffect(() => {
    fetchCurrentUsage();
  }, []);

  const fetchCurrentUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (error) throw error;

      setCurrentUsage(data?.length || 0);
    } catch (error) {
      console.error('Error fetching recording usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingAttempt = () => {
    if (isUnlimited || currentUsage < monthlyLimit) {
      return true; // Allow recording
    } else {
      setShowLimitDialog(true);
      return false; // Block recording
    }
  };

  const getUsageColor = () => {
    if (isUnlimited) return 'text-emerald-600';
    if (usagePercentage >= 90) return 'text-red-600';
    if (usagePercentage >= 75) return 'text-orange-600';
    return 'text-memory-emerald';
  };

  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 75) return 'bg-orange-500';
    return 'bg-memory-emerald';
  };

  if (loading) {
    return (
      <Card className="border-memory-emerald/20">
        <CardContent className="pt-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`border-2 ${usagePercentage >= 90 ? 'border-red-200' : 'border-memory-emerald/20'} 
                      ${usagePercentage >= 90 ? 'bg-red-50 dark:bg-red-900/10' : 'bg-memory-emerald/5'}`}>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className={`h-4 w-4 ${getUsageColor()}`} />
                <span className="font-medium">Recording Usage</span>
              </div>
              <Badge variant={tier === 'free' ? 'secondary' : tier === 'premium' ? 'default' : 'destructive'}>
                {tier === 'free' ? 'MyRhythm Align' : 
                 tier === 'premium' ? 'MyRhythm Flow' : 'MyRhythm Thrive'}
              </Badge>
            </div>

            {!isUnlimited && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={getUsageColor()}>
                      {currentUsage} of {monthlyLimit} recordings used
                    </span>
                    <span className="text-muted-foreground">
                      {Math.max(0, monthlyLimit - currentUsage)} remaining
                    </span>
                  </div>
                  <Progress 
                    value={usagePercentage} 
                    className="h-2"
                    style={{
                      background: usagePercentage >= 90 ? 'rgb(254 226 226)' : 'rgb(240 253 244)'
                    }}
                  />
                </div>

                {usagePercentage >= 75 && (
                  <div className={`flex items-center gap-2 p-2 rounded-md ${
                    usagePercentage >= 90 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      usagePercentage >= 90 ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      usagePercentage >= 90 ? 'text-red-800 dark:text-red-200' : 'text-orange-800 dark:text-orange-200'
                    }`}>
                      {usagePercentage >= 90 ? 
                        'Recording limit reached! Upgrade to continue.' : 
                        'Approaching recording limit. Consider upgrading.'}
                    </span>
                  </div>
                )}
              </>
            )}

            {isUnlimited && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/20">
                <Crown className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Unlimited recordings • {currentUsage} this month
                </span>
              </div>
            )}

            {usagePercentage >= 90 && (
              <Button 
                onClick={() => setShowLimitDialog(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade for More Recordings
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <RecordingLimitDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        currentUsage={currentUsage}
      />
    </>
  );
}

// Export the recording check function for use in other components
export { RecordingUsageTracker as default };