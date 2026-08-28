import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GripVertical, ArrowUpDown, MoreHorizontal, Eye, MessageCircle, Calendar, Lightbulb, Check, Bell, Archive, RotateCcw, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NextStepsItem } from '@/types/memoryBridge';
import { format, differenceInCalendarDays, addDays, isToday, isTomorrow } from 'date-fns';
import { parseDateOnly, formatDateOnly } from '@/utils/dateOnly';
import { ActionWatcherSelector } from './ActionWatcherSelector';
import { getSuccessCriteriaSuggestions } from './successCriteriaSuggestions';
import { matchPreset, nextReminderDate, presetLabel } from '@/utils/reminderLadder';
import { SourceRefLine } from '@/components/traceability/SourceRefLine';
import { WhosInvolvedCell, RaciSavePayload } from './WhosInvolvedCell';



interface ActionsTableViewProps {
  actions: NextStepsItem[];
  onDragEnd: (result: DropResult) => void;
  onStatusChange: (actionId: string, status: string) => void;
  onPriorityChange?: (actionId: string, priorityLevel: number) => void;
  onTextChange?: (actionId: string, text: string) => void;
  onSuccessCriteriaChange?: (actionId: string, criteria: string) => void;
  onAssignedChange?: (actionId: string, assignedTo: string) => void;
  onRaciChange?: (actionId: string, payload: RaciSavePayload) => void;
  onSendRaci?: (actionId: string, payload: RaciSavePayload) => Promise<void>;
  /** Emails the current view's actions to everyone involved, one digest per person. */
  onSendToAll?: () => Promise<void>;
  onStartDateChange?: (actionId: string, date: string | null) => void;
  onDueDateChange?: (actionId: string, date: string | null) => void;
  onWatchersChange?: (actionId: string, watchers: string[]) => void;
  onOpenNotes?: (action: NextStepsItem) => void;
  onOpenReminders?: (action: NextStepsItem) => void;
  onArchive?: (actionId: string) => void;
  onRestore?: (actionId: string) => void;
  /** actionId -> reminder offsets, for the at-a-glance ladder badge. */
  ladders?: Record<string, number[]>;

  onSort: (field: 'priority' | 'status' | 'start' | 'finish') => void;
  sortField: 'priority' | 'status' | 'start' | 'finish';
  sortDirection: 'asc' | 'desc';

}


const priorityOptions = [
  { value: '1', label: 'High', color: 'bg-brand-orange-500', pill: 'bg-brand-orange-500 text-white' },
  { value: '3', label: 'Medium', color: 'bg-brain-health-500', pill: 'bg-brain-health-100 text-brain-health-700' },
  { value: '5', label: 'Low', color: 'bg-muted-foreground/50', pill: 'bg-muted text-muted-foreground' }
];

const priorityValueFor = (level: number) => (level <= 2 ? '1' : level >= 4 ? '5' : '3');
const priorityPillFor = (level: number) =>
  priorityOptions.find(o => o.value === priorityValueFor(level))?.pill || 'bg-muted text-muted-foreground';

const statusOptions = [
  { value: 'not_started', label: 'Ready to Begin', color: 'bg-muted text-muted-foreground' },
  { value: 'doing', label: 'In My Flow', color: 'bg-brain-health-100 text-brain-health-700' },
  { value: 'done', label: 'Accomplished!', color: 'bg-memory-emerald-100 text-memory-emerald-700' },
  { value: 'on_hold', label: 'Paused', color: 'bg-sunrise-amber-100 text-sunrise-amber-700' },
  { value: 'cancelled', label: 'Redirected', color: 'bg-muted text-muted-foreground' }
];

const PriorityIndicator = ({ level }: { level: number }) => {
  const label = level <= 2 ? 'High' : level >= 4 ? 'Low' : 'Medium';
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
      priorityPillFor(level)
    )}>
      {label}
    </span>
  );
};

const WatcherAvatars = ({ watchers }: { watchers: string[] | undefined }) => {
  if (!watchers || watchers.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex -space-x-1">
      {watchers.slice(0, 3).map((id, i) => (
        <Avatar key={id} className="h-6 w-6 ring-1 ring-white">
          <AvatarFallback className="text-[10px] bg-brain-health-100 text-brain-health-700">
            {i + 1}
          </AvatarFallback>
        </Avatar>
      ))}
      {watchers.length > 3 && (
        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium ring-1 ring-white">
          +{watchers.length - 3}
        </div>
      )}
    </div>
  );
};



interface EditableTextProps {
  value: string | undefined | null;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  className?: string;
  displayClassName?: string;
  suggestions?: string[];
  ariaLabel: string;
}

const EditableText = ({
  value,
  onSave,
  placeholder = 'Tap to add…',
  multiline = false,
  required = false,
  className,
  displayClassName,
  suggestions,
  ariaLabel
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const committedRef = useRef(false);

  useEffect(() => {
    if (!isEditing) setDraft(value || '');
  }, [value, isEditing]);

  const startEditing = () => {
    committedRef.current = false;
    setDraft(value || '');
    setShowSuggestions(!value && !!suggestions?.length);
    setIsEditing(true);
  };

  const commit = () => {
    if (committedRef.current) return;
    committedRef.current = true;
    const next = draft.trim();
    setIsEditing(false);
    setShowSuggestions(false);
    if (next === (value || '').trim()) return;
    if (required && !next) {
      setDraft(value || '');
      return;
    }
    onSave(next);
  };

  const cancel = () => {
    committedRef.current = true;
    setDraft(value || '');
    setIsEditing(false);
    setShowSuggestions(false);
  };

  if (!isEditing) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={startEditing}
          aria-label={ariaLabel}
          className={cn(
            'w-full min-h-[44px] text-left rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-orange-500/40',
            !value && 'text-muted-foreground italic',
            displayClassName
          )}
        >
          {value || placeholder}
        </button>
      </div>
    );
  }

  const inputProps = {
    value: draft,
    autoFocus: true,
    'aria-label': ariaLabel,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: () => commit(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
      if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        commit();
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {multiline ? (
        <Textarea {...inputProps} rows={2} className="text-sm min-h-[44px]" placeholder={placeholder} />
      ) : (
        <Input {...inputProps} className="h-11 text-sm" placeholder={placeholder} />
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-1">
          {!showSuggestions ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[11px] text-brand-orange-600 hover:underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowSuggestions(true)}
            >
              <Lightbulb className="h-3 w-3" /> Suggestions
            </button>
          ) : (
            <div className="flex flex-wrap gap-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setDraft(s);
                    setShowSuggestions(false);
                  }}
                  className="text-[11px] leading-snug text-left rounded-full border border-brand-orange-200 bg-brand-orange-50 px-2.5 py-1.5 text-brand-orange-700 hover:bg-brand-orange-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EditableDate = ({
  value,
  onSave,
  ariaLabel
}: {
  value: string | null | undefined;
  onSave: (date: string | null) => void;
  ariaLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const parsed = parseDateOnly(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label={ariaLabel}
          className={cn('h-11 px-2 justify-start gap-1 text-sm font-normal', !parsed && 'text-muted-foreground')}
        >
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {parsed ? format(parsed, 'MMM d') : 'Set date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPicker
          mode="single"
          selected={parsed}
          onSelect={(d) => {
            onSave(d ? format(d, 'yyyy-MM-dd') : null);
            setOpen(false);
          }}
          initialFocus
          className={cn('p-3 pointer-events-auto')}
        />
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              onSave(null);
              setOpen(false);
            }}
          >
            Clear date
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const dueInLabel = (finishDate: string | null | undefined, status: string): { text: string; tone: 'neutral' | 'amber' | 'red' | 'green' } => {
  if (!finishDate) return { text: '—', tone: 'neutral' };
  if (status === 'done' || status === 'completed') return { text: 'Done', tone: 'green' };

  const finish = parseDateOnly(finishDate);
  if (!finish) return { text: '—', tone: 'neutral' };
  const days = differenceInCalendarDays(finish, new Date());

  if (days === 0) return { text: 'Today', tone: 'amber' };
  if (days === 1) return { text: 'Tomorrow', tone: 'amber' };
  if (days > 1 && days < 14) return { text: `in ${days} days`, tone: 'neutral' };
  if (days >= 14) return { text: `in ${Math.round(days / 7)} weeks`, tone: 'neutral' };
  if (days === -1) return { text: 'Yesterday', tone: 'red' };
  return { text: `${Math.abs(days)} days ago`, tone: 'red' };
};

const QUICK_DUE_IN_DAYS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'Next week', days: 7 }
];

const EditableDueIn = ({
  value,
  onSave,
  status
}: {
  value: string | null | undefined;
  onSave: (date: string | null) => void;
  status: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDays, setDraftDays] = useState<string>('');
  const label = dueInLabel(value, status);

  const commit = (days: number | null) => {
    setIsEditing(false);
    setDraftDays('');
    if (days === null) {
      onSave(null);
      return;
    }
    const date = addDays(new Date(), days);
    onSave(format(date, 'yyyy-MM-dd'));
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        aria-label="Edit due in"
        onClick={() => setIsEditing(true)}
        className={cn(
          'min-h-[44px] w-full text-left rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-orange-500/40'
        )}
      >
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
          label.tone === 'amber' && 'bg-sunrise-amber-100 text-sunrise-amber-700',
          label.tone === 'red' && 'bg-red-100 text-red-700',
          label.tone === 'green' && 'bg-memory-emerald-100 text-memory-emerald-700',
          label.tone === 'neutral' && 'bg-muted text-muted-foreground'
        )}>
          {label.tone === 'green' && <Check className="h-3 w-3" />}
          {label.text}
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-2" onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        const parsed = parseInt(draftDays, 10);
        commit(Number.isNaN(parsed) ? null : parsed);
      }
    }}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={365}
          value={draftDays}
          autoFocus
          aria-label="Days from today"
          placeholder="Days"
          className="h-9 w-20 text-sm"
          onChange={(e) => setDraftDays(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const parsed = parseInt(draftDays, 10);
              commit(Number.isNaN(parsed) ? null : parsed);
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
              setDraftDays('');
            }
          }}
        />
        <span className="text-xs text-muted-foreground">days from today</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {QUICK_DUE_IN_DAYS.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => commit(q.days)}
            className="text-[11px] rounded-full border border-brand-orange-200 bg-brand-orange-50 px-2.5 py-1 text-brand-orange-700 hover:bg-brand-orange-100 transition-colors"
          >
            {q.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => commit(null)}
          className="text-[11px] rounded-full border border-muted bg-muted px-2.5 py-1 text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

/** Header action: emails the visible actions to everyone involved, one digest per person. */
const SendToAllButton: React.FC<{ onSend: () => Promise<void> }> = ({ onSend }) => {
  const [sending, setSending] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      disabled={sending}
      className="gap-2 bg-brand-orange-500 hover:bg-brand-orange-600 text-white"
      onClick={async () => {
        setSending(true);
        try {
          await onSend();
        } finally {
          setSending(false);
        }
      }}
    >
      <Mail className="h-3.5 w-3.5" />
      {sending ? 'Sending…' : 'Send to everyone'}
    </Button>
  );
};

/** Shows which reminder ladder is in force and when the next nudge lands. */
const ReminderBadge: React.FC<{
  offsets: number[];
  dueDate?: string | null;
  onClick: () => void;
}> = ({ offsets, dueDate, onClick }) => {
  const preset = offsets.length ? matchPreset(offsets) : 'off';
  const next = offsets.length ? nextReminderDate(offsets, dueDate) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Change reminders"
      className={cn(
        'min-h-[44px] w-full flex flex-col items-start justify-center rounded-md px-2 -mx-2 text-left hover:bg-muted/50 transition-colors',
        offsets.length === 0 && 'text-muted-foreground'
      )}
    >
      <span className="flex items-center gap-1 text-xs font-medium">
        <Bell className={cn('h-3.5 w-3.5', offsets.length ? 'text-brand-orange-500' : 'text-muted-foreground')} />
        {offsets.length === 0 ? 'Off' : preset ? presetLabel[preset] : `${offsets.length} set`}
      </span>
      {next && (
        <span className="text-[11px] text-muted-foreground">
          Next {format(next, 'MMM d')}
        </span>
      )}
    </button>
  );
};



export function ActionsTableView({
  actions,
  onDragEnd,
  onStatusChange,
  onPriorityChange,
  onTextChange,
  onSuccessCriteriaChange,
  onAssignedChange,
  onRaciChange,
  onSendRaci,
  onSendToAll,
  onStartDateChange,
  onDueDateChange,
  onWatchersChange,
  onOpenNotes,
  onOpenReminders,
  onArchive,
  onRestore,
  ladders,


  onSort,
  sortField,
  sortDirection
}: ActionsTableViewProps) {

  const getStatusOption = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const formatDate = (dateStr: string | null | undefined) => formatDateOnly(dateStr, 'MMM d');


  const openCount = actions.filter(a => !a.archived_at && a.status !== 'done').length;
  const doneCount = actions.filter(a => a.status === 'done').length;

  const headCell = 'text-brain-health-50 text-[11px] font-semibold uppercase tracking-[0.14em]';
  const sortIcon = (active: boolean) => cn(
    'h-3 w-3 transition-colors',
    active ? 'text-brand-orange-300' : 'text-brain-health-300'
  );

  return (
    <div className="relative overflow-x-auto rounded-2xl bg-white/85 backdrop-blur-xl shadow-xl border border-brain-health-100">
      {/* Summary strip */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-brain-health-100">
        <p className="text-xs text-brain-health-700">
          <span className="font-semibold text-brain-health-900">{openCount} next step{openCount === 1 ? '' : 's'}</span>
          {doneCount > 0 && (
            <span className="text-muted-foreground"> · {doneCount} accomplished</span>
          )}
        </p>
        {onSendToAll && <SendToAllButton onSend={onSendToAll} />}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Table className="min-w-[860px]">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-brain-health-900 hover:bg-brain-health-900 border-b-0">
              <TableHead className="w-10"></TableHead>
              <TableHead
                className={cn(headCell, 'cursor-pointer transition-colors w-24 hover:bg-brain-health-800')}
                onClick={() => onSort('priority')}
              >
                <div className="flex items-center gap-1">
                  Priority
                  <ArrowUpDown className={sortIcon(sortField === 'priority')} />
                </div>
              </TableHead>
              <TableHead className={cn(headCell, 'min-w-[300px] w-[34%]')}>Action</TableHead>
              <TableHead className={cn(headCell, 'w-40 hidden lg:table-cell')}>Who's involved</TableHead>
              <TableHead
                className={cn(headCell, 'cursor-pointer transition-colors w-40 hover:bg-brain-health-800')}
                onClick={() => onSort('start')}
              >
                <div className="flex items-center gap-1">
                  Schedule
                  <ArrowUpDown className={sortIcon(sortField === 'start' || sortField === 'finish')} />
                </div>
              </TableHead>
              <TableHead className={cn(headCell, 'w-28')}>Due in</TableHead>
              <TableHead
                className={cn(headCell, 'cursor-pointer transition-colors w-36 hover:bg-brain-health-800')}
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className={sortIcon(sortField === 'status')} />
                </div>
              </TableHead>
              <TableHead className={cn(headCell, 'w-32')}>Support</TableHead>
              <TableHead className="w-10"></TableHead>

            </TableRow>
          </TableHeader>
          
          <Droppable droppableId="actions-table">
            {(provided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {actions.map((action, index) => (
                  <Draggable key={action.id} draggableId={action.id!} index={index}>
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group border-b border-brain-health-100/60 hover:bg-brain-health-50/60 transition-colors duration-150",
                          snapshot.isDragging && "bg-brand-orange-50 shadow-lg scale-[1.01] rounded-lg"
                        )}
                      >
                        <TableCell
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing py-3"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors md:opacity-0 md:group-hover:opacity-100" />
                        </TableCell>
                        <TableCell className="py-3">
                          {onPriorityChange ? (
                            <Select
                              value={priorityValueFor(action.priority_level || 3)}
                              onValueChange={(v) => onPriorityChange(action.id!, Number(v))}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-9 w-full border-0 rounded-full px-3 text-[11px] font-semibold",
                                  priorityPillFor(action.priority_level || 3)
                                )}
                                aria-label="Change priority"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {priorityOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    <span className="flex items-center gap-2">
                                      <span className={cn('h-2.5 w-2.5 rounded-full', opt.color)} />
                                      {opt.label}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <PriorityIndicator level={action.priority_level || 3} />
                          )}
                        </TableCell>
                        <TableCell>
                          {onTextChange ? (
                            <EditableText
                              value={action.action_text}
                              onSave={(v) => onTextChange(action.id!, v)}
                              multiline
                              required
                              ariaLabel="Edit action"
                              placeholder="Describe this action…"
                              displayClassName="font-medium text-[15px] leading-snug text-brain-health-950"
                            />
                          ) : (
                            <p className="font-medium text-[15px] leading-snug text-brain-health-950 line-clamp-2">{action.action_text}</p>
                          )}

                          {action.reference_code && (
                            <div className="mt-1.5">
                              <SourceRefLine
                                referenceCode={action.reference_code}
                                recordingId={action.meeting_recording_id}
                                compact
                              />
                            </div>
                          )}


                          {onSuccessCriteriaChange ? (
                            <EditableText
                              value={action.success_criteria}
                              onSave={(v) => onSuccessCriteriaChange(action.id!, v)}
                              multiline
                              ariaLabel="Edit how I'll know I'm done"
                              placeholder="I'll know I'm done when…"
                              suggestions={getSuccessCriteriaSuggestions(action.action_text)}
                              className="mt-1"
                              displayClassName="text-xs text-muted-foreground"
                            />
                          ) : action.success_criteria ? (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              ✓ {action.success_criteria}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {onRaciChange ? (
                            <WhosInvolvedCell
                              action={action}
                              onSave={(payload) => onRaciChange(action.id!, payload)}
                              onSend={onSendRaci ? (payload) => onSendRaci(action.id!, payload) : undefined}
                            />
                          ) : onAssignedChange ? (
                            <EditableText
                              value={action.assigned_to}
                              onSave={(v) => onAssignedChange(action.id!, v)}
                              ariaLabel="Edit who this is assigned to"
                              placeholder="Me"
                              displayClassName="text-sm"
                            />
                          ) : (
                            <span className="text-sm">{action.assigned_to || 'You'}</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground w-11">Start</span>
                              {onStartDateChange ? (
                                <EditableDate
                                  value={action.start_date}
                                  onSave={(d) => onStartDateChange(action.id!, d)}
                                  ariaLabel="Edit start date"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">{formatDate(action.start_date)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground w-11">Finish</span>
                              {onDueDateChange ? (
                                <EditableDate
                                  value={action.completion_date || action.end_date}
                                  onSave={(d) => onDueDateChange(action.id!, d)}
                                  ariaLabel="Edit finish date"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">{formatDate(action.completion_date || action.end_date)}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <EditableDueIn
                            value={action.completion_date || action.end_date}
                            onSave={(d) => onDueDateChange && onDueDateChange(action.id!, d)}
                            status={action.status}
                          />
                        </TableCell>

                        <TableCell>
                          <Select 
                            value={action.status} 
                            onValueChange={(v) => onStatusChange(action.id!, v)}
                          >
                            <SelectTrigger className={cn(
                              "h-9 w-full text-[11px] font-semibold border-0 rounded-full px-3",
                              getStatusOption(action.status).color
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {onWatchersChange ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    aria-label="Change watchers"
                                    className="min-h-[32px] flex items-center rounded-md px-2 -mx-2 hover:bg-muted/50 transition-colors"
                                  >
                                    <WatcherAvatars watchers={action.assigned_watchers} />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3" align="end">
                                  <ActionWatcherSelector
                                    actionId={action.id!}
                                    assignedWatchers={action.assigned_watchers || []}
                                    onWatchersChange={(w) => onWatchersChange(action.id!, w)}
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <WatcherAvatars watchers={action.assigned_watchers} />
                            )}
                            <ReminderBadge
                              offsets={ladders?.[action.id!] || []}
                              dueDate={action.completion_date || action.end_date}
                              onClick={() => onOpenReminders?.(action)}
                            />
                          </div>
                        </TableCell>



                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => onOpenNotes?.(action)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Notes &amp; encouragement
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => onOpenReminders?.(action)}>
                                <Bell className="h-4 w-4 mr-2" />
                                Reminders
                              </DropdownMenuItem>
                              {action.archived_at ? (
                                <DropdownMenuItem onSelect={() => onRestore?.(action.id!)}>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Restore to open
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onSelect={() => onArchive?.(action.id!)}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Close &amp; archive
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </div>
  );
}
