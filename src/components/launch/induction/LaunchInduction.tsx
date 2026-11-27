import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useInduction } from '@/launch/onboarding/useInduction';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import { INDUCTION_STEPS, type InductionStep } from '@/launch/onboarding/induction';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { readFocus, saveFocus, readReminderChoice, saveReminderChoice, type FocusWindow, type ReminderChoice } from '@/launch/onboarding/welcomeSettings';

const TOUR = [
  { title: 'Record', text: 'Tap Record when a conversation or appointment starts. MyRhythm listens and finds the next steps.' },
  { title: 'Diary', text: 'Your chosen steps wait here, placed at your clearest time, with gentle reminders until done.' },
  { title: 'Circle', text: 'No one walks alone. Invite someone you trust to see or help, only as much as you choose.' },
  { title: 'Vision', text: 'The life you are building. Each small step today can link to it, whenever you want.' },
];
import { Button } from '@/components/ui/button';

type Step = { title: string; text: string; primary: string; to?: string; secondary?: string };
const STEPS: Record<InductionStep, Step> = {
  welcome: { title: 'Welcome. Here is how MyRhythm helps you.', text: 'MyRhythm remembers, so you can follow through. You record what matters, choose your next steps, and they wait for you in your diary. This short welcome takes under a minute, and you can leave it at any point.', primary: 'Show me' },
  who: { title: 'Who am I using MyRhythm for?', text: 'One tap tailors the wording and first suggestions. Myself, someone I care for, or a busy working life. Optional.', primary: 'Choose who it is for', to: '/launch/user-type?after=home', secondary: 'Not now' },
  rhythm: { title: 'Two quick settings, so MyRhythm fits you.', text: 'When your mind feels clearest, MyRhythm suggests that time for your next steps. Choose where gentle reminders go. You can change both later in Settings.', primary: 'Save' },
  style: { title: 'How would you like to start?', text: 'Take a short walkthrough of the four places you will use most, or discover the app in your own time. You can switch in the round menu at any time.', primary: 'Take the walkthrough', secondary: 'Discover in my own time' },
};

/** The single induction for new members. Never blocks the app. */
export function LaunchInduction() {
  const ind = useInduction();
  const starting = useLaunchStartingStyle();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [focus, setFocus] = React.useState<FocusWindow | null>(() => readFocus(user?.id));
  const [remind, setRemind] = React.useState<ReminderChoice | null>(() => readReminderChoice(user?.id));
  const [tour, setTour] = React.useState<number | null>(null);
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
  const emerald = ind.step % 2 === 1;
  const nextId = INDUCTION_STEPS[ind.step + 1];
  const nextStep = nextId ? STEPS[nextId] : undefined;
  const primary = () => {
    ind.next();
    if (s.to) navigate(s.to);
  };
  const pill = (on: boolean) => cn('min-h-14 h-auto whitespace-normal rounded-2xl border px-5 font-semibold',
    emerald ? (on ? 'border-launch-ivory bg-launch-ivory/15 text-launch-ivory hover:bg-launch-ivory/20 hover:text-launch-ivory' : 'border-launch-ivory/40 text-launch-ivory hover:bg-launch-ivory/10 hover:text-launch-ivory')
      : (on ? 'border-launch-ink-deep bg-launch-ink-deep/10 text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep' : 'border-launch-ink-deep/30 text-launch-ink-deep hover:bg-launch-ink-deep/10 hover:text-launch-ink-deep'));
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
      {ind.stepId === 'rhythm' && (
        <div className="mt-5 space-y-5">
          <div role="group" aria-label="My clearest time of day">
            <p className="mb-2 text-sm font-semibold">When does your mind feel clearest?</p>
            <div className="flex flex-wrap gap-3">
              {(['morning', 'afternoon', 'evening'] as const).map(w => (
                <Button key={w} variant="ghost" type="button" aria-pressed={focus === w} className={pill(focus === w)}
                  onClick={() => { setFocus(w); saveFocus(user?.id, w); }}>
                  {w === 'morning' ? 'Morning' : w === 'afternoon' ? 'Afternoon' : 'Evening'}
                </Button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Where my reminders go">
            <p className="mb-2 text-sm font-semibold">Where should gentle reminders go?</p>
            <div className="flex flex-wrap gap-3">
              {(['email', 'both'] as const).map(c => (
                <Button key={c} variant="ghost" type="button" aria-pressed={remind === c} className={pill(remind === c)}
                  onClick={() => { setRemind(c); saveReminderChoice(user?.id, c); }}>
                  {c === 'email' ? 'Email' : 'Phone and email'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      {ind.stepId === 'style' && (
        <div className="mt-5">
          <div role="group" aria-label="My starting approach" className="flex flex-wrap gap-3">
            <Button variant="ghost" type="button" aria-pressed={tour !== null} className={pill(tour !== null)}
              onClick={() => { starting.chooseStyle('guided'); setTour(0); }}>Take the walkthrough</Button>
            <Button variant="ghost" type="button" aria-pressed={tour === null && starting.style === 'explore'} className={pill(tour === null && starting.style === 'explore')}
              onClick={() => { starting.chooseStyle('explore'); setTour(null); }}>Discover in my own time</Button>
          </div>
          {tour !== null && (
            <div aria-live="polite" className="mt-5 rounded-2xl border border-launch-ink-deep/20 bg-launch-cream/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Walkthrough · {tour + 1} of {TOUR.length}</p>
              <h3 className="mt-2 font-instrument text-2xl">{TOUR[tour].title}</h3>
              <p className="mt-2 text-base leading-relaxed">{TOUR[tour].text}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {tour > 0 && <Button variant="ghost" type="button" className={pill(false)} onClick={() => setTour(tour - 1)}>Previous</Button>}
                {tour < TOUR.length - 1
                  ? <Button variant="ghost" type="button" className={pill(true)} onClick={() => setTour(tour + 1)}>Next stop</Button>
                  : <p className="self-center text-sm font-semibold">That is the tour. Next opens your first loop.</p>}
              </div>
            </div>
          )}
        </div>
      )}
      <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-85">
        {ind.stepId === 'style' ? 'Next finishes your welcome. Your first loop on Home then shows each step from first recording to done.' : ind.stepId === 'rhythm' ? 'Each choice saves as you tap. Skip either one and MyRhythm uses a calm morning default.' :
          nextStep ? `Next: ${nextStep.title} You can try this now or keep going without doing it yet.` : 'Nothing is recorded, scheduled or shared by finishing this welcome.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {s.to && s.secondary !== undefined && ind.stepId === 'who' && (
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
