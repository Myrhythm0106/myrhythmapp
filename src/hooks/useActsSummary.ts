import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDateRanges, TimeFrame } from './useDateRanges';

interface ActsStatusDistribution {
  open: number;
  inProgress: number; 
  completed: number;
  total: number;
}

interface ActsSummary {
  raised: number;
  statusDistribution: ActsStatusDistribution;
  completionRate: number;
}

export function useActsSummary(timeFrame: TimeFrame = 'day') {
  const { user } = useAuth();
  const { start, end } = useDateRanges(timeFrame);
  const [summary, setSummary] = useState<ActsSummary>({
    raised: 0,
    statusDistribution: { open: 0, inProgress: 0, completed: 0, total: 0 },
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActsSummary = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get raised actions in this time period
        const { count: raisedCount } = await supabase
          .from('extracted_actions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        // Get all actions for status distribution (not time-filtered)
        const { data: allActions } = await supabase
          .from('extracted_actions')
          .select('status')
          .eq('user_id', user.id)
          .not('status', 'eq', 'rejected'); // Exclude rejected actions

        // Calculate status distribution
        const statusCounts = {
          open: 0,
          inProgress: 0,
          completed: 0
        };

        allActions?.forEach(action => {
          switch (action.status) {
            case 'completed':
              statusCounts.completed++;
              break;
            case 'in_progress':
            case 'scheduled':
              statusCounts.inProgress++;
              break;
            default:
              statusCounts.open++;
              break;
          }
        });

        const totalActions = statusCounts.open + statusCounts.inProgress + statusCounts.completed;
        const completionRate = totalActions > 0 ? Math.round((statusCounts.completed / totalActions) * 100) : 0;

        setSummary({
          raised: raisedCount || 0,
          statusDistribution: {
            ...statusCounts,
            total: totalActions
          },
          completionRate
        });
      } catch (error) {
        console.error('Error fetching ACTs summary:', error);
        setSummary({
          raised: 0,
          statusDistribution: { open: 0, inProgress: 0, completed: 0, total: 0 },
          completionRate: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActsSummary();
  }, [user, start, end]);

  return { summary, isLoading };
}