
import React, { createContext, useContext, ReactNode, useState } from 'react';

export interface SubscriptionFeatures {
  // Memory Bridge Features
  memoryBridgeRecordings: number; // Free: 3/month, Starter: unlimited
  basicACTReports: boolean;
  fullACTReports: boolean;
  
  // Assessment Features
  briefAssessment: boolean;
  fullAssessment: boolean;
  cognitiveInsights: boolean;
  
  // Support Circle Features
  maxSupportCircleMembers: number; // Free: 1, Starter: 3, SMART Pro: 5, Family: unlimited
  basicSupportNotifications: boolean;
  advancedSupportNotifications: boolean;
  
  // Calendar & Scheduling Features
  basicCalendar: boolean;
  smartScheduling: boolean; // SMART Pro feature
  externalCalendarSync: boolean; // SMART Pro feature
  scheduleOptimization: boolean; // SMART Pro feature
  conflictDetection: boolean; // SMART Pro feature
  
  // Analytics & Progress Features
  basicProgressTracking: boolean;
  advancedAnalytics: boolean; // SMART Pro feature
  cognitiveProgressReports: boolean; // SMART Pro feature
  familyProgressDashboard: boolean; // Family feature
  
  // Family Features
  multipleAccounts: boolean; // Family feature
  sharedFamilyCalendar: boolean; // Family feature
  careCoordination: boolean; // Family feature
  familyInsights: boolean; // Family feature
  prioritySupport: boolean; // SMART Pro & Family feature
}

export interface SubscriptionData {
  subscribed: boolean;
  trial_active: boolean;
  trial_days_left: number;
  subscription_tier: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'smart_pro' | 'family_smart';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  subscriptionData: SubscriptionData;
  isLoading: boolean;
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
  openCustomerPortal: () => Promise<string>;
  updateSubscription: (newTier: SubscriptionTier) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const getFeaturesByTier = (tier: SubscriptionTier): SubscriptionFeatures => {
  const baseFeatures: SubscriptionFeatures = {
    // Memory Bridge Features
    memoryBridgeRecordings: 0,
    basicACTReports: false,
    fullACTReports: false,
    
    // Assessment Features
    briefAssessment: false,
    fullAssessment: false,
    cognitiveInsights: false,
    
    // Support Circle Features
    maxSupportCircleMembers: 0,
    basicSupportNotifications: false,
    advancedSupportNotifications: false,
    
    // Calendar & Scheduling Features
    basicCalendar: false,
    smartScheduling: false,
    externalCalendarSync: false,
    scheduleOptimization: false,
    conflictDetection: false,
    
    // Analytics & Progress Features
    basicProgressTracking: false,
    advancedAnalytics: false,
    cognitiveProgressReports: false,
    familyProgressDashboard: false,
    
    // Family Features
    multipleAccounts: false,
    sharedFamilyCalendar: false,
    careCoordination: false,
    familyInsights: false,
    prioritySupport: false,
  };

  switch (tier) {
    case 'free':
      return {
        ...baseFeatures,
        memoryBridgeRecordings: 3, // 3 recordings per month
        basicACTReports: true,
        briefAssessment: true,
        maxSupportCircleMembers: 1,
        basicCalendar: true,
        basicProgressTracking: true,
        basicSupportNotifications: true,
      };
      
    case 'starter':
      return {
        ...baseFeatures,
        memoryBridgeRecordings: -1, // Unlimited recordings
        basicACTReports: true,
        fullACTReports: true,
        briefAssessment: true,
        fullAssessment: true,
        maxSupportCircleMembers: 3,
        basicCalendar: true,
        basicProgressTracking: true,
        basicSupportNotifications: true,
        cognitiveInsights: true,
      };
      
    case 'smart_pro':
      return {
        ...baseFeatures,
        memoryBridgeRecordings: -1, // Unlimited recordings
        basicACTReports: true,
        fullACTReports: true,
        briefAssessment: true,
        fullAssessment: true,
        cognitiveInsights: true,
        maxSupportCircleMembers: 5,
        basicSupportNotifications: true,
        advancedSupportNotifications: true,
        basicCalendar: true,
        smartScheduling: true, // KEY DIFFERENTIATOR
        externalCalendarSync: true,
        scheduleOptimization: true,
        conflictDetection: true,
        basicProgressTracking: true,
        advancedAnalytics: true,
        cognitiveProgressReports: true,
        prioritySupport: true,
      };
      
    case 'family_smart':
      return {
        ...baseFeatures,
        memoryBridgeRecordings: -1, // Unlimited recordings
        basicACTReports: true,
        fullACTReports: true,
        briefAssessment: true,
        fullAssessment: true,
        cognitiveInsights: true,
        maxSupportCircleMembers: -1, // Unlimited family members
        basicSupportNotifications: true,
        advancedSupportNotifications: true,
        basicCalendar: true,
        smartScheduling: true,
        externalCalendarSync: true,
        scheduleOptimization: true,
        conflictDetection: true,
        basicProgressTracking: true,
        advancedAnalytics: true,
        cognitiveProgressReports: true,
        familyProgressDashboard: true,
        multipleAccounts: true,
        sharedFamilyCalendar: true,
        careCoordination: true,
        familyInsights: true,
        prioritySupport: true,
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
  tier: initialTier = 'free' // Default to free tier for demo
}: SubscriptionProviderProps) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(initialTier);
  const features = getFeaturesByTier(currentTier);
  
  // Mock subscription data for demo
  const subscriptionData: SubscriptionData = {
    subscribed: currentTier !== 'free',
    trial_active: currentTier === 'free',
    trial_days_left: currentTier === 'free' ? 7 : 0,
    subscription_tier: currentTier
  };
  
  const updateSubscription = (newTier: SubscriptionTier) => {
    console.log("SubscriptionContext: Updating subscription tier from", currentTier, "to", newTier);
    setCurrentTier(newTier);
  };
  
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (feature === 'maxSupportCircleMembers' || feature === 'memoryBridgeRecordings') {
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
      updateSubscription
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
