import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addDays, format, isSameDay, startOfWeek, endOfWeek, min as minDate, max as maxDate } from 'date-fns';
import { ChevronLeft, ChevronRight, Mic, CalendarDays, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useDemoOrLive } from '@/contexts/DemoModeContext';
import { useFirstSession } from '@/launch/onboarding/useFirstSession';
import { FirstSessionCard } from './FirstSessionCard';
import { TierSwitcherPill } from './TierSwitcherPill';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';
import { useSubject } from '@/launch/persona/SubjectContext';
import { useStage } from '@/launch/stage/useStage';
import { QuietHomePause } from './QuietHomePause';
import { useDisplayName } from '@/launch/profile/useDisplayName';
import { useLaunchStartingStyle } from '@/launch/onboarding/useLaunchStartingStyle';
import { useAuth } from '@/hooks/useAuth';
import { LaunchDailySupport, useLaunchDailySupport } from './LaunchDailySupport';
import { useLaunchCalendarEvents, type LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { useLaunchPriorityHighlights, useLaunchSavedVision } from '@/hooks/useLaunchFocusDisplay';
import { pickTopThree, MAX_TOP } from '@/launch/today/topThree';
import { getHomeMode, setHomeMode, type HomeMode } from '@/launch/today/homePrefs';
import { savedPeakHours } from '@/launch/scheduling/suggestSlots';
import { getDailyEntry } from '@/data/iChoose365';
import { supabase } from '@/integrations/supabase/client';
import { StillOpenList } from '@/launch/reminders/StillOpenList';
import { HomePriorities } from '../home/HomePriorities';
import { HomeNextLine } from '../home/HomeNextLine';
import { HomeStatusLine } from '../home/HomeStatusLine';
import { HomeWeekStrip } from '../home/HomeWeekStrip';
import { HomeDayReview } from '../home/HomeDayReview';
import { HomeMoreToday, type MoreItem } from '../home/HomeMoreToday';
import { PriorityDetailSheet } from '../home/PriorityDetailSheet';
import { cn } from '@/lib/utils';

function timeBucket(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

/** Home: my priorities, calm on the surface, detail on tap. */
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
  const starred = useLaunchPriorityHighlights();
  const vision = useLaunchSavedVision();

  const today = React.useMemo(() => new Date(), []);
  const rangeStart = React.useMemo(() => minDate([startOfWeek(today, { weekStartsOn: 1 }), addDays(today, -1)]), [today]);
  const rangeEnd = React.useMemo(() => maxDate([endOfWeek(today, { weekStartsOn: 1 }), addDays(today, 1)]), [today]);
  const { events, updateStatus, carryOver, addEvent, fetchEvents } = useLaunchCalendarEvents(rangeStart, rangeEnd);

  const [mode, setMode] = React.useState<HomeMode>(() => getHomeMode(user?.id));
  React.useEffect(() => { setMode(getHomeMode(user?.id)); }, [user?.id]);
  const [offset, setOffset] = React.useState<-1 | 0 | 1>(0);
  const [openItem, setOpenItem] = React.useState<LaunchCalendarEvent | null>(null);
  const [justDone, setJustDone] = React.useState<string[]>([]);
  const [waiting, setWaiting] = React.useState(0);

  React.useEffect(() => {
    if (!user?.id) return;
    supabase.from('extracted_actions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).is('calendar_event_id', null).not('status', 'in', '(done,completed,declined,dismissed)')
      .then(({ count }) => setWaiting(count ?? 0));
  }, [user?.id]);

  const effectivePersona = isCaregiver && subject === 'supporting' ? 'recovery' : persona;
  const copy = getPersonaCopy(effectivePersona);
  const realName = useDisplayName(fixtures.name);
  const greetName = isCaregiver && subject === 'supporting' ? supportedName : realName;
  const greeting = copy.greeting[timeBucket()];
  const entry = React.useMemo(() => getDailyEntry(), []);
  const settlingIn = starting.style === null && !firstSession.loading && firstSession.isNewAccount;

  const todays = events.filter(e => isSameDay(e.date, today));
  const top = React.useMemo(() => {
    const picked = pickTopThree(todays, starred.ids, []);
    const ticked = todays.filter(e => justDone.includes(e.id) && e.status === 'done');
    return [...ticked, ...picked].slice(0, MAX_TOP);
  }, [todays, starred.ids, justDone]);
  const topIds = top.map(e => e.id);
  const live = (list: LaunchCalendarEvent[]) => list.filter(e => e.status !== 'cancelled' && !e.requiresAcceptance);
  const todayLive = live(todays);
  const weekLive = live(events.filter(e => e.date >= startOfWeek(today, { weekStartsOn: 1 }) && e.date <= endOfWeek(today, { weekStartsOn: 1 })));
  const suggestions = todays.filter(e => e.requiresAcceptance).length;
  const peaks = savedPeakHours(user?.id);

  const moreItems: MoreItem[] = [];
  if (waiting) moreItems.push({ label: 'Promises waiting for a time', detail: `${waiting}`, to: '/launch/commit' });
  if (suggestions) moreItems.push({ label: 'Suggested by my Support Circle', detail: `${suggestions} to confirm`, to: '/launch/calendar?view=day' });
  if (peaks) moreItems.push({ label: 'My best focus time', detail: `${peaks[0]}–${peaks[peaks.length - 1]}`, to: '/launch/calendar?view=day' });

  const toggle = async (e: LaunchCalendarEvent) => {
    if (e.status === 'done') { await updateStatus(e.id, 'pending'); setJustDone(d => d.filter(id => id !== e.id)); return; }
    setJustDone(d => [...d, e.id]);
    await updateStatus(e.id, 'done');
    toast('Marked done in my diary', { action: { label: 'Undo', onClick: () => { void updateStatus(e.id, 'pending'); setJustDone(d => d.filter(id => id !== e.id)); } } });
  };

  const chooseMode = (m: HomeMode) => { setMode(m); setHomeMode(user?.id, m); };
  const focusDate = addDays(today, offset);

  if (isPause) return <QuietHomePause />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-10">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Yesterday" disabled={offset === -1} onClick={() => setOffset(offset === 1 ? 0 : -1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-launch-ink/60 hover:bg-launch-cream disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            <p className="min-w-[10rem] text-center text-sm text-launch-ink/65">
              {offset === 0 ? format(today, 'EEEE d MMMM') : offset === -1 ? `Yesterday · ${format(focusDate, 'EEE d MMM')}` : `Tomorrow · ${format(focusDate, 'EEE d MMM')}`}
            </p>
            <button type="button" aria-label="Tomorrow" disabled={offset === 1} onClick={() => setOffset(offset === -1 ? 0 : 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-launch-ink/60 hover:bg-launch-cream disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
          </div>
          {offset !== 0 ? (
            <button type="button" onClick={() => setOffset(0)} className="min-h-[44px] rounded-full border border-launch-gold/40 px-4 text-sm font-semibold text-launch-ink">Back to today</button>
          ) : (
            <div role="group" aria-label="How I see my priorities" className="flex rounded-full border border-launch-gold/35 p-0.5">
              {(['dashboard', 'list'] as HomeMode[]).map(m => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => chooseMode(m)}
                  className={cn('min-h-[40px] rounded-full px-4 text-sm capitalize transition', mode === m ? 'bg-launch-ink text-primary-foreground' : 'text-launch-ink/65')}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
        <h1 className="font-instrument text-4xl leading-tight text-launch-ink sm:text-5xl">
          {offset === 0 ? <>{greeting}{greetName ? `, ${greetName}` : ''}.</> : offset === -1 ? 'Looking back at yesterday.' : 'Getting ready for tomorrow.'}
        </h1>
        {offset === 0 && !(isCaregiver && subject === 'supporting') && (
          <p className="border-l-2 border-launch-gold/60 pl-3 text-base italic text-launch-ink/70">Today I choose: {entry.statement}</p>
        )}
        {offset === 0 && vision && (
          <button type="button" onClick={() => navigate('/launch/vision-statement')} className="block text-left text-sm text-launch-moss hover:text-launch-ink">
            Serving my vision: <span className="text-launch-ink/80">{vision.length > 90 ? `${vision.slice(0, 90)}…` : vision}</span>
          </button>
        )}
      </motion.header>

      {starting.style === null && <FirstSessionCard state={firstSession} />}

      {settlingIn && offset === 0 && <StillOpenList />}

      {!settlingIn && offset !== 0 && (
        <div className="rounded-3xl border border-launch-gold/25 bg-launch-ivory/85 p-5 shadow-[0_20px_50px_-34px_hsl(var(--launch-ink-deep)/0.4)] backdrop-blur-xl sm:p-7">
          <HomeDayReview which={offset === -1 ? 'yesterday' : 'tomorrow'} date={focusDate}
            events={events.filter(e => isSameDay(e.date, focusDate))}
            onOpen={setOpenItem}
            onCarry={async e => { await carryOver(e); await fetchEvents(); toast('Carried into today'); }}
            onPrep={async e => {
              const h = Math.min(Math.max(new Date().getHours() + 1, 9), 20);
              await addEvent({ title: `Get ready: ${e.title}`, time: `${String(h).padStart(2, '0')}:00`, type: 'task', date: today, reminder_level: 'off' });
              await fetchEvents(); toast('Prep step added to today');
            }} />
        </div>
      )}

      {!settlingIn && offset === 0 && (
        <div className="space-y-5 rounded-3xl border border-launch-gold/25 bg-launch-ivory/85 p-5 shadow-[0_20px_50px_-34px_hsl(var(--launch-ink-deep)/0.4)] backdrop-blur-xl sm:p-7">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-launch-moss">
              {dailySupport.gentle ? 'One step is enough today' : 'My priorities today'}
            </h2>
            {top.length > 0 && <span className="text-sm text-launch-ink/60">{top.filter(t => t.status === 'done').length} of {top.length} done</span>}
          </div>

          <StillOpenList />
          {top.length === 0 ? (
            <div>
              <p className="text-base text-launch-ink">Nothing in my diary yet today.</p>
              <button type="button" onClick={() => navigate('/launch/calendar?view=day')}
                className="mt-3 inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-5 font-semibold text-primary-foreground">
                <CalendarPlus className="h-5 w-5" /> Plan my day
              </button>
            </div>
          ) : (
            <HomePriorities items={dailySupport.gentle ? top.slice(0, 1) : top} mode={mode} onToggle={e => void toggle(e)} onOpen={setOpenItem} />
          )}

          <HomeNextLine events={todays} excludeIds={topIds} onOpen={setOpenItem} />

          {mode === 'dashboard' && todayLive.length > 0 && (
            <HomeStatusLine todayDone={todayLive.filter(e => e.status === 'done').length} todayTotal={todayLive.length}
              weekPlanned={weekLive.length} weekDone={weekLive.filter(e => e.status === 'done').length} waiting={waiting} />
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate('/launch/memory?record=1')}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-6 font-semibold text-primary-foreground">
              <Mic className="h-5 w-5" /> Record a conversation
            </button>
            <button type="button" onClick={() => navigate('/launch/calendar?view=day')}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border border-launch-gold/45 px-6 font-semibold text-launch-ink hover:bg-launch-cream">
              <CalendarDays className="h-5 w-5" /> See my day
            </button>
          </div>

          <HomeMoreToday uid={user?.id} items={moreItems} />
        </div>
      )}

      {!settlingIn && (
        <div className="rounded-3xl border border-launch-gold/20 bg-launch-ivory/70 p-5 sm:p-6">
          <HomeWeekStrip events={events} onOpen={setOpenItem} />
        </div>
      )}

      {!settlingIn && user?.id && !(isCaregiver && subject === 'supporting') && <LaunchDailySupport {...dailySupport} />}

      <PriorityDetailSheet event={openItem} onClose={() => setOpenItem(null)} onSaved={() => void fetchEvents()} />

      <p className="pt-2 pb-8 text-center text-xs text-launch-ink/50">Today is mine. #IChoose</p>
      <TierSwitcherPill />
    </div>
  );
}
