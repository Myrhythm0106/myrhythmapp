import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_LIMITS, RecordingUsageTracking } from '@/types/memoryBridge';

export function useRecordingLimits() {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [usage, setUsage] = useState<RecordingUsageTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const limits = SUBSCRIPTION_LIMITS[tier];

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const currentPeriod = new Date();
      const periodStart = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), 1);
      const periodEnd = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth() + 1, 0);
      
      const response = await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/recording_usage_tracking?user_id=eq.${user.id}&period_start=eq.${periodStart.toISOString().split('T')[0]}`,
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        let currentUsage = data[0];

        if (!currentUsage) {
          // Create initial usage record
          const createResponse = await fetch(
            `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/recording_usage_tracking`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
              },
              body: JSON.stringify({
                user_id: user.id,
                period_start: periodStart.toISOString().split('T')[0],
                period_end: periodEnd.toISOString().split('T')[0],
                subscription_tier: tier,
                recording_count: 0,
                recording_duration_minutes: 0,
                comment_count: 0
              })
            }
          );

          if (createResponse.ok) {
            const newUsage = await createResponse.json();
            currentUsage = newUsage[0];
          }
        }

        setUsage(currentUsage);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, tier]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const updateUsage = async (updates: Partial<RecordingUsageTracking>) => {
    if (!usage || !user) return;

    try {
      const response = await fetch(
        `https://bomjibcivwxbcwfmkrnv.supabase.co/rest/v1/recording_usage_tracking?id=eq.${usage.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWppYmNpdnd4YmN3Zm1rcm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTg0OTksImV4cCI6MjA2Mzg5NDQ5OX0.gSaHvq6iGHHeqCcKOzKfuDd7T5LC5EXmDvJY8s48T7g',
          },
          body: JSON.stringify(updates)
        }
      );

      if (response.ok) {
        setUsage(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  const canRecord = () => {
    if (!usage) return true;
    
    const recordingLimit = limits.recordingCount;
    if (recordingLimit === -1) return true; // unlimited
    
    return usage.recording_count < recordingLimit;
  };

  const canAddWatchers = () => {
    return limits.hasWatchers;
  };

  const getDeletionCountdown = () => {
    if (limits.retentionDays === -1) return null; // permanent storage
    
    // Calculate days until deletion for free tier
    const retentionDays = limits.retentionDays;
    const currentDate = new Date();
    const usageDate = new Date(usage?.created_at || currentDate);
    const deletionDate = new Date(usageDate.getTime() + (retentionDays * 24 * 60 * 60 * 1000));
    const daysLeft = Math.ceil((deletionDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysLeft);
  };

  return {
    usage,
    limits,
    isLoading,
    canRecord,
    canAddWatchers,
    getDeletionCountdown,
    updateUsage,
    refetch: fetchUsage
  };
}