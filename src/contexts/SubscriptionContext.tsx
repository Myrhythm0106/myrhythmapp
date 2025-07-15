
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SubscriptionFeatures {
  personalizedInsights: boolean;
  familyAccess: boolean;
  premiumContent: boolean;
  advancedSymptomTracking: boolean;
  fullCalendarManagement: boolean;
  prioritySupport: boolean;
  smartInterventionAlerts: boolean;
  enhancedSafetyReminders: boolean;
  objectLocationTracker: boolean;
  medicationPhotoVerification: boolean;
  conversationNotes: boolean;
  readingSupport: boolean;
  financialSafetyAlerts: boolean;
  multipleAccounts: boolean;
  sharedCalendars: boolean;
  caregiverResources: boolean;
  familySupportGroup: boolean;
  dedicatedCaseManager: boolean;
  emergencySupport: boolean;
  patternRecognition: boolean;
  processRecording: boolean;
}

export interface SubscriptionData {
  subscribed: boolean;
  trial_active: boolean;
  trial_days_left: number;
  subscription_tier: 'free' | 'premium' | 'family';
  subscription_end?: string;
}

interface SubscriptionContextType {
  tier: 'free' | 'premium' | 'family';
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  subscriptionData: SubscriptionData;
  isLoading: boolean;
  openCustomerPortal: () => Promise<string>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<'free' | 'premium' | 'family'>('free');
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionData: SubscriptionData = {
    subscribed: tier !== 'free',
    trial_active: isTrialActive,
    trial_days_left: trialDaysLeft,
    subscription_tier: tier,
  };

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    switch (feature) {
      case 'personalizedInsights':
      case 'premiumContent':
      case 'advancedSymptomTracking':
      case 'fullCalendarManagement':
      case 'prioritySupport':
      case 'smartInterventionAlerts':
      case 'enhancedSafetyReminders':
      case 'objectLocationTracker':
      case 'medicationPhotoVerification':
      case 'conversationNotes':
      case 'readingSupport':
      case 'financialSafetyAlerts':
        return tier === 'premium' || tier === 'family';
      case 'familyAccess':
      case 'multipleAccounts':
      case 'sharedCalendars':
      case 'caregiverResources':
      case 'familySupportGroup':
      case 'dedicatedCaseManager':
      case 'emergencySupport':
      case 'patternRecognition':
      case 'processRecording':
        return tier === 'family';
      default:
        return false;
    }
  };

  const openCustomerPortal = async (): Promise<string> => {
    // Mock implementation - in real app this would call Stripe
    return Promise.resolve('https://billing.stripe.com/session/example');
  };

  return (
    <SubscriptionContext.Provider value={{ 
      tier, 
      hasFeature, 
      isTrialActive, 
      trialDaysLeft,
      subscriptionData,
      isLoading,
      openCustomerPortal
    }}>
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
