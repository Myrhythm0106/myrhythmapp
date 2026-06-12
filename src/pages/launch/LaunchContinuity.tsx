import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, FileJson, Shield } from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useContinuityThread } from '@/launch/continuity/useContinuityThread';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { buildContinuitySummary } from '@/launch/continuity/buildContinuitySummary';
import {
  downloadContinuitySummaryPdf,
  downloadContinuitySummaryJson,
} from '@/launch/continuity/continuitySummaryPdf';
import { toast } from 'sonner';

export default function LaunchContinuity() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history } = useContinuityThread();
  const { members } = useSupportCircle();

  const [includeVision, setIncludeVision] = useState(true);
  const [includePriorities, setIncludePriorities] = useState(true);
  const [includeWins, setIncludeWins] = useState(true);
  const [includeSupportCircle, setIncludeSupportCircle] = useState(true);
  const [includeContactDetails, setIncludeContactDetails] = useState(false);

  const summary = useMemo(() => {
    let vision: string | undefined;
    let topPriorities: string[] = [];
    try {
      vision = includeVision
        ? localStorage.getItem('myrhythm_vision_statement') ?? undefined
        : undefined;
      if (includePriorities) {
        const raw = localStorage.getItem('myrhythm_top_priorities');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) topPriorities = parsed.slice(0, 3);
        }
      }
    } catch {
      /* noop */
    }

    return buildContinuitySummary({
      userName: user?.email?.split('@')[0] ?? 'MyRhythm User',
      threads: history,
      vision,
      topPriorities,
      supportCircle: includeSupportCircle
        ? members.map(m => ({ name: m.name, role: 'Support circle' }))
        : [],
      includeContactDetails,
    });
  }, [user, history, members, includeVision, includePriorities, includeSupportCircle, includeContactDetails]);

  const handlePdf = () => {
    try {
      downloadContinuitySummaryPdf(summary);
      toast.success('Continuity summary downloaded');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not generate PDF');
    }
  };

  const handleJson = () => {
    try {
      downloadContinuitySummaryJson(summary);
      toast.success('JSON downloaded');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not generate JSON');
    }
  };

  return (
    <LaunchLayout showHeader={true}>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4">
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Continuity summary</h1>
        <p className="text-gray-500 text-sm mt-1">
          A life-readiness snapshot for handoff — to a new clinician, therapist, employer, or caregiver.
          Not a medical record.
        </p>
      </div>

      <div className="space-y-4 pb-24">
        <LaunchCard>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What to include</h3>
              <p className="text-xs text-gray-500">You control what leaves the app.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Current vision', checked: includeVision, set: setIncludeVision },
              { label: 'Top priorities', checked: includePriorities, set: setIncludePriorities },
              { label: 'Recent wins', checked: includeWins, set: setIncludeWins },
              { label: 'Support circle (names + roles)', checked: includeSupportCircle, set: setIncludeSupportCircle },
              { label: 'Include their contact details', checked: includeContactDetails, set: setIncludeContactDetails },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <Label className="text-sm text-gray-900">{row.label}</Label>
                <Switch checked={row.checked} onCheckedChange={row.set} />
              </div>
            ))}
          </div>
        </LaunchCard>

        <LaunchCard>
          <h3 className="font-semibold text-gray-900 mb-3">Preview</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div><span className="text-gray-500">Period:</span> {summary.periodLabel}</div>
            {summary.vision && <div><span className="text-gray-500">Vision:</span> {summary.vision}</div>}
            {summary.topPriorities.length > 0 && (
              <div>
                <span className="text-gray-500">Priorities:</span>{' '}
                {summary.topPriorities.join(' · ')}
              </div>
            )}
            {summary.personaMix.length > 0 && (
              <div>
                <span className="text-gray-500">Mode mix:</span>{' '}
                {summary.personaMix.map(m => `${m.label} ${m.pct}%`).join(' · ')}
              </div>
            )}
            {includeWins && summary.topWins.length > 0 && (
              <div>
                <span className="text-gray-500">Wins:</span> {summary.topWins.join(' · ')}
              </div>
            )}
            {summary.carryForward.length > 0 && (
              <div>
                <span className="text-gray-500">Carrying forward:</span>{' '}
                {summary.carryForward.join(' · ')}
              </div>
            )}
            {summary.supportCircle.length > 0 && (
              <div>
                <span className="text-gray-500">Support circle:</span>{' '}
                {summary.supportCircle.map(s => s.name).join(', ')}
              </div>
            )}
          </div>
        </LaunchCard>

        <div className="grid grid-cols-2 gap-3">
          <LaunchButton onClick={handlePdf} className="min-h-[56px]">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </LaunchButton>
          <LaunchButton onClick={handleJson} variant="secondary" className="min-h-[56px]">
            <FileJson className="h-4 w-4 mr-2" /> Download JSON
          </LaunchButton>
        </div>

        <p className="text-[11px] text-gray-500 italic px-1">
          MyRhythm does not diagnose, treat, or cure any condition. This summary reflects what you logged.
        </p>
      </div>
    </LaunchLayout>
  );
}
