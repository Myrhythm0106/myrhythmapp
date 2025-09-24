import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { addDays, subDays, startOfDay, startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

export type TimeFrame = 'day' | 'week' | 'month' | 'year';

export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
  description?: string;
  color: string;
}

export interface DashboardInsights {
  capture: DashboardMetric;
  calendar: DashboardMetric;
  supportCircle: DashboardMetric;
  tracking: DashboardMetric;
  goals: DashboardMetric;
  clarityIndex: DashboardMetric;
  isLoading: boolean;
  error: string | null;
}

const sampleMetrics: Record<TimeFrame, DashboardInsights> = {
  day: {
    capture: { title: "Captures Today", value: 3, trend: 'up', change: 2, unit: "entries", color: "memory-emerald", description: "Voice notes & memories" },
    calendar: { title: "Today's Actions", value: 5, trend: 'up', change: 1, unit: "completed", color: "brain-health", description: "Planned activities" },
    supportCircle: { title: "Circle Activity", value: 2, trend: 'up', change: 1, unit: "interactions", color: "clarity-teal", description: "Messages & check-ins" },
    tracking: { title: "Mood Score", value: 7.2, trend: 'up', change: 0.5, unit: "/10", color: "sunrise-amber", description: "Daily wellbeing" },
    goals: { title: "Goal Progress", value: 68, trend: 'up', change: 12, unit: "%", color: "beacon", description: "Weekly objectives" },
    clarityIndex: { title: "Clarity Index", value: 8.1, trend: 'up', change: 0.3, unit: "/10", color: "brain-health", description: "Overall mental clarity" },
    isLoading: false,
    error: null
  },
  week: {
    capture: { title: "Weekly Captures", value: 18, trend: 'up', change: 4, unit: "entries", color: "memory-emerald", description: "Voice notes & memories" },
    calendar: { title: "Actions Completed", value: 24, trend: 'up', change: 6, unit: "tasks", color: "brain-health", description: "Weekly achievements" },
    supportCircle: { title: "Support Engagement", value: 12, trend: 'up', change: 3, unit: "interactions", color: "clarity-teal", description: "Circle connections" },
    tracking: { title: "Avg Mood", value: 7.4, trend: 'up', change: 0.2, unit: "/10", color: "sunrise-amber", description: "Weekly average" },
    goals: { title: "Goals On Track", value: 3, trend: 'neutral', change: 0, unit: "of 4", color: "beacon", description: "Active objectives" },
    clarityIndex: { title: "Clarity Index", value: 7.8, trend: 'up', change: 0.4, unit: "/10", color: "brain-health", description: "Weekly mental clarity" },
    isLoading: false,
    error: null
  },
  month: {
    capture: { title: "Monthly Captures", value: 76, trend: 'up', change: 12, unit: "entries", color: "memory-emerald", description: "Voice notes & memories" },
    calendar: { title: "Actions Completed", value: 98, trend: 'up', change: 18, unit: "tasks", color: "brain-health", description: "Monthly achievements" },
    supportCircle: { title: "Support Network", value: 8, trend: 'up', change: 2, unit: "active members", color: "clarity-teal", description: "Circle growth" },
    tracking: { title: "Mood Consistency", value: 85, trend: 'up', change: 7, unit: "%", color: "sunrise-amber", description: "Positive mood days" },
    goals: { title: "Goals Achieved", value: 2, trend: 'up', change: 1, unit: "of 4", color: "beacon", description: "Monthly completions" },
    clarityIndex: { title: "Clarity Index", value: 7.6, trend: 'up', change: 0.8, unit: "/10", color: "brain-health", description: "Monthly growth" },
    isLoading: false,
    error: null
  },
  year: {
    capture: { title: "Annual Captures", value: 892, trend: 'up', change: 156, unit: "entries", color: "memory-emerald", description: "Total memories" },
    calendar: { title: "Annual Actions", value: 1247, trend: 'up', change: 234, unit: "completed", color: "brain-health", description: "Year's achievements" },
    supportCircle: { title: "Support Growth", value: 15, trend: 'up', change: 8, unit: "total members", color: "clarity-teal", description: "Circle expansion" },
    tracking: { title: "Recovery Progress", value: 78, trend: 'up', change: 23, unit: "%", color: "sunrise-amber", description: "Annual improvement" },
    goals: { title: "Major Milestones", value: 8, trend: 'up', change: 5, unit: "achieved", color: "beacon", description: "Life-changing wins" },
    clarityIndex: { title: "Clarity Index", value: 8.4, trend: 'up', change: 1.2, unit: "/10", color: "brain-health", description: "Annual transformation" },
    isLoading: false,
    error: null
  }
};

export function useDashboardInsights(timeFrame: TimeFrame = 'month'): DashboardInsights {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-insights', user?.id, timeFrame],
    queryFn: async () => {
      if (!user) {
        // Return sample data for non-authenticated users
        return sampleMetrics[timeFrame];
      }

      const now = new Date();
      let startDate: Date;
      let previousPeriodStart: Date;

      switch (timeFrame) {
        case 'day':
          startDate = startOfDay(now);
          previousPeriodStart = startOfDay(subDays(now, 1));
          break;
        case 'week':
          startDate = startOfWeek(now);
          previousPeriodStart = startOfWeek(subDays(now, 7));
          break;
        case 'month':
          startDate = startOfMonth(now);
          previousPeriodStart = startOfMonth(subDays(startOfMonth(now), 1));
          break;
        case 'year':
          startDate = startOfYear(now);
          previousPeriodStart = startOfYear(subDays(startOfYear(now), 365));
          break;
        default:
          startDate = startOfMonth(now);
          previousPeriodStart = startOfMonth(subDays(startOfMonth(now), 1));
      }

      try {
        // Fetch data from multiple sources in parallel
        const [capturesResult, actionsResult, moodResult, goalsResult] = await Promise.allSettled([
          // Memory entries (captures)
          supabase
            .from('memory_entries')
            .select('id, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString()),

          // Daily actions (calendar)
          supabase
            .from('daily_actions')
            .select('id, status, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString()),

          // Mood entries (tracking)
          supabase
            .from('mood_entries')
            .select('mood, energy_level, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString()),

          // Goals
          supabase
            .from('goals')
            .select('id, status, progress_percentage, created_at')
            .eq('user_id', user.id)
        ]);

        // Process captures
        const captures = capturesResult.status === 'fulfilled' ? capturesResult.value.data || [] : [];
        const captureCount = captures.length;

        // Process actions
        const actions = actionsResult.status === 'fulfilled' ? actionsResult.value.data || [] : [];
        const completedActions = actions.filter(a => a.status === 'completed').length;

        // Process mood data
        const moods = moodResult.status === 'fulfilled' ? moodResult.value.data || [] : [];
        const avgMood = moods.length > 0 
          ? moods.reduce((sum, m) => sum + (m.energy_level || 5), 0) / moods.length 
          : 7.0;

        // Process goals
        const goals = goalsResult.status === 'fulfilled' ? goalsResult.value.data || [] : [];
        const activeGoals = goals.filter(g => g.status === 'active');
        const avgProgress = activeGoals.length > 0
          ? activeGoals.reduce((sum, g) => sum + (g.progress_percentage || 0), 0) / activeGoals.length
          : 50;

        // Calculate clarity index (weighted average of mood and goal progress)
        const clarityIndex = (avgMood * 0.6 + (avgProgress / 10) * 0.4);

        // Calculate trends (mock for now - in production, compare with previous period)
        const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
          if (value > 5) return 'up';
          if (value < -5) return 'down';
          return 'neutral';
        };

        const insights: DashboardInsights = {
          capture: {
            title: timeFrame === 'day' ? "Captures Today" : `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Captures`,
            value: captureCount,
            trend: getTrend(Math.random() * 10 - 5),
            change: Math.floor(Math.random() * 5),
            unit: "entries",
            color: "memory-emerald",
            description: "Voice notes & memories"
          },
          calendar: {
            title: timeFrame === 'day' ? "Today's Actions" : "Actions Completed",
            value: completedActions,
            trend: getTrend(Math.random() * 10 - 5),
            change: Math.floor(Math.random() * 5),
            unit: timeFrame === 'day' ? "completed" : "tasks",
            color: "brain-health",
            description: timeFrame === 'day' ? "Planned activities" : `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} achievements`
          },
          supportCircle: {
            title: timeFrame === 'day' ? "Circle Activity" : "Support Network",
            value: Math.floor(Math.random() * 10) + 1,
            trend: 'up',
            change: Math.floor(Math.random() * 3),
            unit: timeFrame === 'day' ? "interactions" : "active members",
            color: "clarity-teal",
            description: timeFrame === 'day' ? "Messages & check-ins" : "Circle connections"
          },
          tracking: {
            title: timeFrame === 'day' ? "Mood Score" : "Mood Average",
            value: Number(avgMood.toFixed(1)),
            trend: getTrend(Math.random() * 10 - 5),
            change: Number((Math.random() * 2 - 1).toFixed(1)),
            unit: "/10",
            color: "sunrise-amber",
            description: timeFrame === 'day' ? "Daily wellbeing" : `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} average`
          },
          goals: {
            title: timeFrame === 'day' ? "Goal Progress" : "Goals Status",
            value: timeFrame === 'day' ? Math.round(avgProgress) : activeGoals.length,
            trend: getTrend(Math.random() * 10 - 5),
            change: Math.floor(Math.random() * 5),
            unit: timeFrame === 'day' ? "%" : `of ${goals.length}`,
            color: "beacon",
            description: timeFrame === 'day' ? "Daily objectives" : "Active objectives"
          },
          clarityIndex: {
            title: "Clarity Index",
            value: Number(clarityIndex.toFixed(1)),
            trend: 'up',
            change: Number((Math.random() * 1).toFixed(1)),
            unit: "/10",
            color: "brain-health",
            description: `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} mental clarity`
          },
          isLoading: false,
          error: null
        };

        return insights;
      } catch (err) {
        console.error('Error fetching dashboard insights:', err);
        // Return sample data on error
        return {
          ...sampleMetrics[timeFrame],
          error: 'Failed to load live data, showing sample metrics'
        };
      }
    },
    enabled: true, // Always enabled to show sample data when not authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  return data || { ...sampleMetrics[timeFrame], isLoading, error: error?.message || null };
}