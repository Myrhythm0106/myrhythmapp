import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, TrendingUp, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UsageLimitCardProps {
  currentUsage: number;
  feature: 'memoryBridgeRecordings';
  onUpgrade: () => void;
}

export function UsageLimitCard({ currentUsage, feature, onUpgrade }: UsageLimitCardProps) {
  const { features, tier } = useSubscription();
  
  const limit = features[feature] as number;
  const isUnlimited = limit === -1;
  const usagePercentage = isUnlimited ? 0 : Math.min((currentUsage / limit) * 100, 100);
  const isAtLimit = !isUnlimited && currentUsage >= limit;
  const isNearLimit = !isUnlimited && currentUsage >= limit * 0.8;

  // Don't show for unlimited plans
  if (isUnlimited) return null;

  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'memoryBridgeRecordings':
        return 'Memory Bridge Recordings';
      default:
        return feature;
    }
  };

  const getUpgradeMessage = () => {
    if (tier === 'free') {
      return 'Upgrade to Starter for unlimited recordings';
    }
    return 'Upgrade for unlimited access';
  };

  const getVariant = () => {
    if (isAtLimit) return 'destructive';
    if (isNearLimit) return 'warning';
    return 'default';
  };

  return (
    <Card className={`border-2 ${
      isAtLimit ? 'border-red-200 bg-red-50' : 
      isNearLimit ? 'border-orange-200 bg-orange-50' : 
      'border-teal-200 bg-teal-50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isAtLimit ? <Lock className="h-5 w-5 text-red-600" /> : <TrendingUp className="h-5 w-5 text-teal-600" />}
            {getFeatureName(feature)} Usage
          </CardTitle>
          <Badge variant={getVariant()}>
            {currentUsage}/{limit} used
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">This month</span>
            <span className={`font-medium ${
              isAtLimit ? 'text-red-600' : 
              isNearLimit ? 'text-orange-600' : 
              'text-teal-600'
            }`}>
              {usagePercentage.toFixed(0)}% used
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${
              isAtLimit ? '[&>div]:bg-red-500' : 
              isNearLimit ? '[&>div]:bg-orange-500' : 
              '[&>div]:bg-teal-500'
            }`}
          />
        </div>

        {isAtLimit && (
          <div className="text-center p-4 bg-white rounded-lg border border-red-200">
            <Lock className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium mb-2">
              Monthly limit reached
            </p>
            <p className="text-xs text-red-600 mb-3">
              You've used all {limit} recordings this month. Upgrade for unlimited access.
            </p>
            <Button 
              onClick={onUpgrade}
              size="sm"
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              {getUpgradeMessage()}
            </Button>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700 font-medium mb-2">
              Almost at your monthly limit
            </p>
            <p className="text-xs text-orange-600 mb-3">
              Only {limit - currentUsage} recordings left this month.
            </p>
            <Button 
              onClick={onUpgrade}
              variant="outline"
              size="sm"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}