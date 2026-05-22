import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, clearActs, REMINDER_LABEL } from '@/prototype/prototypeStore';
import { CheckCircle2, Calendar, Users, RotateCcw, BellRing } from 'lucide-react';
import { toast } from 'sonner';

export default function PrototypeDone() {
  const navigate = useNavigate();
  const acts = useMemo(() => loadActs().filter(a => a.status === 'scheduled'), []);
  const totalInvites = acts.reduce((n, a) => n + (a.attendees?.length || 0), 0);
  const totalReminders = acts.reduce((n, a) => n + (a.reminders?.length || 0), 0);

  const restart = () => { clearActs(); navigate('/prototype/capture'); };

  const testReminder = () => {
    const first = acts[0];
    if (!first) return;
    toast(`🔔 Reminder: ${first.text}`, {
      description: `${first.proposedDate} at ${first.proposedTime}${first.attendees?.length ? ` · with ${first.attendees.join(', ')}` : ''}`,
      duration: 6000,
      action: { label: 'Done', onClick: () => toast.success('Marked done') },
    });
  };

  return (
    <PrototypeLayout>
      <div className="mb-8">
        <div className="inline-flex w-12 h-12 rounded-full bg-slate-900 items-center justify-center text-white mb-5">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Done. Your assistant handled it.
        </h1>
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">
          You captured a conversation. We did the admin — and we'll nudge you at the right moment.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Calendar className="w-[18px] h-[18px] text-slate-500 mb-2" />
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">{acts.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">scheduled</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <BellRing className="w-[18px] h-[18px] text-slate-500 mb-2" />
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">{totalReminders}</div>
          <div className="text-[11px] text-slate-500 mt-1">reminders</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Users className="w-[18px] h-[18px] text-slate-500 mb-2" />
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">{totalInvites}</div>
          <div className="text-[11px] text-slate-500 mt-1">invited</div>
        </div>
      </div>

      <button
        onClick={testReminder}
        className="w-full mb-6 min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <BellRing className="w-4 h-4" /> Test a reminder now
      </button>


      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-8">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">In your diary</div>
        <ul className="space-y-2.5">
          {acts.map(a => (
            <li key={a.id} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-slate-900">{a.text}</div>
                <div className="text-xs text-slate-500">
                  {a.proposedDate} at {a.proposedTime}
                  {a.attendees && a.attendees.length > 0 && ` · with ${a.attendees.join(', ')}`}
                </div>
                {a.reminders && a.reminders.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {a.reminders.map(r => (
                      <span key={r.id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {REMINDER_LABEL[r.offset]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={restart}
        className="w-full min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Capture another conversation
      </button>

      <button
        onClick={() => navigate('/launch/home')}
        className="w-full mt-3 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm transition-colors"
      >
        Back to the full app
      </button>
    </PrototypeLayout>
  );
}
