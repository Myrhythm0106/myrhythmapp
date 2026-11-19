import React, { useCallback, useEffect, useState } from 'react';
import { addDays, format, subDays, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Lock, Plus, Clock3 } from 'lucide-react';
import { toast } from 'sonner';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchPageHeader } from '@/components/launch/LaunchPageHeader';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type Shared = { owner_id: string; owner_name: string; level: 'busy' | 'see' | 'help' };
type Item = { id: string; time: string | null; end_time: string | null; title: string; status: string; is_busy_only: boolean; added_by_name: string | null; awaiting_confirmation: boolean };

const LEVEL_LABEL: Record<Shared['level'], string> = { busy: 'Busy or free', see: 'Can see the day', help: 'Can help with the day' };

/** Diaries that people have chosen to share with me as part of their Support Circle. */
export default function LaunchCircleDiary() {
  const [shared, setShared] = useState<Shared[] | null>(null);
  const [active, setActive] = useState<Shared | null>(null);
  const [day, setDay] = useState(() => new Date());
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');

  useEffect(() => {
    (supabase.rpc as any)('my_shared_diaries').then(({ data, error }: { data: Shared[] | null; error: unknown }) => {
      const list = error ? [] : data ?? [];
      setShared(list);
      setActive(list[0] ?? null);
    });
  }, []);

  const load = useCallback(async () => {
    if (!active) return;
    setLoading(true);
    const d = format(day, 'yyyy-MM-dd');
    const { data, error } = await (supabase.rpc as any)('circle_diary', { p_owner: active.owner_id, p_from: d, p_to: d });
    setItems(error ? [] : data ?? []);
    setLoading(false);
  }, [active, day]);
  useEffect(() => { void load(); }, [load]);

  const suggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !title.trim()) return;
    const { error } = await (supabase.rpc as any)('circle_add_diary_item', { p_owner: active.owner_id, p_title: title.trim(), p_date: format(day, 'yyyy-MM-dd'), p_time: time });
    if (error) { toast.error('Could not add that just now'); return; }
    toast(`Sent to ${active.owner_name.split(' ')[0]} to confirm`);
    setTitle(''); void load();
  };

  const first = active?.owner_name.split(' ')[0] ?? '';

  return (
    <LaunchLayout>
      <LaunchPageHeader fallbackPath="/launch/support" />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 pb-24">
        <header>
          <h1 className="font-instrument text-4xl text-launch-ink">Diaries shared with me</h1>
          <p className="mt-1 text-base text-launch-ink/65">Only what each person has chosen to share. They can change it any time.</p>
        </header>

        {shared === null ? (
          <div className="h-32 animate-pulse rounded-3xl bg-launch-cream" />
        ) : shared.length === 0 ? (
          <div className="rounded-3xl border border-launch-gold/25 bg-launch-ivory/80 p-6">
            <p className="text-base text-launch-ink">No one has shared their diary with me yet.</p>
            <p className="mt-1 text-sm text-launch-ink/60">When someone in a Support Circle switches on diary sharing for me, it appears here.</p>
          </div>
        ) : (
          <>
            {shared.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {shared.map(s => (
                  <button key={s.owner_id} type="button" onClick={() => setActive(s)}
                    className={cn('min-h-[48px] rounded-full border px-4 text-sm font-semibold', active?.owner_id === s.owner_id ? 'border-launch-teal bg-launch-ivory text-launch-ink' : 'border-launch-gold/30 text-launch-ink/70')}>
                    {s.owner_name}
                  </button>
                ))}
              </div>
            )}

            {active && (
              <section className="rounded-3xl border border-launch-gold/25 bg-launch-ivory/80 p-6 shadow-[0_20px_50px_-30px_hsl(var(--launch-ink-deep)/0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-instrument text-2xl text-launch-ink">{first}'s day</h2>
                    <p className="text-sm text-launch-ink/60">{LEVEL_LABEL[active.level]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="Previous day" onClick={() => setDay(d => subDays(d, 1))} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-launch-cream"><ChevronLeft className="h-5 w-5" /></button>
                    <span className="min-w-[110px] text-center text-sm font-semibold text-launch-ink">{isToday(day) ? 'Today' : format(day, 'EEE d MMM')}</span>
                    <button type="button" aria-label="Next day" onClick={() => setDay(d => addDays(d, 1))} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-launch-cream"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-4 h-24 animate-pulse rounded-2xl bg-launch-cream" />
                ) : items.length === 0 ? (
                  <p className="mt-4 text-base text-launch-ink/70">Nothing in {first}'s diary for this day.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-launch-gold/20">
                    {items.map(it => (
                      <li key={it.id} className="flex min-h-[56px] items-center gap-3 py-2">
                        <span className="w-14 shrink-0 tabular-nums text-sm text-launch-ink/60">{it.time?.slice(0, 5)}</span>
                        <span className={cn('flex-1 text-base', it.is_busy_only ? 'text-launch-ink/55' : 'text-launch-ink', it.status === 'done' && 'line-through text-launch-ink/45')}>
                          {it.is_busy_only && <Lock className="mr-1.5 inline h-3.5 w-3.5" />}{it.title}
                        </span>
                        {it.awaiting_confirmation && <span className="inline-flex items-center gap-1 text-xs text-launch-ink/60"><Clock3 className="h-3.5 w-3.5" />Waiting for {first}</span>}
                        {it.status === 'done' && <span className="text-xs text-launch-teal">Done</span>}
                      </li>
                    ))}
                  </ul>
                )}

                {active.level === 'help' && (
                  <form onSubmit={suggest} className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} placeholder={`Suggest something for ${first}`} aria-label={`Suggest something for ${first}`}
                      className="min-h-[56px] flex-1 rounded-2xl border border-launch-gold/30 bg-launch-cream-light px-4 text-base text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-launch-teal" />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} aria-label="Time"
                      className="min-h-[56px] rounded-2xl border border-launch-gold/30 bg-launch-cream-light px-3 text-base text-launch-ink" />
                    <button type="submit" disabled={!title.trim()} className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-launch-teal px-5 font-semibold text-primary-foreground disabled:opacity-40">
                      <Plus className="h-5 w-5" /> Send to confirm
                    </button>
                  </form>
                )}
                {active.level === 'help' && <p className="mt-2 text-xs text-launch-ink/55">{first} sees "Added by me" and decides whether to keep it.</p>}
              </section>
            )}
          </>
        )}
      </div>
    </LaunchLayout>
  );
}
