
import React from 'react';
import { Card } from '@/components/ui/card';
import { TBIEvent, DayData } from '../types/calendarTypes';
import { getEventTypeColor, getEventTypeIcon, formatEventTime } from '../utils/eventUtils';
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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <Card
              key={day.toISOString()}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isCurrentDay ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
              onClick={() => onDayClick(day)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className={`font-medium ${isCurrentDay ? 'text-blue-700' : 'text-gray-900'}`}>
                    {format(day, 'EEEE')}
                  </h3>
                  <p className={`text-sm ${isCurrentDay ? 'text-blue-600' : 'text-gray-600'}`}>
                    {format(day, 'MMM d')}
                    {isCurrentDay && ' (Today)'}
                  </p>
                </div>
                
                {dayEvents.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{dayEvents.length}</span>
                    <div className="flex gap-1">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getEventTypeColor(event.type) }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-xs text-gray-400">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="flex items-center gap-2 text-sm">
                      <span className="text-base">{getEventTypeIcon(event.type)}</span>
                      <span className="text-gray-700 truncate">{event.title}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatEventTime(event.startTime)}
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 2} more events
                    </div>
                  )}
                </div>
              )}

              {dayEvents.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-2">
                  No events
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
