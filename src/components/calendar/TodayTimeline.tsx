import React from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Circle, CheckCircle2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { cn } from '@/lib/utils';

interface TodayTimelineProps {
  selectedDate: Date;
  onAddAction: () => void;
}

export function TodayTimeline({ selectedDate, onAddAction }: TodayTimelineProps) {
  const { actions } = useDailyActions();
  
  const todaysActions = actions.filter(action => 
    action.date && isSameDay(new Date(action.date), selectedDate)
  ).sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return a.start_time.localeCompare(b.start_time);
  });

  const completedCount = todaysActions.filter(action => action.status === 'completed').length;
  const totalCount = todaysActions.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <SurfaceCard className="h-full" padding="lg">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isToday ? "Today's Timeline" : format(selectedDate, "EEEE's Timeline")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount > 0 
                ? `${completedCount} of ${totalCount} completed`
                : "No actions scheduled"
              }
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddAction}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Daily Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex-1 space-y-3">
          {todaysActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                {isToday ? "No actions planned for today" : "No actions on this day"}
              </h3>
              <p className="text-sm text-muted-foreground/80 mb-4 max-w-sm">
                {isToday 
                  ? "Start by adding your first action to make this day productive and fulfilling."
                  : "Select a different date or add actions to get started."
                }
              </p>
              <Button
                variant="outline"
                onClick={onAddAction}
                className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200 hover:from-brain-health-100 hover:to-clarity-teal-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Action
              </Button>
            </div>
          ) : (
            todaysActions.map((action, index) => (
              <div 
                key={action.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm",
                  action.status === 'completed' 
                    ? "bg-memory-emerald-50/50 border-memory-emerald-200/50" 
                    : "bg-card border-border/30 hover:border-brain-health-200"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {action.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-memory-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {action.start_time && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {action.start_time}
                      </Badge>
                    )}
                    {action.duration_minutes && (
                      <span className="text-xs text-muted-foreground">
                        {action.duration_minutes}m
                      </span>
                    )}
                  </div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    action.status === 'completed' 
                      ? "line-through text-muted-foreground" 
                      : "text-foreground"
                  )}>
                    {action.title}
                  </h4>
                  {action.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {action.description}
                    </p>
                  )}
                </div>

                {action.focus_area && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-brain-health-100 text-brain-health-700"
                  >
                    {action.focus_area}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}