import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

export interface LaunchCalendarEvent {
  id: string;
  title: string;
  time: string; // HH:MM
  end_time?: string | null;
  type: string;
  date: Date;
  status: 'pending' | 'done' | 'cancelled' | 'carried';
  source: 'manual' | 'memory_bridge' | string;
  carriedFrom?: Date | null;
  description?: string | null;
}

type Row = {
  id: string;
  title: string;
  time: string;
  end_time: string | null;
  type: string;
  date: string;
  status: string;
  source: string;
  carried_from: string | null;
  description: string | null;
};

function rowToEvent(r: Row): LaunchCalendarEvent {
  return {
    id: r.id,
    title: r.title,
    // Postgres time comes back as HH:MM:SS — trim seconds for display
    time: (r.time || '').slice(0, 5),
    end_time: r.end_time ? r.end_time.slice(0, 5) : null,
    type: r.type,
    date: new Date(`${r.date}T00:00:00`),
    status: (r.status as LaunchCalendarEvent['status']) || 'pending',
    source: r.source || 'manual',
    carriedFrom: r.carried_from ? new Date(`${r.carried_from}T00:00:00`) : null,
    description: r.description,
  };
}

export function useLaunchCalendarEvents(rangeStart: Date, rangeEnd: Date) {
  const { user } = useAuth();
  const [events, setEvents] = useState<LaunchCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const startStr = format(rangeStart, 'yyyy-MM-dd');
  const endStr = format(rangeEnd, 'yyyy-MM-dd');

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('calendar_events')
      .select('id, title, time, end_time, type, date, status, source, carried_from, description')
      .eq('user_id', user.id)
      .gte('date', startStr)
      .lte('date', endStr)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Fetch calendar_events failed:', error);
      toast.error('Could not load your calendar');
      setLoading(false);
      return;
    }
    setEvents((data as Row[] | null)?.map(rowToEvent) ?? []);
    setLoading(false);
  }, [user, startStr, endStr]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(
    async (input: {
      title: string;
      time: string;
      type: string;
      date: Date;
      watchers?: string[];
      reminder_level?: 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
      reminder_offsets_minutes?: number[];
    }) => {
      if (!user) return;
      const { error } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        title: input.title,
        time: input.time,
        type: input.type,
        date: format(input.date, 'yyyy-MM-dd'),
        status: 'pending',
        source: 'manual',
        requires_acceptance: false,
        is_system_generated: false,
        watchers: input.watchers ?? [],
        reminder_level: input.reminder_level ?? 'steady',
        reminder_offsets_minutes: input.reminder_offsets_minutes ?? [1440, 30],
      } as any);
      if (error) {
        console.error(error);
        toast.error('Could not add event');
        return;
      }
      toast.success('Added to your calendar');
      fetchEvents();
    },
    [user, fetchEvents]
  );

  const updateStatus = useCallback(
    async (eventId: string, status: LaunchCalendarEvent['status']) => {
      const { error } = await supabase
        .from('calendar_events')
        .update({ status })
        .eq('id', eventId);
      if (error) {
        toast.error('Could not update event');
        return;
      }
      fetchEvents();
    },
    [fetchEvents]
  );

  const carryOver = useCallback(
    async (event: LaunchCalendarEvent) => {
      if (!user) return;
      const nextDate = format(addDays(event.date, 1), 'yyyy-MM-dd');
      const { error: insertErr } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        title: event.title,
        time: event.time,
        type: event.type,
        date: nextDate,
        status: 'pending',
        source: event.source,
        carried_from: format(event.date, 'yyyy-MM-dd'),
        requires_acceptance: false,
        is_system_generated: false,
      });
      if (insertErr) {
        toast.error('Could not carry event over');
        return;
      }
      await supabase.from('calendar_events').update({ status: 'carried' }).eq('id', event.id);
      toast.success('Moved to tomorrow');
      fetchEvents();
    },
    [user, fetchEvents]
  );

  const reschedule = useCallback(
    async (eventId: string, newDate: Date, newTime: string) => {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          date: format(newDate, 'yyyy-MM-dd'),
          time: newTime,
          status: 'pending',
        })
        .eq('id', eventId);
      if (error) {
        toast.error('Could not reschedule');
        return;
      }
      toast.success('Rescheduled');
      fetchEvents();
    },
    [fetchEvents]
  );

  return { events, loading, fetchEvents, addEvent, updateStatus, carryOver, reschedule };
}
