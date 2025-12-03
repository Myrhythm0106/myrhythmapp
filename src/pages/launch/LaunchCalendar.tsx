import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchViewSwitcher, CalendarView } from '@/components/launch/calendar/LaunchViewSwitcher';
import { LaunchDayView } from '@/components/launch/calendar/LaunchDayView';
import { LaunchWeekView } from '@/components/launch/calendar/LaunchWeekView';
import { LaunchMonthView } from '@/components/launch/calendar/LaunchMonthView';
import { LaunchYearView } from '@/components/launch/calendar/LaunchYearView';
import { LaunchAddEventModal } from '@/components/launch/calendar/LaunchAddEventModal';
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  type: string;
  date: Date;
  status?: 'pending' | 'done' | 'cancelled' | 'carried';
  carriedFrom?: Date;
}

export default function LaunchCalendar() {
  const [currentView, setCurrentView] = useState<CalendarView>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Vision cascade state
  const [yearVision, setYearVision] = useState('');
  const [monthFocus, setMonthFocus] = useState('');
  const [weekFocus, setWeekFocus] = useState('');
  
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', time: '09:00', title: 'Morning routine', type: 'routine', date: new Date(), status: 'pending' },
    { id: '2', time: '10:30', title: 'Call Dr. Smith', type: 'appointment', date: new Date(), status: 'pending' },
    { id: '3', time: '14:00', title: 'Physical therapy', type: 'medical', date: new Date(), status: 'pending' },
    { id: '4', time: '16:00', title: 'Brain game session', type: 'activity', date: new Date(), status: 'pending' },
  ]);

  const handleAddEvent = (event: { title: string; time: string; type: string }) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...event,
      date: selectedDate,
      status: 'pending'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEventStatusChange = (eventIndex: number, status: CalendarEvent['status']) => {
    const filteredEvents = events.filter(e => 
      e.date && format(e.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    const event = filteredEvents[eventIndex];
    if (event) {
      setEvents(prev => prev.map(e => 
        e.id === event.id ? { ...e, status } : e
      ));
    }
  };

  const handleEventCarryOver = (eventIndex: number) => {
    const filteredEvents = events.filter(e => 
      e.date && format(e.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    const event = filteredEvents[eventIndex];
    if (event) {
      // Mark original as carried
      setEvents(prev => prev.map(e => 
        e.id === event.id ? { ...e, status: 'carried' } : e
      ));
      // Create new event for tomorrow
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        time: event.time,
        title: event.title,
        type: event.type,
        date: addDays(selectedDate, 1),
        status: 'pending',
        carriedFrom: selectedDate
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const handleEventReschedule = (eventIndex: number) => {
    // For now, show a toast. In future, open a date picker modal
    toast.info('Reschedule feature coming soon!', {
      description: 'You\'ll be able to pick a new date and time.'
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    switch (currentView) {
      case 'day':
        setSelectedDate(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(direction === 'prev' ? subDays(selectedDate, 7) : addDays(selectedDate, 7));
        break;
      case 'month':
        setSelectedDate(direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
        break;
      case 'year':
        setSelectedDate(direction === 'prev' ? subYears(selectedDate, 1) : addYears(selectedDate, 1));
        break;
    }
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  const handleMonthSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('month');
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d');
      case 'week':
        return `Week of ${format(selectedDate, 'MMM d, yyyy')}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'year':
        return format(selectedDate, 'yyyy');
    }
  };

  const filteredDayEvents = events.filter(e => 
    e.date && format(e.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <LaunchLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNavigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getHeaderTitle()}</h1>
          </div>
          <button 
            onClick={() => handleNavigate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-sm text-brand-emerald-600 font-medium hover:text-brand-emerald-700"
          >
            + Add
          </button>
          <LaunchButton variant="secondary" size="icon">
            <Share2 className="h-5 w-5" />
          </LaunchButton>
        </div>
      </div>

      {/* View Switcher */}
      <LaunchViewSwitcher 
        currentView={currentView} 
        onViewChange={setCurrentView}
        className="mb-6"
      />

      {/* Calendar Views */}
      <div className="mb-24">
        {currentView === 'day' && (
          <LaunchDayView 
            date={selectedDate} 
            events={filteredDayEvents}
            inheritedVision={yearVision}
            inheritedMonthFocus={monthFocus}
            inheritedWeekFocus={weekFocus}
            onEventStatusChange={handleEventStatusChange}
            onEventCarryOver={handleEventCarryOver}
            onEventReschedule={handleEventReschedule}
          />
        )}
        {currentView === 'week' && (
          <LaunchWeekView 
            date={selectedDate} 
            events={events}
            onDaySelect={handleDaySelect}
            inheritedVision={yearVision}
            inheritedMonthFocus={monthFocus}
          />
        )}
        {currentView === 'month' && (
          <LaunchMonthView 
            date={selectedDate} 
            events={events}
            onDaySelect={handleDaySelect}
            inheritedVision={yearVision}
          />
        )}
        {currentView === 'year' && (
          <LaunchYearView 
            date={selectedDate}
            onMonthSelect={handleMonthSelect}
            yearVision={yearVision}
            onYearVisionChange={setYearVision}
          />
        )}
      </div>

      {/* Add Event Modal */}
      <LaunchAddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEvent}
        selectedDate={selectedDate}
      />
    </LaunchLayout>
  );
}
