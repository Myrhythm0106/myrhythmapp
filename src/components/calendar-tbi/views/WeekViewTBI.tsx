import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UnifiedHeader } from '../components/UnifiedHeader';
import { NavigationHeader } from '../components/NavigationHeader';
import { TBIEvent } from '../types/calendarTypes';
import { DailyAction } from '@/contexts/DailyActionsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  actions: DailyAction[];
  onDayClick: (date: Date) => void;
  priorities: { p1: string; p2: string; p3: string };
  updatePriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  scopeLabel: string;
  scopeGradient: string;
  onDateChange: (date: Date) => void;
}

export function WeekViewTBI({ currentDate, events, actions, onDayClick, priorities, updatePriorities, scopeLabel, scopeGradient, onDateChange }: WeekViewTBIProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startTime, date)
    );
  };

  const getActionsForDay = (date: Date) => {
    return actions.filter(action => 
      action.date && isSameDay(new Date(action.date), date)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Week at a Glance"
        viewType="week"
        currentDate={currentDate}
      />
      
      <NavigationHeader
        currentDate={currentDate}
        viewType="week"
        onDateChange={onDateChange}
      />

      {/* Empowerment Banner - P1, P2, P3 Priorities */}
      <Card className={`bg-gradient-to-r ${scopeGradient} text-white`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {scopeLabel} Focus - I AM Empowered
            </h2>
            <div className="text-sm opacity-90 font-medium">
              {scopeLabel} • Year → Month → Week → Day
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* P1 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P1 - Most Important</label>
              <Input
                value={priorities.p1}
                onChange={(e) => updatePriorities('p1', e.target.value)}
                placeholder="Your top priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P2 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P2 - Important</label>
              <Input
                value={priorities.p2}
                onChange={(e) => updatePriorities('p2', e.target.value)}
                placeholder="Second priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P3 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P3 - Nice to Have</label>
              <Input
                value={priorities.p3}
                onChange={(e) => updatePriorities('p3', e.target.value)}
                placeholder="Third priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Week Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayActions = getActionsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all hover:shadow-md ${isToday ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Activity Headlines */}
                  <div className="mt-3 space-y-1">
                    {dayActions.slice(0, 2).map((action, actionIndex) => (
                      <div
                        key={actionIndex}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full truncate"
                        title={action.title}
                      >
                        • {action.title.length > 15 ? action.title.substring(0, 15) + '...' : action.title}
                      </div>
                    ))}
                    {dayActions.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayActions.length - 2} more
                      </div>
                    )}
                    {dayActions.length === 0 && dayEvents.length > 0 && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {dayEvents.length} events
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}