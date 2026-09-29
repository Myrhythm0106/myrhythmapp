import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { useFirstSession } from '@/launch/onboarding/useFirstSession';
import { FirstSessionCard } from './FirstSessionCard';
import { RhythmLine } from './RhythmLine';
import { NextActionStrip } from './NextActionStrip';
import { TierSwitcherPill } from './TierSwitcherPill';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';
import { useSubject } from '@/launch/persona/SubjectContext';
import { useStage } from '@/launch/stage/useStage';
import { StagePicker } from '@/launch/stage/StagePicker';
import { QuietHomePause } from './QuietHomePause';
import { useDisplayName } from '@/launch/profile/useDisplayName';
import { MyRhythmGHomeChip } from '@/launch/growth/MyRhythmGHomeChip';
import { DayOpenWelcome } from '@/launch/daily/DayOpenWelcome';

function timeBucket(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function QuietHome() {
  const navigate = useNavigate();
  const { fixtures } = useDemoOrLive();
  const { persona, isCaregiver } = usePersona();
  const { subject, supportedName } = useSubject();
  const { isPause } = useStage();
  const firstSession = useFirstSession();

  if (isPause) return <QuietHomePause />;

  // Caregivers in "supporting" mode see the recovery-toned home for the person they support.
  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const copy = getPersonaCopy(effectivePersona);
  const realName = useDisplayName(fixtures.name);
  const greetName = isCaregiver && subject === 'supporting' ? supportedName : realName;
  const greeting = copy.greeting[timeBucket()];

  // Day one: one clear next move instead of a dozen empty panels.
  const settlingIn = !firstSession.loading && firstSession.isNewAccount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Warm, once-a-day welcome to the new day */}
      <DayOpenWelcome name={greetName} />

      {/* Greeting strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="font-hind text-[11px] font-semibold uppercase tracking-[0.28em] text-launch-ink/55">
            {greeting}
          </p>
          <p className="font-archivo mt-1 text-xl uppercase tracking-tight text-launch-ink sm:text-2xl">
            {greetName}
          </p>
          <p className="font-hind text-xs text-launch-ink/60 mt-1">{copy.subgreeting}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StagePicker />
            <MyRhythmGHomeChip />
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-launch-ivory border border-launch-gold/30 text-launch-ink capitalize">
          {isCaregiver && subject === 'supporting' ? 'Co-pilot view' : fixtures.tier}
        </span>
      </motion.div>

      {/* What I learned about your best hours — said out loud */}
      <RhythmLine />

      {/* The guided first session */}
      <FirstSessionCard state={firstSession} />

      {/* Returning Home: one priority and two familiar places. */}
      {!settlingIn && (
        <section aria-labelledby="home-now-title" className="space-y-4">
          <h2 id="home-now-title" className="font-display text-2xl text-launch-ink">
            What needs my attention now
          </h2>
          <NextActionStrip />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-[72px] justify-start border-launch-gold/40 bg-launch-ivory px-5 text-base text-launch-ink"
              onClick={() => navigate('/launch/memory?record=1')}
            >
              <Mic className="h-5 w-5 text-launch-ember" />
              Record something
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-[72px] justify-start border-launch-gold/40 bg-launch-ivory px-5 text-base text-launch-ink"
              onClick={() => navigate('/launch/calendar')}
            >
              <CalendarDays className="h-5 w-5 text-launch-teal" />
              See my day
            </Button>
          </div>
        </section>
      )}

      {/* Footer signature */}
      <p className="text-center text-xs text-launch-ink/50 pt-4 pb-8">
        Today is mine. #IChoose
      </p>

      {/* Dev-only tier switcher */}
      <TierSwitcherPill />
    </div>
  );
}
