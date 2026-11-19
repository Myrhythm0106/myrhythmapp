import React, { useEffect, useMemo, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { addTop, dayKey, loadTop, saveTop, MAX_TOP, type TopItem } from '@/launch/today/topThree';
import { cn } from '@/lib/utils';

/** Today's top 3 — chosen by me, kept on this device, fresh each day. */
export function TopThreeToday() {
  const { user } = useAuth();
  const key = useMemo(() => dayKey(user?.id), [user?.id]);
  const [items, setItems] = useState<TopItem[]>(() => loadTop(key));
  const [draft, setDraft] = useState('');

  useEffect(() => { setItems(loadTop(key)); }, [key]);
  const update = (next: TopItem[]) => { setItems(next); saveTop(key, next); };
  const done = items.filter(i => i.done).length;

  return (
    <section aria-labelledby="top3-title" className="rounded-3xl border border-launch-gold/25 bg-launch-ivory/80 p-6 shadow-[0_20px_50px_-30px_hsl(var(--launch-ink-deep)/0.35)] backdrop-blur-xl">
      <div className="flex items-baseline justify-between">
        <h2 id="top3-title" className="font-instrument text-2xl text-launch-ink">My top 3 today</h2>
        {items.length > 0 && <span className="text-sm text-launch-ink/60">{done} of {items.length} done</span>}
      </div>

      <ol className="mt-4 divide-y divide-launch-gold/20">
        {items.map((item, i) => (
          <li key={item.id} className="flex min-h-[56px] items-center gap-3 py-2">
            <button
              type="button"
              aria-label={item.done ? `Mark "${item.text}" not done` : `Mark "${item.text}" done`}
              onClick={() => update(items.map(x => x.id === item.id ? { ...x, done: !x.done } : x))}
              className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
                item.done ? 'border-launch-teal bg-launch-teal text-primary-foreground' : 'border-launch-gold/50 text-launch-ink/50 hover:border-launch-teal')}
            >
              {item.done ? <Check className="h-5 w-5" /> : <span className="text-sm font-semibold">{i + 1}</span>}
            </button>
            <span className={cn('flex-1 text-base text-launch-ink', item.done && 'text-launch-ink/45 line-through')}>{item.text}</span>
            <button type="button" aria-label={`Remove "${item.text}"`} onClick={() => update(items.filter(x => x.id !== item.id))}
              className="flex h-11 w-11 items-center justify-center rounded-full text-launch-ink/35 hover:bg-launch-cream hover:text-launch-ink">
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ol>

      {items.length < MAX_TOP && (
        <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); update(addTop(items, draft)); setDraft(''); }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={items.length === 0 ? 'What matters most today?' : 'Add another (optional)'}
            aria-label="Add a priority for today"
            maxLength={80}
            className="min-h-[56px] flex-1 rounded-2xl border border-launch-gold/30 bg-launch-cream-light px-4 text-base text-launch-ink placeholder:text-launch-ink/40 focus:outline-none focus:ring-2 focus:ring-launch-teal"
          />
          <button type="submit" disabled={!draft.trim()} aria-label="Add priority"
            className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl bg-launch-teal text-primary-foreground disabled:opacity-40">
            <Plus className="h-5 w-5" />
          </button>
        </form>
      )}
      {items.length === MAX_TOP && done === MAX_TOP && (
        <p className="mt-3 text-sm text-launch-ink/70">All three done. That's a day people can count on.</p>
      )}
    </section>
  );
}
