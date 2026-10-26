import { Compass, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';

const NEXT = [
  { title: 'A few quick questions about my day', time: 'about 6 minutes' },
  { title: 'My free personal snapshot', time: 'ready straight away' },
  { title: 'My first small step, saved to my day', time: 'about 1 minute' },
];

/** Shown once, straight after registering: what happens next, and how I'd like to begin. */
export function LaunchFirstWelcome({ name, onChoose }: { name?: string; onChoose: (style: StartingStyle) => void }) {
  return (
    <section aria-labelledby="first-welcome-title" className="mx-auto w-full max-w-md px-4 py-10">
      <h1 id="first-welcome-title" className="font-display text-3xl font-bold leading-tight text-launch-ink">
        You're in{name ? `, ${name}` : ''}. Welcome to MyRhythm.
      </h1>
      <p className="mt-3 text-base leading-relaxed text-launch-ink-deep">
        Here's what happens next. It takes about 10 minutes, and I can stop any time.
      </p>
      <ol className="mt-6 space-y-3">
        {NEXT.map((item, i) => (
          <li key={item.title} className="flex items-start gap-3 rounded-2xl border border-launch-gold/30 bg-launch-ivory p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-launch-teal/15 font-semibold text-launch-teal">{i + 1}</span>
            <span>
              <span className="block text-base font-semibold text-launch-ink-deep">{item.title}</span>
              <span className="block text-sm text-launch-ink/70">{item.time}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-3">
        <Button variant="ghost" onClick={() => onChoose('guided')}
          className="h-auto min-h-[56px] justify-start gap-3 whitespace-normal rounded-xl bg-brand-orange-500 px-5 py-4 text-left text-primary-foreground hover:bg-brand-orange-600 hover:text-primary-foreground">
          <Route aria-hidden="true" />
          <span><span className="block text-base font-semibold">Guide me</span><span className="block text-sm font-normal">One step at a time. Recommended for my first visit.</span></span>
        </Button>
        <Button variant="ghost" onClick={() => onChoose('explore')}
          className="h-auto min-h-[56px] justify-start gap-3 whitespace-normal rounded-xl border border-launch-gold/50 bg-launch-ivory px-5 py-4 text-left text-launch-ink-deep hover:bg-launch-cream hover:text-launch-ink-deep">
          <Compass aria-hidden="true" />
          <span><span className="block text-base font-semibold">Let me explore</span><span className="block text-sm font-normal">I'll look around and choose where to begin.</span></span>
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-launch-ink/70">I can switch between these at any time from the menu.</p>
    </section>
  );
}
