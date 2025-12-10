import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DayViewTBI } from './views/DayViewTBI';
import { WeekViewTBI } from './views/WeekViewTBI';
import { MonthViewTBI } from './views/MonthViewTBI';
import { YearViewTBI } from './views/YearViewTBI';
import { DayDetailsModal } from './components/DayDetailsModal';
import { FloatingAddButton } from './components/FloatingAddButton';
import { TBIEvent, EnergyLevel, DayData } from './types/calendarTypes';
import { toast } from 'sonner';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { CalendarSyncSettings } from '@/components/calendar/CalendarSyncSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Timer, Users, Target, Loader2, CalendarPlus, Settings, RefreshCw } from 'lucide-react';
import { usePriorities } from '@/contexts/PriorityContext';

export function TBICalendarApp() {
  const [searchParams] = useSearchParams();
  const { actions } = useDailyActions();
  const { events: realEvents, isLoading, error, refresh } = useCalendarEvents();
  const { integrations, isSyncing, syncCalendar } = useCalendarIntegration();
  
  const [dayData, setDayData] = useState<DayData>({
    date: new Date(),
    events: [],
    energyLevel: undefined
  });

  // Sync real events to dayData when they change
  useEffect(() => {
    setDayData(prev => ({
      ...prev,
      events: realEvents
    }));
  }, [realEvents]);

  // Show toast when calendar is connected
  useEffect(() => {
    const connected = searchParams.get('connected');
    if (connected) {
      toast.success(`${connected === 'google' ? 'Google Calendar' : 'Outlook'} connected successfully!`);
      // Clean up URL
      window.history.replaceState({}, '', '/calendar');
      refresh();
    }
  }, [searchParams, refresh]);

  // Separate date states for each view
  const [dayViewDate, setDayViewDate] = useState(new Date());
  const [weekViewDate, setWeekViewDate] = useState(new Date());
  const [monthViewDate, setMonthViewDate] = useState(new Date());
  const [yearViewDate, setYearViewDate] = useState(new Date());

  const [activeTab, setActiveTab] = useState('day');
  const [userRole] = useState<'individual' | 'caregiver'>('individual');
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { isRunning, timeLeft, currentSession, startTimer, pauseTimer, resetTimer } = usePomodoro();
  
  // Use priority context
  const {
    dailyPriorities,
    weeklyPriorities,
    monthlyPriorities,
    yearlyPriorities,
    updateDailyPriorities,
    updateWeeklyPriorities,
    updateMonthlyPriorities,
    updateYearlyPriorities,
    getParentPriorities,
    hasAnyPriorities
  } = usePriorities();

  // Smart initialization - cascade priorities from parent scopes when empty
  const initializePriorities = (scope: 'daily' | 'weekly' | 'monthly') => {
    return getParentPriorities(scope);
  };

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
    setSelectedDate(date);
    setShowDayDetails(true);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowDayDetails(true);
  };

  const handleDayDetailsClose = () => {
    setShowDayDetails(false);
    setSelectedTime(null);
    // Refresh events after modal closes (in case new event was created)
    refresh();
  };

  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setSelectedTime(null);
    setShowDayDetails(true);
  };

  // Show loading state
  if (isLoading && realEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={refresh} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      {/* Empty state prompt */}
      {realEvents.length === 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              <span className="text-sm text-primary font-medium">
                Your calendar is empty. Start by adding an event or recording a conversation!
              </span>
            </div>
            <Button size="sm" onClick={handleAddEvent}>
              Add Event
            </Button>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <TabsList className="overflow-x-auto flex md:grid md:grid-cols-5 max-w-2xl gap-1">
              <TabsTrigger value="day" className="mobile-label font-medium flex-shrink-0">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="mobile-label font-medium flex-shrink-0">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="mobile-label font-medium flex-shrink-0">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="mobile-label font-medium flex-shrink-0">
                Year
              </TabsTrigger>
              <TabsTrigger value="pomodoro" className="mobile-label font-medium flex-shrink-0">
                Focus
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {integrations.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => syncCalendar()}
                  disabled={isSyncing}
                  className="h-8 w-8"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Calendar Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <CalendarSyncSettings />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
              <TabsTrigger value="day" className="mobile-label font-medium flex-shrink-0">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="mobile-label font-medium flex-shrink-0">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="mobile-label font-medium flex-shrink-0">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="mobile-label font-medium flex-shrink-0">
                Year
              </TabsTrigger>
              <TabsTrigger value="pomodoro" className="mobile-label font-medium flex-shrink-0">
                Focus
              </TabsTrigger>
        <div className="p-4">
          <TabsContent value="day" className="mt-0">
            <DayViewTBI
              dayData={{ ...dayData, date: dayViewDate }}
              userRole={userRole}
              onEventComplete={handleEventComplete}
              onEnergyLevelChange={handleEnergyLevelChange}
              onOpenSettings={handleOpenSettings}
              onOpenCaregiver={handleOpenCaregiver}
              priorities={hasAnyPriorities(dailyPriorities) ? 
                dailyPriorities : initializePriorities('daily')}
              updatePriorities={updateDailyPriorities}
              scopeLabel="Daily"
              scopeGradient="from-emerald-600 to-green-600"
              currentDate={dayViewDate}
              onDateChange={setDayViewDate}
              onTimeSlotClick={handleTimeSlotClick}
            />
          </TabsContent>

          <TabsContent value="week" className="mt-0">
            <WeekViewTBI
              currentDate={weekViewDate}
              events={dayData.events}
              actions={actions}
              onDayClick={handleDayClick}
              priorities={hasAnyPriorities(weeklyPriorities) ? 
                weeklyPriorities : initializePriorities('weekly')}
              updatePriorities={updateWeeklyPriorities}
              scopeLabel="Weekly"
              scopeGradient="from-blue-600 to-indigo-600"
              onDateChange={setWeekViewDate}
            />
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <MonthViewTBI
              currentDate={monthViewDate}
              events={dayData.events}
              onDayClick={handleDayClick}
              priorities={hasAnyPriorities(monthlyPriorities) ? 
                monthlyPriorities : initializePriorities('monthly')}
              updatePriorities={updateMonthlyPriorities}
              scopeLabel="Monthly"
              scopeGradient="from-purple-600 to-pink-600"
              onDateChange={setMonthViewDate}
            />
          </TabsContent>

          <TabsContent value="year" className="mt-0">
            <YearViewTBI
              currentDate={yearViewDate}
              events={dayData.events}
              onDayClick={handleDayClick}
              priorities={yearlyPriorities}
              updatePriorities={updateYearlyPriorities}
              scopeLabel="Yearly"
              scopeGradient="from-yellow-600 to-orange-600"
              onDateChange={setYearViewDate}
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

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={showDayDetails}
        onClose={handleDayDetailsClose}
        selectedDate={selectedDate}
        events={dayData.events}
        prefilledTime={selectedTime}
      />

      {/* Floating Add Button */}
      <FloatingAddButton onClick={handleAddEvent} />
    </div>
  );
}
