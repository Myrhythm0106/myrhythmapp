import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchViewSwitcher, CalendarView } from '@/components/launch/calendar/LaunchViewSwitcher';
import { LaunchDayView } from '@/components/launch/calendar/LaunchDayView';
import { LaunchWeekView } from '@/components/launch/calendar/LaunchWeekView';
import { LaunchMonthView } from '@/components/launch/calendar/LaunchMonthView';
import { LaunchYearView } from '@/components/launch/calendar/LaunchYearView';
import { LaunchAddEventModal } from '@/components/launch/calendar/LaunchAddEventModal';
import { LaunchRescheduleModal } from '@/components/launch/calendar/LaunchRescheduleModal';
import { LaunchSyncBar } from '@/components/launch/calendar/LaunchSyncBar';
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { useLaunchCalendarEvents, LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

export default function LaunchCalendar() {
  const [searchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as CalendarView) || 'day';
  const [currentView, setCurrentView] = useState<CalendarView>(
    (['day', 'week', 'month', 'year'] as CalendarView[]).includes(initialView) ? initialView : 'day'
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<LaunchCalendarEvent | null>(null);

  // If ?assist=1, scroll the commitment banner into view on mount
  useEffect(() => {
    if (searchParams.get('assist') === '1') {
      requestAnimationFrame(() => {
        document.getElementById('commitment-banner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [searchParams]);

  // Vision cascade state
  const [yearVision, setYearVision] = useState('');
  const [monthFocus, setMonthFocus] = useState('');
  const [weekFocus, setWeekFocus] = useState('');

  const { rangeStart, rangeEnd } = useMemo(() => {
    switch (currentView) {
      case 'day':
        return { rangeStart: selectedDate, rangeEnd: selectedDate };
      case 'week':
        return { rangeStart: startOfWeek(selectedDate), rangeEnd: endOfWeek(selectedDate) };
      case 'month':
        return { rangeStart: startOfMonth(selectedDate), rangeEnd: endOfMonth(selectedDate) };
      case 'year':
        return { rangeStart: startOfYear(selectedDate), rangeEnd: endOfYear(selectedDate) };
    }
  }, [currentView, selectedDate]);

  const { events, addEvent, updateStatus, carryOver, reschedule } = useLaunchCalendarEvents(
    rangeStart,
    rangeEnd
  );

  const filteredDayEvents = events.filter(
    (e) => format(e.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleAddEvent = (event: { title: string; time: string; type: string }) => {
    addEvent({ ...event, date: selectedDate });
  };

  const handleEventStatusChange = (idx: number, status: LaunchCalendarEvent['status']) => {
    const evt = sortedDayEvents()[idx];
    if (evt && status) updateStatus(evt.id, status);
  };

  const handleEventCarryOver = (idx: number) => {
    const evt = sortedDayEvents()[idx];
    if (evt) carryOver(evt);
  };

  const handleEventReschedule = (idx: number) => {
    const evt = sortedDayEvents()[idx];
    if (evt) setRescheduleTarget(evt);
  };

  const sortedDayEvents = () =>
    [...filteredDayEvents].sort((a, b) => a.time.localeCompare(b.time));

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

      <LaunchViewSwitcher currentView={currentView} onViewChange={setCurrentView} className="mb-4" />

      <LaunchSyncBar />

      <div className="mb-24">
        {currentView === 'day' && (
          <LaunchDayView
            date={selectedDate}
            events={sortedDayEvents()}
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

      <LaunchAddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEvent}
        selectedDate={selectedDate}
      />

      {rescheduleTarget && (
        <LaunchRescheduleModal
          isOpen={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSubmit={async (newDate, newTime) => {
            await reschedule(rescheduleTarget.id, newDate, newTime);
          }}
          eventTitle={rescheduleTarget.title}
          initialDate={rescheduleTarget.date}
          initialTime={rescheduleTarget.time}
        />
      )}
    </LaunchLayout>
  );
}
