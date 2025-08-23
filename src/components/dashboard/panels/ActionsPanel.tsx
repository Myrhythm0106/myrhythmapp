import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Star, Zap, Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { cn } from '@/lib/utils';
import { format, isToday } from 'date-fns';

export function ActionsPanel() {
  const { filters } = useDashboard();
  const { actions, completeAction } = useDailyActions();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Filter actions based on current date/timeframe and status filter
  const getFilteredActions = () => {
    const selectedDateStr = format(filters.selectedDate, 'yyyy-MM-dd');
    
    switch (filters.timeFrame) {
      case 'day':
        return actions.filter(action => action.date === selectedDateStr);
      case 'week':
        // Get actions for the week containing the selected date
        return actions.filter(action => {
          const actionDate = new Date(action.date);
          const selectedDate = filters.selectedDate;
          const weekStart = new Date(selectedDate);
          weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return actionDate >= weekStart && actionDate <= weekEnd;
        });
      default:
        return actions.filter(action => action.date === selectedDateStr);
    }
  };

  const filteredActions = getFilteredActions().filter(action => {
    return filter === 'all' || action.status === filter;
  });

  const allTimeFrameActions = getFilteredActions();
  const completedCount = allTimeFrameActions.filter(action => action.status === 'completed').length;
  const completionRate = allTimeFrameActions.length > 0 ? (completedCount / allTimeFrameActions.length) * 100 : 0;
  const dailyWins = filteredActions.filter(action => action.is_daily_win && action.status === 'completed');

  const handleToggleComplete = async (actionId: string) => {
    try {
      await completeAction(actionId);
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  };

  const getFocusAreaIcon = (focusArea?: string) => {
    const iconMap = {
      'cognitive': '🧠',
      'physical': '💪',
      'emotional': '❤️',
      'social': '👥',
      'sleep': '😴'
    };
    return iconMap[focusArea as keyof typeof iconMap] || '⭐';
  };

  const getActionBadgeColor = (focusArea?: string) => {
    switch (focusArea) {
      case 'cognitive': return 'bg-brain-health-100 text-brain-health-700 border-brain-health-200';
      case 'physical': return 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200';
      case 'emotional': return 'bg-clarity-teal-100 text-clarity-teal-700 border-clarity-teal-200';
      case 'social': return 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200';
      case 'sleep': return 'bg-beacon-100 text-beacon-700 border-beacon-200';
      default: return 'bg-brain-health-100 text-brain-health-700 border-brain-health-200';
    }
  };

  const getPriorityColor = (difficultyLevel: number) => {
    if (difficultyLevel >= 4) return 'text-sunrise-amber-600 bg-sunrise-amber-50 border-sunrise-amber-200';
    if (difficultyLevel >= 2) return 'text-brain-health-600 bg-brain-health-50 border-brain-health-200';
    return 'text-memory-emerald-600 bg-memory-emerald-50 border-memory-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="empowerment-gradient rounded-xl p-4 border border-brain-health-200/60">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold therapeutic-accent">Your Progress Engine</h4>
          <div className="flex items-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-sunrise-amber-500 animate-pulse" />
            <span className="font-bold">{Math.round(completionRate)}%</span>
          </div>
        </div>
        
        <Progress 
          value={completionRate} 
          className="h-3 mb-2"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedCount} of {allTimeFrameActions.length} completed</span>
          <span className="italic">
            {completionRate > 75 ? "Exceptional momentum! 🚀" 
             : completionRate > 50 ? "Building strong habits! 💪"
             : "Every step counts! ✨"}
          </span>
        </div>
      </div>

      {/* Daily Wins Highlight */}
      {dailyWins.length > 0 && (
        <div className="success-glow rounded-lg p-3 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-sunrise-amber-500 animate-pulse" />
            <span className="text-sm font-bold healing-accent">Victory Celebrations</span>
          </div>
          <div className="space-y-1">
            {dailyWins.map(win => (
              <div key={win.id} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="animate-pulse">🌟</span>
                <span>{win.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Summary Stats */}
      {allTimeFrameActions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-memory-emerald-50 border border-memory-emerald-200/60 neural-pathway-effect">
            <div className="text-xl font-bold text-memory-emerald-700">
              {allTimeFrameActions.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-xs text-memory-emerald-600 font-medium">Victories</div>
          </div>
          <div className="p-3 rounded-lg bg-brain-health-50 border border-brain-health-200/60 neural-pathway-effect">
            <div className="text-xl font-bold text-brain-health-700">
              {allTimeFrameActions.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-xs text-brain-health-600 font-medium">In Progress</div>
          </div>
          <div className="p-3 rounded-lg bg-sunrise-amber-50 border border-sunrise-amber-200/60 neural-pathway-effect">
            <div className="text-xl font-bold text-sunrise-amber-700">
              {dailyWins.length}
            </div>
            <div className="text-xs text-sunrise-amber-600 font-medium">Daily Wins</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All', count: getFilteredActions().length },
          { key: 'pending', label: 'Active', count: getFilteredActions().filter(a => a.status === 'pending').length },
          { key: 'completed', label: 'Done', count: getFilteredActions().filter(a => a.status === 'completed').length }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.key as any)}
            className={cn(
              "text-xs",
              filter === tab.key && "premium-button text-white"
            )}
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.length > 0 ? (
          filteredActions.slice(0, 6).map((action) => (
            <div
              key={action.id}
              className={cn(
                "group flex items-start gap-3 p-4 rounded-lg border transition-all neural-pathway-effect",
                action.status === 'completed'
                  ? "success-glow bg-memory-emerald-50 border-memory-emerald-200"
                  : "bg-background border-border/50 hover:border-brain-health-200 hover:shadow-sm"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleComplete(action.id)}
                className="h-6 w-6 p-0 rounded-full neural-pulse shrink-0 mt-0.5"
                disabled={action.status === 'completed'}
              >
                {action.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500 victory-celebration" />
                ) : (
                  <Circle className="h-5 w-5 text-brain-health-400 hover:text-brain-health-600" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <p className={cn(
                    "text-sm font-medium flex-1",
                    action.status === 'completed' && "line-through text-muted-foreground"
                  )}>
                    {action.title}
                  </p>
                  
                  {action.is_daily_win && (
                    <Star className="h-4 w-4 text-sunrise-amber-500 animate-pulse shrink-0" />
                  )}
                  
                  {action.goal_id && (
                    <Target className="h-4 w-4 text-beacon-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  {action.start_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{action.start_time}</span>
                    </div>
                  )}
                  
                  {action.duration_minutes && (
                    <span>{action.duration_minutes}min</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {action.focus_area && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs border",
                        getActionBadgeColor(action.focus_area)
                      )}
                    >
                      <span className="mr-1" role="img" aria-label={action.focus_area}>
                        {getFocusAreaIcon(action.focus_area)}
                      </span>
                      {action.focus_area}
                    </Badge>
                  )}
                  
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-xs border",
                    getPriorityColor(action.difficulty_level)
                  )}>
                    {action.difficulty_level >= 4 ? 'High Impact' 
                     : action.difficulty_level >= 2 ? 'Medium' 
                     : 'Light & Easy'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl mb-3">🎯</div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Ready to take meaningful action?
              </p>
              <p className="text-xs text-muted-foreground italic">
                Every action brings you closer to your dreams
              </p>
            </div>
            <Button size="sm" className="premium-button text-white mt-4">
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Action
            </Button>
          </div>
        )}
      </div>

      {filteredActions.length > 6 && (
        <div className="text-center">
          <Button variant="outline" size="sm" className="text-xs">
            View All Actions ({filteredActions.length})
          </Button>
        </div>
      )}
    </div>
  );
}