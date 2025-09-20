
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TBIEvent } from '../types/calendarTypes';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';

interface WeekViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
  priorities: { p1: string; p2: string; p3: string };
  updatePriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  scopeLabel: string;
  scopeGradient: string;
}

export function WeekViewTBI({ currentDate, events, onDayClick, priorities, updatePriorities, scopeLabel, scopeGradient }: WeekViewTBIProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Week at a Glance"
        dateInfo={`${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`}
        viewType="week"
        currentDate={currentDate}
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
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <Card
              key={day.toISOString()}
              className={`p-4 cursor-pointer transition-all hover:shadow-md min-h-[120px] ${
                isCurrentDay ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white'
              }`}
              onClick={() => onDayClick(day)}
            >
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${
                  isCurrentDay ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {format(day, 'EEE')}
                </div>
                
                {dayEvents.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </div>
                )}
                
                {dayEvents.length === 0 && (
                  <div className="text-xs text-gray-400">
                    Free
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
