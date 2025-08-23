import { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format } from 'date-fns';

export interface PanelSummary {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'steady';
  color?: string;
  subtext?: string;
  icon?: string;
}

export interface PanelSummaries {
  calendar: PanelSummary[];
  goals: PanelSummary[];
  actions: PanelSummary[];
  reminders: PanelSummary[];
  focus: PanelSummary[];
  insights: PanelSummary[];
}

export function usePanelSummaries(): PanelSummaries {
  const { filters } = useDashboard();
  const { actions, goals } = useDailyActions();
  const { currentGoal } = useWeeklyGoal();
  
  const { selectedDate, timeFrame } = filters;
  
  return useMemo(() => {
    const getDateRange = () => {
      switch (timeFrame) {
        case 'day':
          return { start: selectedDate, end: selectedDate };
        case 'week':
          return { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) };
        case 'month':
          return { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) };
        case 'year':
          return { start: startOfYear(selectedDate), end: endOfYear(selectedDate) };
        default:
          return { start: selectedDate, end: selectedDate };
      }
    };

    const { start, end } = getDateRange();
    
    // Filter actions within the date range
    const filteredActions = actions.filter(action => {
      const actionDate = new Date(action.date);
      return isWithinInterval(actionDate, { start, end });
    });

    const completedActions = filteredActions.filter(action => action.status === 'completed');
    const completionRate = filteredActions.length > 0 ? (completedActions.length / filteredActions.length) * 100 : 0;
    const dailyWins = completedActions.filter(action => action.is_daily_win);

    // Calculate streaks and focus areas
    const focusAreas = filteredActions.reduce((acc, action) => {
      if (action.focus_area) {
        acc[action.focus_area] = (acc[action.focus_area] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topFocusArea = Object.entries(focusAreas).sort(([,a], [,b]) => b - a)[0];

    return {
      calendar: [
        {
          title: timeFrame === 'day' ? 'Today' : `This ${timeFrame}`,
          value: format(selectedDate, timeFrame === 'day' ? 'MMM dd' : timeFrame === 'week' ? "'Week of' MMM dd" : timeFrame === 'month' ? 'MMMM yyyy' : 'yyyy'),
          color: 'brain-health',
          subtext: `${filteredActions.length} planned`,
          icon: '📅'
        },
        {
          title: 'Focus Time',
          value: Math.round(filteredActions.reduce((sum, action) => sum + (action.duration_minutes || 0), 0) / 60 * 10) / 10 + 'h',
          color: 'clarity-teal',
          subtext: 'deep work scheduled',
          icon: '⏰'
        }
      ],
      goals: [
        {
          title: 'Weekly Goal',
          value: currentGoal ? `${currentGoal.progress}%` : '0%',
          trend: currentGoal && currentGoal.progress > 50 ? 'up' : 'steady',
          color: 'beacon',
          subtext: currentGoal?.title || 'No goal set',
          icon: '🎯'
        },
        {
          title: 'Active Goals',
          value: goals.length,
          color: 'memory-emerald',
          subtext: `${goals.filter(g => g.progress_percentage > 75).length} near completion`,
          icon: '⭐'
        }
      ],
      actions: [
        {
          title: 'Completion Rate',
          value: `${Math.round(completionRate)}%`,
          trend: completionRate > 70 ? 'up' : completionRate > 40 ? 'steady' : 'down',
          color: completionRate > 70 ? 'memory-emerald' : 'brain-health',
          subtext: `${completedActions.length}/${filteredActions.length} done`,
          icon: '✅'
        },
        {
          title: 'Daily Wins',
          value: dailyWins.length,
          color: 'sunrise-amber',
          subtext: 'victories celebrated',
          icon: '🌟'
        }
      ],
      reminders: [
        {
          title: 'Upcoming',
          value: 3, // Mock data - would be real reminders
          color: 'brain-health',
          subtext: 'due today',
          icon: '🔔'
        },
        {
          title: 'Priority',
          value: 1, // Mock data
          color: 'sunrise-amber',
          subtext: 'high priority',
          icon: '⚡'
        }
      ],
      focus: [
        {
          title: 'Energy Level',
          value: 'Peak', // Would be calculated based on time and user data
          color: 'memory-emerald',
          subtext: 'perfect for deep work',
          icon: '🧠'
        },
        {
          title: 'Sessions',
          value: 2, // Mock Pomodoro sessions
          color: 'clarity-teal',
          subtext: 'focus blocks completed',
          icon: '🍅'
        }
      ],
      insights: [
        {
          title: 'Top Focus',
          value: topFocusArea ? topFocusArea[0].charAt(0).toUpperCase() + topFocusArea[0].slice(1) : 'Balanced',
          color: 'beacon',
          subtext: topFocusArea ? `${topFocusArea[1]} actions` : 'across all areas',
          icon: '📊'
        },
        {
          title: 'Streak',
          value: completedActions.length > 0 ? 3 : 0, // Mock streak calculation
          color: 'sunrise-amber',
          subtext: 'days consistent',
          icon: '🔥'
        }
      ]
    };
  }, [actions, goals, currentGoal, selectedDate, timeFrame]);
}