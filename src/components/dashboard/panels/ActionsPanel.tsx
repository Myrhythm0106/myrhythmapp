import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Circle, Zap, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function ActionsPanel() {
  const { filters } = useDashboard();
  const { actions } = useDailyActions();

  // Filter actions based on selected date and timeframe
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

  const filteredActions = getFilteredActions();
  const completedActions = filteredActions.filter(a => a.status === 'completed');
  const pendingActions = filteredActions.filter(a => a.status === 'pending' || a.status === 'skipped');

  const getActionIcon = (action: any) => {
    switch (action.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-memory-emerald-600" />;
      case 'in-progress':
        return <Zap className="h-4 w-4 text-sunrise-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-brain-health-400" />;
    }
  };

  const getActionBadgeColor = (focusArea: string) => {
    switch (focusArea) {
      case 'health': return 'bg-memory-emerald-100 text-memory-emerald-700';
      case 'cognitive': return 'bg-brain-health-100 text-brain-health-700';
      case 'emotional': return 'bg-clarity-teal-100 text-clarity-teal-700';
      case 'social': return 'bg-sunrise-amber-100 text-sunrise-amber-700';
      default: return 'bg-brain-health-100 text-brain-health-700';
    }
  };

  return (
    <div className="h-full space-y-4">
      {/* Summary Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Actions</h4>
          <Badge variant="secondary" className="text-xs">
            {completedActions.length}/{filteredActions.length}
          </Badge>
        </div>
        
        <Button size="sm" className="h-7 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      {/* Progress Overview */}
      {filteredActions.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-md bg-memory-emerald-50 border border-memory-emerald-200/60">
            <div className="text-lg font-semibold text-memory-emerald-700">
              {completedActions.length}
            </div>
            <div className="text-xs text-memory-emerald-600">Done</div>
          </div>
          <div className="p-2 rounded-md bg-sunrise-amber-50 border border-sunrise-amber-200/60">
            <div className="text-lg font-semibold text-sunrise-amber-700">
              {pendingActions.length}
            </div>
            <div className="text-xs text-sunrise-amber-600">Pending</div>
          </div>
          <div className="p-2 rounded-md bg-brain-health-50 border border-brain-health-200/60">
            <div className="text-lg font-semibold text-brain-health-700">
              {Math.round((completedActions.length / filteredActions.length) * 100)}%
            </div>
            <div className="text-xs text-brain-health-600">Progress</div>
          </div>
        </div>
      )}

      {/* Actions List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredActions.length > 0 ? (
          filteredActions.slice(0, 8).map((action) => (
            <div
              key={action.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                action.status === 'completed' 
                  ? "bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200/60"
                  : "bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200/60 hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-3">
                {getActionIcon(action)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={cn(
                      "font-medium text-sm truncate",
                      action.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {action.title}
                    </h5>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getActionBadgeColor(action.focus_area))}
                    >
                      {action.focus_area}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {action.start_time}
                    {action.goal_id && (
                      <span className="text-brain-health-600">• Linked to goal</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No actions for {filters.timeFrame}</p>
          </div>
        )}
      </div>

      {filteredActions.length > 8 && (
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View All Actions ({filteredActions.length})
        </Button>
      )}
    </div>
  );
}