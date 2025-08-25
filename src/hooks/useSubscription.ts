import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionFeatures {
  basicProgressTracking: boolean;
  voiceRecordings: boolean;
  memoryBridge: boolean;
  smartScheduling: boolean;
  supportCircle: boolean;
  unlimitedRecordings: boolean;
}

export interface SubscriptionLimits {
  recordingCount: number;
  recordingDurationMinutes: number;
  commentCount: number;
  hasWatchers: boolean;
  retentionDays: number;
}

const SUBSCRIPTION_FEATURES: Record<string, SubscriptionFeatures> = {
  free: {
    basicProgressTracking: true,
    voiceRecordings: true,
    memoryBridge: false,
    smartScheduling: false,
    supportCircle: false,
    unlimitedRecordings: false
  },
  premium: {
    basicProgressTracking: true,
    voiceRecordings: true,
    memoryBridge: true,
    smartScheduling: true,
    supportCircle: true,
    unlimitedRecordings: true
  },
  family: {
    basicProgressTracking: true,
    voiceRecordings: true,
    memoryBridge: true,
    smartScheduling: true,
    supportCircle: true,
    unlimitedRecordings: true
  }
};

const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    recordingCount: 3,
    recordingDurationMinutes: 30,
    commentCount: 1,
    hasWatchers: false,
    retentionDays: 7
  },
  premium: {
    recordingCount: -1, // unlimited
    recordingDurationMinutes: 180, // 3 hours
    commentCount: 7,
    hasWatchers: true,
    retentionDays: -1 // permanent
  },
  family: {
    recordingCount: -1, // unlimited
    recordingDurationMinutes: 180, // 3 hours
    commentCount: -1, // unlimited
    hasWatchers: true,
    retentionDays: -1 // permanent
  }
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        // Default to free tier
        setSubscription({ plan_type: 'free', status: 'active' });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const getCurrentTier = () => {
    if (!subscription) return 'free';
    
    // Check if trial is active
    if (subscription.status === 'trial' && subscription.trial_end >= new Date().toISOString().split('T')[0]) {
      return subscription.plan_type || 'premium';
    }
    
    if (subscription.status === 'active') {
      return subscription.plan_type || 'free';
    }
    
    return 'free';
  };

  const hasFeature = (feature: keyof SubscriptionFeatures) => {
    const tier = getCurrentTier();
    return SUBSCRIPTION_FEATURES[tier]?.[feature] || false;
  };

  const getLimits = (): SubscriptionLimits => {
    const tier = getCurrentTier();
    return SUBSCRIPTION_LIMITS[tier] || SUBSCRIPTION_LIMITS.free;
  };

  const canUseFeature = (feature: keyof SubscriptionFeatures) => {
    return hasFeature(feature);
  };

  return {
    subscription,
    loading,
    tier: getCurrentTier(),
    hasFeature,
    getLimits,
    canUseFeature,
    features: SUBSCRIPTION_FEATURES[getCurrentTier()] || SUBSCRIPTION_FEATURES.free
  };
}