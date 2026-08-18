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
import { GripVertical, ArrowUpDown, MoreHorizontal, Eye, MessageCircle, Calendar, Lightbulb, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NextStepsItem } from '@/types/memoryBridge';
import { format } from 'date-fns';
import { ActionWatcherSelector } from './ActionWatcherSelector';
import { getSuccessCriteriaSuggestions } from './successCriteriaSuggestions';

interface ActionsTableViewProps {
  actions: NextStepsItem[];
  onDragEnd: (result: DropResult) => void;
  onStatusChange: (actionId: string, status: string) => void;
  onPriorityChange?: (actionId: string, priorityLevel: number) => void;
  onTextChange?: (actionId: string, text: string) => void;
  onSuccessCriteriaChange?: (actionId: string, criteria: string) => void;
  onAssignedChange?: (actionId: string, assignedTo: string) => void;
  onDueDateChange?: (actionId: string, date: string | null) => void;
  onWatchersChange?: (actionId: string, watchers: string[]) => void;
  onSort: (field: 'priority' | 'status' | 'date') => void;
  sortField: 'priority' | 'status' | 'date';
  sortDirection: 'asc' | 'desc';
}


const priorityOptions = [
  { value: '1', label: 'High', color: 'bg-red-500' },
  { value: '3', label: 'Medium', color: 'bg-brand-orange-500' },
  { value: '5', label: 'Low', color: 'bg-green-500' }
];

const priorityValueFor = (level: number) => (level <= 2 ? '1' : level >= 4 ? '5' : '3');

const statusOptions = [
  { value: 'not_started', label: 'Ready to Begin', color: 'bg-muted text-muted-foreground' },
  { value: 'doing', label: 'In My Flow', color: 'bg-blue-100 text-blue-700' },
  { value: 'done', label: 'Accomplished!', color: 'bg-green-100 text-green-700' },
  { value: 'on_hold', label: 'Paused', color: 'bg-amber-100 text-amber-700' },
  { value: 'cancelled', label: 'Redirected', color: 'bg-red-100 text-red-700' }
];

const PriorityIndicator = ({ level }: { level: number }) => {
  const config = {
    1: { color: 'bg-red-500', glow: 'shadow-red-500/50', label: 'High' },
    2: { color: 'bg-red-500', glow: 'shadow-red-500/50', label: 'High' },
    3: { color: 'bg-brand-orange-500', glow: 'shadow-brand-orange-500/50', label: 'Medium' },
    4: { color: 'bg-green-500', glow: 'shadow-green-500/50', label: 'Low' },
    5: { color: 'bg-green-500', glow: 'shadow-green-500/50', label: 'Low' }
  }[level] || { color: 'bg-gray-400', glow: '', label: 'None' };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn("w-3 h-3 rounded-full shadow-lg animate-pulse", config.color, config.glow)} 
        title={config.label}
      />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
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
          <AvatarFallback className="text-[10px] bg-neural-purple-100 text-neural-purple-700">
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

const EditableDueDate = ({
  value,
  onSave
}: {
  value: string | null | undefined;
  onSave: (date: string | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  let parsed: Date | undefined;
  try {
    parsed = value ? new Date(value) : undefined;
    if (parsed && isNaN(parsed.getTime())) parsed = undefined;
  } catch {
    parsed = undefined;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Change due date"
          className={cn('h-11 px-2 justify-start gap-1 text-sm font-normal', !parsed && 'text-muted-foreground')}
        >
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {parsed ? format(parsed, 'MMM d') : '—'}
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

export function ActionsTableView({
  actions,
  onDragEnd,
  onStatusChange,
  onPriorityChange,
  onTextChange,
  onSuccessCriteriaChange,
  onAssignedChange,
  onDueDateChange,
  onWatchersChange,
  onSort,
  sortField,
  sortDirection
}: ActionsTableViewProps) {

  const getStatusOption = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return '—';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-white/40">
      {/* Glass reflection */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/50 to-transparent pointer-events-none z-10" />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50/90 to-white/90 hover:bg-gray-50/90">
              <TableHead className="w-10"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-24"
                onClick={() => onSort('priority')}
              >
                <div className="flex items-center gap-1">
                  Priority
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'priority' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px]">Action</TableHead>
              <TableHead className="w-32">Assigned</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-24"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center gap-1">
                  Due
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'date' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors w-36"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors",
                    sortField === 'status' ? "text-brand-orange-500" : "text-muted-foreground"
                  )} />
                </div>
              </TableHead>
              <TableHead className="w-20">Watchers</TableHead>
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
                          "hover:bg-muted/30 transition-all duration-200",
                          snapshot.isDragging && "bg-brand-orange-50 shadow-lg scale-[1.01] rounded-lg"
                        )}
                      >
                        <TableCell 
                          {...provided.dragHandleProps} 
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </TableCell>
                        <TableCell>
                          {onPriorityChange ? (
                            <Select
                              value={priorityValueFor(action.priority_level || 3)}
                              onValueChange={(v) => onPriorityChange(action.id!, Number(v))}
                            >
                              <SelectTrigger
                                className="h-9 w-full border-0 bg-transparent px-2 text-xs"
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
                              displayClassName="font-medium text-sm"
                            />
                          ) : (
                            <p className="font-medium text-sm line-clamp-2">{action.action_text}</p>
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
                        <TableCell>
                          {onAssignedChange ? (
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
                          {onDueDateChange ? (
                            <EditableDueDate
                              value={action.completion_date || action.end_date}
                              onSave={(d) => onDueDateChange(action.id!, d)}
                            />
                          ) : (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(action.completion_date || action.end_date)}
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <Select 
                            value={action.status} 
                            onValueChange={(v) => onStatusChange(action.id!, v)}
                          >
                            <SelectTrigger className={cn(
                              "h-8 w-full text-xs border-0",
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
                          {onWatchersChange ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Change watchers"
                                  className="min-h-[44px] flex items-center rounded-md px-2 -mx-2 hover:bg-muted/50 transition-colors"
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
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Add Comment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Add to Calendar
                              </DropdownMenuItem>
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
