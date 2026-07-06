import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mic,
  Target,
  Activity,
  PartyPopper,
  Repeat,
  FileText,
  CheckCircle2,
  Circle,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Button } from '@/components/ui/button';
import { CapabilityHero } from '@/components/launch/chrome/CapabilityHero';
import { IconBadge } from '@/components/launch/chrome/IconBadge';
import { StatusPill } from '@/components/launch/chrome/StatusPill';
import { DISCLAIMER_TEXT } from '@/config/appDescription';
import { buildDischargeHandoverPdf } from '@/utils/clinicalExport';

const STORAGE_KEY = 'discharge_bridge_progress_v1';

type DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface DaySpec {
  day: DayId;
  title: string;
  loopStage: string;
  description: string;
  cta: string;
  ctaRoute: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const DAYS: DaySpec[] = [
  {
    day: 1,
    title: 'Someone knows you\u2019re home',
    loopStage: 'Reconnect',
    description: 'Invite one person to your Support Circle. Just one. Someone who already knows you\u2019re on this path.',
    cta: 'Invite one person',
    ctaRoute: '/launch/support-circle',
    icon: Users,
  },
  {
    day: 2,
    title: 'First capture',
    loopStage: 'Capture',
    description: 'A short voice note or a single line of text. Anything that\u2019s in your head right now.',
    cta: 'Capture something',
    ctaRoute: '/launch/capture',
    icon: Mic,
  },
  {
    day: 3,
    title: 'One thing tomorrow',
    loopStage: 'Commit',
    description: 'Not five. Not the whole week. One thing you can commit to for tomorrow.',
    cta: 'Commit to one thing',
    ctaRoute: '/launch/commit',
    icon: Target,
  },
  {
    day: 4,
    title: 'How did that feel?',
    loopStage: 'Calibrate',
    description: 'Green, amber, or red. That\u2019s the whole check-in. Your rhythm is data.',
    cta: 'Do a Calibrate check-in',
    ctaRoute: '/launch/calibrate',
    icon: Activity,
  },
  {
    day: 5,
    title: 'Share one win',
    loopStage: 'Celebrate',
    description: 'Tell your Support Circle one small thing that went right this week. Small counts.',
    cta: 'Share a win',
    ctaRoute: '/launch/gratitude',
    icon: PartyPopper,
  },
  {
    day: 6,
    title: 'Replay your week',
    loopStage: 'Continuity',
    description: 'Open Memory Bridge. Listen back to one capture. Notice what past-you wanted future-you to know.',
    cta: 'Open Memory Bridge',
    ctaRoute: '/launch/memory-bridge',
    icon: Repeat,
  },
  {
    day: 7,
    title: 'Prepare your handover',
    loopStage: 'Handover',
    description: 'Generate a one-page handover PDF to bring to your first post-discharge appointment.',
    cta: 'Generate handover PDF',
    ctaRoute: '__handover__',
    icon: FileText,
  },
];

function loadProgress(): Record<DayId, boolean> {
  if (typeof window === 'undefined') return {} as Record<DayId, boolean>;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {} as Record<DayId, boolean>;
    return JSON.parse(raw) as Record<DayId, boolean>;
  } catch {
    return {} as Record<DayId, boolean>;
  }
}

function saveProgress(progress: Record<DayId, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* localStorage disabled — v0.1 accepted trade-off */
  }
}

function BridgeBody() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Record<DayId, boolean>>({} as Record<DayId, boolean>);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const toggle = (day: DayId) => {
    const next = { ...progress, [day]: !progress[day] };
    setProgress(next);
    saveProgress(next);
  };

  const handleAction = (spec: DaySpec) => {
    if (spec.ctaRoute === '__handover__') {
      const doc = buildDischargeHandoverPdf({
        patientName: 'Founding Member',
        dischargeDateLabel: new Date().toLocaleDateString('en-GB'),
        supportCircle: [],
        weekPlanItems: DAYS.filter((d) => progress[d.day]).map((d) => `Day ${d.day}: ${d.title}`),
        clinicianName: '',
      });
      doc.save('myrhythm-discharge-handover.pdf');
      return;
    }
    navigate(spec.ctaRoute);
  };

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <CapabilityHero
        eyebrow="Discharge Bridge Kit \u00b7 First 30 days home"
        title="You don\u2019t walk this alone"
        lede="Seven small actions across seven days. Each one takes under two minutes. This is how MyRhythm meets you where discharge leaves off."
        icon={FileText}
        tone="teal"
        meta={[
          { label: `${completedCount} of 7 complete`, tone: completedCount === 7 ? 'success' : 'info' },
          { label: 'Founding Edition', tone: 'neutral' },
          { label: 'Wellness support \u2014 not a medical device', tone: 'neutral' },
        ]}
      />

      <div className="rounded-2xl bg-white border border-brain-health-100 p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brain-health-700">
          Prefer a printed version to hand out on the ward?
        </p>
        <Button
          variant="outline"
          className="rounded-xl border-brain-health-200 text-brain-health-800"
          onClick={() => navigate('/launch/discharge-bridge/handout')}
        >
          <Printer className="h-4 w-4 mr-2" strokeWidth={1.75} />
          Open the printable one-pager
        </Button>
      </div>

      <ol className="space-y-4">
        {DAYS.map((spec) => {
          const Icon = spec.icon;
          const done = !!progress[spec.day];
          return (
            <li
              key={spec.day}
              className={`rounded-2xl border p-6 md:p-7 transition-colors ${
                done ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-brain-health-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <IconBadge icon={Icon} tone={done ? 'emerald' : 'teal'} size="md" />
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-brain-health-500">
                      <span>Day {spec.day}</span>
                      <span aria-hidden="true">\u00b7</span>
                      <StatusPill tone="neutral">{spec.loopStage}</StatusPill>
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-brain-health-900">
                      {spec.title}
                    </h2>
                    <p className="mt-1 text-sm text-brain-health-700 leading-relaxed max-w-xl">
                      {spec.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:min-w-[220px]">
                  <Button
                    className="rounded-xl min-h-[56px] text-base"
                    onClick={() => handleAction(spec)}
                  >
                    {spec.cta}
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggle(spec.day)}
                    className="inline-flex items-center justify-center gap-2 text-sm text-brain-health-600 hover:text-brain-health-900 min-h-[44px]"
                    aria-pressed={done}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                        Marked complete
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" strokeWidth={1.75} />
                        Mark this day complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] leading-relaxed text-brain-health-500 inline-flex items-start gap-2">
        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={1.75} />
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}

export default function LaunchDischargeBridge() {
  return (
    <LaunchLayout>
      <BridgeBody />
    </LaunchLayout>
  );
}
