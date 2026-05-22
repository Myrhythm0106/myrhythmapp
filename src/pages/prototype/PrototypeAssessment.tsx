import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  saveAssessmentProfile, type PrototypePersona, type FocusWindow,
  type SupportStyle, type LoadPattern,
} from '@/prototype/prototypeAssessment';
import { addMember, loadCircle, type CircleRelationship, type CircleRole } from '@/prototype/prototypeSupportCircle';
import { ArrowRight, Sparkles, HeartPulse, Brain, Users, Plus, Check, SkipForward } from 'lucide-react';

type StepId = 'persona' | 'hardest' | 'best' | 'low' | 'support' | 'circle';

interface Choice<T extends string> {
  value: T;
  label: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const PERSONA_CHOICES: Choice<PrototypePersona>[] = [
  { value: 'rebuilding', label: "I'm rebuilding after a brain health event or injury", icon: HeartPulse,
    desc: 'Stroke, TBI, concussion, surgery — finding your rhythm again.' },
  { value: 'managing',   label: "I'm managing daily cognitive load, focus, or fatigue", icon: Brain,
    desc: 'ADHD, Long COVID, MS fog, burnout, executive overload.' },
  { value: 'supporting', label: "I'm supporting someone else", icon: Users,
    desc: 'Family, friend, or care partner staying coordinated.' },
];

const HARDEST_CHOICES: Choice<LoadPattern>[] = [
  { value: 'overwhelm',      label: 'Feeling overwhelmed by everything at once' },
  { value: 'forgetting',     label: 'Forgetting conversations or commitments' },
  { value: 'follow_through', label: 'Starting things but not finishing them' },
  { value: 'fatigue',        label: 'Running out of energy before the day is done' },
];

const WINDOW_CHOICES: Choice<FocusWindow>[] = [
  { value: 'early_morning', label: 'Early morning (7–9)' },
  { value: 'late_morning',  label: 'Late morning (9–11)' },
  { value: 'afternoon',     label: 'Afternoon (1–4)' },
  { value: 'evening',       label: 'Evening (5–7)' },
];

const SUPPORT_CHOICES: Choice<SupportStyle>[] = [
  { value: 'independent',      label: 'Independent — just gentle structure for me' },
  { value: 'gentle_reminders', label: 'Reminders before the moment matters' },
  { value: 'shared_circle',    label: 'Shared with my circle — invite the right people' },
];

export default function PrototypeAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepId>('persona');
  const [persona, setPersona] = useState<PrototypePersona | null>(null);
  const [hardest, setHardest] = useState<LoadPattern | null>(null);
  const [best, setBest] = useState<FocusWindow | null>(null);
  const [low, setLow] = useState<FocusWindow | null>(null);
  const [support, setSupport] = useState<SupportStyle | null>(null);

  const stepIndex = ['persona', 'hardest', 'best', 'low', 'support', 'circle'].indexOf(step) + 1;
  const TOTAL = 6;

  const saveProfile = (sup: SupportStyle) => {
    if (!persona || !hardest || !best || !low) return;
    saveAssessmentProfile({
      persona,
      hardestRightNow: hardest,
      bestFocusWindow: best,
      lowEnergyWindow: low,
      supportStyle: sup,
      recommendedNext: 'capture',
      completedAt: new Date().toISOString(),
    });
  };

  const finish = () => navigate('/prototype/capture');

  const renderStep = () => {
    switch (step) {
      case 'persona':
        return (
          <QuestionBlock
            eyebrow="About you"
            title="What brings you to MyRhythm today?"
            sub="Your answer shapes everything that follows — questions, calendar, tone."
            choices={PERSONA_CHOICES}
            onPick={(v) => { setPersona(v); setStep('hardest'); }}
          />
        );
      case 'hardest':
        return (
          <QuestionBlock
            eyebrow="What feels hardest"
            title="Right now, which one weighs heaviest?"
            sub="There are no wrong answers — pick the one that's costing you most."
            choices={HARDEST_CHOICES}
            onPick={(v) => { setHardest(v); setStep('best'); }}
          />
        );
      case 'best':
        return (
          <QuestionBlock
            eyebrow="Your best brain-window"
            title="When is your thinking sharpest?"
            sub="We'll place your most important actions here automatically."
            choices={WINDOW_CHOICES}
            onPick={(v) => { setBest(v); setStep('low'); }}
          />
        );
      case 'low':
        return (
          <QuestionBlock
            eyebrow="Energy to protect"
            title="When do you usually dip?"
            sub="We'll keep this window light — short tasks or rest, never heavy lifts."
            choices={WINDOW_CHOICES.filter(c => c.value !== best)}
            onPick={(v) => { setLow(v); setStep('support'); }}
          />
        );
      case 'support':
        return (
          <QuestionBlock
            eyebrow="How you like support"
            title="How should the assistant show up?"
            sub="You can change this anytime in settings."
            choices={SUPPORT_CHOICES}
            onPick={(v) => { setSupport(v); finish(v); }}
          />
        );
    }
  };

  return (
    <PrototypeLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
          <Sparkles className="w-3 h-3" />
          Step {stepIndex} of 5 — Rhythm check
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: `${(stepIndex / 5) * 100}%` }}
          />
        </div>
      </div>
      {renderStep()}
      <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed">
        MyRhythm is not a medical device. It does not diagnose, treat, or cure any condition.
      </p>
    </PrototypeLayout>
  );
}

interface QuestionBlockProps<T extends string> {
  eyebrow: string;
  title: string;
  sub?: string;
  choices: Choice<T>[];
  onPick: (v: T) => void;
}

function QuestionBlock<T extends string>({ eyebrow, title, sub, choices, onPick }: QuestionBlockProps<T>) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 mb-2">{eyebrow}</div>
      <h1 className="text-2xl sm:text-3xl leading-tight font-semibold text-slate-900 tracking-tight">{title}</h1>
      {sub && <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{sub}</p>}

      <div className="mt-6 space-y-3">
        {choices.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.value}
              onClick={() => onPick(c.value)}
              className="w-full min-h-[56px] text-left rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 bg-white p-4 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {Icon && (
                  <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-[15px] leading-snug">{c.label}</div>
                  {c.desc && <div className="text-[13px] text-slate-500 mt-1 leading-relaxed">{c.desc}</div>}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 mt-1 flex-shrink-0 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
