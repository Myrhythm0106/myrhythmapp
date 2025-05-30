
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrentEventCard } from '../components/CurrentEventCard';
import { NextEventCard } from '../components/NextEventCard';
import { CompletedTasksList } from '../components/CompletedTasksList';
import { EnergyLevelInput } from '../components/EnergyLevelInput';
import { TBIEvent, EnergyLevel, DayData } from '../types/calendarTypes';
import { getCurrentEvent, getNextEvent, getCompletedEventsToday } from '../utils/eventUtils';
import { format } from 'date-fns';
import { Calendar, Settings, Users } from 'lucide-react';

interface DayViewTBIProps {
  dayData: DayData;
  userRole: 'individual' | 'caregiver';
  onEventComplete?: (eventId: string) => void;
  onEnergyLevelChange?: (level: EnergyLevel) => void;
  onOpenSettings?: () => void;
  onOpenCaregiver?: () => void;
}

export function DayViewTBI({ 
  dayData, 
  userRole, 
  onEventComplete, 
  onEnergyLevelChange,
  onOpenSettings,
  onOpenCaregiver
}: DayViewTBIProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const currentEvent = getCurrentEvent(dayData.events);
  const nextEvent = getNextEvent(dayData.events);
  const completedEvents = getCompletedEventsToday(dayData.events);
  
  const todayFormatted = format(dayData.date, 'EEEE, MMMM do');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-600">{todayFormatted}</p>
        </div>
        
        <div className="flex gap-2">
          {userRole === 'individual' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenCaregiver}
              className="flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              Support
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onOpenSettings}
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Time */}
      <Card className="p-4 mb-6 bg-white border-blue-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {format(currentTime, 'h:mm a')}
          </div>
          <div className="text-sm text-gray-600">
            {format(currentTime, 'EEEE, MMMM do, yyyy')}
          </div>
        </div>
      </Card>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Current Event */}
        <CurrentEventCard
          event={currentEvent}
          onMarkComplete={onEventComplete}
          showCompleteButton={userRole === 'individual'}
        />

        {/* Next Event */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coming Up
          </h2>
          <NextEventCard event={nextEvent} />
        </div>

        {/* Energy Level Input - Only for individuals */}
        {userRole === 'individual' && (
          <EnergyLevelInput
            currentLevel={dayData.energyLevel}
            onLevelChange={onEnergyLevelChange || (() => {})}
          />
        )}

        {/* Completed Tasks */}
        {completedEvents.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Great Work!
            </h2>
            <CompletedTasksList 
              events={completedEvents}
              showList={completedEvents.length <= 3}
            />
          </div>
        )}

        {/* Encouragement Message */}
        {!currentEvent && !nextEvent && (
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-center">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              You're doing great!
            </h3>
            <p className="text-gray-600">
              Take some time to rest and recharge.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
