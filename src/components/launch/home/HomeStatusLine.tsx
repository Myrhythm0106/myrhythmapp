import React from 'react';

function Bar({ value, total }: { value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <span className="relative inline-block h-1.5 w-24 overflow-hidden rounded-full bg-launch-gold/20" aria-hidden="true">
      <span className="absolute inset-y-0 left-0 rounded-full bg-launch-teal" style={{ width: `${pct}%` }} />
    </span>
  );
}

/** Status-report style summary: today and this week, small and quiet. */
export function HomeStatusLine({ todayDone, todayTotal, weekPlanned, weekDone, waiting }: {
  todayDone: number; todayTotal: number; weekPlanned: number; weekDone: number; waiting: number;
}) {
  return (
    <div className="grid gap-2 text-sm text-launch-ink/75 sm:grid-cols-2">
      <p className="flex items-center gap-3">
        <span className="w-20 text-[11px] font-semibold uppercase tracking-[0.2em] text-launch-moss">Today</span>
        <Bar value={todayDone} total={todayTotal} />
        <span className="tabular-nums">{todayDone} of {todayTotal} done</span>
      </p>
      <p className="flex items-center gap-3">
        <span className="w-20 text-[11px] font-semibold uppercase tracking-[0.2em] text-launch-moss">This week</span>
        <Bar value={weekDone} total={weekPlanned} />
        <span className="tabular-nums">{weekPlanned} planned · {weekDone} done{waiting ? ` · ${waiting} waiting for a time` : ''}</span>
      </p>
    </div>
  );
}
