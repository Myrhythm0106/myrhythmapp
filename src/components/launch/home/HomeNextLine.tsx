import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';

const toMin = (t?: string) => { const [h, m] = (t || '00:00').split(':').map(Number); return h * 60 + (m || 0); };
const until = (n: number) => (n <= 0 ? 'now' : n < 60 ? `in ${n} min` : `in ${Math.floor(n / 60)} h${n % 60 ? ` ${n % 60} min` : ''}`);

/** One quiet line: what's next, with a gentle countdown. */
export function HomeNextLine({ events, excludeIds = [], onOpen }: { events: LaunchCalendarEvent[]; excludeIds?: string[]; onOpen?: (e: LaunchCalendarEvent) => void }) {
  const [now, setNow] = useState(() => new Date().getHours() * 60 + new Date().getMinutes());
  useEffect(() => { const t = setInterval(() => setNow(new Date().getHours() * 60 + new Date().getMinutes()), 60_000); return () => clearInterval(t); }, []);
  const next = useMemo(() => events
    .filter(e => e.status === 'pending' && !e.requiresAcceptance && !excludeIds.includes(e.id) && toMin(e.time) >= now - 10)
    .sort((a, b) => toMin(a.time) - toMin(b.time))[0], [events, excludeIds, now]);
  if (!next) return null;
  return (
    <button type="button" onClick={() => onOpen?.(next)} disabled={!onOpen}
      className="flex min-h-[56px] w-full items-center gap-3 border-t border-launch-gold/25 pt-3 text-left">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-launch-moss">Next</span>
      <span className="flex-1 truncate text-base text-launch-ink-deep">{next.title} · <span className="tabular-nums">{next.time?.slice(0, 5)}</span></span>
      <span className="text-sm font-semibold text-launch-teal">{until(toMin(next.time) - now)}</span>
      {onOpen && <ChevronRight className="h-4 w-4 text-launch-ink/35" />}
    </button>
  );
}
