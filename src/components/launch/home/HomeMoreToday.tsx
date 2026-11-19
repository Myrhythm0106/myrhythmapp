import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getMoreOpen, setMoreOpen } from '@/launch/today/homePrefs';
import { cn } from '@/lib/utils';

export type MoreItem = { label: string; detail: string; to: string };

/** Folded by default; only appears when there is something inside. Remembers open/closed. */
export function HomeMoreToday({ uid, items }: { uid?: string; items: MoreItem[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => getMoreOpen(uid));
  if (items.length === 0) return null;
  return (
    <section className="border-t border-launch-gold/25 pt-2">
      <button type="button" aria-expanded={open} onClick={() => { setOpen(!open); setMoreOpen(uid, !open); }}
        className="flex min-h-[56px] w-full items-center justify-between text-left">
        <span className="text-sm font-semibold text-launch-ink">More for today <span className="font-normal text-launch-ink/55">({items.length})</span></span>
        <ChevronDown className={cn('h-5 w-5 text-launch-ink/50 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul className="pb-2">
          {items.map(i => (
            <li key={i.label}>
              <button type="button" onClick={() => navigate(i.to)} className="flex min-h-[52px] w-full items-baseline justify-between gap-3 rounded-xl px-2 text-left hover:bg-launch-cream">
                <span className="text-base text-launch-ink-deep">{i.label}</span>
                <span className="text-sm text-launch-ink/60">{i.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
