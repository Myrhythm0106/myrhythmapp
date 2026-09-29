import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FREQUENCY_LABEL,
  Frequency,
  RegularAppointment,
  RhythmItem,
  readRhythmConsent,
  saveRhythmConsent,
  suggestedRhythm,
} from '@/launch/calendar/rhythmConsent';

const ITEM_LABEL: Record<RhythmItem, string> = {
  work: 'My best time to work',
  productive: 'My most productive window',
  breaks: 'Breaks',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Snapshot card: "built from your answers" + permission to show it on my calendar + regular appointments. */
export function RhythmCalendarConsent({ mainFocus }: { mainFocus?: string | null }) {
  const navigate = useNavigate();
  const suggestion = suggestedRhythm();
  const [consent, setConsent] = useState(readRhythmConsent);
  const [choosing, setChoosing] = useState(false);
  const [draft, setDraft] = useState({ title: '', time: '10:00', durationMinutes: 60, frequency: 'weekly' as Frequency, weekday: 1 });

  useEffect(() => saveRhythmConsent(consent), [consent]);

  if (!suggestion) return null;

  const rows: { id: RhythmItem; value: string }[] = [
    { id: 'work', value: `${suggestion.work.start}–${suggestion.work.end}` },
    { id: 'productive', value: `${suggestion.productive.start}–${suggestion.productive.end}` },
    { id: 'breaks', value: `After about ${suggestion.focusBlockMinutes} minutes of focus` },
  ];

  const answer = (status: 'yes' | 'no', all?: boolean) => {
    setConsent((c) => ({
      ...c,
      status,
      items: all ? { work: true, productive: true, breaks: true } : status === 'no' ? { work: false, productive: false, breaks: false } : c.items,
    }));
    setChoosing(false);
    toast.success(status === 'yes' ? 'Added to my calendar. I can change this any time in Settings.' : 'Nothing added. I can switch this on later in Settings.');
  };

  const addAppointment = () => {
    if (!draft.title.trim()) {
      toast.error('Give it a name first — for example "Physio".');
      return;
    }
    const today = new Date();
    const appt: RegularAppointment = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      time: draft.time,
      durationMinutes: draft.durationMinutes,
      frequency: draft.frequency,
      weekday: draft.weekday,
      startDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    };
    setConsent((c) => ({ ...c, appointments: [...c.appointments, appt] }));
    setDraft((d) => ({ ...d, title: '' }));
    toast.success(`"${appt.title}" is blocked out ${FREQUENCY_LABEL[appt.frequency].toLowerCase()}.`);
  };

  const removeAppointment = (id: string) => {
    const prev = consent.appointments;
    setConsent((c) => ({ ...c, appointments: c.appointments.filter((a) => a.id !== id) }));
    toast('Removed', { action: { label: 'Undo', onClick: () => setConsent((c) => ({ ...c, appointments: prev })) } });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 md:px-8 space-y-4" aria-label="My set-up">
      <div className="rounded-xl border border-launch-gold/40 bg-launch-ivory p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-launch-teal">Your set-up is built from your answers</p>
        <ul className="mt-4 divide-y divide-launch-gold/20">
          {rows.map((r) => (
            <li key={r.id} className="flex min-h-[56px] items-center justify-between gap-3 py-2">
              <span className="text-base text-launch-ink-deep">{ITEM_LABEL[r.id]}</span>
              <span className="flex items-center gap-3">
                <span className="font-semibold text-launch-ink-deep">{r.value}</span>
                <button onClick={() => navigate('/launch/settings#rhythm')} className="min-h-11 px-2 text-sm font-semibold text-launch-teal underline">Edit</button>
              </span>
            </li>
          ))}
          {mainFocus && (
            <li className="flex min-h-[56px] items-center justify-between gap-3 py-2">
              <span className="text-base text-launch-ink-deep">My main focus</span>
              <span className="flex items-center gap-3">
                <span className="font-semibold text-launch-ink-deep">{mainFocus}</span>
                <button onClick={() => navigate('/launch/compass')} className="min-h-11 px-2 text-sm font-semibold text-launch-teal underline">Edit</button>
              </span>
            </li>
          )}
        </ul>
        <p className="mt-3 text-sm text-launch-ink-deep/70">These are suggestions, not rules. I'm in control.</p>
      </div>

      <div className="rounded-xl border border-launch-teal/30 bg-launch-cream-light p-6 md:p-8">
        <h2 className="text-xl font-bold text-launch-ink-deep">May MyRhythm show this on my calendar?</h2>
        <p className="mt-2 text-base text-launch-ink-deep/80">
          They appear as soft, labelled bands — never as appointments. Nothing is added without my yes.
        </p>
        {consent.status === 'ask' || choosing ? (
          <>
            {choosing && (
              <div className="mt-4 space-y-1">
                {rows.map((r) => (
                  <label key={r.id} className="flex min-h-[56px] items-center justify-between gap-3">
                    <span className="text-base text-launch-ink-deep">{ITEM_LABEL[r.id]}</span>
                    <Switch
                      checked={consent.items[r.id]}
                      onCheckedChange={(v) => setConsent((c) => ({ ...c, items: { ...c.items, [r.id]: v } }))}
                      aria-label={ITEM_LABEL[r.id]}
                    />
                  </label>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {choosing ? (
                <Button className="min-h-[56px] bg-launch-teal text-primary-foreground hover:bg-launch-ink" onClick={() => answer('yes')}>Save my choices</Button>
              ) : (
                <>
                  <Button className="min-h-[56px] bg-launch-teal text-primary-foreground hover:bg-launch-ink" onClick={() => answer('yes', true)}>Yes, show it</Button>
                  <Button variant="outline" className="min-h-[56px] border-launch-teal/40" onClick={() => setChoosing(true)}>Let me choose</Button>
                </>
              )}
              <Button variant="ghost" className="min-h-[56px]" onClick={() => answer('no')}>Not now</Button>
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base font-semibold text-launch-ink-deep">
              {consent.status === 'yes'
                ? `Showing: ${(Object.keys(consent.items) as RhythmItem[]).filter((k) => consent.items[k]).map((k) => ITEM_LABEL[k].toLowerCase()).join(', ') || 'nothing yet'}`
                : 'Not shown on my calendar.'}
            </p>
            <Button variant="outline" className="min-h-[56px]" onClick={() => setChoosing(true)}>Change</Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-launch-gold/40 bg-launch-ivory p-6 md:p-8">
        <h2 className="text-xl font-bold text-launch-ink-deep">My regular appointments</h2>
        <p className="mt-2 text-base text-launch-ink-deep/80">
          Add things that repeat — physio, clinic, school run, a class. They're blocked out automatically so nothing is planned on top of them.
        </p>
        {consent.appointments.length > 0 && (
          <ul className="mt-4 divide-y divide-launch-gold/20">
            {consent.appointments.map((a) => (
              <li key={a.id} className="flex min-h-[56px] items-center justify-between gap-3">
                <span className="text-base text-launch-ink-deep">
                  <strong>{a.title}</strong> · {a.time} · {a.durationMinutes} min · {FREQUENCY_LABEL[a.frequency]}
                  {(a.frequency === 'weekly' || a.frequency === 'fortnightly') && ` on ${WEEKDAYS[a.weekday]}`}
                </span>
                <button onClick={() => removeAppointment(a.id)} className="min-h-11 px-2 text-sm font-semibold text-launch-ink-deep/70 underline">Remove</button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-launch-ink-deep">What is it?
            <Input className="mt-1 min-h-[56px] text-base" placeholder="e.g. Physio" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <label className="text-sm font-semibold text-launch-ink-deep">Time
            <Input type="time" className="mt-1 min-h-[56px] text-base" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
          </label>
          <label className="text-sm font-semibold text-launch-ink-deep">How often?
            <select className="mt-1 block min-h-[56px] w-full rounded-md border border-input bg-background px-3 text-base" value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value as Frequency })}>
              {(Object.keys(FREQUENCY_LABEL) as Frequency[]).map((f) => <option key={f} value={f}>{FREQUENCY_LABEL[f]}</option>)}
            </select>
          </label>
          {draft.frequency === 'weekly' || draft.frequency === 'fortnightly' ? (
            <label className="text-sm font-semibold text-launch-ink-deep">Which day?
              <select className="mt-1 block min-h-[56px] w-full rounded-md border border-input bg-background px-3 text-base" value={draft.weekday} onChange={(e) => setDraft({ ...draft, weekday: Number(e.target.value) })}>
                {WEEKDAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </label>
          ) : (
            <label className="text-sm font-semibold text-launch-ink-deep">How long? (minutes)
              <Input type="number" min={5} step={5} className="mt-1 min-h-[56px] text-base" value={draft.durationMinutes} onChange={(e) => setDraft({ ...draft, durationMinutes: Math.max(5, Number(e.target.value) || 60) })} />
            </label>
          )}
        </div>
        <Button variant="outline" className="mt-4 min-h-[56px] border-launch-teal/40" onClick={addAppointment}>Add this appointment</Button>
      </div>
    </section>
  );
}
