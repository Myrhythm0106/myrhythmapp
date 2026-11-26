import { LaunchYesWeekCard } from './LaunchYesWeekCard';
import type { YesAction } from '@/launch/yes/yesActions';
import React from 'react';
import { MoreVertical, Check, X, Calendar, Sparkles, Bell, Star, Lock, Unlock, UserRound, Compass } from 'lucide-react';
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
import { LaunchActionReminder, reminderOffsetLabel } from '@/hooks/useLaunchActionReminders';
import { SourceRefLine, type SourceState } from '@/components/traceability/SourceRefLine';
import { useActionVisionLinks, VISION_AREAS, visionAreaLabel, type VisionArea } from '@/launch/vision/actionVision';

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
  isPrivate?: boolean;
  requiresAcceptance?: boolean;
  addedByName?: string | null;
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
  onEventPrivacy?: (event: Event, isPrivate: boolean) => void;
  onCircleDecision?: (event: Event, accept: boolean) => void;
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
  onEventReschedule,
  onEventOpenSource,
  onAddYesAction,
  onEventPrivacy,
  onCircleDecision
}: LaunchDayViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));
  const sortedReminders = [...reminders].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  const priorities = useLaunchPriorityHighlights();
  const actionVision = useActionVisionLinks();
  const [visionHighlight, setVisionHighlight] = React.useState<'all' | VisionArea | null>(null);
  const isActive = (event: Event) => !event.status || event.status === 'pending';
  const priorityCount = sortedEvents.filter(event => event.id && isActive(event) && priorities.ids.includes(event.id)).length;
  const eventVisionArea = (event: Event) => actionVision.areaFor(event.extractedActionId);
  const linkedAreas = VISION_AREAS.filter(area => sortedEvents.some(event => eventVisionArea(event) === area.id));
  const isVisionHighlighted = (event: Event) => {
    const area = eventVisionArea(event);
    return visionHighlight === 'all' ? Boolean(area) : visionHighlight === area;
  };


  const getStatusStyles = (status?: Event['status']) => {
    if (status === 'done') return 'bg-launch-teal/5 border-launch-teal/30';
    if (status === 'cancelled' || status === 'carried') return 'bg-muted/40 border-border';
    return '';
  };

  // Persistence and the single closure message belong to the parent handlers.
  const handleMarkDone = (index: number) => onEventStatusChange?.(index, 'done');
  const handleCancel = (index: number) => onEventStatusChange?.(index, 'cancelled');
  const handleReschedule = (index: number) => onEventReschedule?.(index);

  return (
    <div className={cn("space-y-4", className)}>

      <LaunchDailyBrief
        date={date}
        eventCount={sortedEvents.filter(e => e.status !== 'cancelled' && e.status !== 'carried').length}
        focusTitle={undefined}
      />

      <h2 className="text-xl font-semibold font-display text-launch-ink">My schedule · {format(date, 'EEE d MMM')}</h2>

      {linkedAreas.length > 0 && (
        <div className="rounded-xl border border-launch-teal/20 bg-launch-teal/5 p-3">
          <label className="flex flex-wrap items-center gap-2 text-sm font-semibold text-launch-ink">
            <Compass className="h-4 w-4 text-launch-teal" aria-hidden="true" />
            Highlight steps serving My Vision
            <select
              value={visionHighlight ?? ''}
              onChange={event => setVisionHighlight((event.target.value || null) as 'all' | VisionArea | null)}
              className="min-h-[44px] rounded-lg border border-launch-teal/25 bg-launch-ivory px-3 text-sm text-launch-ink"
              aria-label="Highlight My Vision steps"
            >
              <option value="">No highlight</option>
              <option value="all">All linked steps</option>
              {linkedAreas.map(area => <option key={area.id} value={area.id}>{area.label}</option>)}
            </select>
          </label>
          {visionHighlight && <p className="mt-1 text-xs text-launch-ink/60">Everyday appointments stay visible.</p>}
        </div>
      )}

      {sortedReminders.length > 0 && (
        <div className="space-y-2">
          {sortedReminders.map((r) => (
            <Button
              variant="ghost"
              key={r.id}
              onClick={() => onReminderSelect?.(r)}
              className={cn(
                'w-full h-auto whitespace-normal text-left flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-launch-gold/50 bg-launch-gold/5 px-4 py-3 min-h-[56px] transition-colors hover:bg-launch-gold/10',
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
            </Button>
          ))}
        </div>
      )}

      {sortedEvents.length === 0 ? (
        sortedReminders.length === 0 ? (
          <LaunchCard className="p-8 text-center">
            <p className="text-foreground text-lg">My diary has space today.</p>

          </LaunchCard>
        ) : null
      ) : (

        <div className="space-y-3">
          {sortedEvents.map((event, i) => (
            <LaunchCard
              key={event.id ?? i}
              variant="glass"
              className={cn("p-4", getStatusStyles(event.status), event.id && isActive(event) && priorities.ids.includes(event.id) && 'border-launch-gold bg-launch-gold/5', isVisionHighlighted(event) && 'border-launch-teal bg-launch-teal/5 ring-1 ring-launch-teal/35')}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                <div className="text-center min-w-[50px]">
                  <p className={cn(
                    "text-sm font-bold",
                    event.status === 'done' ? 'text-launch-teal' :
                    event.status === 'cancelled' ? 'text-muted-foreground line-through' :
                    'text-foreground'
                  )}>
                    {event.time}
                  </p>
                </div>
                <div className="w-1 h-12 rounded-full bg-launch-teal/40" />
                <div className="flex-1 min-w-0 basis-[calc(100%-70px)] sm:basis-0">
                  <p className={cn(
                    "font-medium break-words",
                    event.status === 'done' ? 'text-launch-teal line-through' :
                    event.status === 'cancelled' ? 'text-muted-foreground line-through' :
                    'text-foreground'
                  )}>
                    {event.status === 'done' && <Check className="inline h-4 w-4 mr-1 text-launch-teal" />}
                    {event.status === 'cancelled' && <X className="inline h-4 w-4 mr-1 text-muted-foreground" />}
                    {event.title}
                  </p>
                  {event.requiresAcceptance && event.status === 'pending' && (
                    <div className="mt-2 rounded-xl border border-launch-gold/40 bg-launch-cream-light p-3">
                      <p className="flex items-center gap-1.5 text-sm text-launch-ink"><UserRound className="h-4 w-4" />Added by {event.addedByName || 'my Support Circle'}. Shall I keep it?</p>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="action" className="min-h-14" onClick={() => onCircleDecision?.(event, true)}>Keep it</Button>
                        <Button size="sm" variant="outline" className="min-h-14" onClick={() => onCircleDecision?.(event, false)}>No thanks</Button>
                      </div>
                    </div>
                  )}
                  {event.isPrivate && (
                    <span className="mt-1 inline-flex items-center gap-1 text-sm text-launch-ink/60"><Lock className="h-3.5 w-3.5" />Private</span>
                  )}
                  {event.id && isActive(event) && priorities.ids.includes(event.id) && (
                    <span className="inline-flex items-center gap-1 text-base text-launch-ink mt-1"><Star className="h-4 w-4 fill-current" />Priority</span>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base text-muted-foreground capitalize">{event.type}</p>
                    {event.source === 'memory_bridge' && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => onEventOpenSource?.(event)}
                        className="min-h-14 text-base text-launch-teal px-0"
                      >
                        <Sparkles className="h-3 w-3" />
                        From my conversation
                      </Button>
                    )}

                    {eventVisionArea(event) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-launch-teal/10 px-2 py-0.5 text-xs font-semibold text-launch-teal">
                        <Compass className="h-3 w-3" aria-hidden="true" />My Vision: {visionAreaLabel(eventVisionArea(event))}
                      </span>
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
                      <span className="text-base bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Carried over
                      </span>
                    )}
                  </div>
                  <ExpandableBrief text={event.description} className="mt-1.5" />
                </div>

                {event.id && isActive(event) && (
                  <Button variant="ghost" size="icon"
                    className="shrink-0 min-h-14 min-w-14 text-launch-ink hover:text-launch-ink hover:bg-launch-gold/10"
                    aria-label={`${priorities.ids.includes(event.id) ? 'Remove priority' : 'Mark as a priority'}: ${event.title}`}
                    title={priorities.ids.includes(event.id) ? 'Remove priority' : 'Mark as a priority'}
                    aria-pressed={priorities.ids.includes(event.id)}
                    onClick={() => { if (event.id) priorities.toggle(event.id); }}>
                    <Star className={cn('h-5 w-5', priorities.ids.includes(event.id) && 'fill-current')} />
                  </Button>
                )}
                {isActive(event) && !event.requiresAcceptance && onEventStatusChange && (
                  <Button variant="ghost" className="min-h-14 text-launch-teal border border-launch-teal/30" onClick={() => handleMarkDone(i)} aria-label={`Mark done: ${event.title}`}>
                    <Check />Done
                  </Button>
                )}
                {/* Action Menu */}
                {event.status !== 'done' && event.status !== 'cancelled' && event.status !== 'carried' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${event.title}`} className="min-h-14 min-w-14 text-muted-foreground">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleCancel(i)} className="min-h-14 text-muted-foreground">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReschedule(i)} className="min-h-14 text-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Choose another time
                      </DropdownMenuItem>
                      {onEventPrivacy && event.id && (
                        <DropdownMenuItem className="min-h-14" onClick={() => onEventPrivacy(event, !event.isPrivate)}>
                          {event.isPrivate ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                          {event.isPrivate ? 'Show to my circle' : 'Keep private'}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Status indicator for completed/cancelled */}
                {(event.status === 'done' || event.status === 'cancelled' || event.status === 'carried') && (
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    event.status === 'done' && 'bg-launch-teal/10 text-launch-teal',
                    event.status === 'cancelled' && 'bg-muted text-muted-foreground',
                    event.status === 'carried' && 'bg-muted text-muted-foreground'
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
    </div>
  );
}
