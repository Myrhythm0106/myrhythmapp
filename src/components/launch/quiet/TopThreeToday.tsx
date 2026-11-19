import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, Plus, Repeat2, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLaunchCalendarEvents, type LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { useLaunchPriorityHighlights } from '@/hooks/useLaunchFocusDisplay';
import { pickTopThree, pinKey, loadPins, savePins, MAX_TOP } from '@/launch/today/topThree';
import { cn } from '@/lib/utils';

/** Today's top 3, taken from my diary. Ticking here ticks the diary too. */
export function TopThreeToday({ onPicked }: { onPicked?: (ids: string[]) => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const { events, loading, addEvent, updateStatus, fetchEvents } = useLaunchCalendarEvents(today, today);
  const starred = useLaunchPriorityHighlights();
  const key = useMemo(() => pinKey(user?.id), [user?.id]);
  const [pins, setPins] = useState<string[]>(() => loadPins(key));
  const [doneToday, setDoneToday] = useState<string[]>([]);
  const [swapFor, setSwapFor] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => { setPins(loadPins(key)); }, [key]);

  const top = useMemo(() => {
    const picked = pickTopThree(events, starred.ids, pins);
    // Keep items I just ticked visible (struck through) so the list doesn't jump.
    const ticked = events.filter(e => doneToday.includes(e.id) && e.status === 'done');
    return [...ticked, ...picked].slice(0, MAX_TOP);
  }, [events, starred.ids, pins, doneToday]);

  useEffect(() => { onPicked?.(top.map(e => e.id)); }, [top, onPicked]);

  const others = events.filter(e => e.status === 'pending' && !e.requiresAcceptance && !top.some(t => t.id === e.id));
  const doneCount = top.filter(e => e.status === 'done').length;

  const toggle = async (e: LaunchCalendarEvent) => {
    if (e.status === 'done') {
      await updateStatus(e.id, 'pending');
      setDoneToday(d => d.filter(id => id !== e.id));
    } else {
      setDoneToday(d => [...d, e.id]);
      await updateStatus(e.id, 'done');
      toast('Marked done in my diary', { action: { label: 'Undo', onClick: () => { void updateStatus(e.id, 'pending'); setDoneToday(d => d.filter(id => id !== e.id)); } } });
    }
  };

  const swap = (outId: string, inId: string) => {
    const current = top.filter(t => t.status === 'pending').map(t => t.id).map(id => (id === outId ? inId : id));
    setPins(current); savePins(key, current); setSwapFor(null);
  };

  const add = async () => {
    const title = draft.trim();
    if (!title) return;
    const h = Math.min(new Date().getHours() + 1, 23);
    await addEvent({ title, time: `${String(h).padStart(2, '0')}:00`, type: 'task', date: today, reminder_level: 'off' });
    setDraft('');
    void fetchEvents();
  };

  const openSlots = Math.max(0, MAX_TOP - top.filter(t => t.status === 'pending').length - doneCount);

  return (
    <section aria-labelledby="top3-title" className="rounded-3xl border border-launch-gold/25 bg-launch-ivory/80 p-6 shadow-[0_20px_50px_-30px_hsl(var(--launch-ink-deep)/0.35)] backdrop-blur-xl">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="top3-title" className="font-instrument text-2xl text-launch-ink">My top 3 today</h2>
        {top.length > 0 && <span className="text-sm text-launch-ink/60">{doneCount} of {top.length} done · from my diary</span>}
      </div>

      {loading && events.length === 0 ? (
        <div className="mt-4 h-[168px] animate-pulse rounded-2xl bg-launch-cream" />
      ) : events.length === 0 ? (
        <div className="mt-4">
          <p className="text-base text-launch-ink">Nothing in my diary yet today.</p>
          <button type="button" onClick={() => navigate('/launch/calendar')}
            className="mt-3 inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-5 font-semibold text-primary-foreground">
            <CalendarPlus className="h-5 w-5" /> Plan my day
          </button>
        </div>
      ) : (
        <ol className="mt-4 divide-y divide-launch-gold/20">
          {top.map((e, i) => (
            <li key={e.id} className="py-2">
              <div className="flex min-h-[56px] items-center gap-3">
                <button type="button" aria-pressed={e.status === 'done'}
                  aria-label={e.status === 'done' ? `Mark "${e.title}" not done` : `Mark "${e.title}" done`}
                  onClick={() => void toggle(e)}
                  className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
                    e.status === 'done' ? 'border-launch-teal bg-launch-teal text-primary-foreground' : 'border-launch-gold/50 text-launch-ink/50 hover:border-launch-teal')}>
                  {e.status === 'done' ? <Check className="h-5 w-5" /> : <span className="text-sm font-semibold">{i + 1}</span>}
                </button>
                <button type="button" onClick={() => navigate(`/launch/calendar?view=day&date=${format(today, 'yyyy-MM-dd')}`)}
                  className={cn('flex-1 text-left text-base text-launch-ink', e.status === 'done' && 'text-launch-ink/45 line-through')}>
                  <span className="mr-2 tabular-nums text-launch-ink/55">{e.time?.slice(0, 5)}</span>{e.title}
                </button>
                {e.status === 'pending' && others.length > 0 && (
                  <button type="button" aria-label={`Swap "${e.title}"`} onClick={() => setSwapFor(swapFor === e.id ? null : e.id)}
                    className="flex h-11 items-center gap-1 rounded-full px-3 text-sm text-launch-ink/55 hover:bg-launch-cream hover:text-launch-ink">
                    <Repeat2 className="h-4 w-4" /> Swap
                  </button>
                )}
              </div>
              {swapFor === e.id && (
                <div className="mb-2 ml-14 flex flex-wrap gap-2">
                  {others.slice(0, 6).map(o => (
                    <button key={o.id} type="button" onClick={() => swap(e.id, o.id)}
                      className="min-h-[44px] rounded-full border border-launch-gold/40 px-4 text-sm text-launch-ink hover:bg-launch-cream">
                      {o.time?.slice(0, 5)} · {o.title}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      {events.length > 0 && openSlots > 0 && (
        <form className="mt-3 flex gap-2" onSubmit={ev => { ev.preventDefault(); void add(); }}>
          <input value={draft} onChange={ev => setDraft(ev.target.value)} maxLength={80}
            placeholder="Add one thing that matters today" aria-label="Add one thing that matters today"
            className="min-h-[56px] flex-1 rounded-2xl border border-launch-gold/30 bg-launch-cream-light px-4 text-base text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-launch-teal" />
          <button type="submit" disabled={!draft.trim()} aria-label="Add to today's diary"
            className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl bg-launch-teal text-primary-foreground disabled:opacity-40">
            <Plus className="h-5 w-5" />
          </button>
        </form>
      )}
      {top.length === MAX_TOP && doneCount === MAX_TOP && (
        <p className="mt-3 text-sm text-launch-ink/70">All three done. That's a day people can count on.</p>
      )}
    </section>
  );
}
