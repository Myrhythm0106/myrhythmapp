import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Share2, ChevronLeft, ChevronRight, FileUp } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { useAuth } from '@/hooks/useAuth';

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
import { LaunchAiPlanAssist } from '@/components/launch/calendar/LaunchAiPlanAssist';
import { usePlanningDay, usePlanningScope, periodStartFor } from '@/hooks/usePlanningScope';
import { DocumentImportCard, DocumentImportResult } from '@/components/memoryBridge/DocumentImportCard';
import { PostExtractionDialog } from '@/components/memoryBridge/PostExtractionDialog';
import { supabase } from '@/integrations/supabase/client';
import { convertActionToCalendarEvent } from '@/utils/calendarIntegration';
import { toast } from 'sonner';

export default function LaunchCalendar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as CalendarView) || 'day';
  const [currentView, setCurrentView] = useState<CalendarView>(
    (['day', 'week', 'month', 'year'] as CalendarView[]).includes(initialView) ? initialView : 'day'
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<LaunchCalendarEvent | null>(null);
  const [assistOpen, setAssistOpen] = useState(searchParams.get('assist') === '1');
  const [showImportCard, setShowImportCard] = useState(false);
  const [importResult, setImportResult] = useState<DocumentImportResult | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { user } = useAuth();


  const { dayOfWeek } = usePlanningDay();
  const weekScope = usePlanningScope('week', selectedDate, dayOfWeek);

  // If ?assist=1, scroll the commitment banner into view on mount
  useEffect(() => {
    if (searchParams.get('assist') === '1') {
      setAssistOpen(true);
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

  const handleAddEvent = (event: {
    title: string;
    time: string;
    type: string;
    watchers?: string[];
    reminder_level?: 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
    reminder_offsets_minutes?: number[];
  }) => {
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
      <LaunchHeroBand
        eyebrow="Commit"
        title="Calendar"
        subtitle="Your day, week, month and year — planned around your energy, not the clock."
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
        {/* Controls */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30 mb-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-2 hover:bg-launch-gold/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-launch-ink" />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-launch-ink font-display min-w-[10rem] text-center">
                {getHeaderTitle()}
              </h1>
              <button
                onClick={() => handleNavigate('next')}
                className="p-2 hover:bg-launch-gold/10 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-launch-ink" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportCard((s) => !s)}
                className="text-sm text-launch-ink/80 font-medium hover:text-launch-ink inline-flex items-center gap-1"
                title="Import schedule from a document"
              >
                <FileUp className="h-4 w-4" />
                Import
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-sm text-launch-ember font-medium hover:text-launch-ember/80"
              >
                + Add
              </button>
              <LaunchButton variant="secondary" size="icon" className="border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10">
                <Share2 className="h-5 w-5" />
              </LaunchButton>
            </div>
          </div>

          <div className="mt-4">
            <LaunchViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </LaunchCard>

        {showImportCard && (
          <DocumentImportCard
            onExtracted={(res) => {
              setImportResult(res);
              setShowImportDialog(true);
              setShowImportCard(false);
            }}
          />
        )}

        <LaunchSyncBar />

        <LaunchCard className="bg-launch-ivory border-launch-gold/30 min-h-[24rem] p-4 md:p-6">

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
      </LaunchCard>
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

      <LaunchAiPlanAssist
        isOpen={assistOpen}
        onClose={() => {
          setAssistOpen(false);
          if (searchParams.get('assist')) {
            const next = new URLSearchParams(searchParams);
            next.delete('assist');
            setSearchParams(next, { replace: true });
          }
        }}
        scope="week"
        periodStart={periodStartFor('week', selectedDate, dayOfWeek)}
        onAccept={(draft) => {
          weekScope.save({
            core: draft.core,
            key: draft.key,
            stretch: draft.stretch,
            source: 'ai_assisted',
          });
        }}
      />

      {importResult && (
        <PostExtractionDialog
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          actionsCount={importResult.actionsCount}
          meetingTitle={importResult.title}
          meetingId={importResult.meetingId}
          onAcceptAndScheduleAll={async (_notify, actionIds) => {
            if (!user) return;
            let query = supabase
              .from('extracted_actions')
              .select('*')
              .eq('meeting_recording_id', importResult.meetingId);
            if (actionIds?.length) query = query.in('id', actionIds);
            const { data: actions, error } = await query;
            if (error) {
              toast.error('Could not load extracted actions.');
              return;
            }
            let scheduled = 0;
            for (const action of actions || []) {
              try {
                const eventId = await convertActionToCalendarEvent(
                  action as any,
                  user.id,
                  [],
                  (action as any).proposed_date,
                  (action as any).proposed_time,
                );
                if (eventId) {
                  await supabase
                    .from('extracted_actions')
                    .update({ status: 'scheduled', calendar_event_id: eventId })
                    .eq('id', (action as any).id);
                  scheduled++;
                }
              } catch (err) {
                console.error('Schedule action failed', err);
              }
            }
            if (scheduled > 0) {
              toast.success(`Added ${scheduled} action${scheduled === 1 ? '' : 's'} to your calendar.`);
            } else {
              toast.info('No actions were scheduled.');
            }
            setShowImportDialog(false);
            setImportResult(null);
          }}
          onReviewIndividually={() => {
            setShowImportDialog(false);
            // Send user to Memory Bridge to review individually
            window.location.href = '/launch/memory';
          }}
        />
      )}
    </LaunchLayout>
  );
}

