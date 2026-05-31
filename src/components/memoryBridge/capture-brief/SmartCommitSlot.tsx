import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar as CalendarIcon,
  Bell,
  Lock,
  Unlock,
  ChevronDown,
  Loader2,
  Check,
  Users,
  Eye,
  X,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import type {
  BriefAction,
  PersonPick,
  SchedulingSuggestion,
  ActionReminder,
} from './model/types';
import {
  defaultReminders,
  formatDateLabel,
  validatePostpone,
} from './model/scheduleActions';
import { commitAction, undoCommit } from './model/commitActions';

interface Props {
  action: BriefAction;
  onUpdated: (updates: Partial<BriefAction>) => void;
}

const REMINDER_OPTIONS: { label: string; minutes: number }[] = [
  { label: 'At start', minutes: 0 },
  { label: '15 min before', minutes: 15 },
  { label: '30 min before', minutes: 30 },
  { label: '1 hour before', minutes: 60 },
  { label: '1 day before', minutes: 1440 },
  { label: 'Morning of (8h)', minutes: 480 },
];

export function SmartCommitSlot({ action, onUpdated }: Props) {
  const isScheduled = Boolean(action.scheduled?.calendarEventId);
  const recommended = useMemo(
    () => action.suggestions?.find(s => s.isRecommended) || action.suggestions?.[0],
    [action.suggestions],
  );

  const [selected, setSelected] = useState<SchedulingSuggestion | null>(recommended || null);
  const [reminders, setReminders] = useState<ActionReminder[]>(() =>
    defaultReminders(action.priority, action.dueDate?.date, recommended?.date),
  );
  const [dueLocked, setDueLocked] = useState<boolean>(action.dueDate?.locked ?? false);
  const [dueDate, setDueDate] = useState<string | undefined>(action.dueDate?.date);
  const [people, setPeople] = useState<PersonPick[]>(action.people || []);
  const [committing, setCommitting] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const start = selected?.date && selected?.time
    ? { date: selected.date, time: selected.time }
    : action.dateMentionedInMeeting && action.dueDate
      ? { date: action.dueDate.date, time: '09:00' }
      : null;

  if (isScheduled) {
    return (
      <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-xl bg-memory-emerald-50 border border-memory-emerald-200">
        <div className="flex items-center gap-2 text-sm text-memory-emerald-700">
          <Check className="h-4 w-4" />
          <span className="font-semibold">
            Scheduled {formatDateLabel(action.scheduled!.startDate)} · {action.scheduled!.startTime}
          </span>
          {(action.scheduled!.invitedMemberIds.length > 0 || action.scheduled!.watcherMemberIds.length > 0) && (
            <span className="text-xs text-memory-emerald-600">
              · {action.scheduled!.invitedMemberIds.length} invited
              {action.scheduled!.watcherMemberIds.length > 0 && `, ${action.scheduled!.watcherMemberIds.length} watching`}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-memory-emerald-700 hover:text-memory-emerald-900"
          onClick={async () => {
            await undoCommit(action);
            onUpdated({ scheduled: undefined });
            toast.success('Undone');
          }}
        >
          <Undo2 className="h-3 w-3 mr-1" />
          Undo
        </Button>
      </div>
    );
  }

  const handleSchedule = async () => {
    if (!start) {
      toast.error('Pick a time first');
      return;
    }
    const check = validatePostpone(start.date, dueDate);
    if (!check.ok) {
      setWarning(check.warning || null);
      return;
    }
    setWarning(null);
    setCommitting(true);
    const res = await commitAction(action, {
      startDate: start.date,
      startTime: start.time,
      dueDate,
      reminders,
      people,
    });
    setCommitting(false);
    if (!res.ok || !res.calendarEventId) {
      toast.error(res.error || 'Could not schedule');
      return;
    }
    onUpdated({
      scheduled: {
        startDate: start.date,
        startTime: start.time,
        dueDate,
        reminders,
        invitedMemberIds: people.filter(p => p.role === 'invite').map(p => p.memberId),
        watcherMemberIds: people.filter(p => p.role === 'watch').map(p => p.memberId),
        calendarEventId: res.calendarEventId,
      },
    });
    toast.success('Scheduled', { duration: 4000 });
  };

  const togglePersonRole = (memberId: string, role: PersonPick['role']) => {
    setPeople(prev => prev.map(p => (p.memberId === memberId ? { ...p, role } : p)));
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-card border border-border space-y-3">
      {/* Suggestions row */}
      {action.suggestions && action.suggestions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange-600 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            AI suggested
          </span>
          {action.suggestions.map(s => {
            const isActive = selected?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  isActive
                    ? 'bg-brand-orange-500 text-white border-brand-orange-500'
                    : 'bg-background text-foreground border-border hover:border-brand-orange-400',
                  s.isRecommended && !isActive && 'ring-1 ring-brand-orange-300',
                ].filter(Boolean).join(' ')}
              >
                {formatDateLabel(s.date)} · {s.time}
                {s.isRecommended && <span className="ml-1 opacity-80">★</span>}
              </button>
            );
          })}
        </div>
      )}
      {selected?.reason && (
        <p className="text-xs text-muted-foreground italic">{selected.reason}</p>
      )}

      {/* 3-field SMART grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Field icon={<CalendarIcon className="h-3.5 w-3.5" />} label="Start">
          <span className="text-sm font-semibold text-foreground">
            {start ? `${formatDateLabel(start.date)} · ${start.time}` : 'Pick a slot'}
          </span>
        </Field>

        <Field icon={<Bell className="h-3.5 w-3.5" />} label="Remind">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-semibold text-foreground inline-flex items-center gap-1 hover:text-brand-orange-600">
              {reminders.length === 0
                ? 'No reminder'
                : reminders.length === 1
                  ? labelForMinutes(reminders[0].minutesBefore)
                  : `${reminders.length} reminders`}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {REMINDER_OPTIONS.map(o => (
                <DropdownMenuItem
                  key={o.minutes}
                  onClick={() => setReminders([{ minutesBefore: o.minutes, channel: 'push' }])}
                >
                  {o.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setReminders([])}>None</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>

        <Field icon={dueLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />} label="Due">
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dueDate || ''}
              disabled={dueLocked}
              onChange={e => setDueDate(e.target.value || undefined)}
              className="text-sm font-semibold text-foreground bg-transparent border-0 p-0 focus:outline-none focus:ring-0 disabled:opacity-100"
            />
            <button
              onClick={() => setDueLocked(v => !v)}
              className="opacity-50 hover:opacity-100"
              title={dueLocked ? 'Unlock to override' : 'Lock'}
            >
              {dueLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </button>
          </div>
          {action.dueDate?.source === 'meeting' && (
            <span className="text-[10px] text-brand-orange-600 font-semibold">From meeting</span>
          )}
        </Field>
      </div>

      {warning && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {warning}
        </div>
      )}

      {/* People row */}
      {people.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Who knows?
          </span>
          {people.map(p => (
            <PersonChip key={p.memberId} person={p} onChange={(r) => togglePersonRole(p.memberId, r)} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          onClick={handleSchedule}
          disabled={committing || !start}
          className="min-h-[44px] bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-semibold"
        >
          {committing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
          Schedule
          {start && <span className="ml-1 opacity-80">{formatDateLabel(start.date)}</span>}
        </Button>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function labelForMinutes(min: number): string {
  const found = REMINDER_OPTIONS.find(o => o.minutes === min);
  return found?.label || `${min} min before`;
}

function PersonChip({ person, onChange }: { person: PersonPick; onChange: (r: PersonPick['role']) => void }) {
  const icon = person.role === 'invite' ? <Check className="h-3 w-3" />
    : person.role === 'watch' ? <Eye className="h-3 w-3" />
      : <X className="h-3 w-3" />;
  const tone =
    person.role === 'invite' ? 'bg-brand-orange-50 text-brand-orange-700 border-brand-orange-200'
    : person.role === 'watch' ? 'bg-brain-health-50 text-brain-health-700 border-brain-health-200'
    : 'bg-muted text-muted-foreground border-border';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tone} hover:opacity-80`}>
          {icon}
          {person.name}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem disabled={!person.canInvite} onClick={() => onChange('invite')}>
          <Check className="h-3.5 w-3.5 mr-2" /> Invite {!person.canInvite && '(no calendar access)'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!person.canWatch} onClick={() => onChange('watch')}>
          <Eye className="h-3.5 w-3.5 mr-2" /> Watch only {!person.canWatch && '(no actions access)'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('none')}>
          <X className="h-3.5 w-3.5 mr-2" /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
