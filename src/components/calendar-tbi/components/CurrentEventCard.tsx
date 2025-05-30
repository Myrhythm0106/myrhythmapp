
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, MapPin, Phone } from 'lucide-react';
import { TBIEvent } from '../types/calendarTypes';
import { getEventTypeColor, getEventTypeIcon, formatEventDuration, getTimeUntilEvent } from '../utils/eventUtils';

interface CurrentEventCardProps {
  event: TBIEvent | null;
  onMarkComplete?: (eventId: string) => void;
  showCompleteButton?: boolean;
}

export function CurrentEventCard({ event, onMarkComplete, showCompleteButton = true }: CurrentEventCardProps) {
  if (!event) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">All Clear!</h2>
          <p className="text-gray-600">No current activities</p>
        </div>
      </Card>
    );
  }

  const eventColor = getEventTypeColor(event.type);
  const eventIcon = getEventTypeIcon(event.type);
  
  // Calculate progress if event has start and end times
  const now = new Date();
  const totalDuration = event.endTime.getTime() - event.startTime.getTime();
  const elapsed = now.getTime() - event.startTime.getTime();
  const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: eventColor }}>
      <div 
        className="p-4 text-white font-bold text-center"
        style={{ backgroundColor: eventColor }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">{eventIcon}</span>
          <span className="text-lg">NOW</span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {event.title}
        </h2>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{formatEventDuration(event.startTime, event.endTime)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.contactPerson && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{event.contactPerson}</span>
              {event.contactPhone && (
                <span className="text-blue-600 ml-1">{event.contactPhone}</span>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {event.caregiverNotes && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 mb-1">Remember:</h4>
            <p className="text-blue-800 text-sm">{event.caregiverNotes}</p>
          </div>
        )}

        {showCompleteButton && onMarkComplete && (
          <Button 
            onClick={() => onMarkComplete(event.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          >
            <Check className="mr-2 h-5 w-5" />
            Mark as Complete
          </Button>
        )}
      </div>
    </Card>
  );
}
