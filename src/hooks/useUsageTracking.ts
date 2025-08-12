import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UsageData {
  memoryBridgeRecordings: number;
  lastReset: string; // ISO date string
}

export function useUsageTracking() {
  const { features } = useSubscription();
  const [usage, setUsage] = useState<UsageData>({
    memoryBridgeRecordings: 0,
    lastReset: new Date().toISOString()
  });

  // Load usage from localStorage on mount
  useEffect(() => {
    const savedUsage = localStorage.getItem('myrhythm_usage');
    if (savedUsage) {
      const parsedUsage = JSON.parse(savedUsage);
      
      // Check if we need to reset monthly usage
      const lastReset = new Date(parsedUsage.lastReset);
      const now = new Date();
      const shouldReset = now.getMonth() !== lastReset.getMonth() || 
                         now.getFullYear() !== lastReset.getFullYear();
      
      if (shouldReset) {
        const resetUsage = {
          memoryBridgeRecordings: 0,
          lastReset: now.toISOString()
        };
        setUsage(resetUsage);
        localStorage.setItem('myrhythm_usage', JSON.stringify(resetUsage));
      } else {
        setUsage(parsedUsage);
      }
    }
  }, []);

  // Save usage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myrhythm_usage', JSON.stringify(usage));
  }, [usage]);

  const incrementUsage = (feature: keyof UsageData) => {
    setUsage(prev => ({
      ...prev,
      [feature]: (prev[feature] as number) + 1
    }));
  };

  const canUseFeature = (feature: 'memoryBridgeRecordings'): boolean => {
    const limit = features[feature] as number;
    
    // Unlimited access
    if (limit === -1) return true;
    
    // Check if under limit
    return usage[feature] < limit;
  };

  const getRemainingUsage = (feature: 'memoryBridgeRecordings'): number => {
    const limit = features[feature] as number;
    
    // Unlimited access
    if (limit === -1) return -1;
    
    return Math.max(0, limit - usage[feature]);
  };

  const getUsagePercentage = (feature: 'memoryBridgeRecordings'): number => {
    const limit = features[feature] as number;
    
    // Unlimited access
    if (limit === -1) return 0;
    
    return Math.min((usage[feature] / limit) * 100, 100);
  };

  return {
    usage,
    incrementUsage,
    canUseFeature,
    getRemainingUsage,
    getUsagePercentage
  };
}