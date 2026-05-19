import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, ListChecks, CalendarClock, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { path: '/prototype/capture', label: 'Capture', icon: Mic },
  { path: '/prototype/review', label: 'Review', icon: ListChecks },
  { path: '/prototype/schedule', label: 'Schedule', icon: CalendarClock },
  { path: '/prototype/done', label: 'Done', icon: CheckCircle2 },
];

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PrototypeLayout({ children, title, subtitle }: Props) {
  const { pathname } = useLocation();
  const activeIdx = STEPS.findIndex(s => pathname.startsWith(s.path));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/prototype" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900 text-sm">MyRhythm</div>
              <div className="text-[10px] uppercase tracking-wider text-orange-600 font-medium">MVP Prototype</div>
            </div>
          </Link>
          <Link
            to="/launch/home"
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300"
          >
            ← Full app
          </Link>
        </div>

        {/* Step indicator */}
        {activeIdx >= 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === activeIdx;
                const isDone = i < activeIdx;
                return (
                  <React.Fragment key={s.path}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive ? 'bg-orange-500 text-white' :
                      isDone ? 'bg-teal-100 text-teal-700' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-px flex-1 ${isDone ? 'bg-teal-300' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>}
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-[10px] text-slate-400">
        MVP Prototype — not a medical device. Does not diagnose, treat, or cure any condition.
      </footer>
    </div>
  );
}
