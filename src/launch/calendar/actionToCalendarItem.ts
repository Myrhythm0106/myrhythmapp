import type { NextStepsItem } from '@/types/memoryBridge';
import type { ExternalCalendarItem } from './externalCalendarLinks';

/** Turns one of my next steps into something any calendar can accept. */
export function calendarItemForAction(action: NextStepsItem): ExternalCalendarItem {
  const date =
    action.scheduled_date ||
    action.start_date ||
    action.proposed_date ||
    action.end_date ||
    new Date().toISOString().slice(0, 10);

  const time = (action.scheduled_time || action.proposed_time || '09:00').slice(0, 5);

  const notes: string[] = [];
  if (action.success_criteria) notes.push(`I'll know I'm done when: ${action.success_criteria}`);
  if (action.end_date) notes.push(`Finish by ${action.end_date}`);
  if (action.source_quote) notes.push(`From the conversation: "${action.source_quote}"`);

  return {
    title: action.action_text,
    date,
    time,
    durationMinutes: 30,
    description: notes.join('\n\n') || undefined,
    referenceCode: action.reference_code ?? null,
    sourceUrl:
      typeof window !== 'undefined' && action.meeting_recording_id
        ? `${window.location.origin}/launch/diary?recording=${action.meeting_recording_id}`
        : undefined,
    uid: action.id ? `action-${action.id}` : undefined,
  };
}
