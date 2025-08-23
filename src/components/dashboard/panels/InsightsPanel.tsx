import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export function InsightsPanel() {
  const { filters } = useDashboard();
  const { actions } = useDailyActions();

  // Calculate insights for the past week
  const getWeeklyInsights = () => {
    const weekAgo = subDays(filters.selectedDate, 7);
    const weekActions = actions.filter(action => {
      const actionDate = new Date(action.date);
      return actionDate >= weekAgo && actionDate <= filters.selectedDate;
    });

    const completed = weekActions.filter(a => a.status === 'completed');
    const completionRate = weekActions.length > 0 ? (completed.length / weekActions.length) * 100 : 0;

    // Calculate streak
    let currentStreak = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = format(subDays(filters.selectedDate, i), 'yyyy-MM-dd');
      const dayActions = actions.filter(a => a.date === checkDate);
      const dayCompleted = dayActions.filter(a => a.status === 'completed');
      
      if (dayActions.length > 0 && dayCompleted.length > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate focus area distribution
    const focusAreas = completed.reduce((acc: Record<string, number>, action) => {
      acc[action.focus_area] = (acc[action.focus_area] || 0) + 1;
      return acc;
    }, {});

    const topFocusArea = Object.entries(focusAreas).reduce((a, b) => 
      focusAreas[a[0]] > focusAreas[b[0]] ? a : b, ['', 0]
    );

    return {
      totalActions: weekActions.length,
      completed: completed.length,
      completionRate,
      currentStreak,
      topFocusArea: topFocusArea[0] || 'None',
      topFocusCount: topFocusArea[1] || 0
    };
  };

  const insights = getWeeklyInsights();

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'health': return 'memory-emerald';
      case 'cognitive': return 'brain-health';
      case 'emotional': return 'clarity-teal';
      case 'social': return 'sunrise-amber';
      default: return 'brain-health';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'completion': return <TrendingUp className="h-4 w-4" />;
      case 'streak': return <Award className="h-4 w-4" />;
      case 'focus': return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-brain-health-500" />
        <h4 className="font-medium text-sm">This Week's Progress</h4>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-3">
        {/* Completion Rate */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border border-brain-health-200/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getInsightIcon('completion')}
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <span className="text-lg font-bold text-brain-health-700">
              {Math.round(insights.completionRate)}%
            </span>
          </div>
          <Progress 
            value={insights.completionRate} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {insights.completed} of {insights.totalActions} actions completed
          </p>
        </div>

        {/* Current Streak */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border border-memory-emerald-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getInsightIcon('streak')}
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <span className="text-lg font-bold text-memory-emerald-700">
              {insights.currentStreak}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {insights.currentStreak > 0 ? 'days of progress' : 'Start your streak today!'}
          </p>
        </div>

        {/* Top Focus Area */}
        {insights.topFocusArea !== 'None' && (
          <div className={cn(
            "p-3 rounded-lg border",
            `bg-gradient-to-r from-${getFocusAreaColor(insights.topFocusArea)}-50 to-brain-health-50`,
            `border-${getFocusAreaColor(insights.topFocusArea)}-200/60`
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getInsightIcon('focus')}
                <span className="text-sm font-medium">Top Focus</span>
              </div>
              <span className={cn(
                "text-lg font-bold",
                `text-${getFocusAreaColor(insights.topFocusArea)}-700`
              )}>
                {insights.topFocusCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {insights.topFocusArea} area actions
            </p>
          </div>
        )}
      </div>

      {/* Motivational Message */}
      <div className="pt-3 border-t border-border/30">
        <div className="text-center">
          {insights.completionRate >= 80 ? (
            <p className="text-sm text-memory-emerald-600 font-medium">
              🎉 Excellent progress this week!
            </p>
          ) : insights.completionRate >= 60 ? (
            <p className="text-sm text-brain-health-600 font-medium">
              💪 Good momentum, keep it up!
            </p>
          ) : insights.completionRate >= 40 ? (
            <p className="text-sm text-clarity-teal-600 font-medium">
              🌱 Steady progress, you're building habits!
            </p>
          ) : (
            <p className="text-sm text-sunrise-amber-600 font-medium">
              ✨ Every step counts, you've got this!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}