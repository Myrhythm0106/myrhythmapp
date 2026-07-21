import React from 'react';
import { GROWTH_STATE_BY_KEY, TONE_CLASSES } from './states';
import type { GrowthStateRow } from '@/hooks/useGrowthStates';
import { cn } from '@/lib/utils';

interface GrowthPathStripProps {
  history: GrowthStateRow[];
}

/** 30-day letter path. Newest on the right. No streaks, no scoring. */
export function GrowthPathStrip({ history }: GrowthPathStripProps) {
  // Dedupe by day (one letter per day, most recent wins), oldest -> newest.
  const byDay = new Map<string, GrowthStateRow>();
  for (const r of history) {
    const day = new Date(r.logged_at).toISOString().slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, r); // history is desc; first entry per day is latest
  }
  const rows = Array.from(byDay.values()).sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  if (rows.length === 0) {
    return (
      <p className="text-xs text-brain-health-500 italic">
        Your 30-day path will appear here as you log.
      </p>
    );
  }

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto pb-1"
      aria-label={`Your last ${rows.length} MyRHYTHM-G entries`}
    >
      {rows.map((r, i) => {
        const s = GROWTH_STATE_BY_KEY[r.letter];
        if (!s) return null;
        const tone = TONE_CLASSES[s.tone];
        const day = new Date(r.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return (
          <React.Fragment key={r.id}>
            {i > 0 && <span className="text-brain-health-300 text-xs" aria-hidden>→</span>}
            <span
              title={`${day} · ${s.name}`}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ring-1',
                tone.bg, tone.ring, tone.text
              )}
            >
              {s.letter}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
