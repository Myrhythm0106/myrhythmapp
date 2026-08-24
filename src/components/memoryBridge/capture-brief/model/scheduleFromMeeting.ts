import { supabase } from '@/integrations/supabase/client';
import { commitAction } from './commitActions';
import { defaultReminders, loadSupportMembers } from './scheduleActions';
import { ADHOC_PREFIX } from './commitActions';
import type { BriefAction, PersonPick } from './types';
import { smartScheduler } from '@/utils/smartScheduler';

export interface MeetingScheduleSummary {
  scheduled: number;
  total: number;
  failed: number;
  notified: number;
  notifyFailures: string[];
  /** Human-readable lines: "Wed 26 Aug, 09:00 — Call the clinic" */
  entries: { text: string; date: string; time: string }[];
  people: string[];
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * The single path used by every "schedule these actions" surface in Memory
 * Bridge. Writes calendar events, reminders, invitations and the
 * extracted_actions row through commitAction so behaviour is identical
 * whether the user schedules one action or all of them.
 */
export async function scheduleExtractedActions(
  meetingId: string,
  userId: string,
  actionIds?: string[],
): Promise<MeetingScheduleSummary> {
  let query = supabase
    .from('extracted_actions')
    .select('*')
    .eq('meeting_recording_id', meetingId);
  if (actionIds && actionIds.length > 0) query = query.in('id', actionIds);

  const { data: rows, error } = await query;
  if (error) throw error;

  const actions = rows || [];
  const members = await loadSupportMembers(userId);
  const memberById = new Map(members.map(m => [m.id, m]));

  const summary: MeetingScheduleSummary = {
    scheduled: 0,
    total: actions.length,
    failed: 0,
    notified: 0,
    notifyFailures: [],
    entries: [],
    people: [],
  };

  for (const row of actions as any[]) {
    if (row.calendar_event_id) {
      summary.scheduled++;
      continue;
    }

    const brief: BriefAction = {
      id: row.id,
      text: row.action_text,
      owner: row.owner || row.assigned_to || 'Me',
      due: row.due_context || undefined,
      priority: row.priority_level ?? 3,
      priorityLabel: 'Medium',
      confidence: row.confidence_score ?? 0.7,
      category: row.category,
      sourceQuote: row.transcript_excerpt || undefined,
      context: row.intent_behind || row.relationship_impact || undefined,
    } as BriefAction;

    // Slot: explicit schedule > proposed > AI suggestion > tomorrow 09:00
    let date: string = row.scheduled_date || row.proposed_date || '';
    let time: string = row.scheduled_time || row.proposed_time || '';
    if (!date) {
      try {
        const suggestions = await smartScheduler.generateSmartSuggestions(
          { id: row.id, action_text: row.action_text, priority_level: row.priority_level } as any,
          userId,
          [],
        );
        if (suggestions?.[0]) {
          date = suggestions[0].date;
          time = suggestions[0].time;
        }
      } catch {
        /* fall through to default slot */
      }
    }
    if (!date) date = tomorrowISO();
    if (!time) time = '09:00';
    if (date < todayISO()) date = todayISO();

    // People: support-circle watchers + ad-hoc loop-ins stored on the row
    const people: PersonPick[] = [];
    for (const id of (row.assigned_watchers || []) as string[]) {
      const m = memberById.get(id);
      if (!m) continue;
      people.push({
        memberId: m.id,
        name: m.name,
        email: m.email,
        role: m.hasCalendarPermission ? 'invite' : 'watch',
        pre: 'mentioned',
        canInvite: m.hasCalendarPermission,
        canWatch: true,
      });
    }
    for (const guest of (row.adhoc_loop_ins || []) as any[]) {
      if (!guest?.email) continue;
      people.push({
        memberId: `${ADHOC_PREFIX}${guest.email}`,
        name: guest.name || guest.email,
        email: guest.email,
        role: 'invite',
        pre: 'manual',
        canInvite: true,
        canWatch: false,
      } as PersonPick);
    }

    const res = await commitAction(brief, {
      startDate: date,
      startTime: time,
      dueDate: row.end_date || undefined,
      reminders: defaultReminders(row.priority_level ?? 3, row.end_date || undefined, date),
      people,
    });

    if (res.ok) {
      summary.scheduled++;
      summary.notified += res.notified || 0;
      summary.notifyFailures.push(...(res.notifyFailures || []));
      summary.entries.push({ text: row.action_text, date, time });
      for (const p of people) if (!summary.people.includes(p.name)) summary.people.push(p.name);
    } else {
      summary.failed++;
      console.error('scheduleExtractedActions: commit failed', res.error, row.id);
    }
  }

  return summary;
}
