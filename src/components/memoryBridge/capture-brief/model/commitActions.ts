import { supabase } from '@/integrations/supabase/client';
import type { BriefAction, ActionReminder, PersonPick } from './types';

export interface CommitInput {
  startDate: string;
  startTime: string;
  dueDate?: string;
  reminders: ActionReminder[];
  people: PersonPick[];
}

export interface CommitResult {
  ok: boolean;
  calendarEventId?: string;
  error?: string;
}

function reminderLabel(min: number): string {
  if (min < 60) return `${min}_minutes`;
  if (min < 1440) return `${Math.round(min / 60)}_hours`;
  return `${Math.round(min / 1440)}_days`;
}

export async function commitAction(action: BriefAction, input: CommitInput): Promise<CommitResult> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { ok: false, error: 'Not signed in' };

  const invited = input.people.filter(p => p.role === 'invite' && p.canInvite);
  const watchers = input.people.filter(p => p.role === 'watch' && p.canWatch);

  // 1. Calendar event
  const { data: event, error: evErr } = await supabase
    .from('calendar_events')
    .insert({
      user_id: userId,
      title: action.text.slice(0, 120),
      description: action.context || action.sourceQuote || null,
      date: input.startDate,
      time: input.startTime,
      type: 'action',
      category: action.category || 'commitment',
      is_system_generated: true,
      watchers: watchers.map(w => w.memberId),
    })
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
      assigned_watchers: watchers.map(w => w.memberId),
      status: 'scheduled',
      support_circle_notified: watchers.length > 0,
    })
    .eq('id', action.id);

  return { ok: true, calendarEventId: event.id };
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
}

export async function commitAllRecommended(
  actions: BriefAction[],
  onCommitted: (id: string, calendarEventId: string) => void,
): Promise<BulkResult> {
  let committed = 0, skipped = 0, failed = 0;
  for (const a of actions) {
    if (a.scheduled?.calendarEventId) { skipped++; continue; }
    const top = a.suggestions?.find(s => s.isRecommended) || a.suggestions?.[0];
    if (!top) { skipped++; continue; }
    const reminders = (await import('./scheduleActions')).defaultReminders(
      a.priority, a.dueDate?.date, top.date,
    );
    const res = await commitAction(a, {
      startDate: top.date,
      startTime: top.time,
      dueDate: a.dueDate?.date,
      reminders,
      people: a.people || [],
    });
    if (res.ok && res.calendarEventId) {
      committed++;
      onCommitted(a.id, res.calendarEventId);
    } else {
      failed++;
    }
  }
  return { committed, skipped, failed };
}
