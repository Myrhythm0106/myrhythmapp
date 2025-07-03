
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'basic' | 'premium' | 'family';
export type SubscriptionStatus = 'trial_active' | 'trial_expired' | 'active' | 'canceled' | 'past_due';

export interface SubscriptionData {
  subscribed: boolean;
  trial_active: boolean;
  trial_days_left: number;
  subscription_tier: SubscriptionTier;
  subscription_end?: string;
  status: SubscriptionStatus;
}

export interface SubscriptionFeatures {
  // Basic features (all tiers)
  basicSymptomTracking: boolean;
  limitedCalendar: boolean;
  publicResources: boolean;
  communityAccess: boolean;
  
  // Premium features
  advancedSymptomTracking: boolean;
  fullCalendarManagement: boolean;
  personalizedInsights: boolean;
  prioritySupport: boolean;
  smartInterventionAlerts: boolean;
  enhancedSafetyReminders: boolean;
  objectLocationTracker: boolean;
  medicationPhotoVerification: boolean;
  conversationNotes: boolean;
  readingSupport: boolean;
  financialSafetyAlerts: boolean;
  
  // Family features
  multipleAccounts: boolean;
  sharedCalendars: boolean;
  caregiverResources: boolean;
  familySupportGroup: boolean;
  dedicatedCaseManager: boolean;
  emergencySupport: boolean;
  patternRecognition: boolean;
  processRecording: boolean;
}

interface SubscriptionContextType {
  subscriptionData: SubscriptionData;
  features: SubscriptionFeatures;
  tier: SubscriptionTier;
  isLoading: boolean;
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
  refreshSubscription: () => Promise<void>;
  createCheckoutSession: (planType: SubscriptionTier) => Promise<string>;
  openCustomerPortal: () => Promise<string>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const getFeaturesByTier = (tier: SubscriptionTier, isActive: boolean): SubscriptionFeatures => {
  const basicFeatures = {
    basicSymptomTracking: true,
    limitedCalendar: true,
    publicResources: true,
    communityAccess: true,
    advancedSymptomTracking: false,
    fullCalendarManagement: false,
    personalizedInsights: false,
    prioritySupport: false,
    smartInterventionAlerts: false,
    enhancedSafetyReminders: false,
    objectLocationTracker: false,
    medicationPhotoVerification: false,
    conversationNotes: false,
    readingSupport: false,
    financialSafetyAlerts: false,
    multipleAccounts: false,
    sharedCalendars: false,
    caregiverResources: false,
    familySupportGroup: false,
    dedicatedCaseManager: false,
    emergencySupport: false,
    patternRecognition: false,
    processRecording: false,
  };

  // During trial or active subscription, unlock features based on tier
  if (isActive || tier === 'premium') {
    if (tier === 'premium' || tier === 'family') {
      return {
        ...basicFeatures,
        advancedSymptomTracking: true,
        fullCalendarManagement: true,
        personalizedInsights: true,
        prioritySupport: true,
        smartInterventionAlerts: true,
        enhancedSafetyReminders: true,
        objectLocationTracker: true,
        medicationPhotoVerification: true,
        conversationNotes: true,
        readingSupport: true,
        financialSafetyAlerts: true,
        multipleAccounts: tier === 'family',
        sharedCalendars: tier === 'family',
        caregiverResources: tier === 'family',
        familySupportGroup: tier === 'family',
        dedicatedCaseManager: tier === 'family',
        emergencySupport: tier === 'family',
        patternRecognition: tier === 'family',
        processRecording: tier === 'family',
      };
    }
  }

  return basicFeatures;
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    trial_active: false,
    trial_days_left: 0,
    subscription_tier: 'premium',
    status: 'trial_expired'
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscriptionData({
        subscribed: false,
        trial_active: false,
        trial_days_left: 0,
        subscription_tier: 'premium',
        status: 'trial_expired'
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      const newData: SubscriptionData = {
        subscribed: data.subscribed || false,
        trial_active: data.trial_active || false,
        trial_days_left: data.trial_days_left || 0,
        subscription_tier: data.subscription_tier || 'premium',
        subscription_end: data.subscription_end,
        status: data.trial_active ? 'trial_active' : 
                data.subscribed ? 'active' : 'trial_expired'
      };

      setSubscriptionData(newData);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Default to trial for new users
      setSubscriptionData({
        subscribed: false,
        trial_active: true,
        trial_days_left: 7,
        subscription_tier: 'premium',
        status: 'trial_active'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (planType: SubscriptionTier): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan_type: planType },
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) throw error;
    return data.url;
  };

  const openCustomerPortal = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) throw error;
    return data.url;
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const isActive = subscriptionData.subscribed || subscriptionData.trial_active;
  const features = getFeaturesByTier(subscriptionData.subscription_tier, isActive);

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return features[feature];
  };

  const upgradeRequired = (feature: keyof SubscriptionFeatures): boolean => {
    return !hasFeature(feature);
  };

  return (
    <SubscriptionContext.Provider value={{
      subscriptionData,
      features,
      tier: subscriptionData.subscription_tier,
      isLoading,
      hasFeature,
      upgradeRequired,
      refreshSubscription,
      createCheckoutSession,
      openCustomerPortal
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
