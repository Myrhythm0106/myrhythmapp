import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, clearActs, REMINDER_LABEL, saveActs, smartReminderDefaults, type PrototypeAct } from '@/prototype/prototypeStore';
import { loadAssessmentProfile, windowLabel } from '@/prototype/prototypeAssessment';
import { loadCircle, initials } from '@/prototype/prototypeSupportCircle';
import { ensureFullDemo } from '@/prototype/prototypeDemoSeed';
import { DemoDataPill } from '@/prototype/DemoDataPill';
import { CircleRail } from '@/prototype/CircleRail';
import { CheckCircle2, Calendar, Users, RotateCcw, BellRing, Download, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PrototypeDone() {
  const navigate = useNavigate();
  const [acts, setActs] = useState<PrototypeAct[]>([]);
  useEffect(() => {
    ensureFullDemo();
    const all = loadActs();
    const promoted = all.map(a => a.status !== 'rejected'
      ? { ...a, status: 'scheduled' as const, reminders: a.reminders?.length ? a.reminders : smartReminderDefaults(a) }
      : a);
    saveActs(promoted);
    setActs(promoted.filter(a => a.status === 'scheduled'));
  }, []);
  const profile = loadAssessmentProfile();
  const circle = loadCircle();
  const cardRef = useRef<HTMLDivElement>(null);

  const totalInvites = acts.reduce((n, a) => n + (a.attendees?.length || 0), 0);
  const totalReminders = acts.reduce((n, a) => n + (a.reminders?.length || 0), 0);

  // Payoff metrics — derived from the user's actual rhythm
  const hourOf = (t?: string) => t ? parseInt(t.slice(0, 2), 10) : 12;
  const bestHours = profile ? bestHourRange(profile.bestFocusWindow) : [9, 11];
  const lowHours = profile ? bestHourRange(profile.lowEnergyWindow) : [14, 16];
  const placedInBest = acts.filter(a => {
    const h = hourOf(a.proposedTime);
    return h >= bestHours[0] && h < bestHours[1];
  }).length;
  const protectedFromDip = acts.filter(a => {
    const h = hourOf(a.proposedTime);
    return !(h >= lowHours[0] && h < lowHours[1]);
  }).length;

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

  const saveMyWeek = async () => {
    const el = cardRef.current;
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-rhythm-week-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      toast.success('Saved to your downloads');
    } catch {
      toast.error('Could not save the image — try again');
    }
  };

  return (
    <PrototypeLayout>
      <DemoDataPill />
      <CircleRail />
      <div className="mb-8">
        <div className="inline-flex w-12 h-12 rounded-full bg-slate-900 items-center justify-center text-white mb-5">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Your week, transformed.
        </h1>
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">
          One conversation in. A whole week structured around how your brain actually shows up —
          and the people standing with you.
        </p>
      </div>

      {/* The keepable artifact — Week on a Page */}
      <div
        ref={cardRef}
        className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-white to-slate-50 p-6 mb-4"
      >
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">MyRhythm · Week on a Page</div>
            <div className="text-lg font-semibold text-slate-900 mt-0.5">
              {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-slate-400" />
        </div>

        {/* Vision strip */}
        <div className="rounded-lg bg-slate-900 text-white px-4 py-3 mb-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">My vision</div>
          <div className="text-sm font-medium leading-snug mt-0.5">
            Live with more ease, and follow through on what matters.
          </div>
        </div>

        {/* The four big numbers */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Stat n={acts.length} label="actions captured" sub="in under 90 seconds" />
          <Stat n={placedInBest} label="in your best window" sub={profile ? windowLabel(profile.bestFocusWindow) : 'late morning'} accent />
          <Stat n={protectedFromDip} label="protected from your dip" sub={profile ? windowLabel(profile.lowEnergyWindow) : 'afternoon'} />
          <Stat n={totalInvites} label="people looped in" sub={circle.length > 0 ? `from your circle of ${circle.length}` : 'add your circle anytime'} />
        </div>

        {/* Action list compact */}
        <div className="rounded-lg bg-white border border-slate-200 p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-2">This week's commitments</div>
          <ul className="space-y-1.5">
            {acts.slice(0, 6).map(a => (
              <li key={a.id} className="flex items-start gap-2 text-[12px]">
                <CheckCircle2 className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-900">{a.text}</span>
                  <span className="text-slate-400"> · {a.proposedDate} {a.proposedTime}</span>
                  {a.attendees && a.attendees.length > 0 && (
                    <span className="ml-1 inline-flex gap-0.5">
                      {a.attendees.map(n => (
                        <span key={n} className="inline-flex w-4 h-4 rounded-full bg-slate-900 text-white text-[8px] font-semibold items-center justify-center">
                          {initials(n)}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-[9px] text-slate-400 text-center mt-3 leading-relaxed">
          MyRhythm · Not a medical device · Does not diagnose, treat, or cure any condition
        </div>
      </div>

      <button
        onClick={saveMyWeek}
        className="w-full mb-3 min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" /> Save my week (PNG)
      </button>

      <button
        onClick={testReminder}
        className="w-full mb-3 min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <BellRing className="w-4 h-4" /> Test a reminder now
      </button>

      {/* Streak seed */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-6 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">Day 1 of your rhythm</div>
          <div className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
            Day 7 unlocks your first weekly review — what you protected, what you completed, what to adjust.
          </div>
        </div>
      </div>

      {/* Mocked circle preview */}
      {circle.length > 0 && totalInvites > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Your circle will know
          </div>
          {acts.filter(a => (a.attendees || []).length > 0).slice(0, 3).map(a => (
            <div key={a.id} className="text-[12px] text-slate-700 leading-relaxed mb-1">
              <span className="font-medium">{a.attendees![0]}</span> will get a heads-up 10 min before{' '}
              <span className="text-slate-500">"{a.text}"</span> at {a.proposedTime}.
            </div>
          ))}
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Prototype — no real messages are sent.
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-8">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">In your diary · full detail</div>
        <ul className="space-y-2.5">
          {acts.map(a => (
            <li key={a.id} className="flex items-start gap-3 text-sm">
              <Calendar className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
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
        className="w-full min-h-[56px] rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-slate-800 font-medium flex items-center justify-center gap-2 transition-colors"
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

interface StatProps { n: number; label: string; sub: string; accent?: boolean; }
function Stat({ n, label, sub, accent }: StatProps) {
  return (
    <div className={`rounded-lg p-3 ${accent ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'}`}>
      <div className={`text-3xl font-semibold tabular-nums leading-none ${accent ? 'text-white' : 'text-slate-900'}`}>{n}</div>
      <div className={`text-[11px] font-medium mt-1.5 ${accent ? 'text-slate-200' : 'text-slate-900'}`}>{label}</div>
      <div className={`text-[10px] mt-0.5 ${accent ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</div>
    </div>
  );
}

// helper: same windows as scheduler
function bestHourRange(w: string): [number, number] {
  switch (w) {
    case 'early_morning': return [7, 9];
    case 'late_morning':  return [9, 11];
    case 'afternoon':     return [13, 16];
    case 'evening':       return [17, 19];
    default:              return [9, 11];
  }
}
