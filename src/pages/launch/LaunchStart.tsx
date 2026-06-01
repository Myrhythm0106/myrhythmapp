import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { Mic, ListChecks, Flag, Users, ShieldCheck } from 'lucide-react';
import { EditionBadge } from '@/components/launch/EditionBadge';

export default function LaunchStart() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-white to-brand-orange-50">
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight text-brain-health-900">MyRhythm</div>
        <EditionBadge />
      </header>

      <main className="max-w-xl mx-auto px-5 pt-2 pb-24">
        <h1 className="text-3xl md:text-4xl font-bold text-brain-health-900 leading-tight">
          Test MyRhythm in 4 minutes.
        </h1>
        <p className="mt-3 text-base text-brain-health-700">
          Capture a meeting. See actions, decisions and milestones. Schedule one — your way.
        </p>

        <ol className="mt-8 space-y-3">
          {[
            { Icon: Mic, t: 'Record or upload', d: 'One tap from Memory.' },
            { Icon: ListChecks, t: 'See actions & decisions', d: 'Owners, dates and quotes.' },
            { Icon: Flag, t: 'Milestones keep you on track', d: 'Auto checkpoints back from the due date.' },
            { Icon: Users, t: 'Loop in your circle', d: 'Invite or share visibility, with consent.' },
          ].map(({ Icon, t, d }, i) => (
            <li key={i} className="flex gap-3 p-3 rounded-xl bg-white/70 border border-brain-health-100 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-orange-100 text-brand-orange-700 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-brain-health-900">{i + 1}. {t}</div>
                <div className="text-sm text-brain-health-600">{d}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3">
          <LaunchButton
            className="min-h-[56px] text-base"
            onClick={() => navigate('/launch/memory?quick=1')}
          >
            <Mic className="h-5 w-5 mr-2" />
            Start a capture now
          </LaunchButton>
          <button
            onClick={() => navigate('/launch/home')}
            className="text-sm text-brain-health-600 underline-offset-4 hover:underline"
          >
            Open MyRhythm Home
          </button>
        </div>

        <p className="mt-10 flex items-center gap-2 text-xs text-brain-health-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Private by default · 30-day recording retention · Not a medical device.
        </p>
      </main>
    </div>
  );
}
