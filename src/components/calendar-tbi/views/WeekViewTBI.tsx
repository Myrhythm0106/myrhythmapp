
import React from 'react';
import { Card } from '@/components/ui/card';
import { TBIEvent } from '../types/calendarTypes';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';

interface WeekViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
}

export function WeekViewTBI({ currentDate, events, onDayClick }: WeekViewTBIProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Week at a Glance</h1>
        <p className="text-gray-600">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </p>
      </div>

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
