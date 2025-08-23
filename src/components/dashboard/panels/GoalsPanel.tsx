import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useWeeklyGoal } from '@/contexts/WeeklyGoalContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Circle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoalsPanel() {
  const { filters } = useDashboard();
  const { currentGoal, goalProgress } = useWeeklyGoal();

  // Mock priorities for now - would come from goal system
  const priorities = [
    { id: '1', title: 'Morning meditation', category: currentGoal?.category || 'health', completed: false },
    { id: '2', title: 'Brain training exercise', category: currentGoal?.category || 'cognitive', completed: true },
    { id: '3', title: 'Physical movement', category: currentGoal?.category || 'health', completed: false }
  ];
  const completedPriorities = priorities.filter(p => p.completed).length;

  return (
    <div className="h-full space-y-4">
      {/* Current Goal Section */}
      {currentGoal ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-brain-health-500" />
              Current Focus
            </h4>
            <div className="text-xs text-muted-foreground">
              {completedPriorities}/{priorities.length} done
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 p-3 rounded-lg border border-brain-health-200/60">
            <h5 className="font-medium text-sm mb-2">{currentGoal.title}</h5>
            <Progress 
              value={goalProgress} 
              className="h-2 mb-2" 
            />
            <p className="text-xs text-muted-foreground">
              {goalProgress}% complete • Weekly Goal
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mb-3">No active goal set</p>
          <Button size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Set Goal
          </Button>
        </div>
      )}

      {/* Priorities List */}
      {priorities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Today's Priorities</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {priorities.slice(0, 5).map((priority) => (
              <div
                key={priority.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-all",
                  priority.completed 
                    ? "bg-memory-emerald-50/50 border border-memory-emerald-200/60"
                    : "bg-brain-health-50/50 border border-brain-health-200/60 hover:bg-brain-health-50"
                )}
              >
                {priority.completed ? (
                  <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 text-brain-health-400" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    priority.completed && "line-through text-muted-foreground"
                  )}>
                    {priority.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {priority.category}
                  </p>
                </div>

                <div className={cn(
                  "w-2 h-2 rounded-full",
                  priority.category === 'health' && "bg-memory-emerald-400",
                  priority.category === 'cognitive' && "bg-brain-health-400",
                  priority.category === 'emotional' && "bg-clarity-teal-400",
                  priority.category === 'social' && "bg-sunrise-amber-400"
                )} />
              </div>
            ))}
          </div>

          {priorities.length > 5 && (
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Priorities ({priorities.length})
            </Button>
          )}
        </div>
      )}

      {/* Goal Traceability */}
      <div className="pt-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Linked to 0 actions
          </p>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            View Links
          </Button>
        </div>
      </div>
    </div>
  );
}