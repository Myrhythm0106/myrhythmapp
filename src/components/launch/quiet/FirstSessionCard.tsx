import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Mic, ListChecks, CalendarPlus, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FirstSessionState } from '@/launch/onboarding/useFirstSession';

interface Step {
  key: keyof Pick<FirstSessionState, 'recorded' | 'reviewed' | 'scheduled' | 'completed'>;
  title: string;
  hint: string;
  icon: React.ElementType;
  cta: string;
  to: string;
}

const STEPS: Step[] = [
  {
    key: 'recorded',
    title: 'Record my first conversation',
    hint: 'Anything — a phone call, an appointment, or a note to myself.',
    icon: Mic,
    cta: 'Start recording',
    to: '/launch/memory?record=1',
  },
  {
    key: 'reviewed',
    title: 'See the steps it found',
    hint: 'I check them over before anything moves.',
    icon: ListChecks,
    cta: 'Review my steps',
    to: '/launch/memory',
  },
  {
    key: 'scheduled',
    title: 'Send one to my diary',
    hint: 'A day, a time, and a reminder that suits me.',
    icon: CalendarPlus,
    cta: 'Open my diary',
    to: '/launch/calendar',
  },
  {
    key: 'completed',
    title: 'Tick it off',
    hint: 'One done thing is the whole point.',
    icon: PartyPopper,
    cta: 'Go to my day',
    to: '/launch/calendar',
  },
];

/**
 * The guaranteed first session. One live step at a time, everything else
 * quiet. Progress comes from real data, so leaving the app never resets it.
 */
export function FirstSessionCard({ state }: { state: FirstSessionState }) {
  const navigate = useNavigate();
  if (state.loading || state.allDone) return null;

  const activeIndex = STEPS.findIndex((s) => !state[s.key]);

  return (
    <div className="rounded-3xl bg-launch-ivory border border-launch-gold/30 p-5">
      <p className="font-hind text-[11px] font-semibold uppercase tracking-[0.28em] text-launch-ink/55">
        Start here
      </p>
      <h3 className="font-semibold text-launch-ink mt-1 mb-4">
        Four small moves and I'll be doing the remembering for you.
      </h3>

      <ol className="space-y-2">
        {STEPS.map((step, i) => {
          const done = state[step.key];
          const active = i === activeIndex;
          const Icon = done ? Check : step.icon;

          return (
            <li
              key={step.key}
              className={cn(
                'rounded-2xl px-4 py-3 border transition-colors',
                active
                  ? 'border-launch-gold/50 bg-launch-cream-light'
                  : 'border-transparent bg-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    done
                      ? 'bg-launch-moss text-white'
                      : active
                      ? 'bg-brand-orange-500 text-white'
                      : 'bg-launch-ink/10 text-launch-ink/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      done ? 'text-launch-ink/50 line-through' : 'text-launch-ink'
                    )}
                  >
                    {step.title}
                  </p>
                  {active && (
                    <>
                      <p className="text-xs text-launch-ink/60 mt-0.5">{step.hint}</p>
                      <button
                        type="button"
                        onClick={() => navigate(step.to)}
                        className="mt-3 w-full sm:w-auto min-h-[56px] px-6 rounded-2xl bg-brand-orange-500 text-white font-semibold inline-flex items-center justify-center gap-2"
                      >
                        {step.cta}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
