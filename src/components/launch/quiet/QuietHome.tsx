import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addDays, format, isSameDay, startOfWeek, endOfWeek, min as minDate, max as maxDate } from 'date-fns';
import { ChevronLeft, ChevronRight, Mic, CalendarDays, CalendarPlus, Users, Clock } from 'lucide-react';
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
import { getResumeStep } from '@/launch/onboarding/resumePoint';
import { ResumeSetupCard } from './ResumeSetupCard';
import { LaunchInduction } from '@/components/launch/induction/LaunchInduction';
import { useInduction } from '@/launch/onboarding/useInduction';
import { VisionInvitation } from '@/components/launch/vision/VisionInvitation';
import { shouldOfferVision } from '@/launch/vision/actionVision';

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
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('postCheckout') === '1') toast.success(q.get('trial') === '1' ? "I'm in. My 7 free days have started." : "I'm in. My membership is active.");
  }, []);
  const rangeStart = React.useMemo(() => minDate([startOfWeek(today, { weekStartsOn: 1 }), addDays(today, -1)]), [today]);
  const rangeEnd = React.useMemo(() => maxDate([endOfWeek(today, { weekStartsOn: 1 }), addDays(today, 1)]), [today]);
  const { events, updateStatus, carryOver, addEvent, fetchEvents } = useLaunchCalendarEvents(rangeStart, rangeEnd);

  const [mode, setMode] = React.useState<HomeMode>(() => getHomeMode(user?.id));
  React.useEffect(() => { setMode(getHomeMode(user?.id)); }, [user?.id]);
  const [offset, setOffset] = React.useState<-1 | 0 | 1>(0);
  const [openItem, setOpenItem] = React.useState<LaunchCalendarEvent | null>(null);
  const [justDone, setJustDone] = React.useState<string[]>([]);
  const [waiting, setWaiting] = React.useState(0);
  const [resumeStep] = React.useState(() => getResumeStep());
  const induction = useInduction();
  const [circleCount, setCircleCount] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!user?.id) return;
    supabase.from('support_circle_members').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
      .then(({ count }) => setCircleCount(count ?? 0));
  }, [user?.id]);

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

  const now = new Date();
  const nextMeeting = todayLive
    .filter(e => e.status !== 'done' && e.time)
    .find(e => { const [h, m] = (e.time || '00:00').split(':').map(Number); return h * 60 + m >= now.getHours() * 60 + now.getMinutes(); });
  const weekDone = weekLive.filter(e => e.status === 'done').length;
  const followPct = weekLive.length ? Math.round((weekDone / weekLive.length) * 100) : 0;
  const card = 'rounded-3xl border border-launch-gold/25 bg-launch-ivory/90 p-5 shadow-[0_20px_50px_-34px_hsl(var(--launch-ink-deep)/0.4)] sm:p-6';
  const label = 'text-[11px] font-semibold uppercase tracking-[0.22em] text-launch-moss';
  const figures = [
    { n: todayLive.length, l: todayLive.length === 1 ? 'item in my diary' : 'items in my diary' },
    { n: top.filter(t => t.status !== 'done').length, l: 'priorities still to do' },
    { n: waiting, l: waiting === 1 ? 'promise waiting for a time' : 'promises waiting for a time' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {offset === 0 && <LaunchInduction />}
      {resumeStep && firstSession.recorded && !induction.visible && <ResumeSetupCard step={resumeStep} />}

      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-3xl bg-launch-ink-deep p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Yesterday" disabled={offset === -1} onClick={() => setOffset(offset === 1 ? 0 : -1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground/75 hover:bg-primary-foreground/10 disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            <p className="min-w-[10rem] text-center text-sm text-primary-foreground/75">
              {offset === 0 ? format(today, 'EEEE d MMMM') : offset === -1 ? `Yesterday · ${format(focusDate, 'EEE d MMM')}` : `Tomorrow · ${format(focusDate, 'EEE d MMM')}`}
            </p>
            <button type="button" aria-label="Tomorrow" disabled={offset === 1} onClick={() => setOffset(offset === -1 ? 0 : 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground/75 hover:bg-primary-foreground/10 disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
          </div>
          {offset !== 0 ? (
            <button type="button" onClick={() => setOffset(0)} className="min-h-[44px] rounded-full border border-primary-foreground/30 px-4 text-sm font-semibold">Back to today</button>
          ) : (
            <div role="group" aria-label="How I see my priorities" className="flex rounded-full border border-primary-foreground/25 p-0.5">
              {(['dashboard', 'list'] as HomeMode[]).map(m => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => chooseMode(m)}
                  className={cn('min-h-[40px] rounded-full px-4 text-sm capitalize transition', mode === m ? 'bg-primary-foreground text-launch-ink-deep' : 'text-primary-foreground/75')}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
        <h1 className="mt-4 font-instrument text-4xl leading-tight sm:text-5xl">
          {offset === 0 ? <>{greeting}{greetName ? `, ${greetName}` : ''}.</> : offset === -1 ? 'Looking back at yesterday.' : 'Getting ready for tomorrow.'}
        </h1>
        {offset === 0 && !(isCaregiver && subject === 'supporting') && (
          <p className="mt-2 text-base italic text-primary-foreground/75">Today I choose: {entry.statement}</p>
        )}
        {offset === 0 && (
          <dl aria-label="Today at a glance" className="mt-6 grid grid-cols-3 gap-3 border-t border-primary-foreground/15 pt-5">
            {figures.map(f => (
              <div key={f.l}>
                <dt className="sr-only">{f.l}</dt>
                <dd className="font-instrument text-4xl leading-none sm:text-5xl">{f.n}</dd>
                <dd className="mt-1 text-sm leading-snug text-primary-foreground/70">{f.l}</dd>
              </div>
            ))}
          </dl>
        )}
      </motion.header>

      {offset !== 0 && (
        <div className={card}>
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

      {offset === 0 && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section aria-label="My priorities today" className={cn(card, 'space-y-5')}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className={label}>{dailySupport.gentle ? 'One step is enough today' : 'My priorities today'}</h2>
              {top.length > 0 && <span className="text-sm text-launch-ink/60">{top.filter(t => t.status === 'done').length} of {top.length} done</span>}
            </div>
            {top.length === 0 ? (
              <div>
                <p className="text-base text-launch-ink">Nothing in my diary yet today. A clear day to plan as I choose.</p>
                <button type="button" onClick={() => navigate('/launch/calendar?view=day')}
                  className="mt-3 inline-flex min-h-[56px] items-center gap-2 rounded-2xl border border-launch-gold/45 px-5 font-semibold text-launch-ink hover:bg-launch-cream">
                  <CalendarPlus className="h-5 w-5" /> Plan my day
                </button>
              </div>
            ) : (
              <HomePriorities items={dailySupport.gentle ? top.slice(0, 1) : top} mode={mode} onToggle={e => void toggle(e)} onOpen={setOpenItem} />
            )}
            <HomeNextLine events={todays} excludeIds={topIds} onOpen={setOpenItem} />
            <div className="flex flex-wrap gap-3 border-t border-launch-gold/20 pt-5">
              <button type="button" onClick={() => navigate('/launch/memory?record=1')}
                className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl bg-brand-orange-500 px-6 font-semibold text-primary-foreground hover:bg-brand-orange-600">
                <Mic className="h-5 w-5" /> Record a conversation
              </button>
              <button type="button" onClick={() => navigate('/launch/calendar?view=day')}
                className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border border-launch-gold/45 px-6 font-semibold text-launch-ink hover:bg-launch-cream">
                <CalendarDays className="h-5 w-5" /> See my day
              </button>
            </div>
            <HomeMoreToday uid={user?.id} items={moreItems} />
          </section>

          <aside className="space-y-6">
            <section aria-label="Next up" className={card}>
              <h2 className={label}>Next up</h2>
              {nextMeeting ? (
                <button type="button" onClick={() => setOpenItem(nextMeeting)} className="mt-3 block w-full text-left">
                  <p className="flex items-center gap-2 text-sm text-launch-ink/65"><Clock className="h-4 w-4" />{nextMeeting.time?.slice(0, 5)}</p>
                  <p className="mt-1 text-lg font-semibold text-launch-ink-deep">{nextMeeting.title}</p>
                </button>
              ) : <p className="mt-3 text-base text-launch-ink/75">Nothing else booked today.</p>}
              <button type="button" onClick={() => navigate('/launch/memory?record=1')}
                className="mt-4 inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold text-launch-ink hover:underline">
                <Mic className="h-4 w-4" /> Record it when it starts
              </button>
            </section>

            <section aria-label="My follow-through this week" className={card}>
              <div className="flex items-baseline justify-between">
                <h2 className={label}>Follow-through this week</h2>
                <span className="font-instrument text-3xl text-launch-ink-deep">{followPct}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-launch-gold/20" role="progressbar" aria-valuenow={followPct} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-launch-ink" style={{ width: `${followPct}%` }} />
              </div>
              <p className="mt-2 text-sm text-launch-ink/65">{weekDone} of {weekLive.length} done{waiting ? ` · ${waiting} waiting for a time` : ''}</p>
            </section>

            <section aria-label="My Support Circle" className={card}>
              <h2 className={label}>No one walks alone</h2>
              <button type="button" onClick={() => navigate('/launch/support')} className="mt-3 flex min-h-[56px] w-full items-center gap-3 text-left">
                <Users className="h-6 w-6 shrink-0 text-launch-ink" />
                <span className="text-base text-launch-ink-deep">
                  {circleCount ? `${circleCount} ${circleCount === 1 ? 'person' : 'people'} in my Support Circle. They see only what I share.` : 'Invite someone I trust. I choose what they see, and can turn it off.'}
                </span>
              </button>
            </section>
          </aside>
        </div>
      )}

      {offset === 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-label="My Vision in ACTion" className={card}>
            <h2 className={label}>My Vision in ACTion</h2>
            {vision ? (
              <button type="button" onClick={() => navigate('/launch/vision-statement')} className="mt-3 block text-left text-base text-launch-ink-deep hover:underline">
                {vision.length > 140 ? `${vision.slice(0, 140)}…` : vision}
              </button>
            ) : user?.id && shouldOfferVision(firstSession.recorded, vision, false) ? (
              <div className="mt-3"><VisionInvitation userId={user.id} /></div>
            ) : (
              <button type="button" onClick={() => navigate('/launch/vision-statement')} className="mt-3 min-h-[48px] text-left text-base text-launch-ink hover:underline">
                Shape the life I am building, one step at a time.
              </button>
            )}
          </section>
          <section aria-label="Still open" className={card}>
            <h2 className={label}>Still open</h2>
            <div className="mt-3"><StillOpenList /></div>
            <p className="mt-2 text-sm text-launch-ink/60">Anything that slipped waits here, calmly.</p>
          </section>
        </div>
      )}

      <div className={card}>
        <HomeWeekStrip events={events} onOpen={setOpenItem} />
      </div>

      {user?.id && !(isCaregiver && subject === 'supporting') && <LaunchDailySupport {...dailySupport} />}

      <PriorityDetailSheet event={openItem} onClose={() => setOpenItem(null)} onSaved={() => void fetchEvents()} />

      <p className="pt-2 pb-8 text-center text-xs text-launch-ink/50">Today is mine. #IChoose</p>
      <TierSwitcherPill />
    </div>
  );
}
