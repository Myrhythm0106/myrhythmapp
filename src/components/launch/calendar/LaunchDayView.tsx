import React from 'react';
import { Clock } from 'lucide-react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';

interface Event {
  time: string;
  title: string;
  type: string;
}

interface LaunchDayViewProps {
  date: Date;
  events: Event[];
  className?: string;
}

export function LaunchDayView({ date, events, className = '' }: LaunchDayViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      routine: 'bg-brand-emerald-400',
      appointment: 'bg-blue-400',
      medical: 'bg-red-400',
      activity: 'bg-purple-400',
      social: 'bg-amber-400',
      rest: 'bg-brand-teal-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <LaunchCommitmentBanner scope="day" date={date} />

      {sortedEvents.length === 0 ? (
        <LaunchCard className="p-8 text-center">
          <p className="text-gray-500">No events scheduled for today</p>
          <p className="text-sm text-brand-teal-600 mt-2">Tap "+ Add" to create one</p>
        </LaunchCard>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event, i) => (
            <LaunchCard key={i} variant="glass" className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[50px]">
                  <p className="text-sm font-bold text-gray-900">{event.time}</p>
                </div>
                <div className={cn("w-1 h-12 rounded-full", getTypeColor(event.type))} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{event.type}</p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </LaunchCard>
          ))}
        </div>
      )}
    </div>
  );
}
