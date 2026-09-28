import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, X, ChevronDown, Home, Brain, Calendar, BookOpen,
  Compass, ClipboardList, Users, Settings, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { findLaunchRoute } from '@/launch/routes';

/**
 * LaunchYouAreHereDial — the "Wayfinder".
 * Always-visible pill: "You are here: [Page]". Opens a calm map with one
 * large "Take me home" button, four landmarks and four secondary places.
 * No search, no jargon. Memory: mem://ux/you-are-here-dial
 */

interface Place {
  path: string;
  label: string;
  purpose: string;
  icon: LucideIcon;
}

const LANDMARKS: Place[] = [
  { path: '/launch/home', label: 'Home', purpose: 'My daily overview and rhythm', icon: Home },
  { path: '/launch/memory', label: 'Memory Bridge', purpose: 'Record a conversation or upload a report', icon: Brain },
  { path: '/launch/calendar', label: 'My Calendar', purpose: 'My commitments and plans', icon: Calendar },
  { path: '/launch/diary', label: 'My Diary', purpose: "Everything I've captured, in date order", icon: BookOpen },
];

const SECONDARY: Place[] = [
  { path: '/launch/compass', label: 'My Compass', purpose: 'My focus and next action', icon: Compass },
  { path: '/launch/assessment', label: 'Brain Health Assessment', purpose: 'Take or retake', icon: ClipboardList },
  { path: '/launch/support', label: 'Support Circle', purpose: 'The people with me', icon: Users },
  { path: '/launch/settings', label: 'Settings', purpose: 'Preferences and profile', icon: Settings },
];

const PLAIN_LABELS: Record<string, string> = {
  '/launch/capture': 'Capture',
  '/launch/commit': 'My next steps',
  '/launch/calibrate': 'Daily check-in',
  '/launch/celebrate': 'My wins',
  '/launch/assessment': 'Brain Health Assessment',
};

export function useCurrentPlace() {
  const location = useLocation();
  const all = [...LANDMARKS, ...SECONDARY];
  const direct = all.find(p => p.path === location.pathname);
  const route = findLaunchRoute(location.pathname);
  const label =
    direct?.label ?? PLAIN_LABELS[location.pathname] ?? route?.label ?? 'MyRhythm';
  const purpose = direct?.purpose ?? route?.description ?? '';
  const icon: LucideIcon = direct?.icon ?? route?.icon ?? MapPin;
  return { label, purpose, icon, path: location.pathname };
}

export function LaunchYouAreHereDial() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = useCurrentPlace();
  const CurrentIcon = current.icon;

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (path: string) => {
    if (path !== location.pathname) navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`You are here: ${current.label}. Open the map of MyRhythm.`}
        className="inline-flex items-center gap-2 h-11 pl-1.5 pr-3 rounded-full bg-launch-cream-light border border-launch-gold/50 hover:border-launch-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
      >
        <span className="h-8 w-8 rounded-full bg-launch-teal text-white flex items-center justify-center shrink-0">
          <CurrentIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex flex-col items-start leading-none text-left">
          <span className="text-[10px] uppercase tracking-[0.14em] text-launch-ink/60">You are here</span>
          <span className="text-sm font-semibold text-launch-ink-deep max-w-[7.5rem] sm:max-w-[10rem] truncate">
            {current.label}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-launch-ink/60" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-launch-ink-deep/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-8"
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Map of MyRhythm"
            className="launch-theme w-full max-w-2xl bg-launch-cream-light rounded-3xl border border-launch-gold/40 shadow-2xl p-5 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-launch-gold font-semibold">You are here</p>
                <h2 className="mt-1 text-2xl font-semibold text-launch-ink-deep" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {current.label}
                </h2>
                {current.purpose && <p className="mt-1 text-base text-launch-ink/75">{current.purpose}</p>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close map"
                className="h-14 w-14 shrink-0 rounded-full border border-launch-gold/40 bg-white flex items-center justify-center hover:bg-launch-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
              >
                <X className="h-6 w-6 text-launch-ink-deep" />
              </button>
            </div>

            {current.path !== '/launch/home' && (
              <button
                type="button"
                onClick={() => go('/launch/home')}
                className="mt-6 w-full min-h-[56px] rounded-2xl bg-launch-teal text-white text-lg font-semibold flex items-center justify-center gap-3 hover:opacity-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-launch-teal/40"
              >
                <Home className="h-5 w-5" aria-hidden="true" /> Take me home
              </button>
            )}

            <h3 className="mt-7 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-launch-ink/70">Main places</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {LANDMARKS.map(p => (
                <PlaceCard key={p.path} place={p} current={p.path === current.path} onGo={go} large />
              ))}
            </ul>

            <h3 className="mt-7 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-launch-ink/70">Also here</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {SECONDARY.map(p => (
                <PlaceCard key={p.path} place={p} current={p.path === current.path} onGo={go} />
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-7 w-full min-h-[56px] rounded-2xl border border-launch-gold/50 text-base font-semibold text-launch-ink-deep hover:bg-launch-cream"
            >
              Close map
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function PlaceCard({
  place, current, onGo, large,
}: { place: Place; current: boolean; onGo: (p: string) => void; large?: boolean }) {
  const Icon = place.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => onGo(place.path)}
        aria-current={current ? 'page' : undefined}
        className={cn(
          'w-full text-left rounded-2xl border flex items-center gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal',
          large ? 'min-h-[76px] p-4' : 'min-h-[56px] px-4 py-3',
          current
            ? 'border-launch-teal bg-launch-teal/10'
            : 'border-launch-gold/30 bg-white hover:border-launch-gold/70'
        )}
      >
        <span className={cn(
          'shrink-0 rounded-xl flex items-center justify-center',
          large ? 'h-11 w-11' : 'h-9 w-9',
          current ? 'bg-launch-teal text-white' : 'bg-launch-cream text-launch-ink-deep'
        )}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-semibold text-launch-ink-deep">{place.label}</span>
          <span className="block text-sm text-launch-ink/70">
            {current ? 'You are here' : place.purpose}
          </span>
        </span>
      </button>
    </li>
  );
}

export default LaunchYouAreHereDial;
