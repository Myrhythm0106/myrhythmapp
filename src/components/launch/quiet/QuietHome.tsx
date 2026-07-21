import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { IChooseHeart } from './IChooseHeart';
import { ReEntryCard } from './ReEntryCard';
import { Scaffolds } from './Scaffolds';
import { Composer } from './Composer';
import { CognitiveLoadMeter } from './CognitiveLoadMeter';
import { TierSwitcherPill } from './TierSwitcherPill';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';
import { useSubject } from '@/launch/persona/SubjectContext';
import { useStage } from '@/launch/stage/useStage';
import { StagePicker } from '@/launch/stage/StagePicker';
import { QuietHomePause } from './QuietHomePause';
import { useDisplayName } from '@/launch/profile/useDisplayName';
import { LaunchWeeklyPlanningCard } from '@/components/launch/LaunchWeeklyPlanningCard';
import { MyRhythmGHomeChip } from '@/launch/growth/MyRhythmGHomeChip';

function timeBucket(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function QuietHome() {
  const { fixtures } = useDemoOrLive();
  const { persona, isCaregiver } = usePersona();
  const { subject, supportedName } = useSubject();
  const { isPause } = useStage();

  if (isPause) return <QuietHomePause />;

  // Caregivers in "supporting" mode see the recovery-toned home for the person they support.
  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const copy = getPersonaCopy(effectivePersona);
  const realName = useDisplayName(fixtures.name);
  const greetName = isCaregiver && subject === 'supporting' ? supportedName : realName;
  const greeting = copy.greeting[timeBucket()];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Greeting strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-launch-ink/80">{greeting}, {greetName}.</p>
          <p className="text-xs text-launch-ink/60 mt-0.5">{copy.subgreeting}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StagePicker />
            <MyRhythmGHomeChip />
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-launch-ivory border border-launch-gold/30 text-launch-ink capitalize">
          {isCaregiver && subject === 'supporting' ? 'Co-pilot view' : fixtures.tier}
        </span>
      </motion.div>


      {/* Weekly planning nudge (only on the user's planning day) */}
      <LaunchWeeklyPlanningCard />

      {/* #IChoose centerpiece */}
      <IChooseHeart />

      {/* Re-entry */}
      <ReEntryCard />

      {/* Scaffolds */}
      <Scaffolds />

      {/* Composer */}
      <Composer />

      {/* Today's wins */}
      <div className="rounded-3xl bg-launch-ivory border border-launch-gold/30 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-launch-ember" />
          <h3 className="font-semibold text-launch-ink">{copy.winsTitle}</h3>
        </div>
        <ul className="space-y-2">
          {fixtures.wins.map((w) => (
            <li key={w.id} className="flex items-center justify-between text-sm">
              <span className="text-launch-ink/80">{w.text}</span>
              <span className="text-xs text-launch-ink/50">{w.time}</span>
            </li>
          ))}
        </ul>
      </div>


      {/* Cognitive Load (Plus+) */}
      <CognitiveLoadMeter />

      {/* Footer signature */}
      <p className="text-center text-xs text-launch-ink/50 pt-4 pb-8">
        Today is yours. #IChoose
      </p>


      {/* Dev-only tier switcher */}
      <TierSwitcherPill />
    </div>
  );
}
