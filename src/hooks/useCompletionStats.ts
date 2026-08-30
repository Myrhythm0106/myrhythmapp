import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  COMPLETION_STATS_EVENT,
  CompletionStats,
  fetchCompletionStats
} from '@/hooks/useCompleteAction';

/** Live follow-through numbers: finished this week, current streak, still open. */
export function useCompletionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setStats(null);
      setIsLoading(false);
      return;
    }
    setStats(await fetchCompletionStats());
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener(COMPLETION_STATS_EVENT, handler);
    return () => window.removeEventListener(COMPLETION_STATS_EVENT, handler);
  }, [refresh]);

  return { stats, isLoading, refresh };
}
