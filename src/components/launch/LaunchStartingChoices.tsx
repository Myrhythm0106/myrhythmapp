import { Compass, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLaunchStartingStyle, type StartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';

export function LaunchStartingChoices({ onChoose, compact = false }: {
  onChoose?: (style: StartingStyle) => void;
  compact?: boolean;
}) {
  const { style, chooseStyle } = useLaunchStartingStyle();
  const choose = (next: StartingStyle) => {
    chooseStyle(next);
    onChoose?.(next);
  };
  return (
    <section aria-label="How would I like to begin?" className="launch-theme">
      <h2 className="text-xl font-semibold text-launch-ink-deep">{compact ? 'My starting approach' : 'How would I like to begin?'}</h2>
      <div className="mt-4 grid gap-3">
        <Button variant="ghost" aria-pressed={style === 'guided'} onClick={() => choose('guided')}
          className="h-auto min-h-[72px] justify-start whitespace-normal rounded-lg bg-brand-orange-500 px-5 py-4 text-left text-primary-foreground hover:bg-brand-orange-600 hover:text-primary-foreground">
          <Route aria-hidden="true" />
          <span><span className="block text-base font-semibold">Guide me</span><span className="block text-base font-normal">One step at a time</span></span>
        </Button>
        <Button variant="ghost" aria-pressed={style === 'explore'} onClick={() => choose('explore')}
          className="h-auto min-h-[72px] justify-start whitespace-normal rounded-lg border border-launch-gold/50 bg-launch-ivory px-5 py-4 text-left text-launch-ink-deep hover:bg-launch-cream hover:text-launch-ink-deep">
          <Compass aria-hidden="true" />
          <span><span className="block text-base font-semibold">Explore my way</span><span className="block text-base font-normal">Choose where I begin</span></span>
        </Button>
      </div>
    </section>
  );
}