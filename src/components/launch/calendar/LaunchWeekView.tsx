import React, { useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';
import { addDays, startOfWeek, isSameDay, format } from 'date-fns';

interface Event {
  time: string;
  title: string;
  type: string;
  date?: Date;
}

interface LaunchWeekViewProps {
  date: Date;
  events: Event[];
  onDaySelect: (date: Date) => void;
  className?: string;
  inheritedVision?: string;
  inheritedMonthFocus?: string;
}

export function LaunchWeekView({ 
  date, 
  events, 
  onDaySelect, 
  className = '',
  inheritedVision,
  inheritedMonthFocus
}: LaunchWeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const getEventsForDay = (day: Date) => {
    return events.filter(e => e.date && isSameDay(e.date, day));
  };

  // Build breadcrumb
  const breadcrumbParts = [];
  if (inheritedVision) breadcrumbParts.push(`🌟 ${inheritedVision}`);
  if (inheritedMonthFocus) breadcrumbParts.push(inheritedMonthFocus);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Vision Cascade Breadcrumb */}
      {breadcrumbParts.length > 0 && (
        <div className="text-sm text-brand-teal-600 flex items-center gap-2 flex-wrap px-1">
          {breadcrumbParts.map((part, i) => (
            <React.Fragment key={i}>
              <span className={i === breadcrumbParts.length - 1 ? 'font-medium' : ''}>
                {part}
              </span>
              {i < breadcrumbParts.length - 1 && (
                <span className="text-brand-teal-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <LaunchCommitmentBanner 
        scope="week" 
        date={date}
        inheritedVision={inheritedVision}
        inheritedFocus={inheritedMonthFocus}
      />

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, today);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDaySelect(day)}
              className={cn(
                "p-3 rounded-xl text-center transition-all min-h-[100px] flex flex-col",
                isToday 
                  ? "bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500 text-white shadow-lg"
                  : "bg-white border border-gray-100 hover:border-brand-emerald-300 hover:shadow-md"
              )}
            >
              <span className={cn(
                "text-xs font-medium",
                isToday ? "text-white/80" : "text-gray-400"
              )}>
                {format(day, 'EEE')}
              </span>
              <span className={cn(
                "text-lg font-bold mt-1",
                isToday ? "text-white" : "text-gray-900"
              )}>
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <div className={cn(
                  "mt-auto pt-2 text-xs font-medium",
                  isToday ? "text-white/90" : "text-brand-emerald-600"
                )}>
                  {dayEvents.length} event{dayEvents.length !== 1 && 's'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Today's Preview */}
      <LaunchCard className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          {format(date, 'EEEE, MMMM d')}
        </h3>
        {events.filter(e => !e.date || isSameDay(e.date, date)).slice(0, 3).map((event, i) => (
          <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm font-medium text-gray-500 w-12">{event.time}</span>
            <span className="text-sm text-gray-900">{event.title}</span>
          </div>
        ))}
      </LaunchCard>
    </div>
  );
}
