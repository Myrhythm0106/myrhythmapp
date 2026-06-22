import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  getAssessmentBank,
  resolveHasSupport,
  computeBrainHealthScore,
  normalizeAnswer,
  PERSONA_LABEL,
  type AssessmentAnswer,
  type PersonaKey,
} from '@/data/launchAssessmentBanks';

type AnswerMap = Record<string, AssessmentAnswer>;

const PROGRESS_KEY = 'myrhythm_assessment_progress';

type StoredProgress = {
  persona: PersonaKey | null;
  currentQuestion: number;
  answers: AnswerMap;
};

function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const answersIn = parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {};
    const answers: AnswerMap = {};
    for (const k of Object.keys(answersIn)) {
      const n = normalizeAnswer(answersIn[k]);
      if (n) answers[k] = n;
    }
    return {
      persona: parsed.persona ?? null,
      currentQuestion: Number.isFinite(parsed.currentQuestion) ? parsed.currentQuestion : 0,
      answers,
    };
  } catch {
    return null;
  }
}

export default function LaunchAssessment() {
  const navigate = useNavigate();
  const initial = useMemo(() => loadProgress(), []);
  const [persona, setPersona] = useState<PersonaKey | null>(initial?.persona ?? null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(initial?.currentQuestion ?? 0);
  const [answers, setAnswers] = useState<AnswerMap>(initial?.answers ?? {});

  // Resolve persona from stored user-type; only update if it actually changed.
  useEffect(() => {
    const stored = localStorage.getItem('myrhythm_user_type');
    const bank = getAssessmentBank(stored);
    if (!bank) {
      navigate('/launch/user-type', { replace: true });
      return;
    }
    setPersona((prev) => (prev === bank.persona ? prev : bank.persona));
  }, [navigate]);

  const bank = useMemo(() => getAssessmentBank(persona), [persona]);

  // Persist in-progress assessment to a dedicated key so remounts don't reset progress.
  useEffect(() => {
    if (!persona) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ persona, currentQuestion, answers, updatedAt: Date.now() })
      );
    } catch {/* noop */}
  }, [persona, currentQuestion, answers]);

  if (!bank) return null;


  const questions = bank.questions;
  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const current: AssessmentAnswer = answers[question.id] ?? { primary: '', alsoFits: [] };

  const setPrimary = (value: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (existing.primary === value) return prev;
      let alsoFits = existing.alsoFits.filter((v) => v !== value);
      if (existing.primary && existing.primary !== value) {
        if (!alsoFits.includes(existing.primary)) alsoFits = [existing.primary, ...alsoFits];
        toast("Switched primary — your earlier pick is kept as 'also fits'.", { duration: 2200 });
      }
      return { ...prev, [question.id]: { primary: value, alsoFits } };
    });
  };

  const toggleAlsoFits = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (!existing.primary) {
        // No primary yet — promote this tap to primary instead.
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      }
      if (value === existing.primary) return prev;
      const has = existing.alsoFits.includes(value);
      const alsoFits = has
        ? existing.alsoFits.filter((v) => v !== value)
        : [...existing.alsoFits, value];
      return { ...prev, [question.id]: { ...existing, alsoFits } };
    });
  };

  const canContinue = !!current.primary;

  const handleNext = () => {
    if (!isLast) {
      setCurrentQuestion((p) => p + 1);
      return;
    }
    const brainHealthScore = computeBrainHealthScore(bank, answers);
    const combined = (id: string) => {
      const a = answers[id];
      return a ? [a.primary, ...a.alsoFits] : [];
    };
    const primaryOf = (id: string) => answers[id]?.primary ?? '';
    const results = {
      userType: persona,
      // Full answer shape per letter (primary + alsoFits).
      answers,
      // Per-letter convenience: primary value (back-compat).
      mindset: primaryOf('mindset'),
      yesReality: primaryOf('yesReality'),
      rhythm: primaryOf('rhythm'),
      harnessSupport: primaryOf('harnessSupport'),
      yourVictories: combined('yourVictories'),
      transform: combined('transform'),
      heal: primaryOf('heal'),
      multiply: primaryOf('multiply'),
      // Legacy derived fields.
      rhythmPreference: primaryOf('rhythm'),
      keyStruggles: combined('transform'),
      goals: combined('yourVictories'),
      hasSupport: resolveHasSupport(primaryOf('harnessSupport')),
      brainHealthScore,
    };
    localStorage.setItem(
      'myrhythm_launch_mode',
      JSON.stringify({
        isLaunchMode: true,
        assessmentCompleted: true,
        assessmentResults: results,
        brainHealthScore,
        lastViewedWhatsNew: null,
        purchasedFeatures: [],
      })
    );
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate('/launch/welcome'), 500);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else navigate('/launch/user-type');
  };



  return (
    <LaunchLayout>
      <div className="max-w-md mx-auto w-full">
        <p className="text-xs text-brain-health-500 mb-4 -mt-2">
          {PERSONA_LABEL[bank.persona]}
        </p>

        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Letter {currentQuestion + 1} of {questions.length} · MYRHYTHM
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-orange-500 text-white font-bold text-lg shadow-sm"
          >
            {question.letter}
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase text-gray-700">
            {question.word}
          </span>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h2>
          {question.subtitle && <p className="text-gray-600">{question.subtitle}</p>}
          <p className="text-xs italic text-brain-health-600 mt-3">
            Brain-health lens: {question.brainHealthLens}
          </p>
        </div>

        <p className="text-sm text-gray-600 text-center mb-4 px-2">
          Pick the one that fits best. Tap <span className="font-semibold">+ Also fits</span> on any others that also feel true — there are no wrong answers.
        </p>

        <div className="space-y-3 pb-4">
          {question.options.map((option) => {
            const isPrimary = current.primary === option.value;
            const isAlso = current.alsoFits.includes(option.value);
            return (
              <div
                key={option.value}
                role="button"
                tabIndex={0}
                onClick={() => setPrimary(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPrimary(option.value); }
                }}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] cursor-pointer',
                  isPrimary
                    ? 'border-brand-orange-500 bg-brand-orange-50 ring-2 ring-brand-orange-200'
                    : isAlso
                      ? 'border-brand-teal-400 bg-brand-teal-50/60'
                      : 'border-gray-200 bg-white hover:border-brand-emerald-200'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                      isPrimary
                        ? 'border-brand-orange-500 bg-brand-orange-500'
                        : isAlso
                          ? 'border-brand-teal-500 bg-brand-teal-500'
                          : 'border-gray-300'
                    )}
                  >
                    {(isPrimary || isAlso) && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      {isPrimary && (
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-brand-orange-500 text-white">
                          Primary
                        </span>
                      )}
                      {isAlso && !isPrimary && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-brand-teal-100 text-brand-teal-800">
                          Also fits
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={(e) => toggleAlsoFits(option.value, e)}
                      className={cn(
                        'shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border transition-colors min-h-[36px]',
                        isAlso
                          ? 'border-brand-teal-500 bg-white text-brand-teal-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-brand-teal-400 hover:text-brand-teal-700'
                      )}
                      aria-pressed={isAlso}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {isAlso ? 'Also fits' : 'Also fits'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2 pb-8">
          <LaunchButton variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="h-5 w-5" />
            Back
          </LaunchButton>
          <LaunchButton onClick={handleNext} disabled={!canContinue} className="flex-1">
            {isLast ? 'Complete' : 'Continue'}
            <ArrowRight className="h-5 w-5" />
          </LaunchButton>
        </div>
      </div>
    </LaunchLayout>
  );
}
