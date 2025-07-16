
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DayViewTBI } from './views/DayViewTBI';
import { WeekViewTBI } from './views/WeekViewTBI';
import { MonthViewTBI } from './views/MonthViewTBI';
import { TBIEvent, EnergyLevel, DayData, CalendarSettings } from './types/calendarTypes';
import { toast } from 'sonner';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Users, Target } from 'lucide-react';

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
  const { isRunning, timeLeft, currentSession, startTimer, pauseTimer, resetTimer } = usePomodoro();

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
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
              <TabsTrigger value="day" className="text-sm font-medium">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-sm font-medium">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-sm font-medium">
                Month
              </TabsTrigger>
              <TabsTrigger value="pomodoro" className="text-sm font-medium">
                Pomodoro
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

          <TabsContent value="pomodoro" className="mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Pomodoro Timer Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-purple-600" />
                    Pomodoro Focus Timer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-mono font-bold text-purple-600">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-lg font-medium text-purple-700">
                      {currentSession === 'work' ? 'Focus Session' : 'Break Time'}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={isRunning ? pauseTimer : startTimer}
                        variant="default"
                        size="lg"
                      >
                        {isRunning ? 'Pause' : 'Start'}
                      </Button>
                      <Button onClick={resetTimer} variant="outline" size="lg">
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accountability Card */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Accountability Circle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-green-700">
                      Share your progress with trusted supporters who help keep you motivated.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                        <Target className="h-4 w-4 mr-2" />
                        Share Current Session
                      </Button>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                        <Users className="h-4 w-4 mr-2" />
                        Invite Supporters
                      </Button>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Today's Progress</p>
                      <p className="text-xs text-green-500">2 focus sessions completed • 1 supporter notified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
