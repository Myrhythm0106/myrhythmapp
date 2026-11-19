import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { useFirstSession } from '@/launch/onboarding/useFirstSession';
import { FirstSessionCard } from './FirstSessionCard';
import { TopThreeToday } from './TopThreeToday';
import { HomeBriefingBand } from './HomeBriefingBand';
import { HomeUpNext } from './HomeUpNext';
import { HomeAtAGlance } from './HomeAtAGlance';
import { useLaunchCalendarEvents } from '@/hooks/useLaunchCalendarEvents';
import { supabase } from '@/integrations/supabase/client';
import { diaryLevel } from '@/launch/circle/diaryAccess';
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
  const today = React.useMemo(() => new Date(), []);
  const { events, updateStatus } = useLaunchCalendarEvents(today, today);
  const [sharedWith, setSharedWith] = React.useState(0);
  React.useEffect(() => {
    if (!user?.id) return;
    supabase.from('support_circle_members').select('permissions').eq('user_id', user.id).eq('status', 'active')
      .then(({ data }) => setSharedWith((data ?? []).filter(r => diaryLevel(r.permissions as Record<string, unknown>) !== 'none').length));
  }, [user?.id]);

  // Caregivers in "supporting" mode see the recovery-toned home for the person they support.
  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const copy = getPersonaCopy(effectivePersona);
  const realName = useDisplayName(fixtures.name);
  const greetName = isCaregiver && subject === 'supporting' ? supportedName : realName;
  const greeting = copy.greeting[timeBucket()];

  // Day one: one clear next move instead of a dozen empty panels.
  const settlingIn = starting.style === null && !firstSession.loading && firstSession.isNewAccount;

  if (isPause) return <QuietHomePause />;

  const supportingView = isCaregiver && subject === 'supporting';

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <HomeBriefingBand greeting={greeting} name={greetName} events={events} sharedWith={sharedWith}
          supporting={supportingView ? supportedName : undefined} />
      </motion.div>

      {/* The guided first session */}
      {starting.style === null && <FirstSessionCard state={firstSession} />}

      {!settlingIn && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <TopThreeToday onPicked={setTopIds} />
            <HomeUpNext events={events} excludeIds={topIds} onDone={(id, st) => updateStatus(id, st)} />
          </div>

          <HomeAtAGlance doneToday={events.filter(e => e.status === 'done').length} />

          {dailySupport.gentle && (
            <p className="text-center font-instrument text-xl text-launch-ink">One step is enough for now.</p>
          )}
          {!dailySupport.gentle && <HomeFullPictureCard />}
        </>
      )}

      {!settlingIn && user?.id && !supportingView && <LaunchDailySupport {...dailySupport} />}

      {/* Footer signature */}
      <p className="text-center text-xs text-launch-ink/50 pt-4 pb-8">
        Today is mine. #IChoose
      </p>

      {/* Dev-only tier switcher */}
      <TierSwitcherPill />
    </div>
  );
}
