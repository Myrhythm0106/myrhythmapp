import { supabase } from '@/integrations/supabase/client';
import { BriefAction, CaptureBriefModel } from './types';
import {
  buildExecutiveSummary,
  extractDecisions,
  extractOpenQuestions,
  extractThemes,
  parseTranscriptTurns,
} from './synthesize';

function priorityLabel(level?: number | null): 'High' | 'Medium' | 'Low' {
  if (!level) return 'Medium';
  if (level >= 4) return 'High';
  if (level <= 2) return 'Low';
  return 'Medium';
}

export async function buildCaptureBrief(meetingId: string): Promise<CaptureBriefModel> {
  const { data: meeting, error: mErr } = await supabase
    .from('meeting_recordings')
    .select('*')
    .eq('id', meetingId)
    .maybeSingle();
  if (mErr) throw mErr;
  if (!meeting) throw new Error('Meeting not found');

  const { data: actionsRaw, error: aErr } = await supabase
    .from('extracted_actions')
    .select('*')
    .eq('meeting_recording_id', meetingId)
    .order('priority_level', { ascending: false });
  if (aErr) throw aErr;

  const actions: BriefAction[] = (actionsRaw || []).map((a: any) => ({
    id: a.id,
    text: a.action_text,
    owner: a.owner || a.assigned_to || 'Me',
    due: a.due_context || a.scheduled_date || undefined,
    priority: a.priority_level ?? 3,
    priorityLabel: priorityLabel(a.priority_level),
    confidence: a.confidence_score ?? 0.7,
    category: a.category,
    sourceQuote: a.transcript_excerpt || undefined,
    context: a.intent_behind || a.relationship_impact || undefined,
  }));

  const rawTranscript: string = meeting.transcript || '';
  const transcript = parseTranscriptTurns(rawTranscript);
  const participants: string[] = Array.isArray(meeting.participants)
    ? (meeting.participants as any[]).map(p => p?.name).filter(Boolean)
    : [];

  const decisions = extractDecisions(actions, rawTranscript);
  const openQuestions = extractOpenQuestions(rawTranscript, actions);
  const themes = extractThemes(rawTranscript);

  const date = meeting.started_at
    ? new Date(meeting.started_at).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const summary = buildExecutiveSummary({
    title: meeting.meeting_title || 'Capture Session',
    participants,
    actions,
    decisions,
    themes,
  });

  return {
    meetingId,
    title: meeting.meeting_title || 'Capture Session',
    date,
    participants,
    context: meeting.meeting_context || undefined,
    summary,
    actions,
    decisions,
    themes,
    openQuestions,
    transcript,
    rawTranscript,
  };
}
