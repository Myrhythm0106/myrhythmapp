import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ListChecks, CalendarPlus, PartyPopper } from 'lucide-react';
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
      <h3 className="font-semibold text-launch-ink mt-1">
        One small step at a time.
      </h3>
      <p className="mt-1 text-sm text-launch-ink/75">
        Step {activeIndex + 1} of {STEPS.length}. I can leave and come back without losing my place.
      </p>

      <ol className="mt-4">
        {STEPS.map((step, i) => {
          if (i !== activeIndex) return null;
          const Icon = step.icon;

          return (
            <li
              key={step.key}
              className="rounded-2xl border border-launch-gold/50 bg-launch-cream-light px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange-500 text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-launch-ink">{step.title}</p>
                  <p className="mt-1 text-sm text-launch-ink/75">{step.hint}</p>
                  <button
                    type="button"
                    onClick={() => navigate(step.to)}
                    className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange-500 px-6 font-semibold text-primary-foreground sm:w-auto"
                  >
                    {step.cta}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
