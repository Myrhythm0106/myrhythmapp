import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { useFirstSession } from '@/launch/onboarding/useFirstSession';
import { FirstSessionCard } from './FirstSessionCard';
import { TopThreeToday } from './TopThreeToday';
import { format } from 'date-fns';
import { NextActionStrip } from './NextActionStrip';
import { TierSwitcherPill } from './TierSwitcherPill';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';
import { useSubject } from '@/launch/persona/SubjectContext';
import { useStage } from '@/launch/stage/useStage';
import { QuietHomePause } from './QuietHomePause';
import { useDisplayName } from '@/launch/profile/useDisplayName';
import { HomeFullPictureCard } from './HomeFullPictureCard';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import { useAuth } from '@/hooks/useAuth';
import { LaunchDailySupport, useLaunchDailySupport } from './LaunchDailySupport';

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
  const starting = useLaunchStartingStyle();
  const { user } = useAuth();
  const dailySupport = useLaunchDailySupport(user?.id);
  const [topIds, setTopIds] = React.useState<string[]>([]);

  // Caregivers in "supporting" mode see the recovery-toned home for the person they support.
  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const copy = getPersonaCopy(effectivePersona);
  const realName = useDisplayName(fixtures.name);
  const greetName = isCaregiver && subject === 'supporting' ? supportedName : realName;
  const greeting = copy.greeting[timeBucket()];

  // Day one: one clear next move instead of a dozen empty panels.
  const settlingIn = starting.style === null && !firstSession.loading && firstSession.isNewAccount;

  if (isPause) return <QuietHomePause />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Calm briefing header */}
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
        <p className="font-worksans text-sm text-launch-ink/55">{format(new Date(), 'EEEE, d MMMM')}</p>
        <h1 className="mt-1 font-instrument text-4xl leading-tight text-launch-ink sm:text-5xl">
          {greeting}{greetName ? `, ${greetName}` : ''}.
        </h1>
        {isCaregiver && subject === 'supporting' && (
          <p className="mt-2 text-sm text-launch-ink/60">Supporting {supportedName}</p>
        )}
      </motion.header>

      {/* The guided first session */}
      {starting.style === null && <FirstSessionCard state={firstSession} />}

      {!settlingIn && (
        <>
          <TopThreeToday onPicked={setTopIds} />

          <section aria-labelledby="home-now-title" className="space-y-3">
            <h2 id="home-now-title" className="font-instrument text-2xl text-launch-ink">
              {dailySupport.gentle ? 'One step is enough for now' : "What's next"}
            </h2>
            <NextActionStrip excludeIds={topIds} />
          </section>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Mic, label: 'Record a conversation', hint: 'One tap. I keep every word.', to: '/launch/memory?record=1', tone: 'text-launch-ember' },
              { icon: CalendarDays, label: 'See my day', hint: 'Everything lined up for today.', to: '/launch/calendar', tone: 'text-launch-teal' },
            ].map(({ icon: Icon, label, hint, to, tone }) => (
              <button key={to} type="button" onClick={() => navigate(to)}
                className="group flex min-h-[88px] items-center gap-4 rounded-3xl border border-launch-gold/25 bg-launch-ivory/80 px-5 text-left shadow-[0_16px_40px_-30px_hsl(var(--launch-ink-deep)/0.4)] backdrop-blur-xl transition hover:border-launch-gold/50">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-launch-cream"><Icon className={`h-5 w-5 ${tone}`} /></span>
                <span>
                  <span className="block text-base font-semibold text-launch-ink">{label}</span>
                  <span className="block text-sm text-launch-ink/60">{hint}</span>
                </span>
              </button>
            ))}
          </div>

          {!dailySupport.gentle && <HomeFullPictureCard />}
        </>
      )}

      {!settlingIn && user?.id && !(isCaregiver && subject === 'supporting') && <LaunchDailySupport {...dailySupport} />}

      {/* Footer signature */}
      <p className="text-center text-xs text-launch-ink/50 pt-4 pb-8">
        Today is mine. #IChoose
      </p>

      {/* Dev-only tier switcher */}
      <TierSwitcherPill />
    </div>
  );
}
