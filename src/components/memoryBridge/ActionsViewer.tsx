import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Target,
  TrendingUp,
  Sparkles,
  GripVertical,
  LayoutGrid,
  TableIcon,
  Users,
  Loader2,
  CalendarPlus,
  MessageCircle,
  MoreHorizontal,
  ChevronDown

} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { NextStepsItem } from '@/types/memoryBridge';
import { EditableField } from './EditableField';
import { ActionWatcherSelector } from './ActionWatcherSelector';
import { ActionCommentsSection } from './ActionCommentsSection';
import { ActionsTableView } from './ActionsTableView';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { scheduleExtractedActions, MeetingScheduleSummary, ActionOverride } from '@/components/memoryBridge/capture-brief/model/scheduleFromMeeting';
import { CommitSummarySheet } from '@/components/memoryBridge/CommitSummarySheet';
import { ReviewStep } from '@/components/memoryBridge/review/ReviewStep';
import { BulkWatcherDialog } from './BulkWatcherDialog';
import { ItemNotesThread } from '@/components/notes/ItemNotesThread';
import { ReminderLadderPicker } from './ReminderLadderPicker';
import {
  clearActionReminders,
  ensureDefaultLadder,
  loadLaddersForActions
} from '@/utils/reminderLadder';
import { buildExecutiveSummary, extractDecisions, extractThemes, extractOpenQuestions } from '@/components/memoryBridge/capture-brief/model/synthesize';
import type { BriefAction } from '@/components/memoryBridge/capture-brief/model/types';
import { enrichWithSchedulingSuggestions } from '@/components/memoryBridge/capture-brief/model/scheduleActions';
import { ExecutiveSummaryPanel, ExecutiveSummarySkeleton, ExecutiveSummaryError, MeetingSummaryModel } from './ExecutiveSummaryPanel';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { useCompleteAction, CompletionResult } from '@/hooks/useCompleteAction';





interface ActionsViewerProps {
  recordingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ActionsViewer({ 
  recordingId, 
  meetingTitle, 
  isOpen, 
  onClose
}: ActionsViewerProps) {
  const { user } = useAuth();
  const { completeAction, undoCompletion } = useCompleteAction();
  const [celebration, setCelebration] = useState<CompletionResult | null>(null);
  const [extractedActions, setExtractedActions] = useState<NextStepsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewModeState] = useState<'cards' | 'table'>(() => {
    if (typeof window === 'undefined') return 'table';
    return localStorage.getItem('nextStepSummaryView') === 'cards' ? 'cards' : 'table';
  });

  const setViewMode = (mode: 'cards' | 'table') => {
    setViewModeState(mode);
    try {
      localStorage.setItem('nextStepSummaryView', mode);
    } catch {
      /* storage unavailable — view still switches for this session */
    }
  };
  const [sortField, setSortField] = useState<'priority' | 'status' | 'start' | 'finish'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSchedulingAll, setIsSchedulingAll] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [commitSummary, setCommitSummary] = useState<MeetingScheduleSummary | null>(null);
  const [showBulkWatcherDialog, setShowBulkWatcherDialog] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [archiveFilter, setArchiveFilter] = useState<'open' | 'archived' | 'all'>('open');
  const [notesTarget, setNotesTarget] = useState<NextStepsItem | null>(null);
  const [remindersTarget, setRemindersTarget] = useState<NextStepsItem | null>(null);
  const [reminderDirty, setReminderDirty] = useState(false);
  const [showUnsavedGuard, setShowUnsavedGuard] = useState(false);
  const [showCaptureNotes, setShowCaptureNotes] = useState(false);
  const [ladders, setLadders] = useState<Record<string, number[]>>({});
  const [summaryModel, setSummaryModel] = useState<MeetingSummaryModel | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [summaryReloadKey, setSummaryReloadKey] = useState(0);


  const refreshLadders = React.useCallback(async () => {
    const ids = extractedActions.map(a => a.id).filter((id): id is string => !!id);
    setLadders(await loadLaddersForActions(ids));
  }, [extractedActions]);

  useEffect(() => {
    if (!isOpen) return;
    refreshLadders();
  }, [isOpen, refreshLadders]);





  const statusOptions = [
    { value: 'not_started', label: 'Ready to Begin' },
    { value: 'doing', label: 'In My Flow' },
    { value: 'done', label: 'Accomplished!' },
    { value: 'on_hold', label: 'Paused Mindfully' },
    { value: 'cancelled', label: 'Redirected Energy' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortedActions = React.useMemo(() => {
    const list = [...extractedActions];
    const dir = sortDirection === 'asc' ? 1 : -1;
    const parseDate = (d?: string | null) => {
      if (!d) return 0;
      const t = new Date(d).getTime();
      return Number.isNaN(t) ? 0 : t;
    };
    list.sort((a, b) => {
      if (sortField === 'priority') {
        return ((a.priority_level || 0) - (b.priority_level || 0)) * dir;
      }
      if (sortField === 'status') {
        return a.status.localeCompare(b.status) * dir;
      }
      if (sortField === 'start') {
        return (parseDate(a.start_date) - parseDate(b.start_date)) * dir;
      }
      if (sortField === 'finish') {
        return (parseDate(a.completion_date || a.end_date) - parseDate(b.completion_date || b.end_date)) * dir;
      }
      return 0;
    });
    return list;
  }, [extractedActions, sortField, sortDirection]);

  const openCount = extractedActions.filter(a => !a.archived_at).length;
  const archivedCount = extractedActions.length - openCount;

  const visibleActions = React.useMemo(() => {
    if (archiveFilter === 'all') return sortedActions;
    if (archiveFilter === 'archived') return sortedActions.filter(a => !!a.archived_at);
    return sortedActions.filter(a => !a.archived_at);
  }, [sortedActions, archiveFilter]);



  useEffect(() => {
    if (!isOpen || !recordingId) return;

    let cancelled = false;

    const fetchActions = async () => {
      setIsLoading(true);
      setExtractedActions([]);
      setMeetingId(null);
      setSummaryModel(null);
      setSummaryError(false);
      setSummaryLoading(true);
      try {
        const { data: meetingByRecording, error: meetingByRecordingError } = await supabase
          .from('meeting_recordings')
          .select('id, meeting_title, started_at, participants, meeting_context, transcript')
          .eq('recording_id', recordingId)
          .maybeSingle();

        if (meetingByRecordingError) throw meetingByRecordingError;

        // Some entry points already hold the meeting-recording id rather than the
        // original voice-recording id. Support both so the brief cannot disappear.
        let meetingRecording = meetingByRecording;
        if (!meetingRecording) {
          const { data: meetingById, error: meetingByIdError } = await supabase
            .from('meeting_recordings')
            .select('id, meeting_title, started_at, participants, meeting_context, transcript')
            .eq('id', recordingId)
            .maybeSingle();
          if (meetingByIdError) throw meetingByIdError;
          meetingRecording = meetingById;
        }

        if (!meetingRecording) {
          if (cancelled) return;
          // No meeting record for this recording — still give an honest summary shell.
          setSummaryModel({
            title: meetingTitle,
            date: new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            participants: [],
            summary:
              'This conversation has no saved meeting record yet, so there is no narrative to summarise. Any next steps below were captured directly.',
            themes: [],
            decisions: [],
            openQuestions: [],
            counts: { total: 0, withProposedDate: 0, scheduled: 0, complete: 0 },
          });
          setSummaryLoading(false);
          return;
        }

        setMeetingId(meetingRecording.id);
        const { data: actions, error: actionsError } = await supabase
          .from('extracted_actions')
          .select('*')
          .eq('meeting_recording_id', meetingRecording.id)
          .order('priority_level', { ascending: true });

        if (actionsError) throw actionsError;

        const mapped = (actions || []).map(action => ({
          ...action,
          category: (action.category || 'action') as 'action' | 'watch_out' | 'depends_on' | 'note',
          action_type: action.action_type as 'commitment' | 'promise' | 'task' | 'reminder' | 'follow_up',
          status: action.status as 'done' | 'doing' | 'on_hold' | 'confirmed' | 'pending' | 'rejected' | 'modified' | 'scheduled' | 'not_started' | 'cancelled',
          detail_level: (action.detail_level || 'standard') as 'minimal' | 'standard' | 'complete',
          alternative_phrasings: Array.isArray(action.alternative_phrasings)
            ? (action.alternative_phrasings as Array<{ text: string; confidence: number }>)
            : []
        }));

        if (cancelled) return;

        // ---- Stage 1: actions + executive summary, no AI dependency ----
        setExtractedActions(mapped);
        setIsLoading(false);

        const transcript = (meetingRecording.transcript as string) || '';
        const participants = Array.isArray(meetingRecording.participants)
          ? (meetingRecording.participants as any[]).map(p => p.name || p).filter(Boolean)
          : [];

        const briefActions: BriefAction[] = mapped.map(action => ({
          id: String(action.id),
          text: action.action_text,
          owner: action.assigned_to || action.owner || 'Me',
          due: action.due_context || undefined,
          priority: action.priority_level ?? 3,
          priorityLabel: (action.priority_level ?? 3) <= 2 ? 'High' : (action.priority_level ?? 3) >= 4 ? 'Low' : 'Medium',
          confidence: action.confidence_score ?? 0.7,
          category: action.category,
          sourceQuote: action.transcript_excerpt || action.source_quote || undefined,
          context: action.intent_behind || action.relationship_impact || undefined,
        }));

        let decisions: string[] = [];
        let themes: string[] = [];
        let openQuestions: string[] = [];
        let narrative = '';
        try {
          decisions = extractDecisions(briefActions, transcript);
          themes = extractThemes(transcript);
          openQuestions = extractOpenQuestions(transcript, briefActions);
          narrative = buildExecutiveSummary({
            title: meetingRecording.meeting_title || meetingTitle,
            participants,
            actions: briefActions,
            decisions,
            themes,
          });
        } catch (e) {
          console.error('Executive summary build failed, using fallback narrative', e);
        }

        if (!narrative) {
          narrative =
            mapped.length > 0
              ? `This conversation produced ${mapped.length} next ${mapped.length === 1 ? 'step' : 'steps'}. The detail below shows who does what, by when, and who needs to be kept in the loop.`
              : 'No next steps were captured from this conversation yet.';
        }

        if (cancelled) return;
        setSummaryModel({
          title: meetingRecording.meeting_title || meetingTitle,
          date: meetingRecording.started_at
            ? new Date(meetingRecording.started_at).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString(),
          participants,
          context: meetingRecording.meeting_context || undefined,
          summary: narrative,
          themes,
          decisions,
          openQuestions,
          counts: { total: mapped.length, withProposedDate: 0, scheduled: 0, complete: 0 },
        });
        setSummaryLoading(false);

        // ---- Stage 2: AI proposed dates (never blocks the summary) ----
        try {
          const { actions: enrichedBriefs } = await enrichWithSchedulingSuggestions(briefActions, transcript);
          if (cancelled) return;
          setExtractedActions(prev =>
            prev.map(action => {
              const brief = enrichedBriefs.find(b => b.id === action.id);
              const top = brief?.suggestions?.[0];
              return top
                ? { ...action, proposed_date: top.date || action.proposed_date, proposed_time: top.time || action.proposed_time }
                : action;
            })
          );
        } catch (e) {
          console.error('Scheduling suggestions unavailable', e);
        }
      } catch (error) {
        console.error('Error fetching actions:', error);
        if (!cancelled) setSummaryError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setSummaryLoading(false);
        }
      }
    };


    fetchActions();
    return () => {
      cancelled = true;
    };
  }, [recordingId, isOpen, meetingTitle, summaryReloadKey]);

  // Counts stay in step with what is actually on screen.
  const displaySummary = React.useMemo(() => {
    if (!summaryModel) return null;
    return {
      ...summaryModel,
      counts: {
        total: extractedActions.length,
        withProposedDate: extractedActions.filter(a => a.proposed_date && !a.calendar_event_id).length,
        scheduled: extractedActions.filter(a => a.calendar_event_id || a.status === 'scheduled').length,
        complete: extractedActions.filter(a => a.status === 'done').length,
      },
    };
  }, [summaryModel, extractedActions]);


  const updateAction = async (actionId: string, updates: Partial<NextStepsItem>) => {
    try {
      const { error } = await supabase
        .from('extracted_actions')
        .update(updates)
        .eq('id', actionId);

      if (error) throw error;

      setExtractedActions(actions => 
        actions.map(action => 
          action.id === actionId ? { ...action, ...updates } : action
        )
      );

      toast.success('Action updated');
    } catch (error) {
      console.error('Error updating action:', error);
      toast.error('Failed to update action');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(extractedActions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    // Update priority_level based on new positions
    const updates = reordered.map((action, index) => ({
      id: action.id,
      priority_level: index + 1
    }));

    setExtractedActions(reordered);

    // Save to database
    try {
      for (const update of updates) {
        await supabase
          .from('extracted_actions')
          .update({ priority_level: update.priority_level })
          .eq('id', update.id);
      }
      toast.success('Priority order updated!');
    } catch (error) {
      console.error('Error updating priority order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleSort = (field: 'priority' | 'status' | 'start' | 'finish') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const setArchived = async (actionId: string, archivedAt: string | null, message: string) => {
    setExtractedActions(actions =>
      actions.map(a => (a.id === actionId ? { ...a, archived_at: archivedAt } : a))
    );

    const { error } = await supabase
      .from('extracted_actions')
      .update({ archived_at: archivedAt } as any)
      .eq('id', actionId);

    if (error) {
      console.error('Error archiving action:', error);
      setExtractedActions(actions =>
        actions.map(a => (a.id === actionId ? { ...a, archived_at: archivedAt ? null : new Date().toISOString() } : a))
      );
      toast.error("That didn't save — please try again");
      return;
    }

    // Closed work stops nagging; reopened work gets its ladder back.
    const action = extractedActions.find(a => a.id === actionId);
    if (archivedAt) {
      await clearActionReminders(actionId);
    } else if (user && action) {
      await ensureDefaultLadder(
        actionId,
        user.id,
        action.completion_date || action.end_date,
        action.priority_level
      );
    }
    refreshLadders();

    toast.success(message, {
      action: archivedAt
        ? { label: 'Undo', onClick: () => setArchived(actionId, null, 'Back on my open list') }
        : undefined
    });
  };

  const handleArchive = (actionId: string) => {
    setArchived(actionId, new Date().toISOString(), 'Closed and archived');
  };

  const handleRestore = (actionId: string) => {
    setArchived(actionId, null, 'Back on my open list');
  };


  const handleStatusChange = async (actionId: string, status: string) => {
    const current = extractedActions.find(a => a.id === actionId);
    const isFinished = status === 'done' || status === 'completed';

    // Finishing runs the whole loop: close, tell, celebrate, count, undo.
    if (isFinished && !current?.archived_at) {
      const title = current?.action_text || 'this step';

      setExtractedActions(actions =>
        actions.map(a =>
          a.id === actionId
            ? { ...a, status: 'done' as any, archived_at: new Date().toISOString() }
            : a
        )
      );

      const result = await completeAction(actionId, title);

      if (!result) {
        setExtractedActions(actions =>
          actions.map(a =>
            a.id === actionId
              ? { ...a, status: current?.status as any, archived_at: current?.archived_at ?? null }
              : a
          )
        );
        toast.error("That didn't save — please try again");
        return;
      }

      refreshLadders();
      setCelebration(result);

      toast.success('Done — nicely closed off', {
        action: {
          label: 'Undo',
          onClick: async () => {
            setCelebration(null);
            const ok = await undoCompletion(actionId);
            if (!ok) {
              toast.error("Couldn't undo that — please try again");
              return;
            }
            setExtractedActions(actions =>
              actions.map(a =>
                a.id === actionId
                  ? {
                      ...a,
                      status: (current?.status || 'pending') as any,
                      archived_at: current?.archived_at ?? null,
                      completion_date: current?.completion_date ?? null
                    }
                  : a
              )
            );
            refreshLadders();
            toast.success('Back on my open list');
          }
        }
      });
      return;
    }

    await updateAction(actionId, { status: status as any });

    // Cancelled work also leaves the list; anything else stays open.
    const shouldArchive = status === 'cancelled';

    if (shouldArchive && !current?.archived_at) {
      await setArchived(actionId, new Date().toISOString(), 'Closed and archived');
    } else if (!shouldArchive && !isFinished && current?.archived_at) {
      await setArchived(actionId, null, 'Back on my open list');
    }
  };



  const handlePriorityChange = async (actionId: string, priorityLevel: number) => {
    const previous = extractedActions.find(a => a.id === actionId)?.priority_level;

    setExtractedActions(actions =>
      actions.map(action =>
        action.id === actionId ? { ...action, priority_level: priorityLevel } : action
      )
    );

    const { error } = await supabase
      .from('extracted_actions')
      .update({ priority_level: priorityLevel })
      .eq('id', actionId);

    if (error) {
      console.error('Error updating priority:', error);
      setExtractedActions(actions =>
        actions.map(action =>
          action.id === actionId ? { ...action, priority_level: previous } : action
        )
      );
      toast.error('Could not save that priority — please try again');
      return;
    }

    toast.success('Priority updated');
  };

  const handleWatchersChange = (actionId: string, watchers: string[]) => {
    updateAction(actionId, { assigned_watchers: watchers });
  };

  // Generic optimistic inline field save (used by the table view)
  const handleFieldChange = async (
    actionId: string,
    updates: Partial<NextStepsItem>,
    successMessage = 'Saved'
  ) => {
    const previous = extractedActions.find(a => a.id === actionId);
    if (!previous) return;

    const rollback: Partial<NextStepsItem> = {};
    (Object.keys(updates) as Array<keyof NextStepsItem>).forEach(key => {
      (rollback as any)[key] = previous[key];
    });

    setExtractedActions(actions =>
      actions.map(a => (a.id === actionId ? { ...a, ...updates } : a))
    );

    const { error } = await supabase
      .from('extracted_actions')
      .update(updates as any)
      .eq('id', actionId);

    if (error) {
      console.error('Error saving field:', error);
      setExtractedActions(actions =>
        actions.map(a => (a.id === actionId ? { ...a, ...rollback } : a))
      );
      toast.error("That didn't save — please try again");
      return;
    }

    toast.success(successMessage);
  };

  /** Emails the action details to everyone involved (R/A/C/I with an email). */
  const sendRaciEmails = async (actionIds: string[]) => {
    if (actionIds.length === 0) return;
    try {
      const { data, error } = await supabase.functions.invoke('send-action-raci', {
        body: { actionIds },
      });
      if (error) throw error;
      const { sent = 0, failures = [] } = (data || {}) as { sent?: number; failures?: string[] };
      if (sent > 0) {
        toast.success(`Details sent to ${sent} ${sent === 1 ? 'person' : 'people'}`);
        const now = new Date().toISOString();
        setExtractedActions(actions =>
          actions.map(a => (actionIds.includes(a.id!) ? { ...a, raci_notified_at: now } : a))
        );
      } else {
        toast.info('No email addresses on these actions yet');
      }
      if (failures.length > 0) {
        toast.error(`Couldn\u2019t reach: ${failures.join(', ')}`);
      }
    } catch (e) {
      console.error('sendRaciEmails failed', e);
      toast.error('Couldn\u2019t send the details — please try again');
    }
  };


  // Bulk actions
  const handleScheduleAll = async (actionIds?: string[], overrides?: Map<string, ActionOverride>) => {
    if (!user || !meetingId) return;
    setIsSchedulingAll(true);
    try {
      const summary = await scheduleExtractedActions(meetingId, user.id, actionIds, overrides);
      if (summary.scheduled === 0) {
        toast.error('Nothing could be added to my diary — please try again.');
      } else {
        setCommitSummary(summary);
        setExtractedActions(prev =>
          prev.map(a => {
            const hit = summary.entries.find(e => e.actionId === a.id);
            return hit
              ? { ...a, status: 'scheduled' as const, calendar_event_id: hit.eventId, scheduled_date: hit.date, scheduled_time: hit.time }
              : a;
          }),
        );
      }
    } catch (error) {
      console.error('Error scheduling all actions:', error);
      toast.error('Failed to schedule actions');
    } finally {
      setIsSchedulingAll(false);
    }
  };

  const handleBulkAddWatchers = async (watcherIds: string[]) => {
    try {
      let updated = 0;
      for (const action of extractedActions) {
        const existingWatchers = action.assigned_watchers || [];
        const newWatchers = [...new Set([...existingWatchers, ...watcherIds])];
        
        await supabase
          .from('extracted_actions')
          .update({ 
            assigned_watchers: newWatchers,
            support_circle_notified: true
          })
          .eq('id', action.id);
        
        // Update local state
        setExtractedActions(prev => 
          prev.map(a => a.id === action.id ? { ...a, assigned_watchers: newWatchers, support_circle_notified: true } : a)
        );
        updated++;
      }
      
      toast.success(`Added watchers to ${updated} actions!`);
    } catch (error) {
      console.error('Error adding watchers to all:', error);
      toast.error('Failed to add watchers');
    }
  };

  const handleScheduleIndividual = async (action: NextStepsItem) => {
    if (!user || !meetingId || !action.id) return;
    try {
      const summary = await scheduleExtractedActions(meetingId, user.id, [action.id]);
      const hit = summary.entries[0];
      if (!hit) {
        toast.error("That couldn't be added to my diary — please try again.");
        return;
      }
      setExtractedActions(prev =>
        prev.map(a =>
          a.id === action.id
            ? { ...a, status: 'scheduled' as const, calendar_event_id: hit.eventId, scheduled_date: hit.date, scheduled_time: hit.time }
            : a,
        ),
      );
      setCommitSummary(summary);
    } catch (error) {
      console.error('Failed to schedule action:', error);
      toast.error('Failed to schedule action');
    }
  };

  const acceptProposedDate = async (action: NextStepsItem) => {
    if (action.proposed_date) {
      await updateAction(action.id!, { 
        scheduled_date: action.proposed_date,
        scheduled_time: action.proposed_time || undefined
      });
      toast.success('AI-suggested date accepted!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200 shadow-memory-emerald-500/20';
      case 'doing':
        return 'bg-neural-blue-100 text-neural-blue-700 border-neural-blue-200 shadow-neural-blue-500/20';
      case 'on_hold':
        return 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-500/20';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200 shadow-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-muted shadow-none';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      case 'doing':
        return <Clock className="h-4 w-4" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStructuredActionText = (action: NextStepsItem) => {
    const what = action.what_outcome || action.action_text;
    const howSteps = action.how_steps || [];
    
    let microTasks: Array<{text: string; completed: boolean}> = [];
    try {
      if (action.micro_tasks) {
        if (Array.isArray(action.micro_tasks)) {
          microTasks = (action.micro_tasks as any[]).map(task => 
            typeof task === 'string' 
              ? { text: task, completed: false }
              : { text: task.text || '', completed: task.completed || false }
          );
        }
      }
    } catch (e) {
      console.warn('Error parsing micro_tasks:', e);
    }
    
    let how = "";
    if (howSteps.length > 0) {
      how = howSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join(', ');
    } else if (action.action_text.includes('|')) {
      const [, howPart] = action.action_text.split('|').map(s => s.trim());
      how = howPart || "Take it step by step, following your own pace and style.";
    } else {
      how = action.relationship_impact || "Break this down into manageable steps that work for you.";
    }
    
    return { what, how, microTasks };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-exhibit-paper border border-exhibit-rule shadow-xl flex flex-col">
        {/* Exhibit header */}
        <DialogHeader className="relative pb-3 border-b border-exhibit-rule">
          <DialogTitle className="flex flex-col gap-2.5">
            <div className="min-w-0">
              <p className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.18em] text-exhibit-moss">
                My next step summary
              </p>
              <p className="mt-1 font-sora text-[17px] font-semibold text-exhibit-ink truncate">
                {meetingTitle}
              </p>
            </div>

            {/* Single control row: one primary action, secondary actions in a menu,
                view toggle and archive filter share the row. */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setShowReview(true)}
                disabled={isSchedulingAll || extractedActions.length === 0 || !meetingId}
                size="sm"
                className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-md"
              >
                {isSchedulingAll ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Scheduling...</>
                ) : (
                  <><CalendarPlus className="h-4 w-4 mr-1" /> Review &amp; schedule</>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4 mr-1" /> More actions
                    <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => setShowBulkWatcherDialog(true)}>
                    <Users className="h-4 w-4 mr-2" /> Add Watchers to All
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!meetingId} onSelect={() => setShowCaptureNotes(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" /> Capture notes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Open / Archived filter */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                {([
                  { key: 'open' as const, label: `Open (${openCount})` },
                  { key: 'archived' as const, label: `Archived (${archivedCount})` },
                  { key: 'all' as const, label: 'All' }
                ]).map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setArchiveFilter(tab.key)}
                    className={cn(
                      'text-xs rounded-md px-3 py-2 min-h-[36px] transition-colors',
                      archiveFilter === tab.key
                        ? 'bg-white shadow-sm font-medium'
                        : 'text-muted-foreground hover:bg-white/60'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg backdrop-blur-sm ml-auto">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className={cn(
                    "transition-all duration-200",
                    viewMode === 'cards' && "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white shadow-md"
                  )}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> Cards
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "transition-all duration-200",
                    viewMode === 'table' && "bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white shadow-md"
                  )}
                >
                  <TableIcon className="h-4 w-4 mr-1" /> Table
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Executive summary: bounded height with its own scroll so it can never
            consume the whole dialog and trap the actions below. */}
        <section className="shrink-0 max-h-[42vh] overflow-y-auto pr-4" aria-label="Professional executive summary">
          {summaryLoading && !displaySummary ? (
            <ExecutiveSummarySkeleton />
          ) : summaryError && !displaySummary ? (
            <ExecutiveSummaryError onRetry={() => setSummaryReloadKey(v => v + 1)} />
          ) : displaySummary ? (
            <ExecutiveSummaryPanel
              model={displaySummary}
              collapsibleDetails
              onScheduleAll={() => handleScheduleAll(visibleActions.map(a => a.id!).filter(Boolean))}
              isSchedulingAll={isSchedulingAll}
            />
          ) : (
            <ExecutiveSummaryError onRetry={() => setSummaryReloadKey(v => v + 1)} />
          )}
        </section>

        <div className="min-h-0 flex-1 overflow-y-auto pr-4" data-actions-scroll>
          {isLoading && extractedActions.length === 0 ? (
            <div className="pb-4">
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse text-brand-orange-500" />
                Analyzing my commitments...
              </div>
            </div>
          ) : extractedActions.length === 0 && !summaryModel ? (
            <div className="pb-4">
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-4" />
                No actionable commitments found in this recording.
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-4">
              {viewMode === 'table' ? (
                <ActionsTableView
                  actions={visibleActions}
                  meetingSummary={displaySummary || undefined}
                  ladders={ladders}
                  onDragEnd={handleDragEnd}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onTextChange={(id, text) => handleFieldChange(id, { action_text: text }, 'Action updated')}
                  onSuccessCriteriaChange={(id, criteria) =>
                    handleFieldChange(id, { success_criteria: criteria }, "Saved — I'll know I'm done when…")
                  }
                  onRaciChange={(id, payload) =>
                    handleFieldChange(
                      id,
                      {
                        assigned_to: payload.assigned_to,
                        owner_email: payload.owner_email,
                        accountable: payload.accountable,
                        consulted: payload.consulted,
                        informed: payload.informed,
                      } as Partial<NextStepsItem>,
                      'Who\u2019s involved updated'
                    )
                  }
                  onSendRaci={(id) => sendRaciEmails([id])}
                  onSendToAll={() => sendRaciEmails(visibleActions.map(a => a.id!))}
                  onStartDateChange={(id, date) =>
                    handleFieldChange(id, { start_date: date } as Partial<NextStepsItem>, date ? 'Start date updated' : 'Start date cleared')
                  }
                  onDueDateChange={async (id, date) => {
                    handleFieldChange(id, { completion_date: date } as Partial<NextStepsItem>, date ? 'Finish date updated' : 'Finish date cleared');
                    if (!date) {
                      await clearActionReminders(id);
                    } else if (user) {
                      const target = extractedActions.find(a => a.id === id);
                      await ensureDefaultLadder(id, user.id, date, target?.priority_level);
                    }
                    refreshLadders();
                  }}
                  onAcceptProposedDate={acceptProposedDate}
                  onWatchersChange={(id, watchers) =>
                    handleFieldChange(id, { assigned_watchers: watchers }, 'Watchers updated')
                  }
                  onOpenNotes={(action) => setNotesTarget(action)}
                  onOpenReminders={(action) => setRemindersTarget(action)}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />

          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="actions-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6 py-2">
                    {extractedActions.map((action, index) => {
                      const structuredAction = getStructuredActionText(action);
                      
                      return (
                        <Draggable key={action.id} draggableId={action.id!} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "relative transition-all duration-200",
                                snapshot.isDragging && "shadow-2xl scale-[1.02] rotate-1 z-50"
                              )}
                            >
                              {/* Premium action card */}
                              <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-xl">
                                {/* Glass reflection */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                                
                                {/* Drag handle bar */}
                                <div 
                                  {...provided.dragHandleProps}
                                  className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/50 to-transparent flex items-center justify-center cursor-grab active:cursor-grabbing hover:from-brand-orange-100/50 transition-colors"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                
                                <div className="pl-10 pr-4 py-5 space-y-4">
                                  {/* Header with status and priority */}
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-4">
                                      {/* ACTION block - Premium burnt orange glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-orange-50/90 to-brand-orange-100/70 backdrop-blur-sm border border-brand-orange-200/50 shadow-lg p-5">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-brand-orange-500 rounded-lg shadow-md">
                                              <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="font-bold text-brand-orange-700 uppercase text-sm tracking-wide">ACTION</span>
                                          </div>
                                          <EditableField
                                            value={action.action_text}
                                            onSave={(value) => updateAction(action.id!, { action_text: value })}
                                            type="textarea"
                                            placeholder="Enter action..."
                                            className="text-lg font-bold text-foreground"
                                          />
                                        </div>
                                      </div>

                                      {/* SUCCESS CRITERIA - Emerald glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-memory-emerald-50/90 to-memory-emerald-100/70 backdrop-blur-sm border border-memory-emerald-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                                            <span className="font-semibold text-memory-emerald-700 text-sm">I'LL KNOW I'M DONE WHEN</span>
                                          </div>
                                          <EditableField
                                            value={action.success_criteria || ''}
                                            onSave={(value) => updateAction(action.id!, { success_criteria: value })}
                                            type="textarea"
                                            placeholder="Define success criteria..."
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>

                                      {/* MOTIVATION - Amber glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50/90 to-amber-100/70 backdrop-blur-sm border border-amber-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-4 w-4 text-amber-600" />
                                            <span className="font-semibold text-amber-700 text-sm">THIS WILL HELP YOU</span>
                                          </div>
                                          <EditableField
                                            value={action.motivation_statement || ''}
                                            onSave={(value) => updateAction(action.id!, { motivation_statement: value })}
                                            type="textarea"
                                            placeholder="Why this matters to you..."
                                            className="text-sm font-medium"
                                          />
                                        </div>
                                      </div>

                                      {/* TIMELINE - Neural blue glass */}
                                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neural-blue-50/90 to-neural-blue-100/70 backdrop-blur-sm border border-neural-blue-200/50 shadow-lg p-4">
                                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        {/* Neural pathway decoration */}
                                        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
                                          <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="80" cy="80" r="15" fill="currentColor" className="text-neural-blue-500" />
                                            <circle cx="60" cy="60" r="8" fill="currentColor" className="text-neural-blue-400" />
                                            <path d="M60,60 L80,80" stroke="currentColor" strokeWidth="2" className="text-neural-blue-400" />
                                          </svg>
                                        </div>
                                        <div className="relative z-10">
                                          <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-neural-blue-600" />
                                            <span className="font-semibold text-neural-blue-700 text-sm">TIMELINE</span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-3">
                                            <EditableField
                                              value={action.start_date}
                                              onSave={(value) => updateAction(action.id!, { start_date: value })}
                                              type="date"
                                              label="START"
                                              placeholder="Set start date"
                                              className="text-sm"
                                            />
                                            <EditableField
                                              value={action.completion_date}
                                              onSave={(value) => updateAction(action.id!, { completion_date: value })}
                                              type="date"
                                              label="TARGET"
                                              placeholder="Set target date"
                                              className="text-sm font-bold"
                                            />
                                            <EditableField
                                              value={action.end_date}
                                              onSave={(value) => updateAction(action.id!, { end_date: value })}
                                              type="date"
                                              label="DEADLINE"
                                              placeholder="Set deadline"
                                              className="text-sm"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* EXPECTED RESULT - Teal glass */}
                                      {structuredAction.what && (
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-clarity-teal-50/90 to-clarity-teal-100/70 backdrop-blur-sm border border-clarity-teal-200/50 shadow-lg p-4">
                                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                          <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Target className="h-4 w-4 text-clarity-teal-600" />
                                              <span className="font-semibold text-clarity-teal-700 text-sm">EXPECTED RESULT</span>
                                            </div>
                                            <p className="text-foreground font-medium">{structuredAction.what}</p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Micro tasks */}
                                      {structuredAction.microTasks && structuredAction.microTasks.length > 0 && (
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50/90 to-green-100/70 backdrop-blur-sm border border-green-200/50 shadow-lg p-4">
                                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                          <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                              <span className="font-semibold text-green-700 text-sm">START WITH THESE TINY STEPS</span>
                                            </div>
                                            <div className="space-y-1">
                                              {structuredAction.microTasks.map((task, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-green-700 bg-green-100/80 px-2 py-1 rounded-lg">
                                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                  {task.text}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* SUPPORT CIRCLE & COMMENTS */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ActionWatcherSelector
                                          actionId={action.id!}
                                          assignedWatchers={action.assigned_watchers || []}
                                          onWatchersChange={(watchers) => handleWatchersChange(action.id!, watchers)}
                                          onNotify={() => updateAction(action.id!, { support_circle_notified: true })}
                                        />
                                        <ActionCommentsSection actionId={action.id!} />
                                      </div>
                                    </div>

                                    {/* Right side - Status & Priority */}
                                    <div className="flex flex-col gap-3 min-w-[140px]">
                                      <EditableField
                                        value={String(action.priority_level || 3)}
                                        onSave={(value) => updateAction(action.id!, { priority_level: Number(value) })}
                                        type="select"
                                        options={priorityOptions}
                                        label="PRIORITY"
                                        className="text-xs"
                                      />
                                      <EditableField
                                        value={action.status}
                                        onSave={(value) => updateAction(action.id!, { status: value as any })}
                                        type="select"
                                        options={statusOptions}
                                        label="STATUS"
                                        className="text-xs"
                                      />
                                      <Badge 
                                        className={cn(
                                          "justify-center py-1.5 border shadow-lg transition-all",
                                          getStatusColor(action.status)
                                        )}
                                      >
                                        {getStatusIcon(action.status)}
                                        <span className="ml-1.5 capitalize text-xs">
                                          {action.status.replace('_', ' ')}
                                        </span>
                                      </Badge>
                                      <Badge variant="outline" className="text-xs justify-center">
                                        {Math.round((action.confidence_score || 0) * 100)}% Confidence
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Bulk Watcher Dialog */}
      <BulkWatcherDialog
        isOpen={showBulkWatcherDialog}
        onClose={() => setShowBulkWatcherDialog(false)}
        onApply={handleBulkAddWatchers}
        actionsCount={extractedActions.length}
      />

      <CommitSummarySheet summary={commitSummary} onClose={() => setCommitSummary(null)} />

      <ReviewStep
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        meetingId={meetingId || undefined}
        meetingTitle={meetingTitle}
        onCommit={(ids, overrides) => handleScheduleAll(ids, overrides)}
      />

      {/* Notes & encouragement on a single next step */}
      <Dialog open={!!notesTarget} onOpenChange={(open) => !open && setNotesTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{notesTarget?.action_text}</DialogTitle>
          </DialogHeader>
          {notesTarget?.id && (
            <ItemNotesThread
              targetType="action"
              targetId={notesTarget.id}
              ownerUserId={notesTarget.user_id}
            />
          )}
          <p className="text-xs text-muted-foreground">
            Only people you've looped in on this step can see or add to this thread.
          </p>
        </DialogContent>
      </Dialog>

      {/* Reminder ladder */}
      <Dialog
        open={!!remindersTarget && !showUnsavedGuard}
        onOpenChange={(open) => {
          if (!open) {
            if (reminderDirty) {
              setShowUnsavedGuard(true);
            } else {
              setRemindersTarget(null);
            }
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{remindersTarget?.action_text}</DialogTitle>
          </DialogHeader>
          {remindersTarget?.id && (
            <ReminderLadderPicker
              actionId={remindersTarget.id}
              dueDate={remindersTarget.completion_date || remindersTarget.end_date}
              priorityLevel={remindersTarget.priority_level}
              onSaved={() => refreshLadders()}
              onClose={() => {
                if (reminderDirty) {
                  setShowUnsavedGuard(true);
                } else {
                  setRemindersTarget(null);
                }
              }}
              onDirtyChange={setReminderDirty}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Unsaved reminder changes guard */}
      <AlertDialog open={showUnsavedGuard} onOpenChange={setShowUnsavedGuard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved reminder changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You've changed your reminder settings. If you close now, those changes won't be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedGuard(false)} className="min-h-[56px]">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowUnsavedGuard(false);
                setReminderDirty(false);
                setRemindersTarget(null);
              }}
              className="min-h-[56px]"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notes on the whole capture */}
      <Dialog open={showCaptureNotes} onOpenChange={setShowCaptureNotes}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{meetingTitle}</DialogTitle>
          </DialogHeader>
          {meetingId && (
            <ItemNotesThread
              targetType="recording"
              targetId={meetingId}
              ownerUserId={user?.id}
              title="Notes on this capture"
            />
          )}
        </DialogContent>
      </Dialog>

      <CompletionCelebration
        isOpen={!!celebration}
        onClose={() => setCelebration(null)}
        actionTitle={celebration?.actionTitle || ''}
        streakCount={celebration?.streak}
        isPersonalBest={celebration?.isPersonalBest}
        notifiedCount={celebration?.notified}
        doneThisWeek={celebration?.doneThisWeek}
      />
    </Dialog>
  );
}
