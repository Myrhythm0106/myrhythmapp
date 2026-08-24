import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  MessageCircle

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

    const fetchActions = async () => {
      setIsLoading(true);
      try {
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('id')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          setMeetingId(meetingRecording.id);
          const { data: actions } = await supabase
            .from('extracted_actions')
            .select('*')
            .eq('meeting_recording_id', meetingRecording.id)
            .order('priority_level', { ascending: true });

          setExtractedActions((actions || []).map(action => ({ 
            ...action, 
            category: (action.category || 'action') as 'action' | 'watch_out' | 'depends_on' | 'note',
            action_type: action.action_type as 'commitment' | 'promise' | 'task' | 'reminder' | 'follow_up',
            status: action.status as 'done' | 'doing' | 'on_hold' | 'confirmed' | 'pending' | 'rejected' | 'modified' | 'scheduled' | 'not_started' | 'cancelled',
            detail_level: (action.detail_level || 'standard') as 'minimal' | 'standard' | 'complete',
            alternative_phrasings: Array.isArray(action.alternative_phrasings) 
              ? (action.alternative_phrasings as Array<{ text: string; confidence: number }>)
              : []
          })));
        }
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, [recordingId, isOpen]);

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
    await updateAction(actionId, { status: status as any });

    // Completed or closed items leave the working list; anything else stays open.
    const shouldArchive = status === 'done' || status === 'completed' || status === 'cancelled';
    const current = extractedActions.find(a => a.id === actionId);

    if (shouldArchive && !current?.archived_at) {
      await setArchived(actionId, new Date().toISOString(), status === 'cancelled' ? 'Closed and archived' : 'Accomplished — archived');
    } else if (!shouldArchive && current?.archived_at) {
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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border border-white/40 shadow-2xl">
        {/* Premium header */}
        <DialogHeader className="relative pb-4 border-b border-white/40">
          {/* Neural pathway decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M10,50 Q30,20 50,50 T90,50" stroke="currentColor" fill="none" strokeWidth="2" className="text-neural-purple-500" />
              <path d="M10,60 Q30,30 50,60 T90,60" stroke="currentColor" fill="none" strokeWidth="1" className="text-brand-orange-500" />
            </svg>
          </div>
          
          <DialogTitle className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 rounded-xl shadow-lg shadow-brand-orange-500/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg">My Next Step Summary</span>
                  <span className="text-sm text-muted-foreground ml-2">• {meetingTitle}</span>
                </div>
                <Badge className="bg-gradient-to-r from-brand-orange-100 to-brand-orange-50 text-brand-orange-700 border border-brand-orange-200 shadow-sm">
                  {extractedActions.length} actions
                </Badge>
              </div>
            </div>
            
            {/* Bulk actions bar */}
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
              <Button
                onClick={() => setShowBulkWatcherDialog(true)}
                variant="outline"
                size="sm"
              >
                <Users className="h-4 w-4 mr-1" /> Add Watchers to All
              </Button>

              <Button
                onClick={() => setShowCaptureNotes(true)}
                variant="outline"
                size="sm"
                disabled={!meetingId}
              >
                <MessageCircle className="h-4 w-4 mr-1" /> Capture notes
              </Button>

              
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

            {/* Open / Archived filter */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
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
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder • <strong>W</strong>hat • <strong>W</strong>ho • <strong>W</strong>hen — Brain-friendly and empowering
          </p>

        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 max-h-[calc(95vh-140px)]">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-4 animate-pulse text-brand-orange-500" />
              Analyzing my commitments...
            </div>
          ) : extractedActions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-4" />
              No actionable commitments found in this recording.
            </div>
          ) : viewMode === 'table' ? (
            <ActionsTableView
              actions={visibleActions}
              ladders={ladders}

              onDragEnd={handleDragEnd}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onTextChange={(id, text) => handleFieldChange(id, { action_text: text }, 'Action updated')}
              onSuccessCriteriaChange={(id, criteria) =>
                handleFieldChange(id, { success_criteria: criteria }, "Saved — I'll know I'm done when…")
              }
              onAssignedChange={(id, assignedTo) =>
                handleFieldChange(id, { assigned_to: assignedTo }, 'Owner updated')
              }
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
        </ScrollArea>
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
      <Dialog open={!!remindersTarget} onOpenChange={(open) => !open && setRemindersTarget(null)}>
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
              onClose={() => setRemindersTarget(null)}
            />


          )}
        </DialogContent>
      </Dialog>

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
    </Dialog>


  );
}
