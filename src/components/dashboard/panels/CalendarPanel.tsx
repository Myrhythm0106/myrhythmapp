import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDailyActions } from '@/contexts/DailyActionsContext';

export function CalendarPanel() {
  const { filters, syncDate, syncTimeFrame } = useDashboard();
  const { actions } = useDailyActions();
  const [localView, setLocalView] = useState<'mini' | 'day' | 'week' | 'month'>('day');

  const navigateDate = (direction: 'prev' | 'next') => {
    const increment = filters.timeFrame === 'day' ? 1 : 
                     filters.timeFrame === 'week' ? 7 : 
                     filters.timeFrame === 'month' ? 30 : 365;
    
    const newDate = direction === 'next' 
      ? addDays(filters.selectedDate, increment)
      : subDays(filters.selectedDate, increment);
    
    syncDate(newDate);
  };

  const getActionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return actions.filter(action => action.date === dateStr);
  };

  const renderMiniCalendar = () => {
    const weekStart = startOfWeek(filters.selectedDate);
    const weekEnd = endOfWeek(filters.selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">This Week</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocalView('week')}
            className="text-xs"
          >
            View Full
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-muted-foreground py-1">
              {day}
            </div>
          ))}
          
          {weekDays.map((day) => {
            const dayActions = getActionsForDate(day);
            const isSelected = format(day, 'yyyy-MM-dd') === format(filters.selectedDate, 'yyyy-MM-dd');
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => syncDate(day)}
                className={cn(
                  "aspect-square rounded-md p-1 text-xs transition-all relative",
                  "hover:bg-brain-health-50",
                  isSelected && "bg-brain-health-100 text-brain-health-700 font-medium",
                  isToday && "ring-2 ring-brain-health-300"
                )}
              >
                {format(day, 'd')}
                {dayActions.length > 0 && (
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-clarity-teal-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const todayActions = getActionsForDate(filters.selectedDate);
    const completedCount = todayActions.filter(a => a.status === 'completed').length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">
              {format(filters.selectedDate, 'EEEE, MMMM d')}
            </h4>
            <p className="text-sm text-muted-foreground">
              {todayActions.length} actions • {completedCount} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todayActions.length > 0 ? (
            todayActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "p-3 rounded-lg border border-border/30 bg-gradient-to-r transition-all",
                  action.status === 'completed' 
                    ? "from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200"
                    : "from-brain-health-50 to-clarity-teal-50 border-brain-health-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{action.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {action.start_time} • {action.focus_area}
                    </p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    action.status === 'completed' ? "bg-memory-emerald-500" : "bg-brain-health-400"
                  )} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No actions scheduled</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {localView === 'mini' && renderMiniCalendar()}
      {localView === 'day' && renderDayView()}
      
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <Button
            variant={localView === 'mini' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLocalView('mini')}
            className="text-xs"
          >
            Week
          </Button>
          <Button
            variant={localView === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLocalView('day')}
            className="text-xs"
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}