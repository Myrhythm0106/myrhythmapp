import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarRange, ChevronDown, FileText, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { ActionsTableView } from '@/components/memoryBridge/ActionsTableView';
import { ExecutiveSummaryPanel, type MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';
import { buildExecutiveSummary, extractDecisions, extractOpenQuestions, extractThemes } from '@/components/memoryBridge/capture-brief/model/synthesize';
import { scheduleExtractedActions } from '@/components/memoryBridge/capture-brief/model/scheduleFromMeeting';
import type { BriefAction } from '@/components/memoryBridge/capture-brief/model/types';
import type { NextStepsItem } from '@/types/memoryBridge';
import { cn } from '@/lib/utils';

interface MeetingRecord {
  id: string;
  recording_id: string | null;
  meeting_title: string | null;
  started_at: string | null;
  created_at: string;
  participants: unknown;
  meeting_context: string | null;
  transcript: string | null;
  processing_status: string | null;
}

const formatMeetingDate = (value: string | null | undefined) => {
  if (!value) return 'Date not recorded';
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const participantNames = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(person => typeof person === 'string' ? person : (person as { name?: string } | null)?.name)
    .filter((name): name is string => Boolean(name));
};

const toNextStep = (action: Record<string, unknown>): NextStepsItem => ({
  ...(action as unknown as NextStepsItem),
  category: (action.category || 'action') as NextStepsItem['category'],
  action_type: (action.action_type || 'task') as NextStepsItem['action_type'],
  status: (action.status || 'not_started') as NextStepsItem['status'],
  action_text: String(action.action_text || action.what_outcome || ''),
  created_at: String(action.created_at || new Date().toISOString()),
  updated_at: String(action.updated_at || new Date().toISOString()),
});

export default function LaunchCommit() {
  const { user, loading: authLoading } = useAuth();
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [actions, setActions] = useState<NextStepsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState(false);
  const [error, setError] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [sortField, setSortField] = useState<'priority' | 'status' | 'start' | 'finish'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [aboutOpen, setAboutOpen] = useState(false);

  const selectedMeeting = useMemo(
    () => meetings.find(meeting => meeting.id === selectedMeetingId) || null,
    [meetings, selectedMeetingId],
  );

  const loadMeetings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(false);

    const { data, error: queryError } = await supabase
      .from('meeting_recordings')
      .select('id, recording_id, meeting_title, started_at, created_at, participants, meeting_context, transcript, processing_status')
      .eq('user_id', user.id)
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('LaunchCommit: failed to load conversations', queryError);
      setError(true);
      setMeetings([]);
      setSelectedMeetingId('');
    } else {
      const nextMeetings = (data || []) as unknown as MeetingRecord[];
      setMeetings(nextMeetings);
      setSelectedMeetingId(current => current && nextMeetings.some(meeting => meeting.id === current)
        ? current
        : nextMeetings[0]?.id || '');
    }
    setLoading(false);
  }, [user]);

  const loadActions = useCallback(async (meetingId: string) => {
    setLoadingActions(true);
    const { data, error: queryError } = await supabase
      .from('extracted_actions')
      .select('*')
      .eq('meeting_recording_id', meetingId)
      .order('priority_level', { ascending: true });

    if (queryError) {
      console.error('LaunchCommit: failed to load next steps', queryError);
      toast.error('I could not load these next steps. Please try again.');
      setActions([]);
    } else {
      setActions((data || []).map(action => toNextStep(action as Record<string, unknown>)));
    }
    setLoadingActions(false);
  }, []);

  useEffect(() => {
    void loadMeetings();
  }, [loadMeetings]);

  useEffect(() => {
    if (selectedMeetingId) void loadActions(selectedMeetingId);
    else setActions([]);
  }, [loadActions, selectedMeetingId]);

  const updateAction = async (actionId: string, updates: Partial<NextStepsItem>, message = 'Saved') => {
    const previous = actions.find(action => action.id === actionId);
    if (!previous) return;
    setActions(current => current.map(action => action.id === actionId ? { ...action, ...updates } : action));

    const { error: updateError } = await supabase
      .from('extracted_actions')
      .update(updates as Record<string, unknown>)
      .eq('id', actionId);

    if (updateError) {
      setActions(current => current.map(action => action.id === actionId ? previous : action));
      toast.error('That did not save. Please try again.');
      return;
    }
    toast.success(message);
  };

  const handleReorder = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...actions];
    const [moved] = reordered.splice(result.source.index, 1);
    if (!moved) return;
    reordered.splice(result.destination.index, 0, moved);
    setActions(reordered);
    await Promise.all(reordered.map((action, index) =>
      supabase.from('extracted_actions').update({ priority_level: index + 1 }).eq('id', action.id),
    ));
    toast.success('Priority order updated');
  };

  const handleSort = (field: 'priority' | 'status' | 'start' | 'finish') => {
    if (sortField === field) setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleScheduleAll = async () => {
    if (!user || !selectedMeetingId) return;
    const unscheduled = actions.filter(action => !action.calendar_event_id && action.status !== 'done');
    if (unscheduled.length === 0) {
      toast.info('There are no unscheduled next steps here.');
      return;
    }
    setIsScheduling(true);
    try {
      const result = await scheduleExtractedActions(selectedMeetingId, user.id, unscheduled.map(action => action.id).filter((id): id is string => Boolean(id)));
      if (result.scheduled === 0) toast.error('Nothing could be added to my diary. Please review the dates first.');
      else {
        toast.success(`${result.scheduled} ${result.scheduled === 1 ? 'next step' : 'next steps'} added to my diary`);
        await loadActions(selectedMeetingId);
      }
    } catch (scheduleError) {
      console.error('LaunchCommit: scheduling failed', scheduleError);
      toast.error('I could not add these to my diary. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const summary = useMemo<MeetingSummaryModel | null>(() => {
    if (!selectedMeeting) return null;
    const participants = participantNames(selectedMeeting.participants);
    const briefActions: BriefAction[] = actions.map(action => ({
      id: String(action.id),
      text: action.action_text,
      owner: action.assigned_to || action.owner || 'Me',
      due: action.due_context || undefined,
      priority: action.priority_level || 3,
      priorityLabel: (action.priority_level || 3) <= 2 ? 'High' : (action.priority_level || 3) >= 4 ? 'Low' : 'Medium',
      confidence: action.confidence_score || 0.7,
      category: action.category,
      sourceQuote: action.transcript_excerpt || action.source_quote || undefined,
    }));
    const transcript = selectedMeeting.transcript || '';
    const decisions = extractDecisions(briefActions, transcript);
    const themes = extractThemes(transcript);
    const openQuestions = extractOpenQuestions(transcript, briefActions);
    const title = selectedMeeting.meeting_title || 'My conversation';

    return {
      title,
      date: formatMeetingDate(selectedMeeting.started_at || selectedMeeting.created_at),
      participants,
      context: selectedMeeting.meeting_context || undefined,
      summary: actions.length > 0
        ? buildExecutiveSummary({ title, participants, actions: briefActions, decisions, themes })
        : 'This conversation is ready to review. No next steps have been captured yet.',
      themes,
      decisions,
      openQuestions,
      counts: {
        total: actions.length,
        withProposedDate: actions.filter(action => Boolean(action.proposed_date) && !action.calendar_event_id).length,
        scheduled: actions.filter(action => Boolean(action.calendar_event_id) || action.status === 'scheduled').length,
        complete: actions.filter(action => action.status === 'done' || action.status === 'completed').length,
      },
    };
  }, [actions, selectedMeeting]);

  if (loading) {
    return (
      <LaunchLayout>
        <div className="py-20 text-center text-launch-ink/70">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-launch-gold" />
          <p className="mt-4 text-sm">Preparing my next steps…</p>
        </div>
      </LaunchLayout>
    );
  }

  return (
    <LaunchLayout>
      <div className="max-w-6xl mx-auto px-1 pb-16">
        <LaunchPageHeader fallbackPath="/launch/home" />

        <header className="mb-6 flex flex-col gap-4 border-b border-launch-gold/20 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-launch-gold">
              <CalendarRange className="h-4 w-4" />
              Commit · Next Steps
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold text-launch-ink md:text-4xl">My next steps</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-launch-ink/70">
              A clear brief first. The detail when I need it. Nothing is added to my diary until I choose.
            </p>
          </div>

          {meetings.length > 0 && (
            <div className="w-full md:w-72">
              <label htmlFor="conversation-selector" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-launch-ink/60">
                Conversation
              </label>
              <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
                <SelectTrigger id="conversation-selector" className="min-h-12 border-launch-gold/30 bg-launch-ivory text-launch-ink">
                  <SelectValue placeholder="Choose a conversation" />
                </SelectTrigger>
                <SelectContent>
                  {meetings.map(meeting => (
                    <SelectItem key={meeting.id} value={meeting.id}>
                      {meeting.meeting_title || 'My conversation'} · {formatMeetingDate(meeting.started_at || meeting.created_at)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </header>

        {error ? (
          <LaunchCard className="border-launch-ember/30 bg-launch-ivory p-8 text-center">
            <p className="text-lg font-semibold text-launch-ink">I could not load my saved conversations.</p>
            <p className="mt-2 text-sm text-launch-ink/70">Nothing has been lost. I can try that again.</p>
            <Button onClick={() => void loadMeetings()} className="mt-5 min-h-14 bg-launch-ink text-white hover:bg-launch-ink/90">
              <RefreshCw className="mr-2 h-4 w-4" /> Try again
            </Button>
          </LaunchCard>
        ) : !selectedMeeting || !summary ? (
          <LaunchCard className="border-launch-gold/30 bg-launch-ivory p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-launch-gold" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-launch-ink">My brief will appear here</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-7 text-launch-ink/70">
              Record a conversation in Memory Bridge and I’ll bring the saved brief and next steps here for review.
            </p>
            <Button onClick={() => window.location.assign('/launch/memory')} className="mt-5 min-h-14 bg-launch-ink text-white hover:bg-launch-ink/90">
              <FileText className="mr-2 h-4 w-4" /> Open Memory Bridge
            </Button>
          </LaunchCard>
        ) : (
          <>
            <section aria-labelledby="executive-summary-heading" className="mb-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-launch-gold">Decision brief</p>
                  <h2 id="executive-summary-heading" className="mt-1 font-display text-xl font-semibold text-launch-ink">Executive summary</h2>
                </div>
                <Badge variant="outline" className="border-launch-gold/30 bg-launch-ivory text-launch-ink/70">
                  {loadingActions ? 'Refreshing' : 'Live from my saved capture'}
                </Badge>
              </div>
              <ExecutiveSummaryPanel
                model={summary}
                collapsibleDetails
                onScheduleAll={handleScheduleAll}
                isSchedulingAll={isScheduling}
              />
            </section>

            <section aria-labelledby="actions-heading" className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-launch-gold">The exhibit</p>
                  <h2 id="actions-heading" className="mt-1 font-display text-xl font-semibold text-launch-ink">My next steps</h2>
                </div>
                <p className="text-sm text-launch-ink/60">Review the detail below when I’m ready.</p>
              </div>
              <div className={cn('transition-opacity', loadingActions && 'opacity-60')}>
                <ActionsTableView
                  actions={actions}
                  meetingSummary={summary}
                  onDragEnd={handleReorder}
                  onStatusChange={(id, status) => void updateAction(id, { status: status as NextStepsItem['status'] }, 'Status updated')}
                  onPriorityChange={(id, priority) => void updateAction(id, { priority_level: priority }, 'Priority updated')}
                  onTextChange={(id, text) => void updateAction(id, { action_text: text }, 'Action updated')}
                  onStartDateChange={(id, date) => void updateAction(id, { start_date: date || null }, 'Start date updated')}
                  onDueDateChange={(id, date) => void updateAction(id, { completion_date: date || null }, 'Finish date updated')}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              </div>
            </section>
          </>
        )}

        <details className="mt-8 border-t border-launch-gold/20 pt-5" open={aboutOpen} onToggle={event => setAboutOpen(event.currentTarget.open)}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-launch-ink">
            <span>About Commit</span>
            <ChevronDown className={cn('h-4 w-4 text-launch-gold transition-transform', aboutOpen && 'rotate-180')} />
          </summary>
          <div className="max-w-3xl pb-2 pt-3 text-sm leading-7 text-launch-ink/70">
            Commit turns a saved conversation into clear, reviewable next steps. I can accept, amend, schedule, involve people and keep the source reference without losing the original context.
          </div>
        </details>
      </div>
    </LaunchLayout>
  );
}
