
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

export interface PlanningData {
  todayActions: any[];
  tomorrowActions: any[];
  weeklyGoals: any[];
  upcomingEvents: any[];
  thisWeekActions: any[];
}

export function usePlanningData() {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['planning-data', user?.id, today],
    queryFn: async (): Promise<PlanningData> => {
      if (!user) throw new Error('User not authenticated');

      // Fetch today's actions
      const { data: todayActions } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: true });

      // Fetch tomorrow's actions
      const { data: tomorrowActions } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', tomorrow)
        .order('created_at', { ascending: true });

      // Fetch this week's actions
      const { data: thisWeekActions } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('date', { ascending: true });

      // Fetch active goals
      const { data: weeklyGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Fetch upcoming calendar events
      const { data: upcomingEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today)
        .lte('date', weekEnd)
        .order('date', { ascending: true })
        .limit(5);

      return {
        todayActions: todayActions || [],
        tomorrowActions: tomorrowActions || [],
        weeklyGoals: weeklyGoals || [],
        upcomingEvents: upcomingEvents || [],
        thisWeekActions: thisWeekActions || []
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
