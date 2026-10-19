import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssessmentAnswer } from '@/data/launchAssessmentBanks';

const SHARP = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'varies', label: 'It changes' },
];
const EMPTY = [
  { value: 'mid-morning', label: 'Mid-morning' },
  { value: 'after-lunch', label: 'After lunch' },
  { value: 'late-afternoon', label: 'Late afternoon' },
  { value: 'evening', label: 'Evening' },
];

interface Props {
  sharp: AssessmentAnswer;
  empty: AssessmentAnswer;
  onToggle: (row: 'planningRhythm' | 'energyDip', value: string) => void;
}

const picked = (a: AssessmentAnswer) => [a.primary, ...a.alsoFits].filter(Boolean);

/** One screen for both: when I'm sharp, and when I'm running on empty. */
export function DayStripStep({ sharp, empty, onToggle }: Props) {
  const rows = [
    { id: 'planningRhythm' as const, label: 'I’m sharpest…', opts: SHARP, chosen: picked(sharp), tone: 'teal' },
    { id: 'energyDip' as const, label: 'I’m running on empty…', opts: EMPTY, chosen: picked(empty), tone: 'ember' },
  ];
  return (
    <div className="space-y-5 pb-4">
      {rows.map((r) => (
        <fieldset key={r.id} className="rounded-2xl border-2 border-launch-gold/30 bg-launch-ivory p-4">
          <legend className="px-1 text-base font-semibold text-launch-ink">{r.label}</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {r.opts.map((o) => {
              const on = r.chosen.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle(r.id, o.value)}
                  className={cn(
                    'min-h-[56px] rounded-xl border-2 px-3 text-base font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal',
                    on
                      ? r.tone === 'teal'
                        ? 'border-launch-teal bg-launch-teal/15 text-launch-ink'
                        : 'border-launch-ember bg-launch-ember/10 text-launch-ink'
                      : 'border-launch-gold/30 bg-launch-cream text-launch-ink/80 hover:border-launch-moss',
                  )}
                >
                  {on && <Check className="h-4 w-4" aria-hidden="true" />}
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
