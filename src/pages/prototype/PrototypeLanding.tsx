import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { Mic, ListChecks, CalendarClock, Users } from 'lucide-react';

export default function PrototypeLanding() {
  const navigate = useNavigate();

  return (
    <PrototypeLayout>
      <div className="text-center mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium tracking-wide uppercase mb-4">
          MVP Prototype
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Your personal assistant <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500">
            after a brain injury.
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
          Record a conversation. We extract the actions, propose times in your diary,
          and invite the right people — so nothing falls through the cracks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {[
          { icon: Mic, label: 'Capture', desc: 'Record any meeting or conversation.' },
          { icon: ListChecks, label: 'Extract', desc: 'AI pulls out actions, commitments, tasks.' },
          { icon: CalendarClock, label: 'Schedule', desc: 'Proposed dates honour your energy.' },
          { icon: Users, label: 'Invite', desc: 'Right people added automatically.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-4">
            <Icon className="w-5 h-5 text-orange-500 mb-2" />
            <div className="font-semibold text-slate-900 text-sm">{label}</div>
            <div className="text-xs text-slate-600 mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/prototype/capture')}
        className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-lg shadow-lg shadow-orange-500/30 transition-all"
      >
        Start the assistant loop →
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        This prototype runs alongside the full app — nothing is deleted.
        Visit <code className="bg-slate-100 px-1.5 py-0.5 rounded">/launch/home</code> any time.
      </p>
    </PrototypeLayout>
  );
}
