import React, { useMemo, useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';
import {
  addDays, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek,
} from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import type { LaunchActionReminder } from '@/hooks/useLaunchActionReminders';

interface YearEvent { time: string; title: string; type: string; date?: Date; status?: string }

interface LaunchYearViewProps {
  date: Date;
  onMonthSelect: (date: Date) => void;
  onDaySelect?: (date: Date) => void;
  events?: YearEvent[];
  reminders?: LaunchActionReminder[];
  className?: string;
  yearVision?: string;
  onYearVisionChange?: (vision: string) => void;
}

const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function LaunchYearView({
  date, onMonthSelect, onDaySelect, events = [], reminders = [], className = '', yearVision, onYearVisionChange,
}: LaunchYearViewProps) {
  const today = new Date();
  const year = date.getFullYear();
  const [openDay, setOpenDay] = useState<Date | null>(null);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    events.forEach((e) => { if (e.date && e.date.getFullYear() === year) m.set(dayKey(e.date), (m.get(dayKey(e.date)) ?? 0) + 1); });
    reminders.forEach((r) => { if (r.dueAt.getFullYear() === year) m.set(dayKey(r.dueAt), (m.get(dayKey(r.dueAt)) ?? 0) + 1); });
    return m;
  }, [events, reminders, year]);

  const dayEvents = openDay ? events.filter((e) => e.date && isSameDay(e.date, openDay)) : [];
  const dayReminders = openDay ? reminders.filter((r) => isSameDay(r.dueAt, openDay)) : [];

  return (
    <div className={cn('space-y-4', className)}>
      <LaunchCommitmentBanner scope="year" date={date} inheritedVision={yearVision} onVisionChange={onYearVisionChange} />

      <div className="text-center">
        <h2 className="text-2xl font-bold text-launch-ink">{year}</h2>
        <p className="text-base text-launch-ink/70">Tap a day to see what's planned. Tap a month name to open it.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, i) => {
          const monthDate = new Date(year, i, 1);
          const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
          const end = endOfMonth(monthDate);
          const days: Date[] = [];
          for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
          const total = days.filter((d) => isSameMonth(d, monthDate)).reduce((n, d) => n + (counts.get(dayKey(d)) ?? 0), 0);
          const current = isSameMonth(monthDate, today);
          return (
            <div key={i} className={cn('rounded-2xl border bg-launch-ivory p-4', current ? 'border-launch-teal ring-1 ring-launch-teal' : 'border-launch-gold/30')}>
              <button type="button" onClick={() => onMonthSelect(monthDate)}
                className="w-full flex items-baseline justify-between min-h-11 text-left">
                <span className="text-lg font-semibold text-launch-ink">{format(monthDate, 'MMMM')}</span>
                <span className="text-base text-launch-ink/70">{total} {total === 1 ? 'action' : 'actions'}</span>
              </button>
              <div className="grid grid-cols-7 gap-1 mt-2" role="grid" aria-label={`${format(monthDate, 'MMMM')} days`}>
                {WEEKDAYS.map((w, j) => <span key={j} className="text-center text-xs text-launch-ink/60">{w}</span>)}
                {days.map((d) => {
                  if (!isSameMonth(d, monthDate)) return <span key={dayKey(d)} />;
                  const n = counts.get(dayKey(d)) ?? 0;
                  return (
                    <button key={dayKey(d)} type="button" onClick={() => setOpenDay(d)}
                      aria-label={`${format(d, 'd MMMM')}: ${n} ${n === 1 ? 'action' : 'actions'}`}
                      className={cn(
                        'relative min-h-11 rounded-lg text-sm flex flex-col items-center justify-center transition-colors hover:bg-launch-teal/10',
                        n >= 3 ? 'bg-launch-teal/25' : n > 0 ? 'bg-launch-teal/10' : '',
                        isSameDay(d, today) && 'ring-2 ring-launch-ember',
                      )}>
                      <span className="text-launch-ink">{format(d, 'd')}</span>
                      {n > 0 && <span className="text-[11px] font-bold leading-none text-launch-teal">{n}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={!!openDay} onOpenChange={(o) => !o && setOpenDay(null)}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto bg-launch-ivory">
          {openDay && <>
            <SheetHeader>
              <SheetTitle className="text-xl">{format(openDay, 'EEEE d MMMM yyyy')}</SheetTitle>
              <SheetDescription className="text-base">
                {dayEvents.length + dayReminders.length === 0 ? 'Nothing planned for this day.' : `${dayEvents.length + dayReminders.length} planned`}
              </SheetDescription>
            </SheetHeader>
            <ul className="mt-4 space-y-2">
              {dayEvents.map((e, i) => (
                <li key={`e${i}`} className="flex items-start gap-3 rounded-xl border border-launch-gold/30 bg-white p-3">
                  <Clock className="h-5 w-5 mt-0.5 text-launch-teal shrink-0" />
                  <div className="min-w-0">
                    <p className="text-base font-medium text-launch-ink break-words">{e.title}</p>
                    <p className="text-sm text-launch-ink/70">{e.time || 'Any time'}{e.status ? ` · ${e.status}` : ''}</p>
                  </div>
                </li>
              ))}
              {dayReminders.map((r) => (
                <li key={r.id} className="flex items-start gap-3 rounded-xl border border-launch-gold/30 bg-white p-3">
                  <Bell className="h-5 w-5 mt-0.5 text-launch-ember shrink-0" />
                  <div className="min-w-0">
                    <p className="text-base font-medium text-launch-ink break-words">{r.actionText}</p>
                    <p className="text-sm text-launch-ink/70">Reminder{r.sent ? ' · sent' : ''}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 mt-5">
              {onDaySelect && (
                <Button className="min-h-14 px-6 text-base bg-launch-teal text-launch-cream hover:bg-launch-teal/90"
                  onClick={() => { const d = openDay; setOpenDay(null); onDaySelect(d); }}>
                  Open this day
                </Button>
              )}
              <Button variant="outline" className="min-h-14 px-6 text-base" onClick={() => setOpenDay(null)}>Close</Button>
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
