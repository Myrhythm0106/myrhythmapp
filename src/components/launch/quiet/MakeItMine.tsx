import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';

const DISMISS = 'myrhythm_make_it_mine_dismissed';

/** Optional, after the shorter start: Guide me / Explore, who it's for, and the free snapshot once I've recorded. */
export function MakeItMine({ recorded }: { recorded: boolean }) {
  const navigate = useNavigate();
  const starting = useLaunchStartingStyle();
  const [hidden, setHidden] = React.useState(() => localStorage.getItem(DISMISS) === '1');
  const hasType = !!localStorage.getItem('myrhythm_user_type');
  const hasSnapshot = !!localStorage.getItem('myrhythm_launch_mode');
  if (hidden) return null;

  const items = [
    !hasType && { label: "Choose what brings you to MyRhythm", to: '/launch/user-type?after=snapshot' },
    recorded && !hasSnapshot && { label: 'Get my free snapshot (about 6 minutes)', to: '/launch/assessment?first=1' },
  ].filter(Boolean) as { label: string; to: string }[];

  return (
    <section aria-label="Make it mine" className="rounded-3xl border border-launch-gold/30 bg-launch-ivory p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-launch-ink-deep">
          How I'd like to start:{' '}
          <button type="button" onClick={() => starting.chooseStyle('guided')} aria-pressed={starting.style === 'guided'}
            className={`min-h-11 px-2 font-semibold underline-offset-4 ${starting.style === 'guided' ? 'text-launch-teal underline' : 'text-launch-ink-deep/70'}`}>Guide me</button>
          ·
          <button type="button" onClick={() => starting.chooseStyle('explore')} aria-pressed={starting.style === 'explore'}
            className={`min-h-11 px-2 font-semibold underline-offset-4 ${starting.style === 'explore' ? 'text-launch-teal underline' : 'text-launch-ink-deep/70'}`}>Explore my way</button>
        </p>
        <button type="button" aria-label="Hide this" onClick={() => { localStorage.setItem(DISMISS, '1'); setHidden(true); }}
          className="flex h-11 w-11 items-center justify-center rounded-full text-launch-ink-deep/60 hover:bg-launch-gold/15">
          <X className="h-4 w-4" />
        </button>
      </div>
      {items.map((i) => (
        <button key={i.to} type="button" onClick={() => navigate(i.to)}
          className="mt-2 flex min-h-14 w-full items-center justify-between rounded-2xl border border-launch-gold/30 px-4 text-left text-base text-launch-ink-deep hover:border-launch-teal">
          {i.label}<ChevronRight className="h-4 w-4 shrink-0" />
        </button>
      ))}
      <p className="mt-2 text-xs text-launch-ink-deep/60">Optional. Everything works without these.</p>
    </section>
  );
}
