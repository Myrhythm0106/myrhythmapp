import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  ShieldCheck,
  ArrowUpRight,
  Stethoscope,
  ClipboardList,
  Activity,
  Users,
} from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { TierGate } from '@/components/launch/quiet/TierGate';
import { Button } from '@/components/ui/button';
import { DemoModeProvider } from '@/contexts/DemoModeContext';
import { CapabilityHero } from '@/components/launch/chrome/CapabilityHero';
import { KpiCard } from '@/components/launch/chrome/KpiCard';
import { StatusPill } from '@/components/launch/chrome/StatusPill';
import { IconBadge } from '@/components/launch/chrome/IconBadge';

function BriefBody() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <CapabilityHero
        eyebrow="Bridge pathway · Stage 02"
        title="Clinical Brief"
        lede="A concise, pre-discharge readiness summary designed to bridge the gap between clinical care and life at home."
        icon={FileText}
        tone="teal"
        meta={[
          { label: 'Available on Pro', tone: 'info' },
          { label: 'Privacy: encrypted', tone: 'success' },
          { label: 'PDF export', tone: 'neutral' },
        ]}
      />

      <TierGate required="pro" label="Clinical Brief — unlock with Pro">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <IconBadge icon={Stethoscope} tone="teal" size="sm" />
                <h2 className="text-sm font-semibold tracking-[0.16em] uppercase text-brain-health-500">
                  Patient summary
                </h2>
              </div>
              <p className="mt-4 text-base text-brain-health-900 font-medium">Alex · Bridge Stage 02</p>
              <p className="mt-1 text-sm text-brain-health-600">Ward → Home transition · Day 6 of 14</p>
            </section>

            <section className="rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <IconBadge icon={Activity} tone="purple" size="sm" />
                <h2 className="text-sm font-semibold tracking-[0.16em] uppercase text-brain-health-500">
                  Current rhythm
                </h2>
              </div>
              <p className="mt-4 text-sm text-brain-health-700 leading-relaxed">
                Steady cognitive load at 42% of personal baseline. Seven-day capture streak.
                One active supporter in the circle. Sleep window stable across the past week.
              </p>
            </section>

            <section className="rounded-2xl bg-white border border-brain-health-100 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <IconBadge icon={ClipboardList} tone="emerald" size="sm" />
                <h2 className="text-sm font-semibold tracking-[0.16em] uppercase text-brain-health-500">
                  Life-readiness flags
                </h2>
              </div>
              <ul className="mt-5 divide-y divide-brain-health-100">
                <li className="flex items-center justify-between py-3">
                  <span className="text-sm text-brain-health-800">Morning routine</span>
                  <StatusPill tone="success">Established</StatusPill>
                </li>
                <li className="flex items-center justify-between py-3">
                  <span className="text-sm text-brain-health-800">Medication tracking</span>
                  <StatusPill tone="success">Active</StatusPill>
                </li>
                <li className="flex items-center justify-between py-3">
                  <span className="text-sm text-brain-health-800">Support circle</span>
                  <StatusPill tone="attention">1 of 3 · room to grow</StatusPill>
                </li>
              </ul>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <KpiCard label="Bridge stage" value="02 / 06" caption="Ward → Home" />
            <KpiCard label="Capture streak" value="7 days" caption="Consistent recording" />
            <KpiCard label="Supporters" value="1 / 3" caption="Active in circle" />

            <div className="rounded-2xl bg-white border border-brain-health-100 p-5 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl border-brain-health-200 text-brain-health-800 justify-center"
              >
                <Download className="h-4 w-4 mr-2" strokeWidth={1.75} /> Export PDF (demo)
              </Button>
              <button
                type="button"
                onClick={() => navigate('/launch/support')}
                className="group w-full flex items-center justify-between text-sm text-brain-health-700 hover:text-brain-health-900"
              >
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" strokeWidth={1.75} /> Invite a supporter
                </span>
                <ArrowUpRight className="h-4 w-4 text-brain-health-400 group-hover:text-brain-health-700" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-brain-health-500 px-1 inline-flex items-start gap-2">
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={1.75} />
              This document supports — it does not diagnose, treat, or replace clinical judgement.
            </p>
          </aside>
        </div>
      </TierGate>
    </div>
  );
}

export default function LaunchClinicalBrief() {
  return (
    <LaunchLayout>
      <DemoModeProvider>
        <BriefBody />
      </DemoModeProvider>
    </LaunchLayout>
  );
}
