import React from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  format 
} from 'date-fns';
import { Bell } from 'lucide-react';
import { LaunchActionReminder } from '@/hooks/useLaunchActionReminders';

interface Event {
  time: string;
  title: string;
  type: string;
  date?: Date;
}

interface LaunchMonthViewProps {
  date: Date;
  events: Event[];
  reminders?: LaunchActionReminder[];
  onDaySelect: (date: Date) => void;
  className?: string;
  inheritedVision?: string;
}

export function LaunchMonthView({ 
  date, 
  events, 
  reminders = [],
  onDaySelect, 
  className = '',
  inheritedVision
}: LaunchMonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const today = new Date();
  const days: Date[] = [];
  let day = calendarStart;
  
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const hasEventsOnDay = (checkDay: Date) => {
    return events.some(e => e.date && isSameDay(e.date, checkDay));
  };

  const hasRemindersOnDay = (checkDay: Date) =>
    reminders.some(r => isSameDay(r.dueAt, checkDay));

  return (
    <div className={cn("space-y-4", className)}>
      {/* Vision Cascade Breadcrumb */}
      {inheritedVision && (
        <div className="text-sm text-brand-teal-600 flex items-center gap-2 px-1">
          <span>{inheritedVision}</span>
        </div>
      )}

      <LaunchCommitmentBanner 
        scope="month" 
        date={date}
        inheritedVision={inheritedVision}
      />

      <LaunchCard className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((calDay) => {
            const isCurrentMonth = isSameMonth(calDay, date);
            const isToday = isSameDay(calDay, today);
            const hasEvents = hasEventsOnDay(calDay);
            const hasReminders = hasRemindersOnDay(calDay);
            
            return (
              <button
                key={calDay.toISOString()}
                onClick={() => onDaySelect(calDay)}
                className={cn(
                  "aspect-square rounded-lg text-sm relative transition-all",
                  isCurrentMonth ? "text-gray-700" : "text-gray-300",
                  isToday && "bg-brand-emerald-500 text-white font-bold",
                  !isToday && isCurrentMonth && "hover:bg-gray-100"
                )}
              >
                {format(calDay, 'd')}
                {hasEvents && !isToday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-emerald-500 rounded-full" />
                )}
                {hasReminders && (
                  <Bell className={cn(
                    "absolute top-1 right-1 h-2.5 w-2.5",
                    isToday ? "text-white/90" : "text-launch-ember"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </LaunchCard>
    </div>
  );
}
