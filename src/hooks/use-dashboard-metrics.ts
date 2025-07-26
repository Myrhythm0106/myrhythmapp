import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export interface DashboardMetrics {
  todayCompleted: number;
  todayTotal: number;
  weeklyGoals: any[];
  monthlyMetrics: {
    activeDays: number;
    totalDays: number;
    streakDays: number;
    completedGoals: number;
  };
  yearlyMetrics: {
    daysCompleted: number;
    totalDays: number;
    majorGoalsCompleted: number;
    totalMajorGoals: number;
    longestStreak: number;
    currentYear: number;
  };
}

export function useDashboardMetrics() {
  const { user } = useAuth();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(today), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(today), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');
  const yearStart = format(startOfYear(today), 'yyyy-MM-dd');
  const yearEnd = format(endOfYear(today), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['dashboard-metrics', user?.id, todayStr],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!user) {
        return getSampleMetrics();
      }

      try {
        // Fetch today's actions
        const { data: todayActions } = await supabase
          .from('daily_actions')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', todayStr);

        // Fetch weekly goals
        const { data: weeklyGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .or(`target_date.gte.${weekStart},target_date.is.null`)
          .order('created_at', { ascending: false });

        // Fetch monthly actions
        const { data: monthlyActions } = await supabase
          .from('daily_actions')
          .select('date, status')
          .eq('user_id', user.id)
          .gte('date', monthStart)
          .lte('date', monthEnd);

        // Fetch monthly goals
        const { data: monthlyGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', monthStart)
          .lte('target_date', monthEnd);

        // Fetch yearly actions for streak calculation
        const { data: yearlyActions } = await supabase
          .from('daily_actions')
          .select('date, status')
          .eq('user_id', user.id)
          .gte('date', yearStart)
          .lte('date', yearEnd)
          .order('date');

        // Fetch yearly goals
        const { data: yearlyGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', yearStart);

        // Calculate metrics
        const todayCompleted = todayActions?.filter(a => a.status === 'completed').length || 0;
        const todayTotal = todayActions?.length || 0;

        // Monthly metrics
        const activeDaysSet = new Set(
          monthlyActions?.filter(a => a.status === 'completed').map(a => a.date) || []
        );
        const activeDays = activeDaysSet.size;
        const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const completedGoals = monthlyGoals?.filter(g => g.status === 'completed').length || 0;

        // Yearly metrics
        const yearlyActiveDaysSet = new Set(
          yearlyActions?.filter(a => a.status === 'completed').map(a => a.date) || []
        );
        const daysCompleted = yearlyActiveDaysSet.size;
        const majorGoalsCompleted = yearlyGoals?.filter(g => g.status === 'completed').length || 0;
        const totalMajorGoals = yearlyGoals?.length || 0;
        const longestStreak = calculateLongestStreak(yearlyActions || []);

        return {
          todayCompleted,
          todayTotal,
          weeklyGoals: weeklyGoals || [],
          monthlyMetrics: {
            activeDays,
            totalDays: totalDaysInMonth,
            streakDays: calculateCurrentStreak(monthlyActions || []),
            completedGoals
          },
          yearlyMetrics: {
            daysCompleted,
            totalDays: 365,
            majorGoalsCompleted,
            totalMajorGoals,
            longestStreak,
            currentYear: today.getFullYear()
          }
        };
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return getSampleMetrics();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function getSampleMetrics(): DashboardMetrics {
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  return {
    todayCompleted: 2,
    todayTotal: 5,
    weeklyGoals: [
      { id: '1', title: 'Complete 3 brain training sessions', progress_percentage: 67, category: 'cognitive' },
      { id: '2', title: 'Daily morning walks', progress_percentage: 57, category: 'physical' },
      { id: '3', title: 'Gratitude journaling', progress_percentage: 43, category: 'emotional' }
    ],
    monthlyMetrics: {
      activeDays: Math.floor(currentDay * 0.7),
      totalDays: daysInMonth,
      streakDays: 5,
      completedGoals: 3
    },
    yearlyMetrics: {
      daysCompleted: dayOfYear,
      totalDays: 365,
      majorGoalsCompleted: 2,
      totalMajorGoals: 5,
      longestStreak: 28,
      currentYear: today.getFullYear()
    }
  };
}

function calculateCurrentStreak(actions: any[]): number {
  // Simple implementation - count consecutive days with completed actions
  const actionsByDate = actions.reduce((acc, action) => {
    if (!acc[action.date]) acc[action.date] = [];
    acc[action.date].push(action);
    return acc;
  }, {} as Record<string, any[]>);

  let streak = 0;
  let currentDate = new Date();
  
  while (streak < 30) { // Max 30 days lookback
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayActions = actionsByDate[dateStr] || [];
    const hasCompletedAction = dayActions.some(a => a.status === 'completed');
    
    if (!hasCompletedAction) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

function calculateLongestStreak(actions: any[]): number {
  // Simple implementation for longest streak
  const actionsByDate = actions.reduce((acc, action) => {
    if (action.status === 'completed') {
      if (!acc[action.date]) acc[action.date] = 0;
      acc[action.date]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const dates = Object.keys(actionsByDate).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate = '';

  for (const date of dates) {
    if (lastDate) {
      const daysDiff = Math.floor((new Date(date).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    lastDate = date;
  }

  return Math.max(maxStreak, currentStreak);
}