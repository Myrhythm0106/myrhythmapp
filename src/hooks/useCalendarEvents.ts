import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TBIEvent, EventType, EventStatus } from '@/components/calendar-tbi/types/calendarTypes';
import { isSameDay, addHours } from 'date-fns';

interface CalendarEventRow {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  type: string;
  category: string | null;
  user_id: string;
  created_at: string;
}

interface DailyActionRow {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  duration_minutes: number | null;
  status: string;
  action_type: string;
  focus_area: string | null;
  user_id: string;
  goal_id: string | null;
}

interface ExtractedActionRow {
  id: string;
  action_text: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: string;
  action_type: string;
  category: string;
  user_id: string;
}

interface ExternalCalendarEventRow {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  end_time: string | null;
  source: string;
  is_all_day: boolean | null;
  location: string | null;
  status: string | null;
  user_id: string;
}

const mapToEventType = (type: string): EventType => {
  const typeMap: Record<string, EventType> = {
    'appointment': 'appointment',
    'therapy': 'therapy',
    'medication': 'medication',
    'rest': 'rest',
    'personal': 'personal',
    'emergency': 'emergency',
    'event': 'appointment',
    'task': 'personal',
    'commitment': 'appointment',
    'decision': 'personal',
    'followup': 'appointment',
    'regular': 'personal',
    'daily_win': 'personal',
    'google': 'appointment',
    'outlook': 'appointment',
  };
  return typeMap[type] || 'personal';
};

const mapToEventStatus = (status: string, startTime: Date): EventStatus => {
  if (status === 'completed') return 'completed';
  if (status === 'missed' || status === 'skipped') return 'missed';
  
  const now = new Date();
  if (startTime < now) return 'completed';
  return 'upcoming';
};

export function useCalendarEvents(dateRange?: { start: Date; end: Date }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<TBIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!user?.id) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [calendarEventsResult, dailyActionsResult, extractedActionsResult, externalEventsResult] = await Promise.all([
        supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true }),
        
        supabase
          .from('daily_actions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true }),
        
        supabase
          .from('extracted_actions')
          .select('*')
          .eq('user_id', user.id)
          .not('scheduled_date', 'is', null)
          .order('scheduled_date', { ascending: true }),

        supabase
          .from('external_calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
      ]);

      const allEvents: TBIEvent[] = [];

      // Process calendar_events
      if (calendarEventsResult.data) {
        calendarEventsResult.data.forEach((event: CalendarEventRow) => {
          const [hours, minutes] = event.time.split(':').map(Number);
          const startTime = new Date(event.date);
          startTime.setHours(hours, minutes, 0, 0);
          const endTime = addHours(startTime, 1);

          allEvents.push({
            id: event.id,
            title: event.title,
            description: event.description || undefined,
            startTime,
            endTime,
            type: mapToEventType(event.type),
            status: mapToEventStatus('upcoming', startTime),
          });
        });
      }

      // Process daily_actions
      if (dailyActionsResult.data) {
        dailyActionsResult.data.forEach((action: DailyActionRow) => {
          let startTime = new Date(action.date);
          if (action.start_time) {
            const [hours, minutes] = action.start_time.split(':').map(Number);
            startTime.setHours(hours, minutes, 0, 0);
          } else {
            startTime.setHours(9, 0, 0, 0);
          }
          
          const duration = action.duration_minutes || 30;
          const endTime = new Date(startTime.getTime() + duration * 60000);

          allEvents.push({
            id: `action-${action.id}`,
            title: action.title,
            description: action.description || undefined,
            startTime,
            endTime,
            type: mapToEventType(action.action_type || action.focus_area || 'personal'),
            status: mapToEventStatus(action.status, startTime),
            completedAt: action.status === 'completed' ? new Date() : undefined,
          });
        });
      }

      // Process extracted_actions
      if (extractedActionsResult.data) {
        extractedActionsResult.data.forEach((action: ExtractedActionRow) => {
          if (!action.scheduled_date) return;
          
          let startTime = new Date(action.scheduled_date);
          if (action.scheduled_time) {
            const [hours, minutes] = action.scheduled_time.split(':').map(Number);
            startTime.setHours(hours, minutes, 0, 0);
          } else {
            startTime.setHours(10, 0, 0, 0);
          }
          
          const endTime = addHours(startTime, 1);

          allEvents.push({
            id: `extracted-${action.id}`,
            title: action.action_text,
            startTime,
            endTime,
            type: mapToEventType(action.action_type || action.category),
            status: mapToEventStatus(action.status, startTime),
            caregiverNotes: `From Memory Bridge - ${action.category}`,
          });
        });
      }

      // Process external calendar events (Google, Outlook)
      if (externalEventsResult.data) {
        externalEventsResult.data.forEach((event: ExternalCalendarEventRow) => {
          let startTime = new Date(event.date);
          if (event.time && !event.is_all_day) {
            const [hours, minutes] = event.time.split(':').map(Number);
            startTime.setHours(hours, minutes, 0, 0);
          } else {
            startTime.setHours(0, 0, 0, 0);
          }
          
          let endTime: Date;
          if (event.end_time && !event.is_all_day) {
            const [endHours, endMinutes] = event.end_time.split(':').map(Number);
            endTime = new Date(event.date);
            endTime.setHours(endHours, endMinutes, 0, 0);
          } else {
            endTime = addHours(startTime, 1);
          }

          allEvents.push({
            id: `external-${event.id}`,
            title: event.title,
            description: event.description || undefined,
            startTime,
            endTime,
            type: mapToEventType(event.source),
            status: mapToEventStatus(event.status || 'upcoming', startTime),
            caregiverNotes: event.location ? `📍 ${event.location}` : `Synced from ${event.source}`,
          });
        });
      }

      allEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      if (dateRange) {
        const filtered = allEvents.filter(event => 
          event.startTime >= dateRange.start && event.startTime <= dateRange.end
        );
        setEvents(filtered);
      } else {
        setEvents(allEvents);
      }

    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, dateRange?.start?.getTime(), dateRange?.end?.getTime()]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('calendar-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_actions', filter: `user_id=eq.${user.id}` }, () => {
        console.log('📅 Daily actions changed, refreshing...');
        fetchEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `user_id=eq.${user.id}` }, () => {
        console.log('📅 Calendar events changed, refreshing...');
        fetchEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'extracted_actions', filter: `user_id=eq.${user.id}` }, () => {
        console.log('📅 Extracted actions changed, refreshing...');
        fetchEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'external_calendar_events', filter: `user_id=eq.${user.id}` }, () => {
        console.log('📅 External calendar events changed, refreshing...');
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchEvents]);

  const getEventsForDay = useCallback((date: Date): TBIEvent[] => {
    return events.filter(event => isSameDay(event.startTime, date));
  }, [events]);

  const getEventsInRange = useCallback((start: Date, end: Date): TBIEvent[] => {
    return events.filter(event => 
      event.startTime >= start && event.startTime <= end
    );
  }, [events]);

  const refresh = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    getEventsForDay,
    getEventsInRange,
    refresh,
  };
}
