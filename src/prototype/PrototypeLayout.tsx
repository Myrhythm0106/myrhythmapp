import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mic, ListChecks, CalendarClock, BellRing, CheckCircle2, ShieldOff, Shield } from 'lucide-react';
import { isBypassAuth, setBypassAuth } from './prototypeStore';

const STEPS = [
  { path: '/prototype/capture', label: 'Capture', icon: Mic },
  { path: '/prototype/review', label: 'Review', icon: ListChecks },
  { path: '/prototype/schedule', label: 'Schedule', icon: CalendarClock },
  { path: '/prototype/reminders', label: 'Reminders', icon: BellRing },
  { path: '/prototype/done', label: 'Done', icon: CheckCircle2 },
];

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PrototypeLayout({ children, title, subtitle }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeIdx = STEPS.findIndex(s => pathname.startsWith(s.path));
  const [bypass, setBypass] = useState<boolean>(false);

  useEffect(() => { setBypass(isBypassAuth()); }, [pathname]);

  const toggleBypass = () => {
    const next = !bypass;
    setBypassAuth(next);
    setBypass(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link to="/prototype" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">M</div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900 text-sm">MyRhythm</div>
              <div className="text-[10px] uppercase tracking-wider text-orange-600 font-medium">MVP Prototype</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBypass}
              title={bypass ? 'Auth bypass ON — using sample data, no login required' : 'Auth bypass OFF — real recording requires login'}
              className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 transition ${
                bypass
                  ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {bypass ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              Bypass {bypass ? 'ON' : 'OFF'}
            </button>
            <Link
              to="/launch/home"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300"
            >
              ← Full app
            </Link>
          </div>
        </div>

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

        {bypass && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-1.5 text-[11px] text-amber-800 text-center">
            Auth bypass is on — friction-free demo. Real recording is skipped; sample meeting is used.
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
