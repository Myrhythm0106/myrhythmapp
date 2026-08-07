import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  'Reading your answers',
  'Finding your clearest window',
  'Mapping your MYRHYTHM letters',
  'Shaping your rhythm',
];

interface AssessmentProcessingProps {
  /** Called once the sequence finishes (or the save resolves, whichever is later). */
  onDone: () => void;
  /** Total run time in ms. Kept under 10 seconds by design. */
  durationMs?: number;
}

/** Reassuring "we're working on it" state between Complete and the results page. */
export function AssessmentProcessing({ onDone, durationMs = 7000 }: AssessmentProcessingProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const per = durationMs / STEPS.length;
    const timers = STEPS.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), per * (i + 1))
    );
    const done = window.setTimeout(onDone, durationMs + 250);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [durationMs, onDone]);

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-launch-gold/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-launch-ember animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-launch-ink">
          M
        </div>
      </div>

      <h2 className="text-2xl font-bold font-display text-launch-ink mb-1">
        Shaping your rhythm
      </h2>
      <p className="text-sm text-launch-ink/60 mb-6">
        This takes a few seconds. Nothing to do — we'll bring you straight to your snapshot.
      </p>

      <ul className="space-y-2 text-left w-full max-w-xs">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={label}
              className={cn(
                'flex items-center gap-3 text-sm transition-opacity',
                done ? 'text-launch-moss' : active ? 'text-launch-ink' : 'text-launch-ink/35'
              )}
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                {done ? (
                  <Check className="h-4 w-4" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
