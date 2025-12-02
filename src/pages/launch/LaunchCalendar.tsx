import React from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Calendar, Clock, Plus, Share2 } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';

export default function LaunchCalendar() {
  const today = new Date();
  const events = [
    { time: '09:00', title: 'Morning routine', type: 'routine' },
    { time: '10:30', title: 'Call Dr. Smith', type: 'appointment' },
    { time: '14:00', title: 'Physical therapy', type: 'medical' },
    { time: '16:00', title: 'Brain game session', type: 'activity' },
  ];

  return (
    <LaunchLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <LaunchButton variant="secondary" size="icon">
          <Share2 className="h-5 w-5" />
        </LaunchButton>
      </div>

      {/* Mini Calendar */}
      <LaunchCard className="mb-6">
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={day + i} className="text-xs font-medium text-gray-400 py-2">{day}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i - 3 + 1; // Offset for month start
            const isToday = dayNum === today.getDate();
            const hasEvent = [5, 8, 12, 15, today.getDate()].includes(dayNum);
            
            return (
              <button
                key={i}
                className={`py-2 text-sm rounded-lg relative ${
                  dayNum < 1 || dayNum > 31 ? 'text-gray-200' :
                  isToday ? 'bg-brand-emerald-500 text-white font-bold' :
                  'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dayNum >= 1 && dayNum <= 31 ? dayNum : ''}
                {hasEvent && !isToday && dayNum >= 1 && dayNum <= 31 && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </LaunchCard>

      {/* Today's Events */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
        <button className="text-sm text-brand-emerald-600 font-medium">+ Add</button>
      </div>

      <div className="space-y-3 mb-24">
        {events.map((event, i) => (
          <LaunchCard key={i} variant="glass" className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[50px]">
                <p className="text-sm font-bold text-gray-900">{event.time}</p>
              </div>
              <div className="w-1 h-12 bg-brand-emerald-400 rounded-full" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500 capitalize">{event.type}</p>
              </div>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </LaunchCard>
        ))}
      </div>
    </LaunchLayout>
  );
}
