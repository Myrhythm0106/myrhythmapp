
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { TBIEvent } from '../types/calendarTypes';
import { getEventTypeIcon, formatEventTime } from '../utils/eventUtils';

interface CompletedTasksListProps {
  events: TBIEvent[];
  showList?: boolean;
}

export function CompletedTasksList({ events, showList = true }: CompletedTasksListProps) {
  if (events.length === 0) {
    return null;
  }

  if (!showList) {
    return (
      <Card className="p-3 bg-green-50 border-green-200">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <Check className="h-5 w-5" />
          <span className="font-medium">{events.length} task{events.length > 1 ? 's' : ''} completed today</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <Check className="h-5 w-5 text-green-600" />
        <h3 className="font-medium text-green-800">Completed Today</h3>
      </div>
      
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-2 text-sm text-gray-600 opacity-75">
            <span className="text-base">{getEventTypeIcon(event.type)}</span>
            <span className="line-through">{event.title}</span>
            <span className="text-xs ml-auto">{formatEventTime(event.startTime)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
