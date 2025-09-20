
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isToday, 
  isSameDay 
} from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';
import { NavigationHeader } from '../components/NavigationHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TBIEvent } from '../types/calendarTypes';
import { getEventTypeColor } from '../utils/eventUtils';

interface MonthViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
  priorities: { p1: string; p2: string; p3: string };
  updatePriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  scopeLabel: string;
  scopeGradient: string;
  onDateChange: (date: Date) => void;
}

export function MonthViewTBI({ currentDate, events, onDayClick, priorities, updatePriorities, scopeLabel, scopeGradient, onDateChange }: MonthViewTBIProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      <UnifiedHeader 
        viewTitle="My Monthly View"
        viewType="month"
        currentDate={currentDate}
      />
      
      <NavigationHeader
        currentDate={currentDate}
        viewType="month"
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

      <Card className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((dayName) => (
            <div key={dayName} className="text-center text-xs font-medium text-gray-500 py-2">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square p-1 cursor-pointer transition-all hover:bg-gray-100 rounded
                  ${isCurrentDay ? 'bg-blue-100 border border-blue-300' : ''}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                `}
                onClick={() => onDayClick(day)}
              >
                <div className="h-full flex flex-col">
                  <div className={`text-xs text-center mb-1 ${
                    isCurrentDay ? 'font-bold text-blue-700' : 
                    isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={index}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getEventTypeColor(event.type) }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-3 bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>Events</span>
            </div>
          </div>
          <p className="mt-1">Tap any day to view details</p>
        </div>
      </Card>
    </div>
  );
}
