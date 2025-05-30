
import React, { useState, useEffect } from 'react';
import { DayViewTBI } from './views/DayViewTBI';
import { TBIEvent, EnergyLevel, DayData, CalendarSettings } from './types/calendarTypes';
import { toast } from 'sonner';

// Mock data for demonstration
const mockEvents: TBIEvent[] = [
  {
    id: '1',
    title: 'Morning Medication',
    startTime: new Date(2024, 0, 15, 8, 0),
    endTime: new Date(2024, 0, 15, 8, 15),
    type: 'medication',
    status: 'completed',
    caregiverNotes: 'Take with breakfast and water',
    completedAt: new Date(2024, 0, 15, 8, 5)
  },
  {
    id: '2',
    title: 'Physical Therapy',
    startTime: new Date(2024, 0, 15, 10, 0),
    endTime: new Date(2024, 0, 15, 11, 0),
    type: 'therapy',
    status: 'current',
    location: 'Rehabilitation Center',
    contactPerson: 'Dr. Sarah Johnson',
    contactPhone: '(555) 123-4567',
    caregiverNotes: 'Remember to bring water bottle and comfortable shoes'
  },
  {
    id: '3',
    title: 'Lunch Break',
    startTime: new Date(2024, 0, 15, 12, 30),
    endTime: new Date(2024, 0, 15, 13, 30),
    type: 'rest',
    status: 'upcoming',
    caregiverNotes: 'Try to eat something nutritious'
  },
  {
    id: '4',
    title: 'Cognitive Therapy Session',
    startTime: new Date(2024, 0, 15, 14, 0),
    endTime: new Date(2024, 0, 15, 15, 0),
    type: 'therapy',
    status: 'upcoming',
    location: 'Room 204, Medical Building',
    contactPerson: 'Dr. Mike Chen',
    reminderMinutes: 15
  }
];

export function TBICalendarApp() {
  const [dayData, setDayData] = useState<DayData>({
    date: new Date(),
    events: mockEvents,
    energyLevel: undefined
  });

  const [userRole] = useState<'individual' | 'caregiver'>('individual');

  const handleEventComplete = (eventId: string) => {
    setDayData(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === eventId 
          ? { ...event, status: 'completed', completedAt: new Date() }
          : event
      )
    }));
    
    toast.success('Great job! Event marked as complete.', {
      duration: 3000,
    });
  };

  const handleEnergyLevelChange = (level: EnergyLevel) => {
    setDayData(prev => ({
      ...prev,
      energyLevel: level
    }));
    
    toast.success(`Energy level updated to ${level}/5`, {
      duration: 2000,
    });
  };

  const handleOpenSettings = () => {
    toast.info('Settings panel would open here');
  };

  const handleOpenCaregiver = () => {
    toast.info('Caregiver support would open here');
  };

  return (
    <DayViewTBI
      dayData={dayData}
      userRole={userRole}
      onEventComplete={handleEventComplete}
      onEnergyLevelChange={handleEnergyLevelChange}
      onOpenSettings={handleOpenSettings}
      onOpenCaregiver={handleOpenCaregiver}
    />
  );
}
