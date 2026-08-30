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
import { GripVertical, ArrowUpDown, MoreHorizontal, Eye, MessageCircle, Calendar, Lightbulb, Check, Bell, Archive, RotateCcw, Mail, Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NextStepsItem } from '@/types/memoryBridge';
import { format, differenceInCalendarDays, addDays, isToday, isTomorrow } from 'date-fns';
import { parseDateOnly, formatDateOnly } from '@/utils/dateOnly';
import { ActionWatcherSelector } from './ActionWatcherSelector';
import { getSuccessCriteriaSuggestions } from './successCriteriaSuggestions';
import { matchPreset, nextReminderDate, presetLabel } from '@/utils/reminderLadder';
import { SourceRefLine } from '@/components/traceability/SourceRefLine';
import { WhosInvolvedCell, RaciSavePayload } from './WhosInvolvedCell';
import type { MeetingSummaryModel } from './ExecutiveSummaryPanel';
import { exportActionsXlsx, exportActionsCsv } from './exporters/actionsXlsx';




interface ActionsTableViewProps {
  actions: NextStepsItem[];
  meetingSummary?: MeetingSummaryModel;
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
  onAcceptProposedDate?: (action: NextStepsItem) => void;
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


/**
 * Exhibit chip — one geometry for every state in the summary.
 * Squared 6px corners read as a professional document; pills read consumer.
 */
const CHIP =
  'inline-flex items-center gap-1 h-[22px] rounded-[6px] px-2 font-sora text-[11px] font-semibold leading-none whitespace-nowrap';

const priorityOptions = [
  { value: '1', label: 'High', dot: 'bg-exhibit-accent', pill: 'bg-exhibit-accent text-white' },
  { value: '3', label: 'Medium', dot: 'bg-exhibit-moss', pill: 'bg-white text-exhibit-moss ring-1 ring-inset ring-exhibit-moss/40' },
  { value: '5', label: 'Low', dot: 'bg-exhibit-soft', pill: 'bg-white text-exhibit-soft ring-1 ring-inset ring-exhibit-rule' }
];

const priorityValueFor = (level: number) => (level <= 2 ? '1' : level >= 4 ? '5' : '3');
const priorityPillFor = (level: number) =>
  priorityOptions.find(o => o.value === priorityValueFor(level))?.pill || priorityOptions[2].pill;

const statusOptions = [
  { value: 'not_started', label: 'Ready to Begin', color: 'bg-white text-exhibit-moss ring-1 ring-inset ring-exhibit-rule' },
  { value: 'doing', label: 'In My Flow', color: 'bg-exhibit-moss/10 text-exhibit-ink ring-1 ring-inset ring-exhibit-moss/30' },
  { value: 'done', label: 'Accomplished!', color: 'bg-exhibit-ink text-white' },
  { value: 'on_hold', label: 'Paused', color: 'bg-white text-exhibit-amber ring-1 ring-inset ring-exhibit-amber/40' },
  { value: 'cancelled', label: 'Redirected', color: 'bg-white text-exhibit-soft ring-1 ring-inset ring-exhibit-rule' }
];

const PriorityIndicator = ({ level }: { level: number }) => {
  const label = level <= 2 ? 'High' : level >= 4 ? 'Low' : 'Medium';
  return <span className={cn(CHIP, priorityPillFor(level))}>{label}</span>;
};

const WatcherAvatars = ({ watchers }: { watchers: string[] | undefined }) => {
  if (!watchers || watchers.length === 0) {
    return <span className="font-sora text-[11px] text-exhibit-soft">Add</span>;
  }

  return (
    <div className="flex -space-x-1">
      {watchers.slice(0, 3).map((id, i) => (
        <Avatar key={id} className="h-6 w-6 rounded-[6px] ring-1 ring-white">
          <AvatarFallback className="rounded-[6px] font-sora text-[10px] bg-exhibit-moss/12 text-exhibit-ink">
            {i + 1}
          </AvatarFallback>
        </Avatar>
      ))}
      {watchers.length > 3 && (
        <div className="h-6 w-6 rounded-[6px] bg-exhibit-surface flex items-center justify-center font-sora text-[10px] font-medium text-exhibit-moss ring-1 ring-white">
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
            'w-full min-h-[44px] text-left rounded-[6px] px-2 py-1.5 -mx-2 transition-colors hover:bg-exhibit-surface focus:outline-none focus:ring-1 focus:ring-exhibit-moss/40',
            !value && 'text-exhibit-soft',
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
              className="inline-flex items-center gap-1 font-sora text-[11px] text-exhibit-moss hover:underline"
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
                  className="font-manrope text-[11px] leading-snug text-left rounded-[6px] border border-exhibit-rule bg-exhibit-surface px-2.5 py-1.5 text-exhibit-ink hover:border-exhibit-moss/40 transition-colors"
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
          className={cn(
            'h-11 px-1.5 justify-start gap-1 rounded-[6px] font-sora text-[13px] font-normal tabular-nums hover:bg-exhibit-surface',
            parsed ? 'text-exhibit-ink' : 'text-exhibit-soft'
          )}
        >
          <Calendar className={cn('h-3 w-3', parsed ? 'text-exhibit-moss' : 'text-exhibit-soft')} />
          {parsed ? format(parsed, 'd MMM') : 'Set date'}
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
          'min-h-[44px] w-full text-right rounded-[6px] px-2 py-2 -mx-2 transition-colors hover:bg-exhibit-surface focus:outline-none focus:ring-1 focus:ring-exhibit-moss/40'
        )}
      >
        <span className={cn(
          CHIP,
          label.tone === 'amber' && 'bg-white text-exhibit-amber ring-1 ring-inset ring-exhibit-amber/40',
          label.tone === 'red' && 'bg-exhibit-alert text-white',
          label.tone === 'green' && 'bg-exhibit-ink text-white',
          label.tone === 'neutral' && 'bg-transparent text-exhibit-moss tabular-nums'
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
            className="font-sora text-[11px] rounded-[6px] border border-exhibit-rule bg-exhibit-surface px-2.5 py-1 text-exhibit-ink hover:border-exhibit-moss/40 transition-colors"
          >
            {q.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => commit(null)}
          className="font-sora text-[11px] rounded-[6px] border border-exhibit-rule bg-white px-2.5 py-1 text-exhibit-soft hover:bg-exhibit-surface transition-colors"
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
      disabled={sending}
      className="h-11 min-h-[44px] gap-2 rounded-[8px] bg-exhibit-accent px-4 font-sora text-[12.5px] font-semibold tracking-wide text-white shadow-none hover:bg-exhibit-accent/90"
      onClick={async () => {
        setSending(true);
        try {
          await onSend();
        } finally {
          setSending(false);
        }
      }}
    >
      <Mail className="h-4 w-4" />
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
        'min-h-[40px] w-full flex flex-col items-start justify-center rounded-[6px] px-2 -mx-2 text-left hover:bg-exhibit-surface transition-colors',
        offsets.length === 0 && 'text-exhibit-soft'
      )}
    >
      <span className="flex items-center gap-1 font-sora text-[12px] font-medium text-exhibit-ink">
        <Bell className={cn('h-3.5 w-3.5', offsets.length ? 'text-exhibit-accent' : 'text-exhibit-soft')} />
        {offsets.length === 0 ? 'Off' : preset ? presetLabel[preset] : `${offsets.length} set`}
      </span>
      {next && (
        <span className="font-sora text-[10.5px] tabular-nums text-exhibit-soft">
          Next {format(next, 'd MMM')}
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

  const headCell = 'h-11 font-sora text-white/85 text-[11px] font-semibold uppercase tracking-[0.14em] align-middle';
  const bodyCell = 'py-3 align-top border-b border-exhibit-rule/70';
  const groupEdge = 'border-l border-exhibit-rule/70';
  const chipSelect = cn(
    'h-[26px] w-full min-w-0 justify-between gap-1 rounded-[6px] border-0 px-2',
    'font-sora text-[11px] font-semibold focus:ring-1 focus:ring-exhibit-moss/40'
  );
  const sortIcon = (active: boolean) => cn(
    'h-3 w-3 transition-colors',
    active ? 'text-exhibit-accent' : 'text-white/40'
  );

  const total = openCount + doneCount;
  const completion = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const dueTodayCount = actions.filter(a => {
    if (a.archived_at || a.status === 'done') return false;
    const d = parseDateOnly(a.completion_date || a.end_date);
    return !!d && differenceInCalendarDays(d, new Date()) === 0;
  }).length;

  return (
    <div className="rounded-xl border border-exhibit-rule bg-exhibit-paper overflow-hidden">
      {/* Exhibit title band */}
      <div className="bg-exhibit-surface border-b border-exhibit-rule">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.18em] text-exhibit-moss">
              Next step summary
            </p>
            <p className="mt-1.5 font-sora text-[13px] tabular-nums text-exhibit-ink">
              <span className="font-semibold">{openCount} next step{openCount === 1 ? '' : 's'}</span>
              {doneCount > 0 && (
                <span className="text-exhibit-moss"> · {doneCount} accomplished</span>
              )}
              {dueTodayCount > 0 && (
                <span className="text-exhibit-amber"> · {dueTodayCount} due today</span>
              )}
            </p>
          </div>
          {onSendToAll && <SendToAllButton onSend={onSendToAll} />}
        </div>
        {/* Completion rule */}
        <div className="h-[3px] w-full bg-exhibit-rule/60">
          <div
            className="h-full bg-exhibit-moss transition-all duration-500"
            style={{ width: `${completion}%` }}
            aria-hidden
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Table className="min-w-[1040px] border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: 108 }} />
              <col />
              <col className="hidden lg:table-column" style={{ width: 190 }} />
              <col style={{ width: 172 }} />
              <col style={{ width: 116 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 148 }} />
              <col style={{ width: 44 }} />
            </colgroup>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-exhibit-ink hover:bg-exhibit-ink border-b-0">
                <TableHead className="w-10 bg-exhibit-ink" />
                <TableHead
                  className={cn(headCell, 'cursor-pointer bg-exhibit-ink transition-colors hover:bg-exhibit-moss')}
                  onClick={() => onSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    Priority
                    <ArrowUpDown className={sortIcon(sortField === 'priority')} />
                  </div>
                </TableHead>
                <TableHead className={cn(headCell, 'bg-exhibit-ink min-w-[320px]')}>Action</TableHead>
                <TableHead className={cn(headCell, groupEdge, 'bg-exhibit-ink hidden lg:table-cell')}>
                  Who&apos;s involved
                </TableHead>
                <TableHead
                  className={cn(headCell, groupEdge, 'cursor-pointer bg-exhibit-ink transition-colors hover:bg-exhibit-moss')}
                  onClick={() => onSort('start')}
                >
                  <div className="flex items-center gap-1">
                    Schedule
                    <ArrowUpDown className={sortIcon(sortField === 'start' || sortField === 'finish')} />
                  </div>
                </TableHead>
                <TableHead className={cn(headCell, 'bg-exhibit-ink text-right')}>Due in</TableHead>
                <TableHead
                  className={cn(headCell, 'cursor-pointer bg-exhibit-ink transition-colors hover:bg-exhibit-moss')}
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className={sortIcon(sortField === 'status')} />
                  </div>
                </TableHead>
                <TableHead className={cn(headCell, groupEdge, 'bg-exhibit-ink')}>Support</TableHead>
                <TableHead className="w-11 bg-exhibit-ink" />
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
                            'group border-0 transition-colors duration-150 hover:bg-exhibit-surface/70',
                            snapshot.isDragging && 'bg-exhibit-surface shadow-lg'
                          )}
                        >
                          <TableCell
                            {...provided.dragHandleProps}
                            className={cn(bodyCell, 'cursor-grab active:cursor-grabbing')}
                          >
                            <GripVertical className="h-4 w-4 text-exhibit-soft transition-colors hover:text-exhibit-ink md:opacity-0 md:group-hover:opacity-100" />
                          </TableCell>

                          <TableCell className={bodyCell}>
                            {onPriorityChange ? (
                              <Select
                                value={priorityValueFor(action.priority_level || 3)}
                                onValueChange={(v) => onPriorityChange(action.id!, Number(v))}
                              >
                                <SelectTrigger
                                  className={cn(chipSelect, priorityPillFor(action.priority_level || 3))}
                                  aria-label="Change priority"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {priorityOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                      <span className="flex items-center gap-2">
                                        <span className={cn('h-2.5 w-2.5 rounded-[2px]', opt.dot)} />
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

                          <TableCell className={cn(bodyCell, 'pr-6')}>
                            {onTextChange ? (
                              <EditableText
                                value={action.action_text}
                                onSave={(v) => onTextChange(action.id!, v)}
                                multiline
                                required
                                ariaLabel="Edit action"
                                placeholder="Describe this action…"
                                displayClassName="font-manrope font-medium text-[15px] leading-[1.45] text-exhibit-ink"
                              />
                            ) : (
                              <p className="font-manrope font-medium text-[15px] leading-[1.45] text-exhibit-ink">
                                {action.action_text}
                              </p>
                            )}

                            {onSuccessCriteriaChange ? (
                              <EditableText
                                value={action.success_criteria}
                                onSave={(v) => onSuccessCriteriaChange(action.id!, v)}
                                multiline
                                ariaLabel="Edit how I'll know I'm done"
                                placeholder="I'll know I'm done when…"
                                suggestions={getSuccessCriteriaSuggestions(action.action_text)}
                                className="mt-0.5"
                                displayClassName="font-manrope text-[12.5px] leading-snug text-exhibit-moss"
                              />
                            ) : action.success_criteria ? (
                              <p className="font-manrope text-[12.5px] leading-snug text-exhibit-moss mt-0.5 line-clamp-1">
                                ✓ {action.success_criteria}
                              </p>
                            ) : null}

                            {action.reference_code && (
                              <div className="mt-1.5 font-mono text-[10.5px] text-exhibit-soft">
                                <SourceRefLine
                                  referenceCode={action.reference_code}
                                  recordingId={action.meeting_recording_id}
                                  compact
                                />
                              </div>
                            )}
                          </TableCell>

                          <TableCell className={cn(bodyCell, groupEdge, 'hidden lg:table-cell')}>
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
                                displayClassName="font-manrope text-[13px] text-exhibit-ink"
                              />
                            ) : (
                              <span className="font-manrope text-[13px] text-exhibit-ink">{action.assigned_to || 'You'}</span>
                            )}
                          </TableCell>

                          <TableCell className={cn(bodyCell, groupEdge)}>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1">
                                <span className="font-sora text-[9.5px] uppercase tracking-[0.12em] text-exhibit-soft w-10">Start</span>
                                {onStartDateChange ? (
                                  <EditableDate
                                    value={action.start_date}
                                    onSave={(d) => onStartDateChange(action.id!, d)}
                                    ariaLabel="Edit start date"
                                  />
                                ) : (
                                  <span className="font-sora text-[13px] tabular-nums text-exhibit-ink">{formatDate(action.start_date)}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-sora text-[9.5px] uppercase tracking-[0.12em] text-exhibit-soft w-10">Finish</span>
                                {onDueDateChange ? (
                                  <EditableDate
                                    value={action.completion_date || action.end_date}
                                    onSave={(d) => onDueDateChange(action.id!, d)}
                                    ariaLabel="Edit finish date"
                                  />
                                ) : (
                                  <span className="font-sora text-[13px] tabular-nums text-exhibit-ink">{formatDate(action.completion_date || action.end_date)}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className={cn(bodyCell, 'text-right')}>
                            <EditableDueIn
                              value={action.completion_date || action.end_date}
                              onSave={(d) => onDueDateChange && onDueDateChange(action.id!, d)}
                              status={action.status}
                            />
                          </TableCell>

                          <TableCell className={bodyCell}>
                            <Select
                              value={action.status}
                              onValueChange={(v) => onStatusChange(action.id!, v)}
                            >
                              <SelectTrigger
                                className={cn(chipSelect, getStatusOption(action.status).color)}
                                aria-label="Change status"
                              >
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

                          <TableCell className={cn(bodyCell, groupEdge)}>
                            <div className="space-y-0.5">
                              {onWatchersChange ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      aria-label="Change watchers"
                                      className="min-h-[32px] flex items-center rounded-[6px] px-2 -mx-2 hover:bg-exhibit-surface transition-colors"
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

                          <TableCell className={bodyCell}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-exhibit-moss md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                  aria-label="More options"
                                >
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
    </div>
  );
}
