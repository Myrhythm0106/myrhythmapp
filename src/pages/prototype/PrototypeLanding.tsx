import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { BrainInjuryWeekSample } from '@/prototype/BrainInjuryWeekSample';
import {
  Mic, ListChecks, CalendarClock, Users, ArrowRight, Sparkles,
  Brain, HeartPulse, Clock, ShieldCheck, Target, Sunrise,
} from 'lucide-react';

export default function PrototypeLanding() {
  const navigate = useNavigate();

  return (
    <PrototypeLayout>
      {/* HERO */}
      <section className="mb-12">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-4 px-2.5 py-1 rounded-full bg-slate-100">
          <Sparkles className="w-3 h-3" />
          Built first with brain-injury survivors — and the people who love them
        </div>
        <h1 className="text-4xl sm:text-[52px] leading-[1.05] font-semibold text-slate-900 tracking-tight">
          Bridge the discharge cliff.<br />
          <span className="text-slate-500">Find your rhythm again.</span>
        </h1>
        <p className="mt-5 text-[17px] text-slate-700 max-w-xl leading-relaxed">
          After stroke, TBI, concussion or surgery, every conversation matters — and every one
          slips. MyRhythm captures the appointment, the homework, the symptom log, places each
          one in your sharpest brain-window, and quietly loops in the people standing with you.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/prototype/assessment')}
            className="min-h-[56px] px-7 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-base inline-flex items-center justify-center gap-2 transition-colors"
          >
            Start my rhythm check
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/prototype/capture')}
            className="min-h-[56px] px-7 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 font-medium text-base inline-flex items-center justify-center gap-2 transition-colors"
          >
            Skip to the live demo
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 90-second rhythm check</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Nothing stored, no signup</span>
          <span className="inline-flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> Works with how your brain actually shows up</span>
        </div>
      </section>

      {/* PAIN -> RELIEF */}
      <section className="mb-12">
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">If any of this sounds familiar…</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { from: 'Conversations slip away the moment they end.',
              to: 'Every action is captured the first time.' },
            { from: 'Your week feels heavier than your energy.',
              to: 'Heavy work lands in your best brain-window.' },
            { from: 'You meant to follow up — and didn\'t.',
              to: 'Reminders show up before the moment matters.' },
            { from: "You feel like you're doing this alone.",
              to: 'Loop in family, friends, or your care team — only when it helps.' },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-[13px] text-slate-500 leading-relaxed">{p.from}</div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[14px] text-slate-900 font-medium leading-snug">
                → {p.to}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAIN-INJURY SAMPLE — keepable artifact preview */}
      <BrainInjuryWeekSample />

      {/* VALUE TILES */}
      <section className="mb-12">
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">What you'll experience in 5 minutes</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Sunrise,       label: 'Personal rhythm check',   sub: '5 quick questions' },
            { icon: Mic,           label: 'Capture a conversation',  sub: 'Voice or sample' },
            { icon: ListChecks,    label: 'Actions extracted',       sub: 'AI does the lifting' },
            { icon: CalendarClock, label: 'Calendar that fits you',  sub: 'Energy-aware slots' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
              <Icon className="w-[18px] h-[18px] text-slate-700 mb-2" />
              <div className="font-semibold text-slate-900 text-[13px] leading-tight">{label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4C LOOP */}
      <section className="mb-12">
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">The 4C rhythm</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Mic,           label: 'Capture',   desc: 'Record meetings, calls, doctor visits, school chats.' },
            { icon: ListChecks,    label: 'Commit',    desc: 'AI pulls out actions, commitments, follow-ups.' },
            { icon: CalendarClock, label: 'Calibrate', desc: 'Each action lands in the right energy window.' },
            { icon: HeartPulse,    label: 'Celebrate', desc: 'See follow-through. Share wins with your circle.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-slate-900 text-sm">{label}</div>
              </div>
              <div className="text-[13px] text-slate-600 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-slate-500 mt-4 leading-relaxed">
          Held together by <strong className="text-slate-700">Cognitive Continuity</strong> — your rhythm,
          your context, your circle, carried forward from one day to the next.
        </p>
      </section>

      {/* VISION CASCADE PREVIEW */}
      <section className="mb-12">
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">Vision → week → day → action</div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="space-y-3">
            {[
              { icon: Target,        tier: 'Vision',  copy: 'Live with more ease, and follow through on what matters.' },
              { icon: CalendarClock, tier: 'Week',    copy: 'Protect energy. Complete the essentials. Stay connected.' },
              { icon: Sunrise,       tier: 'Today',   copy: '2 high-priority actions placed in your best-focus window.' },
              { icon: ListChecks,    tier: 'Action',  copy: 'Call Dr. Patel · Tue 10:00 · reminder 15 min before.' },
            ].map(({ icon: Icon, tier, copy }, i) => (
              <div key={tier} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{tier}</div>
                  <div className="text-[14px] text-slate-900 leading-snug">{copy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 mb-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 mb-2">Ready when you are</div>
        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
          Find your rhythm in 5 minutes.
        </h2>
        <p className="mt-2 text-slate-300 text-[15px] leading-relaxed max-w-md">
          Five quick questions, one captured conversation, one calendar that finally
          works with your brain.
        </p>
        <button
          onClick={() => navigate('/prototype/assessment')}
          className="mt-5 min-h-[56px] px-7 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-base inline-flex items-center justify-center gap-2 transition-colors"
        >
          Start my rhythm check
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <p className="text-xs text-slate-400 text-center">
        Already inside? Visit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/launch/home</code> for the full app.
      </p>
    </PrototypeLayout>
  );
}
