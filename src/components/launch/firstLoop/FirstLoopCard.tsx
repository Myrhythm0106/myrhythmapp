import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LOOP_STEPS, loopCopy } from '@/launch/onboarding/firstLoop';
import { useFirstLoop } from '@/launch/onboarding/useFirstLoop';
import { usePersona } from '@/launch/persona/usePersona';

/** Home card: the five steps of my first loop, each ticked when it really happens, one Next. */
export function FirstLoopCard() {
  const loop = useFirstLoop();
  const { rawType } = usePersona();
  const navigate = useNavigate();
  if (!loop || loop.coreComplete) return null;
  const next = loop.next ? loopCopy(loop.next, rawType) : null;
  return (
    <section aria-label="My first loop" className="rounded-3xl border border-launch-gold/40 bg-launch-ivory p-6 text-launch-ink-deep sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">My first loop · step {loop.nextIndex + 1} of {LOOP_STEPS.length}</p>
      <h2 className="mt-3 font-instrument text-3xl leading-tight">From one conversation to done</h2>
      <ol className="mt-5 grid grid-cols-5 gap-2" aria-label="Steps">
        {LOOP_STEPS.map((s, i) => {
          const done = loop.done[s];
          const current = s === loop.next;
          return (
            <li key={s} className="flex flex-col items-center gap-2 text-center">
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold',
                done ? 'border-launch-ink bg-launch-ink text-launch-ivory' : current ? 'border-brand-orange-500 bg-brand-orange-500 text-launch-ink-deep' : 'border-launch-ink-deep/30')}>
                {done ? <Check className="h-4 w-4" aria-label="done" /> : i + 1}
              </span>
              <span className={cn('text-xs leading-tight sm:text-sm', current && 'font-semibold')}>{loopCopy(s).label}</span>
            </li>
          );
        })}
      </ol>
      {next && (
        <>
          <p className="mt-5 text-base leading-relaxed">Next: {next.next}. Each step ticks itself once it has happened, so I always know where I am.</p>
          <Button variant="ghost" onClick={() => navigate((loop.next === 'confirm' || loop.next === 'diary') && loop.latestRecordingId ? `/launch/memory?open=${loop.latestRecordingId}` : next.to)}
            className="mt-4 min-h-14 h-auto whitespace-normal rounded-2xl bg-brand-orange-500 px-6 font-semibold text-launch-ink-deep hover:bg-brand-orange-600 hover:text-launch-ink-deep">
            {next.next}<ArrowRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </section>
  );
}

/** A quiet "Step x of 5" line on loop screens until my first loop is complete. */
export function FirstLoopStrip() {
  const loop = useFirstLoop();
  const { rawType } = usePersona();
  const navigate = useNavigate();
  if (!loop || loop.coreComplete || !loop.next) return null;
  const next = loopCopy(loop.next, rawType);
  return (
    <div role="status" className="mx-auto mb-3 flex max-w-6xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-launch-gold/40 bg-launch-ivory px-4 py-2 text-sm text-launch-ink-deep">
      <span><strong>Step {loop.nextIndex + 1} of 5: {next.label}.</strong> {next.next}.</span>
      <Button variant="ghost" onClick={() => navigate('/launch/home')} className="min-h-11 px-3 text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep">See my steps</Button>
    </div>
  );
}
