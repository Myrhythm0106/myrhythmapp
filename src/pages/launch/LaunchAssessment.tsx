import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Textarea } from '@/components/ui/textarea';
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
type FreeformMap = Record<string, string>;

const PROGRESS_KEY = 'myrhythm_assessment_progress';
const NONE_FITS_VALUE = '__none_fits__';

type RecencyValue = 'na' | '0-3m' | '3-12m' | '1-3y' | '3-10y' | '10y+';

const RECENCY_OPTIONS: { value: RecencyValue; label: string; hint?: string }[] = [
  { value: 'na', label: 'Not sure / not applicable', hint: 'No specific event, or you\'d rather not say' },
  { value: '0-3m', label: 'In the last 3 months' },
  { value: '3-12m', label: '3–12 months ago' },
  { value: '1-3y', label: '1–3 years ago' },
  { value: '3-10y', label: '3–10 years ago' },
  { value: '10y+', label: '10+ years ago' },
];

type StoredProgress = {
  persona: PersonaKey | null;
  currentQuestion: number;
  answers: AnswerMap;
  freeform?: FreeformMap;
  eventRecency?: RecencyValue | null;
  phase?: 'recency' | 'questions';
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
      freeform: parsed.freeform && typeof parsed.freeform === 'object' ? parsed.freeform : {},
      eventRecency: parsed.eventRecency ?? null,
      phase: parsed.phase === 'questions' ? 'questions' : 'recency',
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
  const [freeform, setFreeform] = useState<FreeformMap>(initial?.freeform ?? {});
  const [eventRecency, setEventRecency] = useState<RecencyValue | null>(initial?.eventRecency ?? null);
  const [phase, setPhase] = useState<'recency' | 'questions'>(initial?.phase ?? 'recency');

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

  useEffect(() => {
    if (!persona) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          persona,
          currentQuestion,
          answers,
          freeform,
          eventRecency,
          phase,
          updatedAt: Date.now(),
        })
      );
    } catch {/* noop */}
  }, [persona, currentQuestion, answers, freeform, eventRecency, phase]);

  if (!bank) return null;

  /* ------------------- Recency phase ------------------- */
  if (phase === 'recency') {
    return (
      <LaunchLayout>
        <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
          <p className="text-xs text-launch-ink/50 mb-4 -mt-2">
            {PERSONA_LABEL[bank.persona]}
          </p>

          <div className="mb-6">
            <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-launch-moss to-launch-gold transition-all duration-500"
                style={{ width: `6%` }}
              />
            </div>
            <p className="text-xs text-launch-ink/50 mt-2 text-center">
              Before we begin
            </p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">
              When did the experience happen?
            </h2>
            <p className="text-launch-ink/70 text-sm">
              This helps us calibrate today's questions to where you actually are — whether that's last month or fifteen years ago.
            </p>
          </div>

          <div className="space-y-2 pb-4">
            {RECENCY_OPTIONS.map((opt) => {
              const selected = eventRecency === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEventRecency(opt.value)}
                  className={cn(
                    'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-start gap-3',
                    selected
                      ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
                      : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-moss'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 flex-shrink-0',
                      selected
                        ? 'border-launch-ember bg-launch-ember'
                        : 'border-launch-ink/20'
                    )}
                  >
                    {selected && <Check className="h-4 w-4 text-white" />}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-launch-ink">{opt.label}</p>
                    {opt.hint && <p className="text-sm text-launch-ink/60 mt-0.5">{opt.hint}</p>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2 pb-8">
            <LaunchButton
              variant="outline"
              onClick={() => navigate('/launch/user-type')}
              className="flex-1 border-launch-gold/40 text-launch-ink hover:bg-launch-gold/10"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </LaunchButton>
            <LaunchButton
              onClick={() => setPhase('questions')}
              disabled={!eventRecency}
              className="flex-1"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </LaunchButton>
          </div>
        </div>
      </LaunchLayout>
    );
  }

  /* ------------------- Question phase ------------------- */
  const questions = bank.questions;
  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const current: AssessmentAnswer = answers[question.id] ?? { primary: '', alsoFits: [] };
  const isNoneFits = current.primary === NONE_FITS_VALUE;
  const noneNote = freeform[question.id] ?? '';

  const setPrimary = (value: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (existing.primary === value) {
        return { ...prev, [question.id]: { primary: '', alsoFits: existing.alsoFits } };
      }
      // Selecting the "None fits" escape hatch clears any regular alsoFits picks.
      if (value === NONE_FITS_VALUE) {
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      }
      let alsoFits = existing.alsoFits.filter((v) => v !== value && v !== NONE_FITS_VALUE);
      if (existing.primary && existing.primary !== value && existing.primary !== NONE_FITS_VALUE) {
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
      if (existing.primary === NONE_FITS_VALUE) {
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      }
      if (!existing.primary) {
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      }
      if (value === existing.primary) {
        const alsoFits = existing.alsoFits.includes(value)
          ? existing.alsoFits
          : [...existing.alsoFits, value];
        return { ...prev, [question.id]: { primary: '', alsoFits } };
      }
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
      if (!a || a.primary === NONE_FITS_VALUE) return [];
      return [a.primary, ...a.alsoFits];
    };
    const primaryOf = (id: string) => {
      const p = answers[id]?.primary ?? '';
      return p === NONE_FITS_VALUE ? '' : p;
    };
    const noneFitsCount = Object.values(answers).filter(a => a.primary === NONE_FITS_VALUE).length;
    const results = {
      userType: persona,
      answers,
      freeformNotes: freeform,
      eventRecency,
      noneFitsCount,
      mindset: primaryOf('mindset'),
      yesReality: primaryOf('yesReality'),
      rhythm: primaryOf('rhythm'),
      harnessSupport: primaryOf('harnessSupport'),
      yourVictories: combined('yourVictories'),
      transform: combined('transform'),
      heal: primaryOf('heal'),
      multiply: primaryOf('multiply'),
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
    localStorage.removeItem(PROGRESS_KEY);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => navigate('/launch/welcome'), 500);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else setPhase('recency');
  };

  return (
    <LaunchLayout>
      <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
        <p className="text-xs text-launch-ink/50 mb-4 -mt-2">
          {PERSONA_LABEL[bank.persona]}
        </p>

        <div className="mb-6">
          <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-launch-moss to-launch-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-launch-ink/50 mt-2 text-center">
            Letter {currentQuestion + 1} of {questions.length} · MYRHYTHM
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-launch-ember text-launch-cream font-bold text-lg shadow-sm"
          >
            {question.letter}
          </span>
          <span className="text-sm font-semibold tracking-wide uppercase text-launch-ink/80">
            {question.word}
          </span>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">{question.title}</h2>
          {question.subtitle && <p className="text-launch-ink/70">{question.subtitle}</p>}
          <p className="text-xs italic text-launch-ink/60 mt-3">
            Brain-health lens: {question.brainHealthLens}
          </p>
        </div>

        <p className="text-sm text-launch-ink/60 text-center mb-4 px-2">
          Tap the <span className="font-semibold">circle</span> on the one that fits best. Tap <span className="font-semibold">+ Also fits</span> on any others that also feel true. If none fit, use the option at the bottom.
        </p>

        <div className="space-y-3 pb-4">
          {question.options.map((option) => {
            const isPrimary = current.primary === option.value;
            const isAlso = current.alsoFits.includes(option.value);
            const dimmed = isNoneFits;
            return (
              <div
                key={option.value}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px]',
                  dimmed && 'opacity-50',
                  isPrimary
                    ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
                    : isAlso
                      ? 'border-launch-moss/60 bg-launch-moss/10'
                      : 'border-launch-gold/30 bg-launch-ivory'
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setPrimary(option.value)}
                    aria-label={isPrimary ? 'Primary answer' : 'Set as primary answer'}
                    aria-pressed={isPrimary}
                    className="w-10 h-10 -m-2 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                        isPrimary
                          ? 'border-launch-ember bg-launch-ember'
                          : isAlso
                            ? 'border-launch-moss bg-launch-moss'
                            : 'border-launch-ink/20 hover:border-launch-ember'
                      )}
                    >
                      {(isPrimary || isAlso) && <Check className="h-4 w-4 text-white" />}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-launch-ink">{option.label}</p>
                      {isPrimary && (
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-launch-ember text-launch-cream">
                          Primary
                        </span>
                      )}
                      {isAlso && !isPrimary && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-launch-moss/20 text-launch-moss">
                          Also fits
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-sm text-launch-ink/60 mt-1">{option.description}</p>
                    )}
                  </div>
                  {!isPrimary && !isNoneFits && (
                    <button
                      type="button"
                      onClick={(e) => toggleAlsoFits(option.value, e)}
                      className={cn(
                        'shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border transition-colors min-h-[36px]',
                        isAlso
                          ? 'border-launch-moss bg-launch-ivory text-launch-moss'
                          : 'border-launch-gold/40 bg-launch-ivory text-launch-ink/60 hover:border-launch-moss hover:text-launch-moss'
                      )}
                      aria-pressed={isAlso}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Also fits
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Escape hatch: "None of these fit me" */}
          <button
            type="button"
            onClick={() => setPrimary(NONE_FITS_VALUE)}
            aria-pressed={isNoneFits}
            className={cn(
              'w-full p-4 rounded-2xl border-2 border-dashed text-left transition-all min-h-[56px] flex items-start gap-3',
              isNoneFits
                ? 'border-launch-ink/60 bg-launch-ink/5 ring-2 ring-launch-ink/10'
                : 'border-launch-ink/20 bg-transparent hover:border-launch-ink/40'
            )}
          >
            <HelpCircle className="h-5 w-5 text-launch-ink/60 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-launch-ink">None of these fit me</p>
              <p className="text-sm text-launch-ink/60 mt-0.5">
                We'll leave this one blank and won't guess. Tell us in your own words below if you want to.
              </p>
            </div>
          </button>

          {isNoneFits && (
            <div className="pt-1">
              <Textarea
                value={noneNote}
                onChange={(e) =>
                  setFreeform((prev) => ({ ...prev, [question.id]: e.target.value.slice(0, 500) }))
                }
                placeholder="Optional — tell us in your own words."
                className="min-h-[80px] bg-launch-ivory border-launch-gold/30 focus-visible:ring-launch-moss"
              />
              <p className="text-[11px] text-launch-ink/50 mt-1 text-right">
                {noneNote.length}/500
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2 pb-8">
          <LaunchButton variant="outline" onClick={handleBack} className="flex-1 border-launch-gold/40 text-launch-ink hover:bg-launch-gold/10">
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
