import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Compass, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { buildInitialCompass, readLatestAssessment, saveCompassVersion } from '@/launch/compass/myCompass';
import { foundingMemberConfig } from '@/config/pricing';

export function LivingCompassReport() {
  const navigate = useNavigate();
  const assessment = readLatestAssessment();
  const insight = assessment?.insight;
  const [action, setAction] = useState(insight?.actions[0] ?? '');
  const [editingAction, setEditingAction] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reviewDays, setReviewDays] = useState<number | null | 'unset'>('unset');

  if (!insight) return null;

  const confirmCompass = () => {
    const compass = buildInitialCompass(action);
    const reviewAt = typeof reviewDays === 'number' ? new Date(Date.now() + reviewDays * 86400000).toISOString() : null;
    saveCompassVersion({ ...compass, reviewAt, reviewStatus: reviewAt ? 'scheduled' : 'not_scheduled' });
    setConfirmed(true);
    toast.success('My Compass is ready. I can change it at any time.');
  };

  return (
    <section className="px-5 md:px-12 py-8 md:py-10 bg-launch-ivory border-b border-launch-gold/30" aria-labelledby="living-report-title">
      <div className="flex items-center gap-3 mb-6"><Compass className="h-7 w-7 text-launch-teal" /><div><p className="text-xs uppercase tracking-[0.2em] font-semibold text-launch-ember">My free, complete insight</p><h2 id="living-report-title" className="font-display text-2xl md:text-3xl text-launch-ink">This is what MyRhythm heard</h2></div></div>

      <div className="grid md:grid-cols-2 gap-4">
        <article className="rounded-lg border border-launch-gold/30 bg-launch-cream p-5"><p className="text-xs font-semibold uppercase tracking-wide text-launch-ink/55">1 · What I told MyRhythm</p><ul className="mt-3 space-y-2">{insight.toldMe.map((line) => <li key={line} className="flex gap-2 text-sm text-launch-ink/80"><Check className="h-4 w-4 mt-0.5 shrink-0 text-launch-teal" />{line}</li>)}</ul></article>
        <article className="rounded-lg border border-launch-gold/30 bg-launch-cream p-5"><p className="text-xs font-semibold uppercase tracking-wide text-launch-ink/55">2 · What this may mean for my days</p><p className="mt-3 text-launch-ink leading-relaxed">{insight.meaning}</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => toast.success('Good — this stays in my Compass only when I choose it.')}>This feels right</Button><Button size="sm" variant="ghost" onClick={() => setEditingAction(true)}>Not true for me</Button></div></article>
        <article className="rounded-lg border-2 border-launch-teal/40 bg-launch-teal/5 p-5 md:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-launch-teal">3 · My key insight right now</p><h3 className="mt-2 font-display text-xl md:text-2xl text-launch-ink">{insight.insight}</h3><button type="button" onClick={() => setShowWhy(!showWhy)} className="mt-3 min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-launch-teal underline underline-offset-4" aria-expanded={showWhy}>Why this?<ChevronDown className={`h-4 w-4 transition-transform ${showWhy ? 'rotate-180' : ''}`} /></button>{showWhy && <ul className="mt-2 space-y-1 text-sm text-launch-ink/70">{insight.why.map((line) => <li key={line}>From my assessment: {line}</li>)}</ul>}</article>
        <article className="rounded-lg border border-launch-gold/30 bg-launch-cream p-5 md:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-launch-ink/55">4 · What is already working for me</p><p className="mt-2 text-lg font-semibold text-launch-ink">{insight.strength}</p></article>
      </div>

      <article className="mt-5 rounded-lg border border-launch-gold/40 bg-launch-cream p-5 md:p-6"><p className="text-xs font-semibold uppercase tracking-wide text-launch-ember">5 · One action I choose now</p><p className="mt-2 text-sm text-launch-ink/65">Choose one, change the words, or write my own. Nothing is added without my say-so.</p><div className="mt-4 grid gap-2">{insight.actions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setAction(suggestion); setEditingAction(false); }} className={`min-h-[56px] rounded-lg border p-4 text-left text-sm transition-colors ${action === suggestion ? 'border-launch-teal bg-launch-teal/10 text-launch-ink' : 'border-launch-gold/30 bg-launch-ivory text-launch-ink/75'}`}>{suggestion}</button>)}</div><Button variant="ghost" className="mt-2" onClick={() => setEditingAction(true)}><Pencil />Change this or write my own</Button>{editingAction && <Textarea className="mt-2 min-h-[112px]" value={action} onChange={(event) => setAction(event.target.value)} aria-label="My chosen action" />}
        <div className="mt-5 border-t border-launch-gold/20 pt-5"><p className="font-semibold text-launch-ink">When would I like to look at this again?</p><div className="grid grid-cols-3 gap-2 mt-3">{([['7 days', 7], ['30 days', 30], ['Not now', null]] as const).map(([label, value]) => <Button key={label} variant={reviewDays === value ? 'secondary' : 'outline'} className="h-auto min-h-[56px] whitespace-normal" onClick={() => setReviewDays(value)}>{label}</Button>)}</div></div>
        <Button variant="secondary" className="mt-5 w-full min-h-[56px]" disabled={!action.trim()} onClick={confirmCompass}>{confirmed ? 'My Compass is saved' : 'Make this my Compass'}</Button>{confirmed && <Button variant="link" className="w-full mt-2" onClick={() => navigate('/launch/compass')}>Open My Compass</Button>}
      </article>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-launch-gold/30 bg-launch-cream p-5"><h3 className="font-semibold text-launch-ink">Included now, free</h3><ul className="mt-3 space-y-2 text-sm text-launch-ink/75">{['My full snapshot and eight-part picture', 'One complete key insight and why', 'One strength and one action I choose', 'My best-time suggestion', 'Revisit this snapshot'].map((line) => <li key={line} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-launch-teal" />{line}</li>)}</ul></div>
        <div className="rounded-lg border border-launch-gold/30 bg-launch-cream p-5"><h3 className="font-semibold text-launch-ink">Membership helps me put it into practice</h3><ul className="mt-3 space-y-2 text-sm text-launch-ink/75">{['My complete personalized plan', 'Dates, reminders and calendar follow-through', 'Memory Bridge and optional Support Circle', 'Planned reviews and adaptations over time'].map((line) => <li key={line} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-launch-ember" />{line}</li>)}</ul></div>
      </div>
      <div className="mt-5 rounded-lg bg-launch-ink p-5 text-launch-ivory"><p className="font-semibold">Founding Member: £{foundingMemberConfig.currentPrice.monthly.toFixed(0)}/month for life while my subscription remains active.</p><p className="mt-1 text-sm text-launch-ivory/75">Regular price £{foundingMemberConfig.regularPrice.monthly.toFixed(0)}/month. 7-day free trial; card required. Cancel before the trial ends to avoid being charged.</p><div className="mt-4 flex flex-col sm:flex-row gap-2"><Button variant="action" onClick={() => navigate('/launch/payment')}>See membership options</Button><Button variant="outline" className="border-launch-gold text-launch-ivory hover:bg-launch-ivory/10" onClick={() => navigate('/launch/home')}>Continue with my free snapshot</Button></div></div>
    </section>
  );
}