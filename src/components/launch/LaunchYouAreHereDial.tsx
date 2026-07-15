import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LAUNCH_ROUTES,
  ROUTES_BY_RING,
  findLaunchRoute,
  type LaunchRoute,
} from '@/launch/routes';

/**
 * LaunchYouAreHereDial
 *
 * Persistent radial "you are here" locator mounted in the LaunchLayout header.
 * Collapsed: brand-orange ring pill showing current page's icon + label.
 * Expanded: full radial menu of every reachable /launch/* page grouped by ring,
 *           with one-tap navigation. Current page is highlighted + labelled
 *           "You are here".
 *
 * Accessibility:
 * - role="menu" when expanded
 * - aria-current="page" on the current segment
 * - Tab through, Enter to activate, ESC to close
 * - <360px falls back to a full-screen scrollable list (grid on md+)
 * - Respects reduced-motion (no transition classes on the panel)
 *
 * Memory: mem://ux/you-are-here-dial
 */
export function LaunchYouAreHereDial() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const current: LaunchRoute | undefined = findLaunchRoute(location.pathname);
  const CurrentIcon = current?.icon ?? MapPin;

  // Close on ESC and route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleJump = (path: string) => {
    if (path !== location.pathname) navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger (collapsed dial) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          current
            ? `You are here: ${current.label}. Open page map.`
            : 'Open page map'
        }
        className={cn(
          'inline-flex items-center gap-2 h-11 pl-2 pr-3 rounded-full',
          'bg-white/85 backdrop-blur-md',
          'ring-2 ring-brand-orange-500 shadow-sm',
          'hover:bg-white transition-colors',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange-300'
        )}
      >
        <span className="h-7 w-7 rounded-full bg-brand-orange-500 text-white flex items-center justify-center shrink-0">
          <CurrentIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline text-sm font-medium text-brain-health-900 max-w-[9rem] truncate">
          {current?.label ?? 'Map'}
        </span>
      </button>

      {/* Backdrop + Panel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="menu"
            aria-label="Page map"
            className={cn(
              'fixed z-50 left-1/2 top-[72px] -translate-x-1/2',
              'w-[min(96vw,880px)] max-h-[80vh] overflow-y-auto',
              'bg-white rounded-2xl shadow-2xl border border-brain-health-100',
              'p-4 sm:p-6'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-brain-health-500 font-semibold">
                  You are here
                </div>
                <div className="text-lg font-semibold text-brain-health-900">
                  {current?.label ?? 'MyRhythm'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close page map"
                className="h-10 w-10 rounded-full bg-brain-health-50 hover:bg-brain-health-100 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-500"
              >
                <X className="h-5 w-5 text-brain-health-700" />
              </button>
            </div>

            <RingSection
              title="Core loop"
              routes={ROUTES_BY_RING.inner}
              currentPath={location.pathname}
              onJump={handleJump}
            />
            <RingSection
              title="Key features"
              routes={ROUTES_BY_RING.middle}
              currentPath={location.pathname}
              onJump={handleJump}
            />
            <RingSection
              title="More"
              routes={ROUTES_BY_RING.outer}
              currentPath={location.pathname}
              onJump={handleJump}
            />

            <p className="text-[11px] text-brain-health-500 mt-4 text-center">
              Tap any tile to jump. Press ESC to close.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function RingSection({
  title,
  routes,
  currentPath,
  onJump,
}: {
  title: string;
  routes: LaunchRoute[];
  currentPath: string;
  onJump: (path: string) => void;
}) {
  if (routes.length === 0) return null;
  return (
    <section className="mb-5 last:mb-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-brain-health-500 mb-2">
        {title}
      </h3>
      <ul
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
      >
        {routes.map(r => {
          const Icon = r.icon;
          const isCurrent = r.path === currentPath;
          return (
            <li key={r.path}>
              <button
                type="button"
                role="menuitem"
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => onJump(r.path)}
                className={cn(
                  'w-full h-full min-h-[80px] p-3 rounded-xl text-left',
                  'flex flex-col items-start gap-1',
                  'border transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-500',
                  isCurrent
                    ? 'border-brand-orange-500 bg-brand-orange-50 ring-2 ring-brand-orange-500'
                    : 'border-brain-health-100 bg-white hover:bg-brain-health-50'
                )}
              >
                <span
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center',
                    isCurrent
                      ? 'bg-brand-orange-500 text-white'
                      : 'bg-brain-health-50 text-brain-health-700'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-brain-health-900 leading-tight">
                  {r.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange-700">
                    You are here
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default LaunchYouAreHereDial;
