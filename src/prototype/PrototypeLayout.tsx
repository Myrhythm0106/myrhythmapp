import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldOff, Shield } from 'lucide-react';
import { isBypassAuth, setBypassAuth } from './prototypeStore';

const STEPS = [
  { path: '/prototype/capture', label: 'Capture' },
  { path: '/prototype/review', label: 'Review' },
  { path: '/prototype/schedule', label: 'Schedule' },
  { path: '/prototype/reminders', label: 'Reminders' },
  { path: '/prototype/done', label: 'Done' },
];

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PrototypeLayout({ children, title, subtitle }: Props) {
  const { pathname } = useLocation();
  const activeIdx = STEPS.findIndex(s => pathname.startsWith(s.path));
  const [bypass, setBypass] = useState<boolean>(false);

  useEffect(() => { setBypass(isBypassAuth()); }, [pathname]);

  const toggleBypass = () => {
    const next = !bypass;
    setBypassAuth(next);
    setBypass(next);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link to="/prototype" className="flex items-baseline gap-2">
            <span className="font-semibold text-slate-900 text-sm tracking-tight">MyRhythm</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Prototype</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBypass}
              title={bypass ? 'Auth bypass on — sample data, no login' : 'Auth bypass off — real recording requires login'}
              className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 transition ${
                bypass
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {bypass ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              bypass {bypass ? 'on' : 'off'}
            </button>
            <Link
              to="/launch/home"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300"
            >
              ← full app
            </Link>
          </div>
        </div>

        {activeIdx >= 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => {
                const isActive = i === activeIdx;
                const isDone = i < activeIdx;
                return (
                  <React.Fragment key={s.path}>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-slate-900' : isDone ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      />
                      {isActive && (
                        <span className="text-[11px] font-medium text-slate-900">{s.label}</span>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-px flex-1 ${isDone ? 'bg-slate-900' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {bypass && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 text-[11px] text-slate-600 text-center">
            Auth bypass is on — sample meeting is used, no real recording.
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>}
            {subtitle && <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-[10px] text-slate-400">
        Prototype — not a medical device. Does not diagnose, treat, or cure any condition.
      </footer>
    </div>
  );
}
