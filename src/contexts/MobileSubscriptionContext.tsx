
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type SubscriptionTier = 'basic' | 'premium' | 'family';
export type SubscriptionStatus = 'trial_active' | 'trial_expired' | 'active' | 'canceled' | 'free';

export interface MobileSubscriptionData {
  subscribed: boolean;
  trial_active: boolean;
  trial_days_left: number;
  subscription_tier: SubscriptionTier;
  subscription_end?: string;
  status: SubscriptionStatus;
}

export interface SubscriptionFeatures {
  // Basic features (free tier)
  basicAssessment: boolean;
  limitedActions: boolean;
  communityAccess: boolean;
  
  // Premium features
  advancedInsights: boolean;
  unlimitedActions: boolean;
  goalTracking: boolean;
  calendarIntegration: boolean;
  moodTracking: boolean;
  personalCoaching: boolean;
  prioritySupport: boolean;
  
  // Family features
  multipleProfiles: boolean;
  familySharing: boolean;
  parentalControls: boolean;
  familyDashboard: boolean;
}

interface MobileSubscriptionContextType {
  subscriptionData: MobileSubscriptionData;
  features: SubscriptionFeatures;
  tier: SubscriptionTier;
  isLoading: boolean;
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
  refreshSubscription: () => Promise<void>;
  startMobilePurchase: (planType: SubscriptionTier) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const MobileSubscriptionContext = createContext<MobileSubscriptionContextType | undefined>(undefined);

const getFeaturesByTier = (tier: SubscriptionTier, isActive: boolean): SubscriptionFeatures => {
  const baseFeatures = {
    basicAssessment: true,
    limitedActions: true,
    communityAccess: true,
    advancedInsights: false,
    unlimitedActions: false,
    goalTracking: false,
    calendarIntegration: false,
    moodTracking: false,
    personalCoaching: false,
    prioritySupport: false,
    multipleProfiles: false,
    familySharing: false,
    parentalControls: false,
    familyDashboard: false,
  };

  if (!isActive) return baseFeatures;

  switch (tier) {
    case 'premium':
    case 'family':
      return {
        ...baseFeatures,
        advancedInsights: true,
        unlimitedActions: true,
        goalTracking: true,
        calendarIntegration: true,
        moodTracking: true,
        personalCoaching: true,
        prioritySupport: true,
        multipleProfiles: tier === 'family',
        familySharing: tier === 'family',
        parentalControls: tier === 'family',
        familyDashboard: tier === 'family',
      };
    case 'basic':
      return {
        ...baseFeatures,
        advancedInsights: true,
        unlimitedActions: true,
        goalTracking: true,
      };
    default:
      return baseFeatures;
  }
};

export function MobileSubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<MobileSubscriptionData>({
    subscribed: false,
    trial_active: true, // Default to trial for new users
    trial_days_left: 7,
    subscription_tier: 'premium',
    status: 'trial_active'
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscriptionData({
        subscribed: false,
        trial_active: false,
        trial_days_left: 0,
        subscription_tier: 'basic',
        status: 'free'
      });
      return;
    }

    // For now, simulate subscription check
    // In production, this would check App Store/Google Play receipts
    console.log("Checking mobile subscription status for user:", user.id);
    
    // Default to trial active for development
    setSubscriptionData({
      subscribed: false,
      trial_active: true,
      trial_days_left: 7,
      subscription_tier: 'premium',
      status: 'trial_active'
    });
  };

  const startMobilePurchase = async (planType: SubscriptionTier): Promise<void> => {
    console.log("Starting mobile purchase for plan:", planType);
    
    try {
      // In production, this would use @capacitor-community/in-app-purchases
      // For now, simulate successful purchase
      toast.success("Redirecting to App Store...");
      
      // Simulate App Store purchase flow
      setTimeout(() => {
        setSubscriptionData(prev => ({
          ...prev,
          subscribed: true,
          subscription_tier: planType,
          status: 'active'
        }));
        toast.success("Subscription activated!");
      }, 2000);
      
    } catch (error) {
      console.error("Mobile purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    }
  };

  const restorePurchases = async (): Promise<void> => {
    console.log("Restoring mobile purchases");
    
    try {
      // In production, this would restore from App Store/Google Play
      toast.info("Checking for existing purchases...");
      
      setTimeout(() => {
        toast.success("Purchases restored successfully!");
      }, 1000);
      
    } catch (error) {
      console.error("Restore purchases error:", error);
      toast.error("Failed to restore purchases.");
    }
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
    <MobileSubscriptionContext.Provider value={{
      subscriptionData,
      features,
      tier: subscriptionData.subscription_tier,
      isLoading,
      hasFeature,
      upgradeRequired,
      refreshSubscription,
      startMobilePurchase,
      restorePurchases
    }}>
      {children}
    </MobileSubscriptionContext.Provider>
  );
}

export function useMobileSubscription() {
  const context = useContext(MobileSubscriptionContext);
  if (context === undefined) {
    throw new Error('useMobileSubscription must be used within a MobileSubscriptionProvider');
  }
  return context;
}
