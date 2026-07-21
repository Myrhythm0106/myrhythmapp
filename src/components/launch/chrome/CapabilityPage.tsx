import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { IconBadge } from '@/components/launch/chrome/IconBadge';
import { KpiCard } from '@/components/launch/chrome/KpiCard';
import { PersonaLensChip } from '@/components/launch/chrome/PersonaLensChip';
import { StageLensChip } from '@/launch/stage/StageLensChip';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';
import { cn } from '@/lib/utils';

type Tone = 'teal' | 'emerald' | 'orange' | 'purple' | 'neutral';

export interface Capability {
  icon: LucideIcon;
  label: string;
  description: string;
}

export interface RhythmStep {
  step: string; // "01"
  title: string;
  description: string;
}

export interface RelatedLink {
  label: string;
  caption?: string;
  to: string;
}

export interface Kpi {
  label: string;
  value: string;
  caption?: string;
}

export interface CapabilityPageProps {
  eyebrow: string;
  title: string;
  lede: string;
  heroIcon: LucideIcon;
  tone?: Tone;
  metaPills?: { label: string; tone?: 'neutral' | 'success' | 'attention' | 'info' }[];
  whyTitle?: string;
  whyParagraphs: string[];
  capabilitiesTitle?: string;
  capabilities: Capability[];
  rhythmTitle?: string;
  rhythmSteps: RhythmStep[];
  kpis: Kpi[];
  relatedTitle?: string;
  related?: RelatedLink[];
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  /** Optional persona-specific framing rendered as a small lens chip under the hero. */
  capabilityKey?: 'capture' | 'commit' | 'calibrate';
  /** Optional content rendered above the "Why it matters" section (e.g. MyRHYTHM-G picker). */
  topSlot?: React.ReactNode;
}

export function CapabilityPage(props: CapabilityPageProps) {
  const navigate = useNavigate();

  const {
    eyebrow,
    title,
    lede,
    heroIcon: HeroIcon,
    tone = 'teal',
    metaPills,
    whyTitle = 'Why it matters',
    whyParagraphs,
    capabilitiesTitle = 'What it does',
    capabilities,
    rhythmTitle = 'How it fits the rhythm',
    rhythmSteps,
    kpis,
    relatedTitle = 'Where it lives',
    related,
    primaryCta = { label: 'Begin 7-day trial', to: '/launch/register' },
    secondaryCta = { label: 'Return overview', to: '/launch' },
    capabilityKey,
    topSlot,
  } = props;

  const { persona } = usePersona();
  const lensText = capabilityKey && persona !== 'recovery'
    ? getPersonaCopy(persona).capabilityLens[capabilityKey]
    : undefined;

  const accentBar =
    tone === 'emerald'
      ? 'bg-launch-gold'
      : tone === 'orange'
      ? 'bg-launch-ember'
      : tone === 'purple'
      ? 'bg-launch-gold'
      : 'bg-launch-gold';

  return (
    <LaunchLayout>
      <LaunchHeroBand eyebrow={eyebrow} title={title} subtitle={lede}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-launch-gold/15 flex items-center justify-center">
            <HeroIcon className="h-5 w-5 text-launch-gold" />
          </div>
          {metaPills?.map((pill) => (
            <span
              key={pill.label}
              className={cn(
                'text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border',
                pill.tone === 'success' && 'bg-launch-gold/10 text-launch-gold border-launch-gold/30',
                pill.tone === 'info' && 'bg-launch-ivory/10 text-launch-ivory border-launch-ivory/30',
                pill.tone === 'attention' && 'bg-launch-ember/10 text-launch-ember border-launch-ember/30',
                (!pill.tone || pill.tone === 'neutral') && 'bg-white/10 text-white/80 border-white/20'
              )}
            >
              {pill.label}
            </span>
          ))}
          {lensText && <PersonaLensChip text={lensText} />}
          <StageLensChip className="ml-2" />
        </div>
      </LaunchHeroBand>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
        {topSlot && <div className="mb-8">{topSlot}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Why it matters */}
            <LaunchCard className="relative overflow-hidden bg-launch-ivory border-launch-gold/30 p-6 md:p-8">
              <span className={`absolute left-0 top-6 bottom-6 w-0.5 ${accentBar}`} aria-hidden />
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold">
                {whyTitle}
              </p>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-launch-ink/90">
                {whyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </LaunchCard>

            {/* Capabilities */}
            <LaunchCard className="bg-launch-ivory border-launch-gold/30 p-6 md:p-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold">
                {capabilitiesTitle}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-launch-ink font-display">
                Six capabilities, working as one.
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {capabilities.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <IconBadge icon={c.icon} tone={tone} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-launch-ink">{c.label}</p>
                      <p className="mt-0.5 text-sm text-launch-ink/70 leading-snug">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </LaunchCard>

            {/* Rhythm fit */}
            <LaunchCard className="bg-launch-ivory border-launch-gold/30 p-6 md:p-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold">
                {rhythmTitle}
              </p>
              <ol className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {rhythmSteps.map((s) => (
                  <li key={s.step} className="border-t border-launch-gold/20 pt-4">
                    <p className="text-xs font-semibold tracking-widest text-launch-gold tabular-nums">
                      {s.step}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-launch-ink">{s.title}</p>
                    <p className="mt-1 text-sm text-launch-ink/70 leading-snug">
                      {s.description}
                    </p>
                  </li>
                ))}
              </ol>
            </LaunchCard>
          </div>

          {/* RIGHT — 4 cols */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {kpis.map((k) => (
                <KpiCard key={k.label} label={k.label} value={k.value} caption={k.caption} />
              ))}
            </div>

            {related && related.length > 0 && (
              <LaunchCard className="bg-launch-ivory border-launch-gold/30 p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold">
                  {relatedTitle}
                </p>
                <ul className="mt-3 divide-y divide-launch-gold/10">
                  {related.map((r) => (
                    <li key={r.to}>
                      <button
                        type="button"
                        onClick={() => navigate(r.to)}
                        className="group w-full flex items-center justify-between gap-3 py-3 text-left hover:bg-launch-gold/5 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <span>
                          <span className="block text-sm font-medium text-launch-ink">
                            {r.label}
                          </span>
                          {r.caption && (
                            <span className="block text-xs text-launch-ink/60 mt-0.5">
                              {r.caption}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-launch-gold/60 group-hover:text-launch-gold transition-colors"
                          strokeWidth={1.75}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </LaunchCard>
            )}
          </aside>
        </div>

        {/* Engagement footer */}
        <LaunchCard className="mt-8 bg-launch-ivory border-launch-gold/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-launch-gold">
                Ready when you are
              </p>
              <p className="mt-2 text-lg font-semibold text-launch-ink font-display">
                Begin a structured 7-day trial. No commitment, cancel anytime.
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-xs text-launch-ink/60">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                Private by default. Your data is yours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(secondaryCta.to)}
                className="rounded-xl border-launch-gold/30 text-launch-ink hover:bg-launch-gold/10"
              >
                {secondaryCta.label}
              </Button>
              <Button
                onClick={() => navigate(primaryCta.to)}
                className="rounded-xl bg-launch-ink hover:bg-launch-ink/90 text-white shadow-none"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-launch-ink/50 border-t border-launch-gold/10 pt-4">
            MyRhythm supports daily structure and reflection. It does not diagnose, treat, or
            replace clinical care. Always consult a qualified professional for medical decisions.
          </p>
        </LaunchCard>
      </div>
    </LaunchLayout>
  );
}
