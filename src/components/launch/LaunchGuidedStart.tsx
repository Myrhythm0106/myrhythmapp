import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Mic, CalendarDays, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';

const STEPS = [
  { title: 'Capture something important', text: 'A conversation or a short note to myself. I choose what to capture.', action: 'Open Memory Bridge', to: '/launch/memory?record=1', path: '/launch/memory', icon: Mic },
  { title: 'Check my next steps', text: 'I read what was captured and choose which next steps matter to me.', action: 'Open my captures', to: '/launch/memory', path: '/launch/memory', icon: ListChecks },
  { title: 'Give one step a place in my day', text: 'I choose the action, day and time. Nothing is added without my agreement.', action: 'Open my calendar', to: '/launch/calendar', path: '/launch/calendar', icon: CalendarDays },
];

export function LaunchGuidedStart() {
  const { style, step, chooseStyle, continueStep } = useLaunchStartingStyle();
  const location = useLocation();
  const navigate = useNavigate();
  if (style !== 'guided' || step >= STEPS.length) return null;
  const current = STEPS[step];
  const Icon = current.icon;
  const atDestination = location.pathname === current.path;
  return (
    <section aria-label="My guided start" className="mb-6 border-b border-launch-gold/40 py-5">
      <p className="text-base font-semibold text-launch-teal">My guided start · {step + 1} of {STEPS.length}</p>
      <h2 className="mt-2 flex items-center gap-3 text-xl font-semibold text-launch-ink-deep"><Icon className="h-5 w-5 shrink-0" />{current.title}</h2>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-launch-ink">{current.text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={() => atDestination ? continueStep() : navigate(current.to)}
          className="min-h-[56px] h-auto whitespace-normal bg-brand-orange-500 text-primary-foreground hover:bg-brand-orange-600 hover:text-primary-foreground">
          {atDestination ? (step === 2 ? 'Finish my guided start' : 'Continue') : current.action}
          {atDestination && step === 2 ? <Check /> : <ArrowRight />}
        </Button>
        <Button variant="ghost" onClick={() => chooseStyle('explore')} className="min-h-[56px] h-auto whitespace-normal text-launch-ink hover:bg-launch-cream hover:text-launch-ink">Explore my way instead</Button>
      </div>
    </section>
  );
}