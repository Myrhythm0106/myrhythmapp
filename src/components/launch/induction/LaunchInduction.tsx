import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useInduction } from '@/launch/onboarding/useInduction';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import type { InductionStep } from '@/launch/onboarding/induction';
import { cn } from '@/lib/utils';

type Step = { title: string; text: string; primary: string; to?: string; secondary?: string };
const STEPS: Record<InductionStep, Step> = {
  welcome: { title: 'Welcome. Here is how MyRhythm helps me.', text: 'MyRhythm remembers, so I can follow through. I record what matters, choose my next steps, and they wait for me in my diary. This short welcome takes about two minutes, and I can leave it at any point.', primary: 'Show me' },
  who: { title: 'Who am I using MyRhythm for?', text: 'One tap tailors the wording and first suggestions. Myself, someone I care for, or a busy working life. Optional.', primary: 'Choose who it is for', to: '/launch/user-type?after=home', secondary: 'Not now' },
  style: { title: 'How would I like to start?', text: 'Guide me shows one step at a time. Explore my way leaves everything open. I can switch whenever I like.', primary: 'Guide me', secondary: 'Explore my way' },
  record: { title: 'Capture my first conversation', text: 'An appointment, a meeting or a chat at home. One tap starts, one tap stops. If now is not the moment, a 20-second note to myself works just as well.', primary: 'Record now', to: '/launch/memory?record=1', secondary: 'Later' },
  nextSteps: { title: 'See my summary and next steps', text: 'MyRhythm writes up what was said and pulls out what was agreed. I keep the ones that matter and give one a time in my diary.', primary: 'Open my conversations', to: '/launch/memory', secondary: 'Next' },
  reminders: { title: 'Gentle reminders, until it is done', text: 'A get-ready prompt before each step, then Done, Snooze or Move. If something slips, it waits for me in Still open at the end of the day. No nagging.', primary: 'Got it' },
  circle: { title: 'Invite someone I trust', text: 'No one walks alone. A family member, friend or colleague can see what I choose to share, and nothing else. I can turn this off at any time.', primary: 'Invite someone', to: '/launch/support', secondary: 'Not now' },
  snapshot: { title: 'My free snapshot', text: 'Six minutes of questions about my energy and focus, so MyRhythm suggests times that suit me. Not a test, and never a diagnosis.', primary: 'Start my snapshot', to: '/launch/assessment?first=1', secondary: 'Later' },
  done: { title: "I'm set up.", text: 'Tomorrow, Home shows my priorities and the next thing to do. Everything else is one tap away in the round menu. I can replay this welcome from Help.', primary: 'Go to my day' },
};

/** The single induction for new members. Never blocks the app. */
export function LaunchInduction() {
  const ind = useInduction();
  const starting = useLaunchStartingStyle();
  const navigate = useNavigate();
  if (ind.finished) return null;
  if (!ind.visible) {
    return (
      <button type="button" onClick={ind.resume}
        className="min-h-11 rounded-full border border-launch-gold/40 px-4 text-sm font-semibold text-launch-ink hover:bg-launch-cream">
        Pick up my welcome · step {ind.step + 1} of {ind.total}
      </button>
    );
  }
  const s = STEPS[ind.stepId];
  const primary = () => {
    if (ind.stepId === 'style') starting.chooseStyle('guided');
    ind.next();
    if (s.to) navigate(s.to);
  };
  const secondary = () => {
    if (ind.stepId === 'style') starting.chooseStyle('explore');
    ind.next();
  };
  return (
    <section aria-label="My welcome" className="relative overflow-hidden rounded-3xl border border-launch-gold/40 bg-launch-ivory p-6 text-launch-ink-deep shadow-[0_30px_60px_-30px_hsl(var(--launch-ink-deep)/0.7)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-launch-ink-deep/70">My welcome · {ind.step + 1} of {ind.total}</p>
        <button type="button" onClick={ind.skip} aria-label="Close my welcome for now"
          className="flex h-11 w-11 items-center justify-center rounded-full text-launch-ink-deep/80 hover:bg-launch-ink-deep/10"><X className="h-5 w-5" /></button>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: ind.total }).map((_, i) => (
          <span key={i} className={cn('h-1 flex-1 rounded-full', i <= ind.step ? 'bg-brand-orange-500' : 'bg-launch-gold/30')} />
        ))}
      </div>
      <h2 className="mt-5 font-instrument text-3xl leading-tight sm:text-4xl">{s.title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-launch-ink-deep/85">{s.text}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={primary}
          className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-6 font-semibold text-primary-foreground hover:bg-brand-orange-600">
          {s.primary}<ArrowRight className="h-5 w-5" />
        </button>
        {s.secondary && (
          <button type="button" onClick={secondary}
            className="min-h-[56px] rounded-2xl border border-launch-ink-deep/30 px-6 font-semibold hover:bg-launch-ink-deep/10">{s.secondary}</button>
        )}
        {ind.step > 0 && (
          <button type="button" onClick={ind.back} className="inline-flex min-h-[56px] items-center gap-1 px-2 text-launch-ink-deep/80 hover:text-launch-ink-deep">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
      </div>
    </section>
  );
}
