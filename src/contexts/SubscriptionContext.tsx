
import React, { createContext, useContext, ReactNode, useState } from 'react';

export interface SubscriptionFeatures {
  // Basic Features (Free tier)
  basicAssessments: boolean;
  simpleMoodTracking: boolean;
  basicCalendar: boolean;
  communityAccess: boolean;
  maxCommunityMembers: number; // Free: 1, Premium: 10, Family: unlimited
  
  // Premium Features
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
  smartScheduling: boolean;
  
  // Family Plan Features
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
  subscription_tier: string;
}

export type SubscriptionTier = 'free' | 'premium' | 'family';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  subscriptionData: SubscriptionData;
  isLoading: boolean;
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
  openCustomerPortal: () => Promise<string>;
  updateSubscription: (newTier: SubscriptionTier) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const getFeaturesByTier = (tier: SubscriptionTier): SubscriptionFeatures => {
  const baseFeatures: SubscriptionFeatures = {
    // Basic Features
    basicAssessments: false,
    simpleMoodTracking: false,
    basicCalendar: false,
    communityAccess: false,
    maxCommunityMembers: 0,
    
  // Premium Features
  advancedSymptomTracking: false,
  fullCalendarManagement: false,
  personalizedInsights: false, // Only available for paid tiers
    prioritySupport: false,
    smartInterventionAlerts: false,
    enhancedSafetyReminders: false,
    objectLocationTracker: false,
    medicationPhotoVerification: false,
    conversationNotes: false,
    readingSupport: false,
    financialSafetyAlerts: false,
    smartScheduling: false,
    
    // Family Plan Features
    multipleAccounts: false,
    sharedCalendars: false,
    caregiverResources: false,
    familySupportGroup: false,
    dedicatedCaseManager: false,
    emergencySupport: false,
    patternRecognition: false,
    processRecording: false,
  };

  switch (tier) {
    case 'free':
      return {
        ...baseFeatures,
        basicAssessments: true,
        simpleMoodTracking: true,
        basicCalendar: true,
        communityAccess: true,
        maxCommunityMembers: 1, // Free tier limited to 1 community member
      };
      
    case 'premium':
      return {
        ...baseFeatures,
        // Basic Features
        basicAssessments: true,
        simpleMoodTracking: true,
        basicCalendar: true,
        communityAccess: true,
        maxCommunityMembers: 10, // Premium tier gets 10 community members
        
        // Premium Features
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
        smartScheduling: true,
      };
      
    case 'family':
      return {
        ...baseFeatures,
        // All Basic and Premium Features
        basicAssessments: true,
        simpleMoodTracking: true,
        basicCalendar: true,
        communityAccess: true,
        maxCommunityMembers: -1, // Family tier gets unlimited community members
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
        smartScheduling: true,
        
        // Family Plan Features
        multipleAccounts: true,
        sharedCalendars: true,
        caregiverResources: true,
        familySupportGroup: true,
        dedicatedCaseManager: true,
        emergencySupport: true,
        patternRecognition: true,
        processRecording: true,
      };
      
    default:
      return baseFeatures;
  }
};

interface SubscriptionProviderProps {
  children: ReactNode;
  tier?: SubscriptionTier;
}

export function SubscriptionProvider({ 
  children, 
  tier: initialTier = 'premium' // Default to premium tier for demo
}: SubscriptionProviderProps) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(initialTier);
  const [demoMode, setDemoMode] = useState(true); // Enable demo mode by default
  const features = getFeaturesByTier(demoMode ? 'premium' : currentTier);
  
  // Mock subscription data for demo
  const subscriptionData: SubscriptionData = {
    subscribed: currentTier !== 'free' || demoMode,
    trial_active: currentTier === 'free' && !demoMode,
    trial_days_left: (currentTier === 'free' && !demoMode) ? 7 : 0,
    subscription_tier: demoMode ? 'premium' : currentTier
  };
  
  const updateSubscription = (newTier: SubscriptionTier) => {
    console.log("SubscriptionContext: Updating subscription tier from", currentTier, "to", newTier);
    setCurrentTier(newTier);
  };
  
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (demoMode) return true; // Demo mode grants all features
    if (feature === 'maxCommunityMembers') {
      return features[feature] > 0 || features[feature] === -1; // -1 means unlimited
    }
    return Boolean(features[feature]);
  };
  
  const upgradeRequired = (feature: keyof SubscriptionFeatures): boolean => {
    return !hasFeature(feature);
  };

  const openCustomerPortal = async (): Promise<string> => {
    // Mock implementation for demo
    return 'https://billing.stripe.com/p/session/test_portal';
  };
  
  return (
    <SubscriptionContext.Provider value={{
      tier: currentTier,
      features,
      subscriptionData,
      isLoading: false,
      hasFeature,
      upgradeRequired,
      openCustomerPortal,
      updateSubscription,
      demoMode,
      setDemoMode
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
