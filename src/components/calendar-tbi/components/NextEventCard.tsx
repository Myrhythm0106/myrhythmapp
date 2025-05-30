
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { TBIEvent } from '../types/calendarTypes';
import { getEventTypeColor, getEventTypeIcon, formatEventTime, getTimeUntilEvent } from '../utils/eventUtils';

interface NextEventCardProps {
  event: TBIEvent | null;
  showTimeUntil?: boolean;
}

export function NextEventCard({ event, showTimeUntil = true }: NextEventCardProps) {
  if (!event) {
    return (
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="text-center text-gray-500">
          <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No upcoming events</p>
        </div>
      </Card>
    );
  }

  const eventColor = getEventTypeColor(event.type);
  const eventIcon = getEventTypeIcon(event.type);
  const timeUntil = getTimeUntilEvent(event.startTime);

  return (
    <Card className="border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: eventColor }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{eventIcon}</span>
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">NEXT</span>
          {showTimeUntil && (
            <span className="text-sm text-gray-500">• {timeUntil}</span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{formatEventTime(event.startTime)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {event.caregiverNotes && (
          <div className="mt-3 p-2 bg-yellow-50 border-l-2 border-yellow-300 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> {event.caregiverNotes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
