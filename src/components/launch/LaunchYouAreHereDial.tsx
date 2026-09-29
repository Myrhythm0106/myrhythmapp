import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, X, Home, Brain, Calendar, BookOpen,
  Compass, ClipboardList, Users, Settings, HelpCircle, Sparkles, Plus, Minus,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { findLaunchRoute } from '@/launch/routes';

/**
 * LaunchYouAreHereDial — the "Wayfinder".
 * A quiet circular wayfinder. The compact dial opens a spatial map with four
 * familiar landmarks, then reveals secondary places only when requested.
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
  { path: '/launch/assessment?mode=retake', label: 'Brain Health Assessment', purpose: 'Take or retake', icon: ClipboardList },
  { path: '/launch/support', label: 'Support Circle', purpose: 'The people with me', icon: Users },
  { path: '/launch/settings', label: 'Settings', purpose: 'Preferences and profile', icon: Settings },
  { path: '/launch/help', label: 'Help', purpose: 'Guidance when I need it', icon: HelpCircle },
  { path: '/launch/whats-new', label: "What's New", purpose: 'Recent improvements', icon: Sparkles },
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
  const [showMore, setShowMore] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = useCurrentPlace();
  const CurrentIcon = current.icon;

  useEffect(() => {
    setOpen(false);
    setShowMore(false);
  }, [location.pathname]);

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
      <div className="flex shrink-0 flex-col items-center gap-0.5">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`You are here: ${current.label}. Open the map of MyRhythm.`}
        title={`You are here: ${current.label}`}
        className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-launch-gold bg-launch-cream-light shadow-md transition hover:border-launch-gold hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
      >
        <span className="absolute inset-1 rounded-full border border-dashed border-launch-gold/80" aria-hidden="true" />
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-launch-teal ring-2 ring-launch-cream-light" aria-hidden="true" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-launch-ink-deep text-launch-gold transition-transform group-hover:scale-105">
          <CurrentIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </button>
      <span className="text-[11px] font-semibold leading-none text-launch-ink/70" aria-hidden="true">Where to?</span>
      </div>

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

            <div className="relative mx-auto mt-7 aspect-square w-full max-w-[27rem] rounded-full border border-launch-gold/40 bg-launch-cream shadow-inner">
              <div className="absolute inset-[18%] rounded-full border border-dashed border-launch-gold/60" aria-hidden="true" />
              <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-launch-gold/50 bg-launch-ink-deep px-2 text-center shadow-lg">
                <CurrentIcon className="h-5 w-5 text-launch-gold" aria-hidden="true" />
                <span className="mt-1 text-[11px] uppercase text-launch-gold">You are here</span>
                <span className="max-w-20 text-sm font-semibold leading-tight text-launch-cream-light">{current.label}</span>
              </div>
              {LANDMARKS.map((place, index) => (
                <RadialPlace key={place.path} place={place} current={place.path === current.path} position={index} onGo={go} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMore(value => !value)}
              aria-expanded={showMore}
              className="mt-6 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border border-launch-gold/50 text-base font-semibold text-launch-ink-deep hover:bg-launch-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
            >
              {showMore ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {showMore ? 'Show fewer places' : 'More places'}
            </button>

            {showMore && (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {SECONDARY.map(p => (
                  <PlaceCard key={p.path} place={p} current={p.path === current.path} onGo={go} />
                ))}
              </ul>
            )}

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

const RADIAL_POSITIONS = [
  'left-1/2 top-2 -translate-x-1/2',
  'right-2 top-1/2 -translate-y-1/2',
  'bottom-2 left-1/2 -translate-x-1/2',
  'left-2 top-1/2 -translate-y-1/2',
] as const;

function RadialPlace({
  place, current, position, onGo,
}: { place: Place; current: boolean; position: number; onGo: (path: string) => void }) {
  const Icon = place.icon;
  return (
    <button
      type="button"
      onClick={() => onGo(place.path)}
      aria-current={current ? 'page' : undefined}
      aria-label={`${place.label}. ${current ? 'You are here.' : place.purpose}`}
      className={cn(
        'absolute z-10 flex min-h-[68px] w-[116px] flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal sm:min-h-[76px] sm:w-[148px]',
        RADIAL_POSITIONS[position],
        current
          ? 'border-launch-teal bg-launch-teal text-launch-cream-light'
          : 'border-launch-gold/50 bg-white text-launch-ink-deep hover:border-launch-gold'
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold leading-tight sm:text-base">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {place.label}
      </span>
      <span className={cn('mt-1 hidden text-xs leading-tight sm:block', current ? 'text-launch-cream-light/85' : 'text-launch-ink/65')}>
        {current ? 'You are here' : place.purpose}
      </span>
    </button>
  );
}

function PlaceCard({
  place, current, onGo,
}: { place: Place; current: boolean; onGo: (p: string) => void }) {
  const Icon = place.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => onGo(place.path)}
        aria-current={current ? 'page' : undefined}
        className={cn(
          'w-full text-left rounded-2xl border flex items-center gap-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal',
          'min-h-[56px] px-4 py-3',
          current
            ? 'border-launch-teal bg-launch-teal/10'
            : 'border-launch-gold/30 bg-white hover:border-launch-gold/70'
        )}
      >
        <span className={cn(
          'shrink-0 rounded-xl flex items-center justify-center',
           'h-9 w-9',
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
