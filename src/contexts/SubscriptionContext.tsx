
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'basic' | 'premium' | 'family';

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
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  isLoading: boolean;
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const getFeaturesByTier = (tier: SubscriptionTier): SubscriptionFeatures => {
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

  if (tier === 'premium') {
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
    };
  }

  if (tier === 'family') {
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
      multipleAccounts: true,
      sharedCalendars: true,
      caregiverResources: true,
      familySupportGroup: true,
      dedicatedCaseManager: true,
      emergencySupport: true,
      patternRecognition: true,
      processRecording: true,
    };
  }

  return basicFeatures;
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('basic');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTier('basic');
      setIsLoading(false);
      return;
    }

    // In a real app, fetch from Supabase profiles table
    // For now, set to premium for testing
    setTier('premium');
    setIsLoading(false);
  }, [user]);

  const features = getFeaturesByTier(tier);

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return features[feature];
  };

  const upgradeRequired = (feature: keyof SubscriptionFeatures): boolean => {
    return !hasFeature(feature);
  };

  return (
    <SubscriptionContext.Provider value={{
      tier,
      features,
      isLoading,
      hasFeature,
      upgradeRequired
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
