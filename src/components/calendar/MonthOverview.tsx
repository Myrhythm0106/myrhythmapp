import React from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { cn } from '@/lib/utils';

interface MonthOverviewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onDateChange: (date: Date) => void;
}

export function MonthOverview({ selectedDate, onDateSelect, onDateChange }: MonthOverviewProps) {
  const { actions } = useDailyActions();
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get actions count for each day
  const getDayActions = (date: Date) => {
    return actions.filter(action => 
      action.date && isSameDay(new Date(action.date), date)
    ).length;
  };

  const getDayCompletedActions = (date: Date) => {
    return actions.filter(action => 
      action.date && 
      isSameDay(new Date(action.date), date) && 
      action.status === 'completed'
    ).length;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
    onDateChange(newDate);
  };

  return (
    <SurfaceCard variant="elevated" padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-brain-health-600" />
            <h2 className="text-xl font-semibold text-foreground">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {monthDays.map((day) => {
              const actionsCount = getDayActions(day);
              const completedCount = getDayCompletedActions(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const hasActions = actionsCount > 0;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => onDateSelect(day)}
                  className={cn(
                    "relative p-3 rounded-lg text-sm font-medium transition-all hover:shadow-sm",
                    "min-h-[60px] flex flex-col items-center justify-center gap-1",
                    isSelected 
                      ? "bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 text-white shadow-md"
                      : isTodayDate
                      ? "bg-gradient-to-br from-brain-health-100 to-clarity-teal-100 border border-brain-health-300 text-brain-health-700"
                      : hasActions
                      ? "bg-gradient-to-br from-memory-emerald-50 to-brain-health-50 border border-memory-emerald-200 hover:border-brain-health-300"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-sm font-medium">
                    {format(day, 'd')}
                  </span>
                  
                  {hasActions && (
                    <div className="flex items-center gap-1">
                      <Circle className={cn(
                        "h-1.5 w-1.5 fill-current",
                        isSelected 
                          ? "text-white/80"
                          : completedCount === actionsCount
                          ? "text-memory-emerald-500"
                          : "text-brain-health-500"
                      )} />
                      <span className={cn(
                        "text-xs",
                        isSelected 
                          ? "text-white/80"
                          : "text-muted-foreground"
                      )}>
                        {actionsCount}
                      </span>
                    </div>
                  )}

                  {isTodayDate && !isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-brain-health-500 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Circle className="h-1.5 w-1.5 fill-current text-brain-health-500" />
              <span>Has actions</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="h-1.5 w-1.5 fill-current text-memory-emerald-500" />
              <span>Completed</span>
            </div>
          </div>
          <div className="text-right">
            <div>Today</div>
            <div className="w-2 h-2 bg-brain-health-500 rounded-full ml-auto mt-0.5" />
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}