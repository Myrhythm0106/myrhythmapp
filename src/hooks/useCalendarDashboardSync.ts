import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  category?: string;
  type: string;
}

interface DailyAction {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  action_type: string;
  status: string;
  calendar_event_id?: string;
  watchers?: any;
}

export function useCalendarDashboardSync() {
  const { user } = useAuth();

  // Convert calendar event to daily action
  const convertEventToAction = (event: CalendarEvent): Partial<DailyAction> => {
    return {
      user_id: event.user_id,
      title: event.title,
      description: event.description,
      date: event.date,
      start_time: event.time,
      action_type: event.category || 'regular',
      status: 'pending',
      calendar_event_id: event.id,
    };
  };

  // Sync calendar events to dashboard actions
  const syncCalendarToDashboard = useCallback(async (date?: string) => {
    if (!user) return;

    const targetDate = date || new Date().toISOString().split('T')[0];

    try {
      // Get calendar events for the date
      const { data: events, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate);

      if (eventsError) throw eventsError;

      // Get existing actions that are linked to calendar events
      const { data: existingActions, error: actionsError } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .not('calendar_event_id', 'is', null);

      if (actionsError) throw actionsError;

      const existingEventIds = new Set(
        existingActions?.map(action => action.calendar_event_id) || []
      );

      // Create actions for new calendar events
      const newActions = events
        ?.filter(event => !existingEventIds.has(event.id))
        .map(convertEventToAction) || [];

      if (newActions.length > 0) {
        const { error: insertError } = await supabase
          .from('daily_actions')
          .insert(newActions);

        if (insertError) throw insertError;

        toast.success(`${newActions.length} calendar events synced to dashboard`);
      }

      return { synced: newActions.length };
    } catch (error) {
      console.error('Error syncing calendar to dashboard:', error);
      toast.error('Failed to sync calendar events');
      return { synced: 0 };
    }
  }, [user]);

  // Create calendar event from action
  const createEventFromAction = useCallback(async (action: Partial<DailyAction>) => {
    if (!user || !action.title) return null;

    try {
      const eventData = {
        user_id: user.id,
        title: action.title,
        description: action.description,
        date: action.date || new Date().toISOString().split('T')[0],
        time: action.start_time || '09:00',
        category: action.action_type,
        type: 'event'
      };

      const { data: event, error } = await supabase
        .from('calendar_events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;

      // Update the action to link to the calendar event
      if (action.id) {
        await supabase
          .from('daily_actions')
          .update({ calendar_event_id: event.id })
          .eq('id', action.id);
      }

      return event;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }, [user]);

  // Auto-sync on component mount
  useEffect(() => {
    if (user) {
      syncCalendarToDashboard();
    }
  }, [user, syncCalendarToDashboard]);

  return {
    syncCalendarToDashboard,
    createEventFromAction,
  };
}