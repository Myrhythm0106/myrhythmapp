import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Leaf, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CHECK_IN_DAYS, dueCheckIn, emptyDailySupport, isGentleDay, localDay, readDailySupport, snoozeCheckIn, writeDailySupport, type DailySupportState, type ReflectionAnswer } from '@/launch/daily/dailySupport';

export function useLaunchDailySupport(userId?: string) {
  const [state, setState] = useState<DailySupportState>(emptyDailySupport);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    setState(userId ? readDailySupport(userId) : emptyDailySupport());
    setError(false);
  }, [userId]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const update = (next: DailySupportState) => {
    if (!userId) return;
    if (!writeDailySupport(userId, next)) { setError(true); return; }
    setError(false);
    setState(next);
  };
  return { state, update, now, error, gentle: isGentleDay(state, now) };
}

type Props = ReturnType<typeof useLaunchDailySupport>;
const choices: { value: ReflectionAnswer; label: string }[] = [{ value: 'easier', label: 'Easier' }, { value: 'same', label: 'About the same' }, { value: 'harder', label: 'Harder' }];
const secondary = 'min-h-[56px] h-auto whitespace-normal text-launch-ink hover:bg-launch-teal/10 hover:text-launch-ink';

export function LaunchDailySupport({ state, update, now, error, gentle }: Props) {
  const [open, setOpen] = useState(false);
  const [remembering, setRemembering] = useState<ReflectionAnswer | null>(null);
  const [followingThrough, setFollowingThrough] = useState<ReflectionAnswer | null>(null);
  const [saved, setSaved] = useState(false);
  const due = dueCheckIn(state, now);
  const latest = state.reflections.at(-1);
  return <section aria-label="My pace and check-ins" className="space-y-3 border-y border-launch-gold/30 py-4">
    <Button variant="ghost" className={cn(secondary, 'justify-start px-0')} aria-pressed={gentle}
      onClick={() => update({ ...state, gentleDate: gentle ? null : localDay(now) })}>
      {gentle ? <RotateCcw className="text-launch-teal" /> : <Leaf className="text-launch-teal" />}
      {gentle ? 'Show my usual Home' : 'I need a gentler day'}
    </Button>
    {gentle && <p role="status" className="text-base text-launch-ink">Just my next step for now. My appointments and reminders stay as they are. My usual Home returns tomorrow.</p>}
    <Button variant="ghost" className={cn(secondary, 'w-full justify-between px-0')} aria-expanded={open} aria-controls="ongoing-check-ins" onClick={() => setOpen(!open)}>
      {due ? `My ${due}-day check-in is ready` : 'My ongoing check-ins'}
      <ChevronDown className={cn('text-launch-teal', open && 'rotate-180')} />
    </Button>
    {open && <div id="ongoing-check-ins" className="space-y-4">
      {!state.startedOn ? <>
        <p className="text-base text-launch-ink">Would I like to pause at 30, 60 and 90 days from today and see what feels easier?</p>
        <Button variant="action" className="min-h-[56px] h-auto whitespace-normal" onClick={() => update({ ...state, startedOn: localDay(now), snoozedUntil: null })}>Yes, offer me check-ins</Button>
      </> : <>
        <p className="text-base text-launch-ink">Started {new Date(`${state.startedOn}T12:00:00`).toLocaleDateString()}. These are reflections on daily life, not a test or a diagnosis.</p>
        {due ? <form className="space-y-4" onSubmit={event => {
          event.preventDefault();
          if (!remembering || !followingThrough) return;
          const next = { ...state, snoozedUntil: null, reflections: [...state.reflections, { day: due, savedAt: now.toISOString(), remembering, followingThrough }] };
          update(next); setSaved(true); setRemembering(null); setFollowingThrough(null);
        }}>
          <h3 className="text-lg font-semibold text-launch-ink">Since I started, how does daily life feel?</h3>
          {([{ id: 'remembering', title: 'Keeping track of what was agreed', value: remembering, change: setRemembering }, { id: 'follow-through', title: 'Following through on my next steps', value: followingThrough, change: setFollowingThrough }]).map(row => <fieldset key={row.id} className="space-y-2">
            <legend className="mb-2 text-base font-semibold text-launch-ink">{row.title}</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{choices.map(choice => <label key={choice.value} className={cn('flex min-h-[56px] cursor-pointer items-center gap-3 rounded-lg border p-3 text-base text-launch-ink', row.value === choice.value ? 'border-launch-teal bg-launch-teal/10' : 'border-launch-gold/40 bg-launch-ivory')}>
              <input type="radio" name={row.id} value={choice.value} checked={row.value === choice.value} onChange={() => row.change(choice.value)} className="h-5 w-5 accent-launch-teal" />{choice.label}
            </label>)}</div>
          </fieldset>)}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="action" className="min-h-[56px]" disabled={!remembering || !followingThrough}><Check />Save my check-in</Button>
            <Button type="button" variant="ghost" className={secondary} onClick={() => { update(snoozeCheckIn(state, now)); setSaved(false); }}>In a week</Button>
            <Button type="button" variant="ghost" className={secondary} onClick={() => update({ ...state, skipped: [...state.skipped, due], snoozedUntil: null })}>Skip this check-in</Button>
          </div>
        </form> : <p role="status" className="text-base text-launch-ink">{saved && !error ? 'My check-in is saved. ' : ''}{CHECK_IN_DAYS.every(d => state.skipped.includes(d) || state.reflections.some(r => r.day === d)) ? 'All three check-ins are finished. I can still choose a gentler day whenever I need one.' : 'No check-in is due today. I can come back when I’m ready.'}</p>}
        {latest && <div className="space-y-2 border-l-2 border-launch-teal pl-4 text-base text-launch-ink">
          <p className="font-semibold">My last reflection · day {latest.day}</p>
          <p>Keeping track: {choices.find(c => c.value === latest.remembering)?.label}. Following through: {choices.find(c => c.value === latest.followingThrough)?.label}.</p>
          <p>{latest.remembering === 'harder' || latest.followingThrough === 'harder' ? 'I don’t have to push harder. I can choose a gentler day and ask someone I trust for support.' : latest.remembering === 'easier' || latest.followingThrough === 'easier' ? 'Something feels easier. I can keep what helps and change what doesn’t.' : 'I can keep what helps and choose one small change. There’s no pass or fail.'}</p>
        </div>}
        {state.reflections.length > 1 && <details className="text-base text-launch-ink"><summary className="flex min-h-[56px] cursor-pointer items-center">My earlier reflections</summary><ul className="space-y-3">{state.reflections.slice(0, -1).map(r => <li key={r.day}>Day {r.day} · Keeping track: {choices.find(c => c.value === r.remembering)?.label}; following through: {choices.find(c => c.value === r.followingThrough)?.label}.</li>)}</ul></details>}
      </>}
      <p className="text-base text-launch-ink/75">Saved for my account on this device only. MyRhythm does not diagnose, treat or replace clinical care.</p>
    </div>}
    {error && <p role="alert" className="text-base text-destructive">This device couldn’t save my choice. Please try again.</p>}
  </section>;
}