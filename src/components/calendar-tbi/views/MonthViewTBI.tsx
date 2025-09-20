
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TBIEvent } from '../types/calendarTypes';
import { getEventTypeColor } from '../utils/eventUtils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isToday,
  isSameMonth 
} from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';

interface MonthViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
  p1Priority: string;
  setP1Priority: (value: string) => void;
  p2Priority: string;
  setP2Priority: (value: string) => void;
  p3Priority: string;
  setP3Priority: (value: string) => void;
}

export function MonthViewTBI({ currentDate, events, onDayClick, p1Priority, setP1Priority, p2Priority, setP2Priority, p3Priority, setP3Priority }: MonthViewTBIProps) {
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
        dateInfo={format(currentDate, 'MMMM yyyy')}
        viewType="month"
        currentDate={currentDate}
      />

      {/* Empowerment Banner - P1, P2, P3 Priorities */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Today, I choose... I AM Empowered
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* P1 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P1 - Most Important</label>
              <Input
                value={p1Priority}
                onChange={(e) => setP1Priority(e.target.value)}
                placeholder="Your top priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P2 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P2 - Important</label>
              <Input
                value={p2Priority}
                onChange={(e) => setP2Priority(e.target.value)}
                placeholder="Second priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P3 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P3 - Nice to Have</label>
              <Input
                value={p3Priority}
                onChange={(e) => setP3Priority(e.target.value)}
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
