import { useCallback, useEffect, useRef, useState } from 'react';
import { announceDiaryChange, onDiaryChange } from '@/launch/reminders/diarySync';
import { closeLinkedAction } from '@/launch/reminders/closeLinkedAction';
import { FRESH_REMINDERS } from '@/launch/reminders/reminderStages';
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
  /** Set when the event came from a next step captured in Memory Bridge */
  extractedActionId?: string | null;
  /** Traceability reference, e.g. MB-260826-K4.2 */
  referenceCode?: string | null;
  /** Whether the original source is still available, downloaded or retired */
  sourceState?: 'available' | 'downloaded' | 'retired';
  /** The capture the event traces back to */
  sourceRecordingId?: string | null;
  /** Hidden from the Support Circle (shown to them only as Busy) */
  isPrivate?: boolean;
  /** Suggested by a Support Circle member and waiting for my yes */
  requiresAcceptance?: boolean;
  addedByName?: string | null;
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
  extracted_action_id: string | null;
  is_private?: boolean | null;
  requires_acceptance?: boolean | null;
  added_by_name?: string | null;
  extracted_actions?: {
    reference_code: string | null;
    meeting_recording_id: string | null;
    meeting_recordings?: {
      source_state: string | null;
    } | null;
  } | null;
};

function rowToEvent(r: Row): LaunchCalendarEvent {
  const linked = r.extracted_actions;
  const state = linked?.meeting_recordings?.source_state;
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
    extractedActionId: r.extracted_action_id,
    referenceCode: linked?.reference_code ?? null,
    sourceState:
      (state as LaunchCalendarEvent['sourceState']) || 'available',
    sourceRecordingId: linked?.meeting_recording_id ?? null,
    isPrivate: !!r.is_private,
    requiresAcceptance: !!r.requires_acceptance,
    addedByName: r.added_by_name ?? null,
  };
}



export function useLaunchCalendarEvents(rangeStart: Date, rangeEnd: Date) {
  const { user } = useAuth();
  const [events, setEvents] = useState<LaunchCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const startStr = format(rangeStart, 'yyyy-MM-dd');
  const endStr = format(rangeEnd, 'yyyy-MM-dd');

  const syncSource = useRef(`calendar-${Math.random().toString(36).slice(2)}`).current;
  const fetchEvents = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    const { data, error } = await supabase
      .from('calendar_events')
      .select('id, title, time, end_time, type, date, status, source, carried_from, description, extracted_action_id, is_private, requires_acceptance, added_by_name, extracted_actions:extracted_action_id (reference_code, meeting_recording_id, meeting_recordings:meeting_recording_id (source_state))')
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
  useEffect(() => onDiaryChange(syncSource, () => fetchEvents(true)), [fetchEvents, syncSource]);
  /** Refresh this view and tell other open views (Home, reminder card) that the diary changed. */
  const refresh = useCallback(() => { fetchEvents(); announceDiaryChange(syncSource); }, [fetchEvents, syncSource]);

  const sendInvites = async (
    eventId: string | undefined,
    input: { title: string; time: string; date: Date; description?: string; watchers?: string[] },
  ) => {
    const w = input.watchers ?? [];
    const emails = w.filter((x) => x.startsWith('email:')).map((x) => ({ email: x.slice(6) }));
    const circleIds = w.filter((x) => x.startsWith('circle:')).map((x) => x.slice(7));
    let circle: { email: string; name?: string }[] = [];
    if (circleIds.length) {
      const { data } = await supabase
        .from('support_circle_members')
        .select('member_email, member_name')
        .in('id', circleIds);
      circle = (data ?? [])
        .filter((m: any) => m.member_email)
        .map((m: any) => ({ email: m.member_email, name: m.member_name ?? undefined }));
    }
    const invites = [...circle, ...emails];
    if (!invites.length) return;
    const { error } = await supabase.functions.invoke('send-event-invitation', {
      body: {
        eventId,
        actionText: input.title,
        startDate: format(input.date, 'yyyy-MM-dd'),
        startTime: input.time,
        context: input.description,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        invites,
      },
    });
    if (error) {
      console.error('send-event-invitation failed', error);
      toast.error('Saved, but the invitations could not be sent. Please try again later.');
    } else {
      toast.success(`Invitation sent to ${invites.length} ${invites.length === 1 ? 'person' : 'people'}`);
    }
  };

  const addEvent = useCallback(
    async (input: {
      title: string;
      time: string;
      type: string;
      description?: string;
      date: Date;
      watchers?: string[];
      reminder_level?: 'gentle' | 'steady' | 'strong' | 'custom' | 'off';
      reminder_offsets_minutes?: number[];
      recurrence_pattern?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'fortnightly' | 'monthly' | 'yearly';
      recurrence_interval?: number;
      recurrence_end_date?: string | null;
    }) => {
      if (!user) return;
      const { data: inserted, error } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        title: input.title,
        time: input.time,
        type: input.type,
        description: input.description || null,
        date: format(input.date, 'yyyy-MM-dd'),
        status: 'pending',
        source: 'manual',
        requires_acceptance: false,
        is_system_generated: false,
        watchers: input.watchers ?? [],
        reminder_level: input.reminder_level ?? 'steady',
        reminder_offsets_minutes: input.reminder_offsets_minutes ?? [1440, 30],
        recurrence_pattern: input.recurrence_pattern ?? 'none',
        recurrence_interval: input.recurrence_interval ?? 1,
        recurrence_end_date: input.recurrence_end_date ?? null,
      } as any).select('id').single();
      if (error) {
        console.error(error);
        toast.error('Could not add event');
        return;
      }
      toast.success('Added to your calendar');
      void sendInvites(inserted?.id, input);
      refresh();
    },
    [user, refresh]
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
      refresh();
      if (status === 'done') void closeLinkedAction(eventId, 'done');
    },
    [refresh]
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
      refresh();
    },
    [user, refresh]
  );

  const reschedule = useCallback(
    async (eventId: string, newDate: Date, newTime: string) => {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          date: format(newDate, 'yyyy-MM-dd'),
          time: newTime,
          status: 'pending',
          ...FRESH_REMINDERS,
        })
        .eq('id', eventId);
      if (error) {
        toast.error('Could not reschedule');
        return;
      }
      toast.success('Rescheduled');
      refresh();
    },
    [refresh]
  );

  const setPrivate = useCallback(
    async (eventId: string, isPrivate: boolean) => {
      const { error } = await supabase.from('calendar_events').update({ is_private: isPrivate }).eq('id', eventId);
      if (error) { toast.error('Could not update that item'); return; }
      toast(isPrivate ? 'Private. My circle sees only "Busy".' : 'Visible to people I share my diary with.');
      refresh();
    },
    [refresh]
  );

  /** Accept or decline an item suggested by someone in my Support Circle. */
  const decideCircleItem = useCallback(
    async (eventId: string, accept: boolean) => {
      const { error } = await supabase
        .from('calendar_events')
        .update(accept ? { requires_acceptance: false } : { status: 'cancelled', requires_acceptance: false })
        .eq('id', eventId);
      if (error) { toast.error('Could not update that item'); return; }
      toast(accept ? 'Added to my day' : 'Declined. Nothing changes in my day.');
      refresh();
    },
    [refresh]
  );

  return { events, loading, fetchEvents, addEvent, updateStatus, carryOver, reschedule, setPrivate, decideCircleItem };
}
