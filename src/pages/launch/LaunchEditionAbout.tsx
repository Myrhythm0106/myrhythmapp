import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock3, MessageCircle } from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { EditionBadge } from '@/components/launch/EditionBadge';
import { FeedbackDialog } from '@/components/launch/FeedbackDialog';
import { EDITION_NAME, EDITION_VERSION, EDITION_TAGLINE } from '@/config/edition';
import {
  APP_DESCRIPTION_INCLUSIVE,
  MEMORY_FIRST_DESIGN_EXPLAINER,
} from '@/config/appDescription';

const LIVE = [
  '4C loop — Capture, Commit, Calibrate, Celebrate',
  'Smart Schedule with energy badges',
  'Memory Bridge recorder (30-day retention)',
  'Support Circle with granular permissions',
  'Record-on-behalf for trusted Anchors (OFF by default)',
  'Clinical Export PDF — share with your clinician',
  'GDPR Data Export — download everything we hold',
  'Vision Board, Assessment, persona-tailored onboarding',
  'Google Calendar & Outlook sync',
  'MFA, RLS, Vault security baseline',
];

const NEXT = [
  'Weekly Anchor digest (G5)',
  'Formal WCAG 2.2 AA certification (baseline already in place)',
  'Mid-journey persona switcher',
  'Backend hardening for record-on-behalf (dedicated column + accountability alerts)',
  'Provider Directory marketplace expansion',
];

export default function LaunchEditionAbout() {
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <LaunchLayout showHeader={true}>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 mb-4 min-h-[44px]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <EditionBadge variant="chip" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">{EDITION_NAME}</h1>
        <p className="text-stone-500 text-sm mt-1 italic">{EDITION_TAGLINE}</p>
      </div>

      <div className="space-y-4 pb-24">
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Live in {EDITION_VERSION}</h3>
              <p className="text-xs text-stone-500">What you can use right now</p>
            </div>
          </div>
          <ul className="space-y-2">
            {LIVE.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-700">
                <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </LaunchCard>

        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
              <Clock3 className="h-5 w-5 text-stone-600" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Coming after {EDITION_VERSION}</h3>
              <p className="text-xs text-stone-500">Planned for v1.1, shaped by your feedback</p>
            </div>
          </div>
          <ul className="space-y-2">
            {NEXT.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-700">
                <Clock3 className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </LaunchCard>

        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Help shape the next release</h3>
              <p className="text-xs text-stone-500">Founding-member feedback goes directly to the team</p>
            </div>
          </div>
          <LaunchButton onClick={() => setFeedbackOpen(true)} className="w-full">
            Send feedback
          </LaunchButton>
        </LaunchCard>

        <p className="text-[11px] text-stone-400 leading-relaxed px-2">
          MyRhythm does not diagnose, treat, or cure any condition. It is a daily-life support tool
          that keeps you in control of who can act on your behalf.
        </p>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </LaunchLayout>
  );
}
