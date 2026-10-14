import { LaunchYesWeekCard } from './LaunchYesWeekCard';
import type { YesAction } from '@/launch/yes/yesActions';
import React from 'react';
import { MoreVertical, Check, X, ArrowRight, Calendar, Sparkles, Bell, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLaunchPriorityHighlights } from '@/hooks/useLaunchFocusDisplay';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { LaunchDailyBrief } from './LaunchDailyBrief';
import { ExpandableBrief } from './ExpandableBrief';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { LaunchActionReminder, reminderOffsetLabel } from '@/hooks/useLaunchActionReminders';
import { SourceRefLine, type SourceState } from '@/components/traceability/SourceRefLine';

interface Event {
  id?: string;
  time: string;
  title: string;
  type: string;
  description?: string | null;
  status?: 'pending' | 'done' | 'cancelled' | 'carried';
  carriedFrom?: Date | null;
  source?: string;
  extractedActionId?: string | null;
  referenceCode?: string | null;
  sourceState?: SourceState;
  sourceRecordingId?: string | null;
}


interface LaunchDayViewProps {
  date: Date;
  events: Event[];
  reminders?: LaunchActionReminder[];
  onReminderSelect?: (reminder: LaunchActionReminder) => void;
  className?: string;
  inheritedVision?: string;
  inheritedMonthFocus?: string;
  inheritedWeekFocus?: string;
  onEventStatusChange?: (eventIndex: number, status: Event['status']) => void;
  onEventCarryOver?: (eventIndex: number) => void;
  onEventReschedule?: (eventIndex: number) => void;
  onEventOpenSource?: (event: Event) => void;
  onAddYesAction?: (action: YesAction) => void;
}



export function LaunchDayView({ 
  date, 
  events, 
  reminders = [],
  onReminderSelect,
  className = '',
  inheritedVision,
  inheritedMonthFocus,
  inheritedWeekFocus,
  onEventStatusChange,
  onEventCarryOver,
  onEventReschedule,
  onEventOpenSource,
  onAddYesAction
}: LaunchDayViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));
  const sortedReminders = [...reminders].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  const priorities = useLaunchPriorityHighlights();
  const isActive = (event: Event) => !event.status || event.status === 'pending';
  const priorityCount = sortedEvents.filter(event => event.id && isActive(event) && priorities.ids.includes(event.id)).length;


  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      routine: 'bg-brand-emerald-400',
      appointment: 'bg-blue-400',
      medical: 'bg-red-400',
      activity: 'bg-purple-400',
      social: 'bg-amber-400',
      rest: 'bg-brand-teal-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getStatusStyles = (status?: Event['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200 opacity-60';
      case 'carried':
        return 'bg-amber-50 border-amber-200 opacity-70';
      default:
        return '';
    }
  };

  const handleMarkDone = (index: number) => {
    onEventStatusChange?.(index, 'done');
    toast.success('Task completed.');
  };

  const handleCancel = (index: number) => {
    onEventStatusChange?.(index, 'cancelled');
    toast('Task cancelled', { description: 'No worries, priorities shift!' });
  };

  const handleCarryOver = (index: number) => {
    onEventCarryOver?.(index);
    toast.success('Moved to tomorrow', { 
      description: 'Same time tomorrow. Tap to reschedule if needed.',
      action: {
        label: 'Reschedule',
        onClick: () => onEventReschedule?.(index)
      }
    });
  };

  const handleReschedule = (index: number) => {
    onEventReschedule?.(index);
    toast('Opening scheduler...', { description: 'Choose a new date and time' });
  };

  return (
    <div className={cn("space-y-4", className)}>

      <LaunchDailyBrief
        date={date}
        eventCount={sortedEvents.filter(e => e.status !== 'cancelled' && e.status !== 'carried').length}
        focusTitle={undefined}
      />

      <LaunchCommitmentBanner 
        scope="day" 
        date={date} 
        inheritedVision={inheritedVision}
        inheritedFocus={inheritedWeekFocus || inheritedMonthFocus}
      />

      <div className="flex items-center justify-between gap-3 pt-2 text-launch-ink">
        <h2 className="text-xl font-semibold font-display">My Daily Rhythm</h2>
        {priorityCount > 0 && <span className="text-base">{priorityCount} highlighted</span>}
      </div>
      <LaunchYesWeekCard date={date} onAdd={onAddYesAction} />
      <p className="text-base text-launch-ink">My schedule</p>

      {sortedReminders.length > 0 && (
        <div className="space-y-2">
          {sortedReminders.map((r) => (
            <button
              key={r.id}
              onClick={() => onReminderSelect?.(r)}
              className={cn(
                'w-full text-left flex items-center gap-3 rounded-xl border border-dashed border-launch-gold/50 bg-launch-gold/5 px-4 py-3 min-h-[56px] transition-colors hover:bg-launch-gold/10',
                r.sent && 'opacity-60'
              )}
            >
              <span className="text-xs font-semibold text-launch-ink/60 min-w-[42px]">
                {format(r.dueAt, 'HH:mm')}
              </span>
              <Bell className="h-4 w-4 text-launch-ember shrink-0" />
              <span className="flex-1 text-sm text-launch-ink">
                <span className="font-medium">Nudge · </span>
                {r.actionText}
              </span>
              <span className="text-xs text-launch-ink/60 whitespace-nowrap">
                {reminderOffsetLabel(r.offsetDays)}
              </span>
            </button>
          ))}
        </div>
      )}

      {sortedEvents.length === 0 ? (
        sortedReminders.length === 0 ? (
          <LaunchCard className="p-8 text-center">
            <p className="text-gray-500">No events scheduled for today</p>
            <p className="text-sm text-brand-teal-600 mt-2">Tap "+ Add" to create one</p>
          </LaunchCard>
        ) : null
      ) : (

        <div className="space-y-3">
          {sortedEvents.map((event, i) => (
            <LaunchCard 
              key={event.id ?? i}
              variant="glass" 
              className={cn("p-4", getStatusStyles(event.status), event.id && isActive(event) && priorities.ids.includes(event.id) && 'border-launch-gold bg-launch-gold/5')}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-center min-w-[50px]">
                  <p className={cn(
                    "text-sm font-bold",
                    event.status === 'done' ? 'text-green-600' : 
                    event.status === 'cancelled' ? 'text-gray-400 line-through' : 
                    'text-gray-900'
                  )}>
                    {event.time}
                  </p>
                </div>
                <div className={cn("w-1 h-12 rounded-full", getTypeColor(event.type))} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium break-words",
                    event.status === 'done' ? 'text-green-700 line-through' : 
                    event.status === 'cancelled' ? 'text-gray-400 line-through' : 
                    'text-gray-900'
                  )}>
                    {event.status === 'done' && <Check className="inline h-4 w-4 mr-1 text-green-500" />}
                    {event.status === 'cancelled' && <X className="inline h-4 w-4 mr-1 text-gray-400" />}
                    {event.title}
                  </p>
                  {event.id && isActive(event) && priorities.ids.includes(event.id) && (
                    <span className="inline-flex items-center gap-1 text-base text-launch-ink mt-1"><Star className="h-4 w-4 fill-current" />Priority</span>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-500 capitalize">{event.type}</p>
                    {event.source === 'memory_bridge' && (
                      <button
                        type="button"
                        onClick={() => onEventOpenSource?.(event)}
                        className="text-xs bg-brand-teal-100 text-brand-teal-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1 hover:bg-brand-teal-200 transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        From Memory Bridge
                      </button>
                    )}

                    {event.referenceCode && (
                      <SourceRefLine
                        referenceCode={event.referenceCode}
                        recordingId={event.sourceRecordingId}
                        state={event.sourceState}
                        compact
                      />
                    )}


                    {event.carriedFrom && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Carried over
                      </span>
                    )}
                  </div>
                  <ExpandableBrief text={event.description} className="mt-1.5" />
                </div>
                
                {event.id && isActive(event) && (
                  <Button variant="ghost" size="icon"
                    className="shrink-0 min-h-11 min-w-11 text-launch-ink hover:text-launch-ink hover:bg-launch-gold/10"
                    aria-label={`${priorities.ids.includes(event.id) ? 'Remove priority' : 'Mark as a priority'}: ${event.title}`}
                    title={priorities.ids.includes(event.id) ? 'Remove priority' : 'Mark as a priority'}
                    aria-pressed={priorities.ids.includes(event.id)}
                    onClick={() => { if (event.id) priorities.toggle(event.id); }}>
                    <Star className={cn('h-5 w-5', priorities.ids.includes(event.id) && 'fill-current')} />
                  </Button>
                )}
                {/* Action Menu */}
                {event.status !== 'done' && event.status !== 'cancelled' && event.status !== 'carried' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleMarkDone(i)} className="text-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        Done
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCancel(i)} className="text-gray-600">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCarryOver(i)} className="text-amber-600">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Carry to Tomorrow
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReschedule(i)} className="text-blue-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Reschedule...
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Status indicator for completed/cancelled */}
                {(event.status === 'done' || event.status === 'cancelled' || event.status === 'carried') && (
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    event.status === 'done' && 'bg-green-100 text-green-700',
                    event.status === 'cancelled' && 'bg-gray-100 text-gray-500',
                    event.status === 'carried' && 'bg-amber-100 text-amber-700'
                  )}>
                    {event.status === 'done' && '✓ Done'}
                    {event.status === 'cancelled' && 'Cancelled'}
                    {event.status === 'carried' && '→ Moved'}
                  </div>
                )}
              </div>
            </LaunchCard>
          ))}
        </div>
      )}
    </div>
  );
}
