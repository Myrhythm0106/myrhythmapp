
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  
  // Brain Games Features
  brainGamesAccess: 'none' | 'basic' | 'intermediate' | 'full'; // Free: basic, Starter: intermediate, SMART Pro+: full
  maxDailyGames: number; // Free: 3/day, Starter: 10/day, SMART Pro+: unlimited
  gameDifficultyLevels: ('Low' | 'Medium' | 'High')[]; // Free: Low only, Starter: Low+Medium, SMART Pro+: All
  advancedGameAnalytics: boolean; // SMART Pro+ feature
  personalizedTraining: boolean; // SMART Pro+ feature
  
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
    
    // Brain Games Features
    brainGamesAccess: 'none',
    maxDailyGames: 0,
    gameDifficultyLevels: [],
    advancedGameAnalytics: false,
    personalizedTraining: false,
    
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
        brainGamesAccess: 'basic',
        maxDailyGames: 3,
        gameDifficultyLevels: ['Low'],
        advancedGameAnalytics: false,
        personalizedTraining: false,
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
        brainGamesAccess: 'intermediate',
        maxDailyGames: 10,
        gameDifficultyLevels: ['Low', 'Medium'],
        advancedGameAnalytics: false,
        personalizedTraining: false,
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
        brainGamesAccess: 'full',
        maxDailyGames: -1, // Unlimited
        gameDifficultyLevels: ['Low', 'Medium', 'High'],
        advancedGameAnalytics: true,
        personalizedTraining: true,
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
        brainGamesAccess: 'full',
        maxDailyGames: -1, // Unlimited
        gameDifficultyLevels: ['Low', 'Medium', 'High'],
        advancedGameAnalytics: true,
        personalizedTraining: true,
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
  tier: initialTier = 'free'
}: SubscriptionProviderProps) {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(initialTier);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    trial_active: false,
    trial_days_left: 0,
    subscription_tier: 'free'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load subscription from database
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const trialActive = data.status === 'trial' && new Date(data.trial_end) > new Date();
          const trialDaysLeft = trialActive 
            ? Math.ceil((new Date(data.trial_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          const tier = data.plan_type === 'premium' 
            ? (trialActive ? 'starter' : 'smart_pro')
            : data.plan_type === 'family'
            ? 'family_smart'
            : data.plan_type === 'basic'
            ? 'starter'
            : 'free';

          setCurrentTier(tier);
          setSubscriptionData({
            subscribed: data.status === 'active' || trialActive,
            trial_active: trialActive,
            trial_days_left: trialDaysLeft,
            subscription_tier: tier
          });
        } else {
          // No subscription found - check localStorage for trial start
          const trialStartDate = localStorage.getItem('trial_start_date');
          if (trialStartDate) {
            const trialStart = new Date(trialStartDate);
            const trialEnd = new Date(trialStart);
            trialEnd.setDate(trialEnd.getDate() + 7);
            const now = new Date();
            const trialActive = now < trialEnd;
            const trialDaysLeft = trialActive 
              ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              : 0;

            if (trialActive) {
              setCurrentTier('starter');
              setSubscriptionData({
                subscribed: true,
                trial_active: true,
                trial_days_left: trialDaysLeft,
                subscription_tier: 'starter'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);
  const features = getFeaturesByTier(currentTier);
  
  const updateSubscription = (newTier: SubscriptionTier) => {
    console.log("SubscriptionContext: Updating subscription tier from", currentTier, "to", newTier);
    setCurrentTier(newTier);
    setSubscriptionData(prev => ({
      ...prev,
      subscribed: newTier !== 'free',
      subscription_tier: newTier
    }));
  };
  
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (feature === 'maxSupportCircleMembers' || feature === 'memoryBridgeRecordings' || feature === 'maxDailyGames') {
      return features[feature] > 0 || features[feature] === -1; // -1 means unlimited
    }
    if (feature === 'brainGamesAccess') {
      return features[feature] !== 'none';
    }
    if (feature === 'gameDifficultyLevels') {
      return features[feature].length > 0;
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
      isLoading,
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
