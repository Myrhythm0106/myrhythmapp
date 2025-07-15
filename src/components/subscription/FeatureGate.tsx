
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Users } from 'lucide-react';
import { useSubscription, SubscriptionFeatures } from '@/contexts/SubscriptionContext';

interface FeatureGateProps {
  feature: keyof SubscriptionFeatures;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: FeatureGateProps) {
  const { hasFeature, tier } = useSubscription();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const getRequiredTier = (feature: keyof SubscriptionFeatures): string => {
    const premiumFeatures: (keyof SubscriptionFeatures)[] = [
      'advancedSymptomTracking', 'fullCalendarManagement', 'personalizedInsights',
      'prioritySupport', 'smartInterventionAlerts', 'enhancedSafetyReminders',
      'objectLocationTracker', 'medicationPhotoVerification', 'conversationNotes',
      'readingSupport', 'financialSafetyAlerts'
    ];
    
    const familyFeatures: (keyof SubscriptionFeatures)[] = [
      'multipleAccounts', 'sharedCalendars', 'caregiverResources',
      'familySupportGroup', 'dedicatedCaseManager', 'emergencySupport',
      'patternRecognition', 'processRecording'
    ];

    if (familyFeatures.includes(feature)) return 'family';
    if (premiumFeatures.includes(feature)) return 'premium';
    return 'basic';
  };

  const requiredTier = getRequiredTier(feature);
  const tierInfo = {
    premium: { icon: Crown, name: 'Premium', color: 'bg-yellow-100 text-yellow-800' },
    family: { icon: Users, name: 'Family', color: 'bg-purple-100 text-purple-800' }
  };

  const info = tierInfo[requiredTier as keyof typeof tierInfo];
  if (!info) return null;

  const Icon = info.icon;

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center mb-2">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
        <Badge className={info.color}>
          <Icon className="h-3 w-3 mr-1" />
          {info.name} Required
        </Badge>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          This feature is available with {info.name} subscription.
        </p>
        <Button variant="outline" size="sm">
          Upgrade to {info.name}
        </Button>
      </CardContent>
    </Card>
  );
}
