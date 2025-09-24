
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

export interface PlanningData {
  todayActions: any[];
  tomorrowActions: any[];
  weeklyGoals: any[];
  upcomingEvents: any[];
  thisWeekActions: any[];
}

// Sample data for demo purposes
const getSamplePlanningData = (): PlanningData => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  return {
    todayActions: [
      {
        id: 'sample-1',
        title: 'Morning mindfulness check-in',
        description: 'Take 5 minutes to center yourself and set intentions',
        status: 'completed',
        is_daily_win: true,
        focus_area: 'emotional',
        difficulty_level: 1
      },
      {
        id: 'sample-2',
        title: 'Take morning medication with breakfast',
        description: 'Remember to eat something nutritious first',
        status: 'completed',
        is_daily_win: false,
        focus_area: 'physical',
        difficulty_level: 1
      },
      {
        id: 'sample-3',
        title: 'Gentle brain exercise - word puzzles',
        description: '15 minutes of engaging cognitive activity',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'cognitive',
        difficulty_level: 2
      },
      {
        id: 'sample-4',
        title: 'Connect with a friend or family member',
        description: 'Quick call or text to stay socially connected',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'social',
        difficulty_level: 2
      },
      {
        id: 'sample-5',
        title: 'Gratitude reflection',
        description: 'Write down 3 things you appreciate about today',
        status: 'pending',
        is_daily_win: true,
        focus_area: 'emotional',
        difficulty_level: 1
      }
    ],
    tomorrowActions: [
      {
        id: 'sample-6',
        title: 'Morning energy assessment',
        description: 'Check in with how you feel and adjust plans accordingly',
        status: 'pending',
        is_daily_win: true,
        focus_area: 'emotional',
        difficulty_level: 1
      },
      {
        id: 'sample-7',
        title: 'Physical therapy exercises',
        description: 'Complete prescribed balance and strength exercises',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'physical',
        difficulty_level: 3
      },
      {
        id: 'sample-8',
        title: 'Creative time - art or music',
        description: '30 minutes of creative expression',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'cognitive',
        difficulty_level: 2
      }
    ],
    weeklyGoals: [
      {
        id: 'goal-1',
        title: 'Build daily movement routine',
        description: 'Incorporate gentle movement into each day, even if just 5 minutes',
        progress_percentage: 65,
        status: 'active',
        category: 'physical'
      },
      {
        id: 'goal-2',
        title: 'Strengthen memory with brain games',
        description: 'Play cognitive games 3 times this week to support brain health',
        progress_percentage: 40,
        status: 'active',
        category: 'cognitive'
      },
      {
        id: 'goal-3',
        title: 'Connect socially every day',
        description: 'Reach out to at least one person daily for meaningful connection',
        progress_percentage: 85,
        status: 'active',
        category: 'social'
      },
      {
        id: 'goal-4',
        title: 'Master simple meal preparation',
        description: 'Cook one simple, nutritious meal independently',
        progress_percentage: 25,
        status: 'active',
        category: 'personal'
      }
    ],
    upcomingEvents: [
      {
        id: 'event-1',
        title: 'Physical Therapy Session',
        description: 'Weekly PT appointment focusing on balance and coordination',
        date: format(today, 'yyyy-MM-dd'),
        time: '10:30',
        type: 'appointment',
        category: 'medical'
      },
      {
        id: 'event-2',
        title: 'Lunch with Support Friend',
        description: 'Social connection time with understanding friend',
        date: format(today, 'yyyy-MM-dd'),
        time: '12:30',
        type: 'social',
        category: 'support'
      },
      {
        id: 'event-3',
        title: 'Morning Walk in Nature',
        description: 'Gentle outdoor exercise for physical and mental wellness',
        date: format(tomorrow, 'yyyy-MM-dd'),
        time: '08:30',
        type: 'exercise',
        category: 'wellness'
      },
      {
        id: 'event-4',
        title: 'Support Group Meeting',
        description: 'Weekly peer support and sharing session',
        date: format(addDays(today, 3), 'yyyy-MM-dd'),
        time: '19:00',
        type: 'group',
        category: 'support'
      }
    ],
    thisWeekActions: [
      // Include all today and tomorrow actions plus a few more
      ...getSamplePlanningData().todayActions,
      ...getSamplePlanningData().tomorrowActions,
      {
        id: 'week-1',
        title: 'Neurologist Follow-up',
        description: 'Quarterly check-in with medical team',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'physical',
        difficulty_level: 2
      },
      {
        id: 'week-2',
        title: 'Creative Art Therapy',
        description: 'Expressive therapy session for cognitive stimulation',
        status: 'pending',
        is_daily_win: false,
        focus_area: 'cognitive',
        difficulty_level: 2
      }
    ]
  };
};

export function usePlanningData() {
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['planning-data', user?.id, today],
    queryFn: async (): Promise<PlanningData> => {
      // If no user, return sample data for demo
      if (!user) {
        return getSamplePlanningData();
      }

      try {
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

        // If we have real data, use it, otherwise fall back to sample data
        const hasRealData = (todayActions && todayActions.length > 0) || 
                           (weeklyGoals && weeklyGoals.length > 0) || 
                           (upcomingEvents && upcomingEvents.length > 0);

        if (hasRealData) {
          return {
            todayActions: todayActions || [],
            tomorrowActions: tomorrowActions || [],
            weeklyGoals: weeklyGoals || [],
            upcomingEvents: upcomingEvents || [],
            thisWeekActions: thisWeekActions || []
          };
        } else {
          // Return sample data for demo purposes
          return getSamplePlanningData();
        }
      } catch (error) {
        console.log('Using sample data due to error:', error);
        return getSamplePlanningData();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
