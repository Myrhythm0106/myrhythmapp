import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** The Get Started path, shown on every registration step so nobody is ever lost. */
export const JOURNEY_STEPS = [
  { label: 'Create account', time: 'about 1 minute' },
  { label: 'About me', time: 'optional, under a minute' },
  { label: 'Questions', time: 'about 5 minutes' },
  { label: 'My snapshot', time: 'free' },
] as const;

interface Props {
  /** 1-based current step */
  current: 1 | 2 | 3 | 4;
  /** Show "Save and finish later" (only once an account exists). */
  canSaveLater?: boolean;
  className?: string;
}

export function JourneySteps({ current, canSaveLater, className }: Props) {
  const navigate = useNavigate();
  const next = JOURNEY_STEPS[current];
  return (
    <nav aria-label="Get Started progress" className={cn('w-full max-w-xl mx-auto', className)}>
      <ol className="grid grid-cols-4 gap-1.5">
        {JOURNEY_STEPS.map((step, i) => {
          const n = i + 1;
          const done = n < current;
          const here = n === current;
          return (
            <li key={step.label} aria-current={here ? 'step' : undefined} className="min-w-0">
              <div className={cn('h-1.5 rounded-full', done || here ? 'bg-launch-teal' : 'bg-launch-ink/15')} />
              <p className={cn('mt-1.5 flex items-center gap-1 text-xs leading-tight sm:text-sm',
                here ? 'font-bold text-launch-ink-deep' : done ? 'text-launch-teal' : 'text-launch-ink-deep/60')}>
                {done && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                <span className="break-words">{step.label}</span>
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-center text-base text-launch-ink-deep" role="status">
        <span className="font-semibold">Step {current} of 4 · {JOURNEY_STEPS[current - 1].label}</span>
        {next ? <> · Next: {next.label.toLowerCase()} ({next.time})</> : <> · Then choose how to continue</>}
      </p>
      {canSaveLater && (
        <p className="mt-1 text-center">
          <button
            type="button"
            onClick={() => navigate('/launch/landingpage')}
            className="min-h-11 text-base font-medium text-launch-teal underline underline-offset-4"
          >
            Save and finish later
          </button>
          <span className="block text-sm text-launch-ink-deep/70">Your progress is kept. Log In any time to continue.</span>
        </p>
      )}
    </nav>
  );
}
