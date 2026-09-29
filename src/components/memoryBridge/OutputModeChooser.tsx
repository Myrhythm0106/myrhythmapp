import { cn } from '@/lib/utils';
import { OUTPUT_MODE_LABELS, type OutputMode } from '@/lib/memoryBridge/outputMode';

interface Props {
  value: OutputMode;
  onChange: (m: OutputMode) => void;
  className?: string;
}

const MAIN: OutputMode[] = ['both', 'transcript', 'actions'];

/** "What would you like from this?" — three big choices and one quiet link. */
export function OutputModeChooser({ value, onChange, className }: Props) {
  return (
    <fieldset className={cn('w-full max-w-md mx-auto text-left', className)}>
      <legend className="mb-2 text-sm font-semibold text-launch-ink">
        What would you like from this?
      </legend>
      <div role="radiogroup" className="grid gap-2">
        {MAIN.map(m => {
          const selected = value === m;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(m)}
              className={cn(
                'min-h-[56px] rounded-xl border px-4 py-2 text-left transition-colors',
                selected
                  ? 'border-launch-teal bg-launch-teal/10 ring-2 ring-launch-teal/40'
                  : 'border-launch-gold/30 bg-launch-ivory hover:bg-launch-gold/10',
              )}
            >
              <span className="block text-base font-semibold text-launch-ink">
                {OUTPUT_MODE_LABELS[m].title}
              </span>
              <span className="block text-sm text-launch-ink/70">{OUTPUT_MODE_LABELS[m].hint}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'none'}
        onClick={() => onChange('none')}
        className={cn(
          'mt-2 min-h-[44px] w-full text-center text-sm underline underline-offset-4',
          value === 'none' ? 'font-semibold text-launch-teal' : 'text-launch-ink/60 hover:text-launch-ink',
        )}
      >
        {value === 'none' ? '✓ ' : ''}Just save the recording — I can ask for a write-up later
      </button>
    </fieldset>
  );
}
