import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronDown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  buildExecutiveSummary, rankAreas, readChosenPriorities, saveChosenPriorities,
  type AreaId, type PriorityArea,
} from '@/launch/compass/priorityAreas';

interface Props { answers: Record<string, unknown>; onChosen?: (ids: AreaId[]) => void }

const tone = (l: string) => (l === 'Strong' ? 'text-launch-teal' : l === 'Building' ? 'text-launch-ink' : 'text-launch-ember');
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.22em] text-launch-gold">{children}</p>
);

export function ConsultingReport({ answers, onChosen }: Props) {
  const summary = useMemo(() => buildExecutiveSummary(answers), [answers]);
  const ranked = useMemo(() => rankAreas(answers), [answers]);
  const [chosen, setChosen] = useState<AreaId[]>(() => {
    const saved = readChosenPriorities();
    return saved.length ? saved : [];
  });
  const [order, setOrder] = useState<PriorityArea[]>(ranked);
  const [confirmed, setConfirmed] = useState(() => readChosenPriorities().length > 0);

  const toggle = (id: AreaId) => {
    setConfirmed(false);
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const acceptRecommended = () => {
    const ids = ranked.slice(0, 3).map((a) => a.id);
    setOrder(ranked); setChosen(ids); confirm(ids);
  };
  const confirm = (ids = chosen) => {
    const sorted = order.filter((a) => ids.includes(a.id)).map((a) => a.id);
    saveChosenPriorities(sorted); setConfirmed(true); onChosen?.(sorted);
  };
  const detailAreas = (chosen.length ? order.filter((a) => chosen.includes(a.id)) : ranked.slice(0, 3));

  return (
    <div className="bg-launch-ivory">
      {/* 1. Executive summary */}
      <section aria-labelledby="exec-title" className="bg-launch-ink px-5 py-8 md:px-12 md:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-launch-gold">My snapshot · Executive summary</p>
        <h2 id="exec-title" className="mt-3 max-w-3xl font-display text-2xl font-semibold leading-tight text-launch-cream md:text-4xl">
          {summary.headline}
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {summary.findings.map((f) => (
            <li key={f.word} className="rounded-2xl border border-launch-gold/30 bg-launch-cream p-4">
              <p className="font-display text-xl text-launch-ink">{f.word}</p>
              <p className={`text-sm font-bold ${tone(f.level)}`}>{f.level}</p>
              <p className="mt-2 text-base leading-relaxed text-launch-ink">{f.reason}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-l-4 border-launch-gold bg-launch-cream/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-launch-gold">Biggest opportunity</p>
            <p className="mt-2 text-base font-semibold leading-relaxed text-launch-cream">{summary.opportunity}</p>
          </div>
          <div className="rounded-2xl border-l-4 border-launch-teal bg-launch-cream/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-launch-gold">What could change in 3 weeks</p>
            <ul className="mt-2 space-y-1.5">
              {summary.outcomes.map((o) => (
                <li key={o} className="flex gap-2 text-base text-launch-cream"><Check className="mt-1 h-4 w-4 shrink-0 text-launch-gold" />{o}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-launch-cream/70">
          Based on {summary.answered} answers. The Full Picture adds more for a sharper read. This describes everyday patterns. It is not a test or a diagnosis.
        </p>
      </section>

      {/* 2. Priority areas */}
      <section aria-labelledby="prio-title" className="border-b border-launch-gold/30 px-5 py-8 md:px-12 md:py-10">
        <Eyebrow>My priority areas</Eyebrow>
        <h2 id="prio-title" className="mt-1 font-display text-2xl text-launch-ink md:text-3xl">Here’s where MyRhythm recommends I start. I decide.</h2>
        <p className="mt-2 max-w-2xl text-base text-launch-ink/80">Ranked by impact on my day, then by how quickly I could feel a difference. I can pick up to 3 and put them in my own order.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ol className="space-y-3">
            {order.map((a, i) => {
              const on = chosen.includes(a.id);
              return (
                <li key={a.id} className={`rounded-2xl border-2 p-4 transition-colors ${on ? 'border-launch-teal bg-launch-teal/5' : 'border-launch-gold/30 bg-launch-cream/40'}`}>
                  <div className="flex items-start gap-3">
                    <span className="font-display text-2xl font-bold text-launch-gold">#{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-launch-ink">{a.title}</p>
                        {ranked[0].id === a.id && <span className="rounded-full bg-launch-ink px-2 py-0.5 text-xs font-bold text-launch-cream">Recommended first</span>}
                      </div>
                      <p className="mt-1 text-sm text-launch-ink/70">
                        Impact: <strong className="text-launch-ink">{a.impactLabel}</strong> · {a.quickWin}
                      </p>
                      <p className="mt-1 text-base text-launch-ink/85">{a.reason}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button variant={on ? 'default' : 'outline'} onClick={() => toggle(a.id)} aria-pressed={on}
                      disabled={!on && chosen.length >= 3} className={`min-h-[56px] flex-1 text-base ${on ? 'bg-launch-teal text-primary-foreground hover:bg-launch-teal/90' : 'border-launch-ink/40 text-launch-ink hover:bg-launch-cream hover:text-launch-ink'}`}>
                      {on ? <><Check />Chosen</> : 'Work on this'}
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Move ${a.title} up`} onClick={() => move(i, -1)} disabled={i === 0} className="h-14 w-14"><ArrowUp /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Move ${a.title} down`} onClick={() => move(i, 1)} disabled={i === order.length - 1} className="h-14 w-14"><ArrowDown /></Button>
                  </div>
                </li>
              );
            })}
          </ol>
          <ImpactEffortGrid areas={ranked} chosen={chosen} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="action" className="min-h-[56px] flex-1 text-base" disabled={!chosen.length} onClick={() => confirm()}>
            {confirmed ? <><Check />My priorities are set</> : `Set my ${chosen.length || ''} priorit${chosen.length === 1 ? 'y' : 'ies'}`}
          </Button>
          <Button variant="outline" className="min-h-[56px] flex-1 text-base border-launch-ink/40 text-launch-ink hover:bg-launch-cream hover:text-launch-ink" onClick={acceptRecommended}>Use the recommended top 3</Button>
        </div>
      </section>

      {/* 3. Detail */}
      <section aria-labelledby="detail-title" className="border-b border-launch-gold/30 px-5 py-8 md:px-12 md:py-10">
        <Eyebrow>The detail behind it</Eyebrow>
        <h2 id="detail-title" className="mt-1 font-display text-2xl text-launch-ink md:text-3xl">{chosen.length ? 'My chosen areas' : 'My top 3 areas'}</h2>
        <div className="mt-5 space-y-3">
          {detailAreas.map((a, i) => <AreaDetailCard key={a.id} area={a} defaultOpen={i === 0} />)}
        </div>
      </section>
    </div>
  );
}

function ImpactEffortGrid({ areas, chosen }: { areas: PriorityArea[]; chosen: AreaId[] }) {
  const cells = [
    { k: 'Quick wins', f: (a: PriorityArea) => a.impact >= 2 && a.effort === 1 },
    { k: 'Big moves', f: (a: PriorityArea) => a.impact >= 2 && a.effort > 1 },
    { k: 'Easy extras', f: (a: PriorityArea) => a.impact < 2 && a.effort === 1 },
    { k: 'Later', f: (a: PriorityArea) => a.impact < 2 && a.effort > 1 },
  ];
  return (
    <figure aria-label="Impact and effort map" className="rounded-2xl border border-launch-gold/40 bg-launch-cream/40 p-4">
      <figcaption className="text-sm font-bold text-launch-ink">Impact vs effort</figcaption>
      <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-1.5 text-sm">
        <span />
        <span className="text-center text-xs font-semibold text-launch-ink/60">Easier</span>
        <span className="text-center text-xs font-semibold text-launch-ink/60">Takes longer</span>
        {[0, 2].map((row) => (
          <React.Fragment key={row}>
            <span className="self-center text-xs font-semibold text-launch-ink/60 [writing-mode:vertical-rl] rotate-180">{row === 0 ? 'Higher impact' : 'Lower impact'}</span>
            {[cells[row], cells[row + 1]].map((c) => (
              <div key={c.k} className={`min-h-[110px] rounded-xl p-2 ${c.k === 'Quick wins' ? 'bg-launch-teal/15' : 'bg-launch-ivory'}`}>
                <p className="text-xs font-bold uppercase tracking-wide text-launch-ink/70">{c.k}</p>
                <ul className="mt-1 space-y-1">
                  {areas.filter(c.f).map((a) => (
                    <li key={a.id} className={`leading-snug ${chosen.includes(a.id) ? 'font-bold text-launch-teal' : 'text-launch-ink'}`}>{a.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </figure>
  );
}

function AreaDetailCard({ area, defaultOpen }: { area: PriorityArea; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-launch-gold/40 bg-launch-cream/30">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-lg font-semibold text-launch-ink">
        {area.title}
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="grid gap-4 px-4 pb-5 md:grid-cols-3">
        <div>
          <p className="text-sm font-bold text-launch-ink">What I told MyRhythm</p>
          <ul className="mt-2 space-y-2">
            {area.quotes.length ? area.quotes.map((q) => <li key={q} className="text-base italic text-launch-ink/80">{q}</li>)
              : <li className="text-base text-launch-ink/70">The Full Picture questions will sharpen this area.</li>}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-launch-ink">What this usually means day to day</p>
          <p className="mt-2 text-base text-launch-ink/85">{area.meaning}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-launch-ink">What MyRhythm will do</p>
          <ul className="mt-2 space-y-1.5">
            {area.actions.map((x) => <li key={x} className="flex gap-2 text-base text-launch-ink"><Check className="mt-1 h-4 w-4 shrink-0 text-launch-teal" />{x}</li>)}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-dashed border-launch-gold/60 p-4 md:col-span-3">
          <p className="flex items-center gap-2 text-sm font-bold text-launch-ink"><Lock className="h-4 w-4" />My 3-week plan for this area · included with membership</p>
          <ul aria-hidden="true" className="mt-2 select-none space-y-1 text-base text-launch-ink blur-[3px]">
            {area.memberPlan.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </div>
    </details>
  );
}
