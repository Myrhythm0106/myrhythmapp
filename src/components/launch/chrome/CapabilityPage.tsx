import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { CapabilityHero } from '@/components/launch/chrome/CapabilityHero';
import { IconBadge } from '@/components/launch/chrome/IconBadge';
import { KpiCard } from '@/components/launch/chrome/KpiCard';
import { PersonaLensChip } from '@/components/launch/chrome/PersonaLensChip';
import { StageLensChip } from '@/launch/stage/StageLensChip';
import { usePersona } from '@/launch/persona/usePersona';
import { getPersonaCopy } from '@/launch/persona/copy';

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
}

export function CapabilityPage(props: CapabilityPageProps) {
  const navigate = useNavigate();

  const {
    eyebrow,
    title,
    lede,
    heroIcon,
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
  } = props;

  const { persona } = usePersona();
  const lensText = capabilityKey && persona !== 'recovery'
    ? getPersonaCopy(persona).capabilityLens[capabilityKey]
    : undefined;

  const accentBar =
    tone === 'emerald'
      ? 'bg-memory-emerald-600'
      : tone === 'orange'
      ? 'bg-brand-orange-600'
      : tone === 'purple'
      ? 'bg-neural-purple-600'
      : tone === 'neutral'
      ? 'bg-brain-health-600'
      : 'bg-brand-teal-600';

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <BackButton onClick={() => navigate('/launch')} />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-12 md:pb-16">
        <CapabilityHero
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          icon={heroIcon}
          tone={tone}
          meta={metaPills}
        />
        <PersonaLensChip text={lensText} />
        <StageLensChip className="ml-2" />



        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Why it matters */}
            <section className="relative rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8 overflow-hidden">
              <span className={`absolute left-0 top-6 bottom-6 w-0.5 ${accentBar}`} aria-hidden />
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
                {whyTitle}
              </p>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-brain-health-700">
                {whyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {/* Capabilities */}
            <section className="rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
                {capabilitiesTitle}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-brain-health-900">
                Six capabilities, working as one.
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {capabilities.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <IconBadge icon={c.icon} tone={tone} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brain-health-900">{c.label}</p>
                      <p className="mt-0.5 text-sm text-brain-health-600 leading-snug">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Rhythm fit */}
            <section className="rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
                {rhythmTitle}
              </p>
              <ol className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {rhythmSteps.map((s) => (
                  <li key={s.step} className="border-t border-brain-health-100 pt-4">
                    <p className="text-xs font-semibold tracking-widest text-brain-health-400 tabular-nums">
                      {s.step}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-brain-health-900">{s.title}</p>
                    <p className="mt-1 text-sm text-brain-health-600 leading-snug">
                      {s.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* RIGHT — 4 cols */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {kpis.map((k) => (
                <KpiCard key={k.label} label={k.label} value={k.value} caption={k.caption} />
              ))}
            </div>

            {related && related.length > 0 && (
              <div className="rounded-2xl bg-white border border-brain-health-100 p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
                  {relatedTitle}
                </p>
                <ul className="mt-3 divide-y divide-brain-health-100">
                  {related.map((r) => (
                    <li key={r.to}>
                      <button
                        type="button"
                        onClick={() => navigate(r.to)}
                        className="group w-full flex items-center justify-between gap-3 py-3 text-left hover:bg-brain-health-50/60 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <span>
                          <span className="block text-sm font-medium text-brain-health-900">
                            {r.label}
                          </span>
                          {r.caption && (
                            <span className="block text-xs text-brain-health-500 mt-0.5">
                              {r.caption}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-brain-health-400 group-hover:text-brain-health-700 transition-colors"
                          strokeWidth={1.75}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Engagement footer */}
        <section className="mt-10 rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
                Ready when you are
              </p>
              <p className="mt-2 text-lg font-semibold text-brain-health-900">
                Begin a structured 7-day trial. No commitment, cancel anytime.
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-xs text-brain-health-500">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                Private by default. Your data is yours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(secondaryCta.to)}
                className="rounded-xl border-brain-health-200 text-brain-health-800"
              >
                {secondaryCta.label}
              </Button>
              <Button
                onClick={() => navigate(primaryCta.to)}
                className="rounded-xl bg-brand-teal-600 hover:bg-brand-teal-700 text-white shadow-none"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-brain-health-400 border-t border-brain-health-100 pt-4">
            MyRhythm supports daily structure and reflection. It does not diagnose, treat, or
            replace clinical care. Always consult a qualified professional for medical decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
