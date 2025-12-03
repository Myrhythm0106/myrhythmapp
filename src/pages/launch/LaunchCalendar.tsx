import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchEmpoweringMessage } from '@/components/launch/LaunchEmpoweringMessage';
import { LaunchViewSwitcher, CalendarView } from '@/components/launch/calendar/LaunchViewSwitcher';
import { LaunchDayView } from '@/components/launch/calendar/LaunchDayView';
import { LaunchWeekView } from '@/components/launch/calendar/LaunchWeekView';
import { LaunchMonthView } from '@/components/launch/calendar/LaunchMonthView';
import { LaunchYearView } from '@/components/launch/calendar/LaunchYearView';
import { LaunchAddEventModal } from '@/components/launch/calendar/LaunchAddEventModal';
import { format, addDays, subDays, addMonths, subMonths, addYears, subYears } from 'date-fns';

export default function LaunchCalendar() {
  const [currentView, setCurrentView] = useState<CalendarView>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([
    { time: '09:00', title: 'Morning routine', type: 'routine', date: new Date() },
    { time: '10:30', title: 'Call Dr. Smith', type: 'appointment', date: new Date() },
    { time: '14:00', title: 'Physical therapy', type: 'medical', date: new Date() },
    { time: '16:00', title: 'Brain game session', type: 'activity', date: new Date() },
  ]);

  const handleAddEvent = (event: { title: string; time: string; type: string }) => {
    setEvents(prev => [...prev, { ...event, date: selectedDate }]);
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

      {/* Empowering Message */}
      <LaunchEmpoweringMessage className="mb-4" />

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
            events={events.filter(e => 
              e.date && 
              format(e.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            )} 
          />
        )}
        {currentView === 'week' && (
          <LaunchWeekView 
            date={selectedDate} 
            events={events}
            onDaySelect={handleDaySelect}
          />
        )}
        {currentView === 'month' && (
          <LaunchMonthView 
            date={selectedDate} 
            events={events}
            onDaySelect={handleDaySelect}
          />
        )}
        {currentView === 'year' && (
          <LaunchYearView 
            date={selectedDate}
            onMonthSelect={handleMonthSelect}
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
