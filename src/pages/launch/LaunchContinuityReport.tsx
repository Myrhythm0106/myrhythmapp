import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, ChevronLeft, Users, CalendarDays, FileCheck, Activity, HelpCircle } from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { MemoryFirstChip } from '@/components/launch/MemoryFirstChip';
import { useAuth } from '@/hooks/useAuth';
import { useContinuityReport, type WindowDays, type ReportMode } from '@/launch/continuity/useContinuityReport';
import { ContinuityRibbon } from '@/launch/continuity/ContinuityRibbon';
import { downloadContinuityReportPdf } from '@/launch/continuity/continuityReportPdf';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MEMORY_FIRST_DESIGN_TAGLINE } from '@/config/appDescription';

const INK = '#064e3b';
const MOSS = '#0d7a5f';
const GOLD = '#c9a84c';
const CREAM = '#f5f0e0';

const SORA: React.CSSProperties = { fontFamily: "'Sora', sans-serif" };
const MANROPE: React.CSSProperties = { fontFamily: "'Manrope', sans-serif" };

export default function LaunchContinuityReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [windowDays, setWindowDays] = useState<WindowDays>(30);
  const [mode, setMode] = useState<ReportMode>('personal');
  const [memberNote, setMemberNote] = useState('');
  const [showStandards, setShowStandards] = useState(false);

  const { report, loading, startDate, endDate, isEmptyWindow } = useContinuityReport({
    windowDays,
    mode,
    memberNote: memberNote.trim() || undefined,
  });

  const handlePdf = () => {
    if (!report) return;
    try {
      downloadContinuityReportPdf(report);
      toast.success('Continuity report downloaded');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not generate PDF');
    }
  };

  const handleShare = async () => {
    if (!report) return;
    const title = `MyRhythm — ${report.windowDays}-day continuity report`;
    const text = `Follow-through rate: ${Math.round(report.followThroughRate * 100)}%. ${report.completedCount} of ${report.committedTotal} commitments carried through.`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
        toast.success('Copied to clipboard');
      }
    } catch {
      // user cancelled share
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const notYetReached = endDate > today;

  return (
    <LaunchLayout showHeader={true}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16" style={{ color: INK, ...MANROPE }}>
        {/* Back + controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: `${INK}99` }}
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              options={[
                { label: '30 days', value: 30 },
                { label: '60 days', value: 60 },
                { label: '90 days', value: 90 },
              ]}
              value={windowDays}
              onChange={(v) => setWindowDays(v as WindowDays)}
            />
            <SegmentedControl
              options={[
                { label: 'Personal', value: 'personal' },
                { label: 'Clinical', value: 'clinical' },
              ]}
              value={mode}
              onChange={(v) => setMode(v as ReportMode)}
            />
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-sm" style={{ color: `${INK}80` }}>
            Building your continuity report…
          </div>
        ) : notYetReached ? (
          <div className="bg-white shadow-xl border p-8 text-center" style={{ borderColor: `${INK}10` }}>
            <p className="text-lg font-semibold mb-2" style={{ ...SORA }}>
              Day {windowDays} not yet reached
            </p>
            <p className="text-sm" style={{ color: `${INK}80` }}>
              Your report will be ready once you have {windowDays} days of activity. Today is {today}; the window runs {startDate} → {endDate}.
            </p>
          </div>
        ) : report ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full bg-white shadow-2xl border overflow-hidden"
            style={{ borderColor: `${INK}10` }}
          >
            {/* Chip row */}
            <div className="p-6 flex flex-wrap gap-3 items-center bg-[#f5f0e0]/50 border-b" style={{ borderColor: `${INK}05` }}>
              <span className="px-3 py-1 text-[10px] tracking-[0.2em] font-bold uppercase border" style={{ color: INK, borderColor: INK }}>
                {mode === 'personal' ? `My first ${windowDays} days` : `${windowDays}-Day Continuity Report`}
              </span>
              <EditionBadge variant="chip" />
              <MemoryFirstChip />
            </div>

            {/* Hero Snapshot */}
            <div className="relative overflow-hidden p-8 md:p-12" style={{ backgroundColor: INK }}>
              <TopographicLines />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="md:max-w-xs">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: GOLD }}>
                    {mode === 'personal' ? 'Your follow-through rate' : 'Follow-through rate'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-none"
                      style={{ ...SORA, color: CREAM }}
                    >
                      {Math.round(report.followThroughRate * 100)}
                    </span>
                    <span className="text-2xl font-light" style={{ color: `${CREAM}66` }}>
                      /100
                    </span>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed" style={{ color: `${CREAM}99` }}>
                    {report.completedCount} of {report.committedTotal} commitments carried through.
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest" style={{ color: `${CREAM}55` }}>
                    {formatDate(startDate)} → {formatDate(endDate)}
                  </p>
                </div>

                <div className="flex-1">
                  <ContinuityRibbon
                    buckets={report.weekBuckets}
                    baseColor={CREAM}
                    accentColor={GOLD}
                    inkColor={INK}
                  />
                  <p
                    className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] flex items-center gap-2"
                    style={{ color: GOLD }}
                  >
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[9px] tracking-[0.24em]"
                      style={{ backgroundColor: GOLD, color: INK }}
                    >
                      Week by week · tap to reveal
                    </span>
                    <span>Tap a column for the detail →</span>
                  </p>
                </div>
              </div>

              <p
                className="relative z-10 mt-10 text-[10px] uppercase tracking-widest pt-6 border-t italic"
                style={{ color: `${CREAM}55`, borderColor: `${CREAM}1a` }}
              >
                A behaviour and quality-of-life snapshot — not a clinical score.
              </p>
            </div>

            {/* Two-column body */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left: narrative */}
              <div className="md:col-span-7 p-8 md:p-12 border-b md:border-b-0 md:border-r" style={{ borderColor: `${INK}05` }}>
                <h1
                  className="text-3xl md:text-4xl font-bold leading-tight mb-6 uppercase"
                  style={{ ...SORA, color: INK }}
                >
                  {mode === 'personal'
                    ? 'This is how your plan kept going.'
                    : 'Continuity summary for review.'}
                </h1>

                <p className="text-lg leading-relaxed italic mb-8" style={{ color: MOSS }}>
                  {mode === 'personal'
                    ? 'MyRhythm kept what you agreed close to your week — appointments, actions, energy, and the people around you.'
                    : 'This report aligns with the shape of standard post-discharge follow-up documentation without producing a clinical score.'}
                </p>

                {report.topWins.length > 0 && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: GOLD }}>
                      Wins carrying forward
                    </p>
                    <ul className="space-y-3">
                      {report.topWins.map((w, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="text-sm font-bold pt-0.5" style={{ ...SORA, color: GOLD }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-sm font-semibold leading-relaxed" style={{ color: INK }}>
                            {w}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.carryForward.length > 0 && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4" style={{ color: `${INK}66` }}>
                      Still carrying forward
                    </p>
                    <ul className="space-y-2">
                      {report.carryForward.map((c, i) => (
                        <li key={i} className="text-sm" style={{ color: `${INK}cc` }}>
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mode === 'personal' && (
                  <div className="mb-6">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: `${INK}80` }}>
                      What I would like help with
                    </Label>
                    <Textarea
                      value={memberNote}
                      onChange={(e) => setMemberNote(e.target.value)}
                      placeholder="Optional note for the person you share this with…"
                      className="mt-2 min-h-[96px] border-[#064e3b]/20 focus-visible:ring-[#064e3b]"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={handlePdf}
                    className="flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.24em] font-bold transition-colors min-h-[56px]"
                    style={{ backgroundColor: INK, color: CREAM, ...SORA }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MOSS)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = INK)}
                  >
                    <Download className="h-4 w-4" /> Export PDF
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.24em] font-bold transition-colors min-h-[56px] border"
                    style={{ borderColor: INK, color: INK, ...SORA }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${INK}08`)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>

              {/* Right: numbered breakdown rail */}
              <div className="md:col-span-5 p-8 md:p-12" style={{ backgroundColor: `${CREAM}4d` }}>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8" style={{ color: GOLD }}>
                  Breakdown
                </p>
                <div className="space-y-8">
                  <BreakdownItem
                    number="01"
                    icon={<CalendarDays className="h-4 w-4" />}
                    title="Commitments"
                    value={`${report.committedTotal}`}
                    sub={`${report.completedCount} carried through · ${report.partialCount} partial · ${report.notMetCount} not met`}
                  />
                  <BreakdownItem
                    number="02"
                    icon={<Users className="h-4 w-4" />}
                    title="Support Circle"
                    value={`${report.supportCircleSize}`}
                    sub={`${report.actionsWithSupport} actions had someone in the loop`}
                  />
                  <BreakdownItem
                    number="03"
                    icon={<FileCheck className="h-4 w-4" />}
                    title="Agreed items"
                    value={`${report.agreedItems.length}`}
                    sub={`${report.agreedItemsCompleted} completed · ${report.agreedItemsNotMet} not yet met`}
                  />
                  <BreakdownItem
                    number="04"
                    icon={<Activity className="h-4 w-4" />}
                    title="Rhythm"
                    value={`${report.daysActive}`}
                    sub={`active days · ${report.captureCount} captures · ${report.calibrateCount} calibrations`}
                  />
                </div>

                {/* Standards alignment panel — clinical mode or expanded */}
                {(mode === 'clinical' || showStandards) && (
                  <div className="mt-10 pt-6 border-t" style={{ borderColor: `${INK}10` }}>
                    <button
                      onClick={() => setShowStandards(!showStandards)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold mb-4"
                      style={{ color: `${INK}80` }}
                    >
                      <HelpCircle className="h-4 w-4" />
                      How this maps to standards
                    </button>
                    <StandardsPanel />
                  </div>
                )}
              </div>
            </div>

            {/* Footer strip */}
            <div className="px-8 md:px-12 py-8 bg-white border-t" style={{ borderColor: `${INK}05` }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <p
                  className="text-[10px] uppercase tracking-[0.15em] max-w-xl leading-loose"
                  style={{ color: `${INK}66` }}
                >
                  MyRhythm does not diagnose, treat, or cure any condition. It is a daily-life support tool that keeps
                  you in control of who can act on your behalf.
                </p>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                  style={{ color: GOLD }}
                >
                  {MEMORY_FIRST_DESIGN_TAGLINE}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </LaunchLayout>
  );
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: `${INK}15` }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className="px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors min-h-[40px]"
            style={{
              backgroundColor: active ? INK : 'transparent',
              color: active ? CREAM : `${INK}99`,
              ...SORA,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function BreakdownItem({
  number,
  icon,
  title,
  value,
  sub,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-sm font-bold pt-1 shrink-0" style={{ ...SORA, color: GOLD }}>
        {number}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1" style={{ color: `${INK}80` }}>
          {icon}
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">{title}</p>
        </div>
        <p className="text-2xl font-extrabold" style={{ ...SORA, color: INK }}>
          {value}
        </p>
        <p className="text-xs mt-1" style={{ color: `${INK}99` }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function TopographicLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d="M-50 320C100 270 200 370 400 320C600 270 700 370 850 320" stroke={GOLD} strokeWidth="2" />
      <path d="M-50 260C100 210 200 310 400 260C600 210 700 310 850 260" stroke={GOLD} strokeWidth="1.5" />
      <path d="M-50 200C100 150 200 250 400 200C600 150 700 250 850 200" stroke={GOLD} strokeWidth="1" />
      <path d="M-50 140C100 90 200 190 400 140C600 90 700 190 850 140" stroke={GOLD} strokeWidth="0.75" />
      <path d="M-50 80C100 30 200 130 400 80C600 30 700 130 850 80" stroke={GOLD} strokeWidth="0.5" />
    </svg>
  );
}

function StandardsPanel() {
  return (
    <div className="text-xs space-y-3" style={{ color: `${INK}cc` }}>
      <p>
        <strong className="text-[#064e3b]">Goal Attainment Scaling (GAS):</strong> goals reported as met / partially met / not met.
      </p>
      <p>
        <strong className="text-[#064e3b]">UKROC / Rehabilitation Prescription:</strong> discharge goals and what became of them.
      </p>
      <p>
        <strong className="text-[#064e3b]">NICE NG211:</strong> person-set goals, written plan, family involvement.
      </p>
      <p>
        <strong className="text-[#064e3b]">CARF:</strong> post-discharge follow-up, person-defined goals, family participation.
      </p>
      <p className="text-[10px] italic" style={{ color: `${INK}80` }}>
        MyRhythm aligns with the reporting shape of these standards. It does not administer, score, or validate any clinical instrument.
      </p>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
