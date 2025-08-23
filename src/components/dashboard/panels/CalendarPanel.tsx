import React, { useState } from 'react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears, isToday, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Circle, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { CalendarIntegration } from '@/components/calendar/CalendarIntegration';

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

  const todayActions = getActionsForDate(filters.selectedDate);
  const completedCount = todayActions.filter(a => a.status === 'completed').length;

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
                  "aspect-square rounded-md p-1 text-xs transition-all relative neural-pathway-effect",
                  "hover:bg-brain-health-50",
                  isSelected && "cognitive-enhancement text-white font-medium",
                  isToday && "success-glow",
                  dayActions.length > 0 && "memory-anchor"
                )}
              >
                {format(day, 'd')}
                {dayActions.length > 0 && (
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-clarity-teal-500 rounded-full animate-pulse" />
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
      <div className="space-y-6">
        {/* Day Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="h-8 neural-pathway-effect hover:scale-105 transition-transform"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <h3 className="text-lg font-bold therapeutic-accent">
              {format(filters.selectedDate, 'EEEE')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {format(filters.selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
            className="h-8 neural-pathway-effect hover:scale-105 transition-transform"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Overview */}
        <div className="empowerment-gradient rounded-xl p-4 border border-brain-health-200/60 neural-pathway-effect relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brain-health-100/30 via-clarity-teal-100/30 to-memory-emerald-100/30 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-brain-health-500" />
                <span className="text-sm font-bold">Today's Journey</span>
              </div>
              {isToday(filters.selectedDate) && (
                <Badge className="bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200 animate-pulse">
                  Live Now
                </Badge>
              )}
            </div>
            
            {todayActions.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {completedCount} of {todayActions.length} completed
                  </span>
                  <span className="font-bold therapeutic-accent">
                    {Math.round((completedCount / todayActions.length) * 100)}% Complete
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {isToday(filters.selectedDate) 
                  ? "Ready to create your perfect day? 🌟" 
                  : "No actions planned for this day"}
              </p>
            )}
          </div>
        </div>

        {/* Integrated Day View */}
        <CalendarIntegration
          date={filters.selectedDate}
          onViewActions={() => console.log('Navigate to actions')}
          onViewGoals={() => console.log('Navigate to goals')}
          onViewSupport={() => console.log('Navigate to support circle')}
          onViewMemories={() => console.log('Navigate to memory bridge')}
        />

        {/* Actions for Selected Day */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold therapeutic-accent flex items-center gap-2">
            <Star className="h-4 w-4 text-sunrise-amber-500 animate-pulse" />
            {isToday(filters.selectedDate) ? "Today's Power Moves" : `Actions for ${format(filters.selectedDate, 'MMM d')}`}
          </h4>
          
          {todayActions.length > 0 ? (
            todayActions.slice(0, 4).map((action) => (
              <div
                key={action.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all neural-pathway-effect group relative overflow-hidden",
                  action.status === 'completed'
                    ? "success-glow bg-memory-emerald-50 border-memory-emerald-200"
                    : "bg-background border-border/50 hover:border-brain-health-200 hover:shadow-sm"
                )}
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-brain-health-100/20 to-clarity-teal-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="mt-0.5 relative z-10">
                  {action.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-memory-emerald-500 victory-celebration" />
                  ) : (
                    <Circle className="h-4 w-4 text-brain-health-400 group-hover:scale-105 transition-transform" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-start justify-between mb-1">
                    <p className={cn(
                      "text-sm font-medium",
                      action.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {action.title}
                    </p>
                    
                    {action.is_daily_win && (
                      <Star className="h-3 w-3 text-sunrise-amber-500 animate-pulse shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {action.start_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{action.start_time}</span>
                      </div>
                    )}
                    
                    {action.focus_area && (
                      <Badge variant="secondary" className="text-xs neural-pathway-effect">
                        {action.focus_area}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 space-y-3 empowerment-gradient rounded-lg border border-brain-health-200/60">
              <div className="text-4xl mb-2">🎯</div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {isToday(filters.selectedDate) 
                    ? "Ready to design your perfect day?"
                    : "No actions planned for this day"}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Every action is a step toward your best self
                </p>
              </div>
              <Button size="sm" className="premium-button text-white mt-2">
                Create Action
              </Button>
            </div>
          )}
          
          {todayActions.length > 4 && (
            <Button variant="outline" size="sm" className="w-full text-xs neural-pathway-effect">
              View All {todayActions.length} Actions
            </Button>
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
            className={cn(
              "text-xs",
              localView === 'mini' && "premium-button text-white"
            )}
          >
            Week
          </Button>
          <Button
            variant={localView === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLocalView('day')}
            className={cn(
              "text-xs",
              localView === 'day' && "premium-button text-white"
            )}
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}