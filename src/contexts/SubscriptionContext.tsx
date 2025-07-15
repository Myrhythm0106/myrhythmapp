
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionContextType {
  tier: 'free' | 'premium' | 'family';
  hasFeature: (feature: string) => boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<'free' | 'premium' | 'family'>('free');
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  const hasFeature = (feature: string): boolean => {
    switch (feature) {
      case 'personalizedInsights':
        return tier === 'premium' || tier === 'family';
      case 'familyAccess':
        return tier === 'family';
      case 'premiumContent':
        return tier === 'premium' || tier === 'family';
      default:
        return false;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ tier, hasFeature, isTrialActive, trialDaysLeft }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
