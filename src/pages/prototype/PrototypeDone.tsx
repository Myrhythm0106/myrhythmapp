import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, clearActs } from '@/prototype/prototypeStore';
import { CheckCircle2, Calendar, Users, RotateCcw } from 'lucide-react';

export default function PrototypeDone() {
  const navigate = useNavigate();
  const acts = useMemo(() => loadActs().filter(a => a.status === 'scheduled'), []);
  const totalInvites = acts.reduce((n, a) => n + (a.attendees?.length || 0), 0);

  const restart = () => {
    clearActs();
    navigate('/prototype/capture');
  };

  return (
    <PrototypeLayout>
      <div className="text-center mb-8">
        <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 items-center justify-center text-white shadow-lg shadow-teal-500/40 mb-5">
          <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Done. Your assistant handled it.
        </h1>
        <p className="mt-3 text-slate-600">
          You captured a conversation. We did the admin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
          <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">{acts.length}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Scheduled</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
          <Users className="w-6 h-6 text-teal-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">{totalInvites}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Invited</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-8">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">In your diary</div>
        <ul className="space-y-2.5">
          {acts.map(a => (
            <li key={a.id} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-slate-900">{a.text}</div>
                <div className="text-xs text-slate-500">
                  {a.proposedDate} at {a.proposedTime}
                  {a.attendees && a.attendees.length > 0 && ` · with ${a.attendees.join(', ')}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={restart}
        className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
      >
        <RotateCcw className="w-5 h-5" /> Capture another conversation
      </button>

      <button
        onClick={() => navigate('/launch/home')}
        className="w-full mt-3 min-h-[44px] rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm transition"
      >
        Back to the full app
      </button>
    </PrototypeLayout>
  );
}
