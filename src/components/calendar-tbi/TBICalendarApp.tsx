
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DayViewTBI } from './views/DayViewTBI';
import { WeekViewTBI } from './views/WeekViewTBI';
import { MonthViewTBI } from './views/MonthViewTBI';
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

  const [activeTab, setActiveTab] = useState('day');
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

  const handleDayClick = (date: Date) => {
    setDayData(prev => ({
      ...prev,
      date: date
    }));
    setActiveTab('day');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="px-4 py-3">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="day" className="text-sm font-medium">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-sm font-medium">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-sm font-medium">
                Month
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-4">
          <TabsContent value="day" className="mt-0">
            <DayViewTBI
              dayData={dayData}
              userRole={userRole}
              onEventComplete={handleEventComplete}
              onEnergyLevelChange={handleEnergyLevelChange}
              onOpenSettings={handleOpenSettings}
              onOpenCaregiver={handleOpenCaregiver}
            />
          </TabsContent>

          <TabsContent value="week" className="mt-0">
            <WeekViewTBI
              currentDate={dayData.date}
              events={dayData.events}
              onDayClick={handleDayClick}
            />
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <MonthViewTBI
              currentDate={dayData.date}
              events={dayData.events}
              onDayClick={handleDayClick}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
