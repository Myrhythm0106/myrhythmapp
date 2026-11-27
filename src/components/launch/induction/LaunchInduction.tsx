import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useInduction } from '@/launch/onboarding/useInduction';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import { INDUCTION_STEPS, type InductionStep } from '@/launch/onboarding/induction';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Step = { title: string; text: string; primary: string; to?: string; secondary?: string };
const STEPS: Record<InductionStep, Step> = {
  welcome: { title: 'Welcome. Here is how MyRhythm helps you.', text: 'MyRhythm remembers, so you can follow through. You record what matters, choose your next steps, and they wait for you in your diary. This short welcome takes under a minute, and you can leave it at any point.', primary: 'Show me' },
  who: { title: 'Who am I using MyRhythm for?', text: 'One tap tailors the wording and first suggestions. Myself, someone I care for, or a busy working life. Optional.', primary: 'Choose who it is for', to: '/launch/user-type?after=home', secondary: 'Not now' },
  style: { title: 'How would you like to start?', text: 'Choose the approach that feels right. Guide me offers one practical step at a time. Explore my way lets you choose where to begin. Both keep every page available, and you can switch in the round menu at any time.', primary: 'Guide me', secondary: 'Explore my way' },
};

/** The single induction for new members. Never blocks the app. */
export function LaunchInduction() {
  const ind = useInduction();
  const starting = useLaunchStartingStyle();
  const navigate = useNavigate();
  if (ind.finished) return null;
  if (!ind.visible) {
    return (
      <Button variant="ghost" type="button" onClick={ind.resume}
        className="min-h-14 h-auto whitespace-normal rounded-full border border-launch-gold/40 px-4 text-sm font-semibold text-launch-ink hover:bg-launch-cream hover:text-launch-ink">
        Pick up my welcome · step {ind.step + 1} of {ind.total}
      </Button>
    );
  }
  const s = STEPS[ind.stepId];
  const emerald = ind.step === 1;
  const nextId = INDUCTION_STEPS[ind.step + 1];
  const nextStep = nextId ? STEPS[nextId] : undefined;
  const primary = () => {
    ind.next();
    if (s.to) navigate(s.to);
  };
  return (
    <section aria-label="My welcome" className={cn('relative overflow-hidden rounded-3xl border border-launch-gold/40 p-6 shadow-[0_30px_60px_-30px_hsl(var(--launch-ink-deep)/0.7)] sm:p-8', emerald ? 'bg-launch-ink text-launch-ivory' : 'bg-launch-ivory text-launch-ink-deep')}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">My welcome · {ind.step + 1} of {ind.total}</p>
        <Button variant="ghost" size="icon" type="button" onClick={ind.skip} aria-label="Close my welcome for now"
          className={cn('h-14 w-14 shrink-0 rounded-full', emerald ? 'text-launch-ivory hover:bg-launch-ivory/10 hover:text-launch-ivory' : 'text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep')}><X className="h-5 w-5" /></Button>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: ind.total }).map((_, i) => (
          <span key={i} className={cn('h-1 flex-1 rounded-full', i <= ind.step ? 'bg-brand-orange-500' : 'bg-launch-gold/30')} />
        ))}
      </div>
      <h2 aria-live="polite" className="mt-5 font-instrument text-3xl leading-tight sm:text-4xl">{s.title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed">{s.text}</p>
      {ind.stepId === 'style' && (
        <div role="group" aria-label="My starting approach" className="mt-5 flex flex-wrap gap-3">
          {(['guided', 'explore'] as const).map(style => (
            <Button key={style} variant="ghost" aria-pressed={starting.style === style} onClick={() => starting.chooseStyle(style)}
              className={cn('min-h-14 h-auto whitespace-normal rounded-2xl border px-5 font-semibold text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep', starting.style === style ? 'border-launch-ink-deep bg-launch-ink-deep/10' : 'border-launch-ink-deep/30')}>
              {style === 'guided' ? 'Guide me' : 'Explore my way'}
            </Button>
          ))}
        </div>
      )}
      <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-85">
        {ind.stepId === 'style' ? 'My choice saves here. Next finishes my welcome. My first loop on Home then shows each step from first recording to done.' :
          nextStep ? `Next: ${nextStep.title} You can try this now or keep going without doing it yet.` : 'Nothing is recorded, scheduled or shared by finishing this welcome.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {s.to && (
          <Button variant="ghost" type="button" onClick={primary}
            className={cn('min-h-14 h-auto whitespace-normal rounded-2xl border px-5 font-semibold', emerald ? 'border-launch-ivory/50 text-launch-ivory hover:bg-launch-ivory/10 hover:text-launch-ivory' : 'border-launch-ink-deep/30 text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep')}>
            {s.primary}
          </Button>
        )}
        <Button variant="ghost" type="button" onClick={ind.next}
          className="min-h-14 h-auto whitespace-normal rounded-2xl bg-brand-orange-500 px-6 font-semibold text-launch-ink-deep hover:bg-brand-orange-600 hover:text-launch-ink-deep">
          {ind.step === ind.total - 1 ? 'Show my first loop' : 'Next'}<ArrowRight className="h-5 w-5" />
        </Button>
        {ind.step > 0 && (
          <Button variant="ghost" type="button" onClick={ind.back} className={cn('min-h-14 px-3', emerald ? 'text-launch-ivory hover:bg-launch-ivory/10 hover:text-launch-ivory' : 'text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
      </div>
    </section>
  );
}
