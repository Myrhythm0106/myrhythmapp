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
 * A quiet circular trigger opens a structured path of four familiar landmarks.
 * The ordered path keeps every destination easy to scan while secondary places
 * stay behind "More places".
 */

interface Place {
  path: string;
  label: string;
  purpose: string;
  /** Very short hint shown under a ring chip */
  hint?: string;
  icon: LucideIcon;
}

// Ring order: top, right, bottom, left.
const RING_PLACES: Place[] = [
  { path: '/launch/memory', label: 'Memory Bridge', purpose: 'Record a conversation or upload a report', hint: 'Record or upload', icon: Brain },
  { path: '/launch/compass', label: 'My Compass', purpose: 'My focus and next action', hint: 'My focus', icon: Compass },
  { path: '/launch/calendar', label: 'My Calendar', purpose: 'My commitments and plans', hint: 'My plans', icon: Calendar },
  { path: '/launch/diary', label: 'My Diary', purpose: "Everything I've captured, in date order", hint: 'In date order', icon: BookOpen },
];

const SECONDARY: Place[] = [
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

const PLAIN_PURPOSES: Record<string, string> = {
  '/launch/assessment': 'My questions and free snapshot',
};

const PLAIN_ICONS: Record<string, LucideIcon> = {
  '/launch/assessment': ClipboardList,
};

export function useCurrentPlace() {
  const location = useLocation();
  const all = [...RING_PLACES, ...SECONDARY];
  const direct = all.find(p => location.pathname.startsWith(p.path.split('?')[0]));
  const route = findLaunchRoute(location.pathname);
  const label =
    direct?.label ?? PLAIN_LABELS[location.pathname] ?? route?.label ?? 'MyRhythm';
  const purpose = direct?.purpose ?? PLAIN_PURPOSES[location.pathname] ?? route?.description ?? '';
  const icon: LucideIcon = direct?.icon ?? PLAIN_ICONS[location.pathname] ?? route?.icon ?? MapPin;
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
  const isHome = location.pathname === '/launch/home';

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
      {/* Compact dial trigger — champagne-gold ring, deep-ink centre */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`You are here: ${current.label}. Open the map of MyRhythm.`}
          title={`You are here: ${current.label}`}
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-[3px] bg-gradient-to-tr from-[hsl(var(--launch-gold)/0.85)] via-[hsl(var(--launch-cream-light))] to-[hsl(var(--launch-gold)/0.55)] shadow-md ring-1 ring-[hsl(var(--launch-gold)/0.4)] transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
        >
          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-launch-ink-deep">
            <span className="absolute inset-[3px] rounded-full border border-dashed border-[hsl(var(--launch-gold)/0.35)]" aria-hidden="true" />
            <CurrentIcon className="relative h-[18px] w-[18px] text-launch-gold transition-transform group-hover:scale-105" aria-hidden="true" />
          </span>
          <span className="absolute left-1/2 top-[-2px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-launch-teal ring-2 ring-launch-cream-light" aria-hidden="true" />
        </button>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] leading-none text-launch-ink/70" aria-hidden="true">Where to?</span>
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
                <p className="text-[11px] uppercase tracking-[0.22em] text-launch-gold font-semibold">You are here</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-launch-ink-deep" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {current.label}
                </h2>
                {current.purpose && <p className="mt-1 text-sm sm:text-base text-launch-ink/75">{current.purpose}</p>}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close map"
                className="h-14 w-14 shrink-0 rounded-full border border-launch-gold/40 bg-launch-ivory flex items-center justify-center hover:bg-launch-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
              >
                <X className="h-6 w-6 text-launch-ink-deep" />
              </button>
            </div>

            {current.path !== '/launch/home' && (
              <button
                type="button"
                onClick={() => go('/launch/home')}
                className="mt-5 w-full min-h-[56px] rounded-2xl bg-launch-teal text-white text-lg font-semibold flex items-center justify-center gap-3 shadow-md hover:opacity-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-launch-teal/40"
              >
                <Home className="h-5 w-5" aria-hidden="true" /> Take me home
              </button>
            )}

            {/* Structured path — one calm reading order, no detached ring labels. */}
            <div className="relative mx-auto mt-6 w-full max-w-lg">
              <div className="absolute bottom-7 left-7 top-7 w-px bg-launch-gold/40" aria-hidden="true" />
              <ul className="relative space-y-3">
                {RING_PLACES.map(place => (
                  <PathPlace
                    key={place.path}
                    place={place}
                    current={location.pathname.startsWith(place.path)}
                    onGo={go}
                  />
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowMore(value => !value)}
              aria-expanded={showMore}
              className="mt-6 flex min-h-[56px] w-full items-center justify-between rounded-2xl border border-launch-gold/50 bg-launch-ivory px-5 text-base font-semibold text-launch-ink-deep hover:bg-launch-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
            >
              <span className="flex items-center gap-2">
                {showMore ? <Minus className="h-5 w-5 text-launch-gold" /> : <Plus className="h-5 w-5 text-launch-gold" />}
                {showMore ? 'Show fewer places' : 'More places'}
              </span>
            </button>

            {showMore && (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {SECONDARY.map(p => (
                  <PlaceCard key={p.path} place={p} current={current.path.startsWith(p.path.split('?')[0])} onGo={go} />
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full min-h-[56px] rounded-2xl border border-launch-gold/50 text-base font-semibold text-launch-ink-deep hover:bg-launch-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
            >
              Close map
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function PathPlace({
  place, current, onGo,
}: { place: Place; current: boolean; onGo: (path: string) => void }) {
  const Icon = place.icon;
  return (
    <li className="relative z-10">
      <button
        type="button"
        onClick={() => onGo(place.path)}
        aria-current={current ? 'page' : undefined}
        aria-label={`${place.label}. ${current ? 'You are here.' : place.purpose}`}
        className={cn(
          'flex min-h-[72px] w-full items-stretch overflow-hidden rounded-2xl border text-left shadow-sm transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal',
          current
            ? 'border-launch-teal bg-launch-teal/10'
            : 'border-launch-gold/35 bg-launch-ivory hover:border-launch-gold/70'
        )}
      >
        <span className="flex w-14 shrink-0 items-center justify-center border-r border-launch-gold/25 bg-launch-cream-light">
          <span className={cn(
            'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-launch-cream-light',
            current ? 'bg-launch-teal text-white' : 'bg-launch-ink-deep text-launch-gold'
          )}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
          <span className="text-base font-semibold leading-tight text-launch-ink-deep">{place.label}</span>
          <span className={cn('mt-1 text-sm leading-snug', current ? 'font-semibold text-launch-teal' : 'text-launch-ink/65')}>
            {current ? 'You are here' : place.hint ?? place.purpose}
          </span>
        </span>
      </button>
    </li>
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
            : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-gold/70'
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
