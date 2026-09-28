import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Compass, Edit3, History, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentCompass, listCompassVersions, listFocusChecks, saveCompassVersion, saveFocusCheck, type CompassVersion } from '@/launch/compass/myCompass';

const fields: Array<{ key: keyof CompassVersion; label: string }> = [
  { key: 'whatMatters', label: 'What matters to me now' },
  { key: 'harder', label: 'What makes things harder for me' },
  { key: 'helps', label: 'What helps me' },
  { key: 'bestTime', label: 'When I tend to be at my best' },
  { key: 'people', label: 'Who I want involved, if anyone' },
  { key: 'nextAction', label: 'What I am trying next' },
  { key: 'successStatement', label: "I'll know I'm done when…" },
];

export default function LaunchCompass() {
  const navigate = useNavigate();
  const [versions, setVersions] = useState(listCompassVersions());
  const [checks, setChecks] = useState(listFocusChecks());
  const latest = versions[0] ?? null;
  const [draft, setDraft] = useState(latest);
  const [editing, setEditing] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [check, setCheck] = useState({ actionHappened: 'Yes', effect: 'Better', nextChoice: 'Keep it', reflection: '' });
  const changed = useMemo(() => Boolean(latest && draft && JSON.stringify(latest) !== JSON.stringify(draft)), [draft, latest]);

  const save = () => {
    if (!draft) return;
    const { id: _id, createdAt: _createdAt, ...values } = draft;
    const next = saveCompassVersion(values);
    setVersions(listCompassVersions());
    setDraft(next);
    setEditing(false);
    toast.success('My Compass is saved. My words stay in control.');
  };

  const schedule = (days: number | null) => {
    if (!draft) return;
    const reviewAt = days === null ? null : new Date(Date.now() + days * 86400000).toISOString();
    setDraft({ ...draft, reviewAt, reviewStatus: reviewAt ? 'scheduled' : 'not_scheduled' });
  };

  const submitCheck = () => {
    const saved = saveFocusCheck(check as Parameters<typeof saveFocusCheck>[0]);
    setChecks(listFocusChecks());
    setShowCheck(false);
    toast.success(`${saved.status}. Nothing changes unless I choose it.`);
  };

  if (!latest || !draft) {
    return <LaunchLayout><LaunchHeroBand eyebrow="My Compass" title="My view of me" subtitle="My answers, my focus and my next step — in my words." /><div className="max-w-3xl mx-auto px-4 py-6"><LaunchCard><p className="text-launch-ink/70 mb-4">Complete the short MYRHYTHM assessment to create my first Compass.</p><Button variant="secondary" onClick={() => navigate('/launch/assessment')}>Take my assessment</Button></LaunchCard></div></LaunchLayout>;
  }

  return (
    <LaunchLayout>
      <LaunchHeroBand eyebrow="My Compass" title="My view of me" subtitle="What matters, what helps and what I am trying next — always in my control." />
      <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
        <Tabs defaultValue="now">
          <TabsList className="grid grid-cols-3 h-auto mb-5 bg-launch-ink/5">
            <TabsTrigger value="now" className="min-h-[56px]">Now</TabsTrigger>
            <TabsTrigger value="change" className="min-h-[56px]">Then &amp; now</TabsTrigger>
            <TabsTrigger value="story" className="min-h-[56px]">My story</TabsTrigger>
          </TabsList>
          <TabsContent value="now" className="space-y-4">
            <LaunchCard className="border-launch-gold/40 bg-launch-ivory">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div><p className="text-xs uppercase tracking-wide text-launch-teal">My chosen focus</p><h2 className="font-display text-xl text-launch-ink mt-1">{draft.focus}</h2></div>
                <span className="shrink-0 rounded-full bg-launch-teal/10 px-3 py-1 text-xs font-semibold text-launch-teal">{checks[0]?.status ?? draft.status}</span>
              </div>
              <button className="text-sm text-launch-ink/60 underline min-h-[44px]" onClick={() => setEditing(true)}>Change this focus</button>
            </LaunchCard>
            <LaunchCard className="space-y-5">
              {fields.map(({ key, label }) => (
                <div key={key} className="border-b border-launch-gold/20 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wide text-launch-ink/55">{label}</p><span className="text-[11px] text-launch-teal">{draft.origins[key] ?? 'I added this'}</span></div>
                  {editing ? <Textarea value={String(draft[key] ?? '')} onChange={(event) => setDraft({ ...draft, [key]: event.target.value, origins: { ...draft.origins, [key]: 'I added this' } })} className="mt-2 min-h-[72px]" /> : <p className="mt-2 text-launch-ink leading-relaxed">{String(draft[key] || 'Not added yet')}</p>}
                </div>
              ))}
              {editing ? <div className="flex gap-2"><Button variant="secondary" disabled={!changed} onClick={save}>Save my words</Button><Button variant="ghost" onClick={() => { setDraft(latest); setEditing(false); }}>Cancel</Button></div> : <Button variant="outline" onClick={() => setEditing(true)}><Edit3 />Change my Compass</Button>}
            </LaunchCard>
            <LaunchCard>
              <div className="flex items-center gap-2"><CalendarDays className="text-launch-ember" /><h2 className="font-semibold text-launch-ink">When would I like to look at this again?</h2></div>
              <div className="grid sm:grid-cols-3 gap-2 mt-4">
                {[['In 7 days', 7], ['In 30 days', 30], ['Not now', null]].map(([label, days]) => <Button key={String(label)} variant="outline" onClick={() => schedule(days as number | null)}>{label}</Button>)}
              </div>
              {draft.reviewAt && <p className="text-sm text-launch-ink/65 mt-3">Next reflection: {new Date(draft.reviewAt).toLocaleDateString()}. Save my Compass to confirm it.</p>}
              {changed && <Button className="mt-3" variant="secondary" onClick={save}>Save review choice</Button>}
            </LaunchCard>
            <LaunchCard>
              <div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold text-launch-ink">Focus Check</h2><p className="text-sm text-launch-ink/65">A gentle check against what I chose — not a test.</p></div><Button variant="secondary" onClick={() => setShowCheck(!showCheck)}>{showCheck ? 'Close' : 'Check in'}</Button></div>
              {showCheck && <div className="mt-5 space-y-5">
                {[{ key: 'actionHappened', q: 'Did this action happen?', options: ['Yes', 'Partly', 'Not yet'] }, { key: 'effect', q: 'Did it help with what I wanted to improve?', options: ['Better', 'About the same', 'Harder'] }, { key: 'nextChoice', q: 'What should happen next?', options: ['Keep it', 'Make it easier', 'Choose something else'] }].map((row) => <fieldset key={row.key}><legend className="text-sm font-semibold text-launch-ink mb-2">{row.q}</legend><div className="grid grid-cols-3 gap-2">{row.options.map((option) => <Button key={option} variant={check[row.key as keyof typeof check] === option ? 'secondary' : 'outline'} className="h-auto min-h-[56px] whitespace-normal" onClick={() => setCheck({ ...check, [row.key]: option })}>{option}</Button>)}</div></fieldset>)}
                <Textarea placeholder="What feels different? (optional)" value={check.reflection} onChange={(event) => setCheck({ ...check, reflection: event.target.value })} />
                <Button variant="secondary" onClick={submitCheck}>Save my check-in</Button>
              </div>}
            </LaunchCard>
          </TabsContent>
          <TabsContent value="change"><LaunchCard><h2 className="font-semibold text-launch-ink mb-3">What has changed in my words</h2>{checks.length ? checks.map((item) => <div key={item.id} className="py-3 border-b border-launch-gold/20 last:border-0"><p className="font-semibold text-launch-teal">{item.status}</p><p className="text-sm text-launch-ink/70">{item.actionHappened} · {item.effect} · {item.nextChoice}</p>{item.reflection && <p className="mt-1 text-launch-ink">“{item.reflection}”</p>}</div>) : <p className="text-launch-ink/65">My first reflection will appear here. It starts with “What feels different?”</p>}</LaunchCard></TabsContent>
          <TabsContent value="story"><LaunchCard><div className="flex items-center gap-2 mb-3"><History className="text-launch-ember" /><h2 className="font-semibold text-launch-ink">My dated Compass snapshots</h2></div>{versions.map((item) => <div key={item.id} className="py-3 border-b border-launch-gold/20 last:border-0"><p className="text-xs text-launch-ink/50">{new Date(item.createdAt).toLocaleDateString()}</p><p className="font-medium text-launch-ink">{item.focus}</p><p className="text-sm text-launch-ink/65">Trying next: {item.nextAction}</p></div>)}</LaunchCard></TabsContent>
        </Tabs>
        <p className="text-xs text-launch-ink/50 mt-5">MyRhythm does not diagnose, treat or cure any condition. My Compass reflects what I tell it and can be changed by me.</p>
      </div>
    </LaunchLayout>
  );
}