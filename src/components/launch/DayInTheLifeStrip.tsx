import React from 'react';
import { Activity, Sparkles, Brain, Calendar, RefreshCw, CalendarCheck, Gauge } from 'lucide-react';

type Block = {
  time: string;
  title: string;
  load: 'low' | 'peak' | 'recovery' | 'medium';
};

const blocks: Block[] = [
  { time: '08:30', title: 'Energy Check', load: 'low' },
  { time: '10:00', title: 'Deep focus — Memory Bridge review', load: 'peak' },
  { time: '13:00', title: 'Lunch + walk', load: 'recovery' },
  { time: '16:00', title: 'Family call — Support Circle', load: 'medium' },
];

const loadStyles: Record<Block['load'], { chip: string; label: string; card: string }> = {
  low: {
    chip: 'bg-brain-health-100 text-brain-health-700',
    label: 'Low load',
    card: 'border-brain-health-200/60',
  },
  peak: {
    chip: 'bg-brand-orange-500/15 text-brand-orange-500',
    label: 'Peak window',
    card: 'border-l-4 border-l-brand-orange-500 border-brain-health-200/60',
  },
  recovery: {
    chip: 'bg-clarity-teal-100 text-clarity-teal-700',
    label: 'Recovery',
    card: 'border-clarity-teal-200/60',
  },
  medium: {
    chip: 'bg-sunrise-amber-100 text-sunrise-amber-700',
    label: 'Medium load',
    card: 'border-sunrise-amber-200/60',
  },
};

export function DayInTheLifeStrip() {
  return (
    <section className="py-16 bg-gradient-to-b from-brain-health-50/30 to-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-brand-orange-500">
            A day you actually run
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-brain-health-900 leading-tight">
            Your calendar, your call.
          </h2>
          <p className="mt-3 text-base md:text-lg text-brain-health-700 leading-relaxed">
            Informed by your peak windows, your Brain Health score, and what&rsquo;s already on your plate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6">
          {/* LEFT RAIL */}
          <aside className="rounded-2xl border border-brain-health-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-brain-health-900 mb-4">
              What MyRhythm knows this morning
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-clarity-teal-100 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4 text-clarity-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Today: steady · 3/5</p>
                  <p className="text-xs text-brain-health-600">Energy Check</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-orange-500/15 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-brand-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Your peak: 09:30–11:30</p>
                  <p className="text-xs text-brain-health-600">Most productive window</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-memory-emerald-100 flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-memory-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Brain Health 72</p>
                  <p className="text-xs text-brain-health-600">from your initial assessment</p>
                </div>
              </li>
            </ul>
            <p className="mt-5 text-xs italic text-brain-health-500">Signals, not instructions.</p>
          </aside>

          {/* CENTER: CALENDAR */}
          <div className="rounded-2xl border border-brain-health-200/60 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brain-health-700" />
                <h3 className="text-sm font-semibold text-brain-health-900">Today&rsquo;s calendar</h3>
              </div>
              <span className="text-xs text-brain-health-500">08:00 – 20:00</span>
            </div>

            {/* Day view with peak band */}
            <div className="relative rounded-xl bg-gradient-to-b from-brain-health-50/40 to-white p-3">
              {/* Peak window band */}
              <div
                aria-hidden
                className="absolute left-3 right-3 rounded-md bg-brand-orange-500/10 border-l-2 border-brand-orange-500 pointer-events-none"
                style={{ top: '12.5%', height: '16.6%' }}
              >
                <span className="absolute -top-2 right-2 text-[10px] font-semibold uppercase tracking-wider text-brand-orange-500 bg-white px-1.5 py-0.5 rounded">
                  Peak 09:30–11:30
                </span>
              </div>

              <ul className="relative space-y-2">
                {blocks.map((b) => {
                  const s = loadStyles[b.load];
                  return (
                    <li
                      key={b.time}
                      className={`flex items-center gap-3 rounded-lg border bg-white/90 backdrop-blur-sm p-3 shadow-sm ${s.card}`}
                    >
                      <span className="text-sm font-mono font-semibold text-brain-health-700 w-14 shrink-0">
                        {b.time}
                      </span>
                      <span className="flex-1 text-sm text-brain-health-900">{b.title}</span>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${s.chip}`}>
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-3 text-xs text-brain-health-500 text-center">
              Synced with Google / Outlook in Settings.
            </p>
          </div>

          {/* RIGHT RAIL */}
          <aside className="rounded-2xl border border-brain-health-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-brain-health-900 mb-4">You&rsquo;re in control</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brain-health-100 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4 w-4 text-brain-health-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Reschedule with one tap</p>
                  <p className="text-xs text-brain-health-600">Moved 16:00 → 17:30 because energy dipped.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-clarity-teal-100 flex items-center justify-center shrink-0">
                  <CalendarCheck className="h-4 w-4 text-clarity-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Flex by availability</p>
                  <p className="text-xs text-brain-health-600">Skips blocks your calendar already owns.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-memory-emerald-100 flex items-center justify-center shrink-0">
                  <Gauge className="h-4 w-4 text-memory-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brain-health-900">Flex by Brain Health</p>
                  <p className="text-xs text-brain-health-600">Lighter load on lower-score days.</p>
                </div>
              </li>
            </ul>
            <p className="mt-5 text-xs font-semibold italic text-brand-orange-500">
              MyRhythm proposes. You commit.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
