import React from 'react';
import { Sparkles, Users, Sun, Moon, Heart } from 'lucide-react';

// Static "Week on a Page" sample shown on the landing.
// Mirrors the visual language of the artifact downloaded from /prototype/done.
export function BrainInjuryWeekSample() {
  return (
    <section className="mb-12">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-4">
        What you'll get — a real week, after one conversation
      </div>

      <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              MyRhythm · Week on a Page
            </div>
            <div className="text-lg font-semibold text-slate-900 mt-0.5">
              A brain-injury rebuild week
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <div className="text-2xl font-semibold tabular-nums leading-none text-slate-900">6</div>
            <div className="text-[11px] font-medium mt-1.5 text-slate-900">actions captured</div>
            <div className="text-[10px] mt-0.5 text-slate-500">in 90 seconds</div>
          </div>
          <div className="rounded-lg bg-slate-900 text-white p-3">
            <div className="text-2xl font-semibold tabular-nums leading-none">3</div>
            <div className="text-[11px] font-medium mt-1.5">in your best window</div>
            <div className="text-[10px] mt-0.5 text-slate-400">late morning</div>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 p-3">
            <div className="text-2xl font-semibold tabular-nums leading-none text-slate-900">2</div>
            <div className="text-[11px] font-medium mt-1.5 text-slate-900">people looped in</div>
            <div className="text-[10px] mt-0.5 text-slate-500">Sarah · Dr. Patel</div>
          </div>
        </div>

        {/* Sample day */}
        <div className="rounded-lg bg-white border border-slate-200 p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-2">
            Tuesday — a day that fits your brain
          </div>
          <ul className="space-y-1.5 text-[12px]">
            <Row time="09:30" icon={Sun}  text="Log symptoms & meds"          tag="homework" tone="slate" />
            <Row time="10:00" icon={Heart} text="Neuro follow-up · Dr. Patel"  tag="shared with circle" tone="amber" />
            <Row time="10:30" icon={Heart} text="Vestibular PT — balance"      tag="best window" tone="emerald" />
            <Row time="14:30" icon={Moon}  text="Protected rest · no screens"  tag="energy dip" tone="slate" />
            <Row time="17:00" icon={Sun}   text="Gentle 15-min walk"           tag="low-load" tone="slate" />
          </ul>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-600">
          <Users className="w-3 h-3" />
          <span>Sarah will get a heads-up 10 min before your 10:00 neuro follow-up.</span>
        </div>

        <div className="text-[9px] text-slate-400 text-center mt-3 leading-relaxed">
          Sample · MyRhythm is not a medical device · Does not diagnose, treat, or cure any condition
        </div>
      </div>
    </section>
  );
}

interface RowProps { time: string; icon: React.ComponentType<{ className?: string }>; text: string; tag: string; tone: 'slate' | 'amber' | 'emerald'; }
function Row({ time, icon: Icon, text, tag, tone }: RowProps) {
  const toneCls = {
    slate:   'bg-slate-100 text-slate-700',
    amber:   'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
  }[tone];
  return (
    <li className="flex items-center gap-2.5">
      <span className="text-[10px] font-mono tabular-nums text-slate-500 w-10">{time}</span>
      <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
      <span className="flex-1 text-slate-900 truncate">{text}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${toneCls}`}>{tag}</span>
    </li>
  );
}
