import { supabase } from '@/integrations/supabase/client';
import type { BriefAction, ActionReminder, PersonPick } from './types';
import { defaultReminders } from './scheduleActions';

export const ADHOC_PREFIX = 'adhoc:';

export const isAdhocPerson = (p: PersonPick) => p.memberId.startsWith(ADHOC_PREFIX);

export interface CommitInput {
  startDate: string;
  startTime: string;
  dueDate?: string;
  reminders: ActionReminder[];
  people: PersonPick[];
  durationMinutes?: number;
  timeZone?: string;
}

export interface CommitResult {
  ok: boolean;
  calendarEventId?: string;
  error?: string;
  /** People who were emailed successfully */
  notified?: number;
  /** Emails that could not be reached */
  notifyFailures?: string[];
}

function reminderLabel(min: number): string {
  if (min < 60) return `${min}_minutes`;
  if (min < 1440) return `${Math.round(min / 60)}_hours`;
  return `${Math.round(min / 1440)}_days`;
}

/** Default 30-minute slot so the event has a real end time in the calendar. */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = (time || '09:00').split(':').map(Number);
  const total = (h || 0) * 60 + (m || 0) + minutes;
  const hh = Math.floor((total % 1440) / 60).toString().padStart(2, '0');
  const mm = (total % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export async function commitAction(action: BriefAction, input: CommitInput): Promise<CommitResult> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { ok: false, error: 'Not signed in' };

  const invited = input.people.filter(p => p.role === 'invite' && p.canInvite);
  const watchers = input.people.filter(p => p.role === 'watch' && p.canWatch);
  // Only real Support Circle members can be stored as watchers (uuid columns)
  const circleWatcherIds = watchers.filter(p => !isAdhocPerson(p)).map(w => w.memberId);

  // 1. Calendar event
  const { data: event, error: evErr } = await supabase
    .from('calendar_events')
    .insert({
      user_id: userId,
      title: action.text.slice(0, 120),
      description: action.context || action.sourceQuote || null,
      date: input.startDate,
      time: input.startTime,
      end_time: addMinutes(input.startTime, input.durationMinutes || 30),
      type: 'action',
      category: action.category || 'commitment',
      is_system_generated: true,
      source: 'memory_bridge',
      extracted_action_id: action.id,
      watchers: circleWatcherIds,
    } as any)
    .select('id')
    .single();


  if (evErr || !event) {
    return { ok: false, error: evErr?.message || 'Failed to create calendar event' };
  }

  // 2. Reminders
  if (input.reminders.length > 0) {
    await supabase.from('event_reminders').insert(
      input.reminders.map(r => ({
        event_id: event.id,
        user_id: userId,
        reminder_time: reminderLabel(r.minutesBefore),
        reminder_methods: [r.channel],
        is_active: true,
      })),
    );
  }

  // 3. Invitations
  if (invited.length > 0) {
    await supabase.from('event_invitations').insert(
      invited
        .filter(p => p.email)
        .map(p => ({
          event_id: event.id,
          invitee_email: p.email!,
          invitee_name: p.name,
          inviter_id: userId,
          status: 'pending',
        })),
    );
  }

  // 4. Update extracted_actions
  await supabase
    .from('extracted_actions')
    .update({
      scheduled_date: input.startDate,
      scheduled_time: input.startTime,
      end_date: input.dueDate || null,
      calendar_event_id: event.id,
      assigned_watchers: circleWatcherIds,
      status: 'scheduled',
      support_circle_notified: watchers.length > 0,
    })
    .eq('id', action.id);

  // 5. Tell people — invitees get a calendar invite, watchers get a light notice
  let notified = 0;
  let notifyFailures: string[] = [];
  const invitePeople = invited.filter(p => p.email).map(p => ({ email: p.email!, name: p.name }));
  const watchPeople = watchers.filter(p => p.email).map(p => ({ email: p.email!, name: p.name }));

  if (invitePeople.length > 0 || watchPeople.length > 0) {
    try {
      const { data, error } = await supabase.functions.invoke('send-event-invitation', {
        body: {
          eventId: event.id,
          actionText: action.text,
          startDate: input.startDate,
          startTime: input.startTime,
          dueDate: input.dueDate,
          context: action.context || action.sourceQuote || undefined,
          durationMinutes: input.durationMinutes || 30,
          timeZone: input.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          invites: invitePeople,
          watchers: watchPeople,
        },
      });
      if (error) throw error;
      notified = data?.sent ?? 0;
      notifyFailures = (data?.failures || []).map((f: any) => f.email);
    } catch (e: any) {
      notifyFailures = [...invitePeople, ...watchPeople].map(p => p.email);
      console.error('send-event-invitation failed', e);
    }
  }

  return { ok: true, calendarEventId: event.id, notified, notifyFailures };
}

export async function undoCommit(action: BriefAction): Promise<void> {
  if (!action.scheduled?.calendarEventId) return;
  await supabase.from('calendar_events').delete().eq('id', action.scheduled.calendarEventId);
  await supabase
    .from('extracted_actions')
    .update({
      scheduled_date: null,
      scheduled_time: null,
      end_date: null,
      calendar_event_id: null,
      assigned_watchers: [],
      status: 'pending',
    })
    .eq('id', action.id);
}

export interface BulkResult {
  committed: number;
  skipped: number;
  failed: number;
  notified: number;
  notifyFailures: string[];
}

export async function commitAllRecommended(
  actions: BriefAction[],
  onCommitted: (id: string, calendarEventId: string, people: PersonPick[], reminders: ActionReminder[], slot: { date: string; time: string }) => void,
): Promise<BulkResult> {
  let committed = 0, skipped = 0, failed = 0, notified = 0;
  const notifyFailures: string[] = [];
  for (const a of actions) {
    if (a.scheduled?.calendarEventId) { skipped++; continue; }
    const top = a.suggestions?.find(s => s.isRecommended) || a.suggestions?.[0];
    if (!top) { skipped++; continue; }
    const reminders = defaultReminders(a.priority, a.dueDate?.date, top.date);
    const people = a.people || [];
    const res = await commitAction(a, {
      startDate: top.date,
      startTime: top.time,
      dueDate: a.dueDate?.date,
      reminders,
      people,
    });
    if (res.ok && res.calendarEventId) {
      committed++;
      notified += res.notified || 0;
      notifyFailures.push(...(res.notifyFailures || []));
      onCommitted(a.id, res.calendarEventId, people, reminders, { date: top.date, time: top.time });
    } else {
      failed++;
    }
  }
  return { committed, skipped, failed, notified, notifyFailures };
}
