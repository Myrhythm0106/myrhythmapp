import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { Mic, ListChecks, CalendarClock, Users, ArrowRight } from 'lucide-react';

export default function PrototypeLanding() {
  const navigate = useNavigate();

  return (
    <PrototypeLayout>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-[40px] leading-[1.1] font-semibold text-slate-900 tracking-tight">
          Your personal assistant<br className="hidden sm:block" />
          after a brain injury.
        </h1>
        <p className="mt-4 text-[15px] text-slate-600 max-w-xl leading-relaxed">
          Record a conversation. We extract the actions, propose times in your diary,
          and invite the right people — so nothing falls through the cracks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          { icon: Mic, label: 'Capture', desc: 'Record any meeting or conversation.' },
          { icon: ListChecks, label: 'Commit', desc: 'AI pulls out actions, commitments, tasks.' },
          { icon: CalendarClock, label: 'Calibrate', desc: 'Proposed times honour your energy.' },
          { icon: Users, label: 'Celebrate', desc: 'Right people added automatically.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
            <Icon className="w-[18px] h-[18px] text-slate-500 mb-2" />
            <div className="font-semibold text-slate-900 text-sm">{label}</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
        Held together by Cognitive Continuity — your rhythm, your context, your circle, carried forward.
      </p>

      <button
        onClick={() => navigate('/prototype/capture')}
        className="w-full min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base inline-flex items-center justify-center gap-2 transition-colors"
      >
        Start the assistant loop
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        Runs alongside the full app. Visit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/launch/home</code> any time.
      </p>
    </PrototypeLayout>
  );
}
