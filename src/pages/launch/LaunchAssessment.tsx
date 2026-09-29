import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resetRhythmConsentForRetake } from '@/launch/calendar/rhythmConsent';
      resetRhythmConsentForRetake();
import { useNavigate } from 'react-router-dom';
      resetRhythmConsentForRetake();
import { supabase } from '@/integrations/supabase/client';
      resetRhythmConsentForRetake();
import { ArrowRight, ArrowLeft, Check, Plus, HelpCircle } from 'lucide-react';
      resetRhythmConsentForRetake();
import { toast } from 'sonner';
      resetRhythmConsentForRetake();
import { LaunchButton } from '@/components/launch/LaunchButton';
      resetRhythmConsentForRetake();
import { RhythmDetailStep } from '@/components/launch/assessment/RhythmDetailStep';
      resetRhythmConsentForRetake();
import { useAuth } from '@/hooks/useAuth';
      resetRhythmConsentForRetake();
import { deriveProductivityWindow } from '@/launch/assessment/productivityWindow';
      resetRhythmConsentForRetake();
import { LaunchLayout } from '@/components/launch/LaunchLayout';
      resetRhythmConsentForRetake();
import { Textarea } from '@/components/ui/textarea';
      resetRhythmConsentForRetake();
import { cn } from '@/lib/utils';
      resetRhythmConsentForRetake();
import { MyRhythmStrip } from '@/components/launch/assessment/MyRhythmStrip';
      resetRhythmConsentForRetake();
import { FrameworkInfoSheet } from '@/components/launch/assessment/FrameworkInfoSheet';
      resetRhythmConsentForRetake();
import { AssessmentProcessing } from '@/components/launch/assessment/AssessmentProcessing';
      resetRhythmConsentForRetake();
import { saveAssessmentRun } from '@/launch/assessment/assessmentHistory';
      resetRhythmConsentForRetake();
import { setResumePoint } from '@/launch/onboarding/resumePoint';
      resetRhythmConsentForRetake();
import { deferAssessment } from '@/launch/onboarding/nextDestination';
      resetRhythmConsentForRetake();
import { useDisplayName } from '@/launch/profile/useDisplayName';
      resetRhythmConsentForRetake();
import {
      resetRhythmConsentForRetake();
  getAssessmentBank,
      resetRhythmConsentForRetake();
  resolveHasSupport,
      resetRhythmConsentForRetake();
  computeBrainHealthScore,
      resetRhythmConsentForRetake();
  normalizeAnswer,
      resetRhythmConsentForRetake();
  PERSONA_LABEL,
      resetRhythmConsentForRetake();
  type AssessmentAnswer,
      resetRhythmConsentForRetake();
  type PersonaKey,
      resetRhythmConsentForRetake();
} from '@/data/launchAssessmentBanks';
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
type AnswerMap = Record<string, AssessmentAnswer>;
      resetRhythmConsentForRetake();
type FreeformMap = Record<string, string>;
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
const PROGRESS_KEY = 'myrhythm_assessment_progress';
      resetRhythmConsentForRetake();
const NONE_FITS_VALUE = '__none_fits__';
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
type RecencyValue = 'na' | '0-3m' | '3-12m' | '1-3y' | '3-10y' | '10y+';
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
const RECENCY_OPTIONS: { value: RecencyValue; label: string; hint?: string }[] = [
      resetRhythmConsentForRetake();
  { value: 'na', label: 'Not sure / not applicable', hint: 'No specific event, or you\'d rather not say' },
      resetRhythmConsentForRetake();
  { value: '0-3m', label: 'In the last 3 months' },
      resetRhythmConsentForRetake();
  { value: '3-12m', label: '3–12 months ago' },
      resetRhythmConsentForRetake();
  { value: '1-3y', label: '1–3 years ago' },
      resetRhythmConsentForRetake();
  { value: '3-10y', label: '3–10 years ago' },
      resetRhythmConsentForRetake();
  { value: '10y+', label: '10 years or more' },
      resetRhythmConsentForRetake();
];
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
type StoredProgress = {
      resetRhythmConsentForRetake();
  persona: PersonaKey | null;
      resetRhythmConsentForRetake();
  currentQuestion: number;
      resetRhythmConsentForRetake();
  answers: AnswerMap;
      resetRhythmConsentForRetake();
  freeform?: FreeformMap;
      resetRhythmConsentForRetake();
  eventRecency?: RecencyValue | null;
      resetRhythmConsentForRetake();
  phase?: 'recency' | 'questions';
      resetRhythmConsentForRetake();
};
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
function loadProgress(): StoredProgress | null {
      resetRhythmConsentForRetake();
  try {
      resetRhythmConsentForRetake();
    const raw = localStorage.getItem(PROGRESS_KEY);
      resetRhythmConsentForRetake();
    if (!raw) return null;
      resetRhythmConsentForRetake();
    const parsed = JSON.parse(raw);
      resetRhythmConsentForRetake();
    if (!parsed || typeof parsed !== 'object') return null;
      resetRhythmConsentForRetake();
    const answersIn = parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {};
      resetRhythmConsentForRetake();
    const answers: AnswerMap = {};
      resetRhythmConsentForRetake();
    for (const k of Object.keys(answersIn)) {
      resetRhythmConsentForRetake();
      const n = normalizeAnswer(answersIn[k]);
      resetRhythmConsentForRetake();
      if (n) answers[k] = n;
      resetRhythmConsentForRetake();
    }
      resetRhythmConsentForRetake();
    return {
      resetRhythmConsentForRetake();
      persona: parsed.persona ?? null,
      resetRhythmConsentForRetake();
      currentQuestion: Number.isFinite(parsed.currentQuestion) ? parsed.currentQuestion : 0,
      resetRhythmConsentForRetake();
      answers,
      resetRhythmConsentForRetake();
      freeform: parsed.freeform && typeof parsed.freeform === 'object' ? parsed.freeform : {},
      resetRhythmConsentForRetake();
      eventRecency: parsed.eventRecency ?? null,
      resetRhythmConsentForRetake();
      phase: parsed.phase === 'questions' ? 'questions' : 'recency',
      resetRhythmConsentForRetake();
    };
      resetRhythmConsentForRetake();
  } catch {
      resetRhythmConsentForRetake();
    return null;
      resetRhythmConsentForRetake();
  }
      resetRhythmConsentForRetake();
}
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
export default function LaunchAssessment() {
      resetRhythmConsentForRetake();
  const navigate = useNavigate();
      resetRhythmConsentForRetake();
  const { user } = useAuth();
      resetRhythmConsentForRetake();
  const initial = useMemo(() => loadProgress(), []);
      resetRhythmConsentForRetake();
  const [persona, setPersona] = useState<PersonaKey | null>(initial?.persona ?? null);
      resetRhythmConsentForRetake();
  const [currentQuestion, setCurrentQuestion] = useState<number>(initial?.currentQuestion ?? 0);
      resetRhythmConsentForRetake();
  const [answers, setAnswers] = useState<AnswerMap>(initial?.answers ?? {});
      resetRhythmConsentForRetake();
  const [freeform, setFreeform] = useState<FreeformMap>(initial?.freeform ?? {});
      resetRhythmConsentForRetake();
  const [eventRecency, setEventRecency] = useState<RecencyValue | null>(initial?.eventRecency ?? null);
      resetRhythmConsentForRetake();
  const [phase, setPhase] = useState<'recency' | 'questions'>(initial?.phase ?? 'recency');
      resetRhythmConsentForRetake();
  const [processing, setProcessing] = useState(false);
      resetRhythmConsentForRetake();
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
      resetRhythmConsentForRetake();
  const pendingNav = useRef<string>('/launch/welcome');
      resetRhythmConsentForRetake();
  const displayName = useDisplayName();
      resetRhythmConsentForRetake();
  // Sent here straight after signing in, before Home.
      resetRhythmConsentForRetake();
  const isFirstRun = useMemo(() => {
      resetRhythmConsentForRetake();
    if (typeof window === 'undefined') return false;
      resetRhythmConsentForRetake();
    return new URLSearchParams(window.location.search).get('first') === '1';
      resetRhythmConsentForRetake();
  }, []);
      resetRhythmConsentForRetake();
  // First-timers get a warm welcome before any question appears.
      resetRhythmConsentForRetake();
  const [showWelcome, setShowWelcome] = useState<boolean>(isFirstRun);
      resetRhythmConsentForRetake();
  // Retake from Profile/dial: ask before reusing earlier answers.
      resetRhythmConsentForRetake();
  const [askRetake, setAskRetake] = useState<boolean>(() => {
      resetRhythmConsentForRetake();
    if (typeof window === 'undefined') return false;
      resetRhythmConsentForRetake();
    const isRetake = new URLSearchParams(window.location.search).get('mode') === 'retake';
      resetRhythmConsentForRetake();
    return isRetake && !!initial && Object.keys(initial.answers).length > 0;
      resetRhythmConsentForRetake();
  });
      resetRhythmConsentForRetake();
  const startFresh = () => {
      resetRhythmConsentForRetake();
    try { localStorage.removeItem(PROGRESS_KEY); } catch {/* noop */}
      resetRhythmConsentForRetake();
    setAnswers({}); setFreeform({}); setCurrentQuestion(0); setEventRecency(null); setPhase('recency');
      resetRhythmConsentForRetake();
    setAskRetake(false);
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  useEffect(() => {
      resetRhythmConsentForRetake();
    setResumePoint('/launch/assessment');
      resetRhythmConsentForRetake();
  }, []);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  useEffect(() => {
      resetRhythmConsentForRetake();
    const stored = localStorage.getItem('myrhythm_user_type');
      resetRhythmConsentForRetake();
    const bank = getAssessmentBank(stored);
      resetRhythmConsentForRetake();
    if (!bank) {
      resetRhythmConsentForRetake();
      navigate('/launch/user-type', { replace: true });
      resetRhythmConsentForRetake();
      return;
      resetRhythmConsentForRetake();
    }
      resetRhythmConsentForRetake();
    // If the stored user type no longer matches saved progress, start the
      resetRhythmConsentForRetake();
    // matching bank clean — never carry another persona's answers over.
      resetRhythmConsentForRetake();
    if (initial?.persona && initial.persona !== bank.persona) {
      resetRhythmConsentForRetake();
      try {
      resetRhythmConsentForRetake();
        localStorage.removeItem(PROGRESS_KEY);
      resetRhythmConsentForRetake();
      } catch {/* noop */}
      resetRhythmConsentForRetake();
      setAnswers({});
      resetRhythmConsentForRetake();
      setFreeform({});
      resetRhythmConsentForRetake();
      setCurrentQuestion(0);
      resetRhythmConsentForRetake();
      setEventRecency(null);
      resetRhythmConsentForRetake();
      setPhase('recency');
      resetRhythmConsentForRetake();
    }
      resetRhythmConsentForRetake();
    setPersona((prev) => (prev === bank.persona ? prev : bank.persona));
      resetRhythmConsentForRetake();
  }, [navigate, initial]);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const bank = useMemo(() => getAssessmentBank(persona), [persona]);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  useEffect(() => {
      resetRhythmConsentForRetake();
    if (!persona) return;
      resetRhythmConsentForRetake();
    try {
      resetRhythmConsentForRetake();
      localStorage.setItem(
      resetRhythmConsentForRetake();
        PROGRESS_KEY,
      resetRhythmConsentForRetake();
        JSON.stringify({
      resetRhythmConsentForRetake();
          persona,
      resetRhythmConsentForRetake();
          currentQuestion,
      resetRhythmConsentForRetake();
          answers,
      resetRhythmConsentForRetake();
          freeform,
      resetRhythmConsentForRetake();
          eventRecency,
      resetRhythmConsentForRetake();
          phase,
      resetRhythmConsentForRetake();
          updatedAt: Date.now(),
      resetRhythmConsentForRetake();
        })
      resetRhythmConsentForRetake();
      );
      resetRhythmConsentForRetake();
    } catch {/* noop */}
      resetRhythmConsentForRetake();
  }, [persona, currentQuestion, answers, freeform, eventRecency, phase]);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const handleProcessingDone = useCallback(() => {
      resetRhythmConsentForRetake();
    navigate(pendingNav.current, { replace: true });
      resetRhythmConsentForRetake();
  }, [navigate]);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  if (!bank) return null;
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  /* ------------------- Processing phase ------------------- */
      resetRhythmConsentForRetake();
  if (processing) {
      resetRhythmConsentForRetake();
    return (
      resetRhythmConsentForRetake();
      <LaunchLayout showHeader={false}>
      resetRhythmConsentForRetake();
        <AssessmentProcessing onDone={handleProcessingDone} />
      resetRhythmConsentForRetake();
        {saveWarning && (
      resetRhythmConsentForRetake();
          <p className="text-xs text-launch-ink/60 text-center px-8 pb-8 max-w-sm mx-auto">
      resetRhythmConsentForRetake();
            {saveWarning}
      resetRhythmConsentForRetake();
          </p>
      resetRhythmConsentForRetake();
        )}
      resetRhythmConsentForRetake();
      </LaunchLayout>
      resetRhythmConsentForRetake();
    );
      resetRhythmConsentForRetake();
  }
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  /* ------------------- Welcome phase (first-timers) ------------------- */
      resetRhythmConsentForRetake();
  if (askRetake) {
      resetRhythmConsentForRetake();
    return (
      resetRhythmConsentForRetake();
      <LaunchLayout>
      resetRhythmConsentForRetake();
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      resetRhythmConsentForRetake();
          <h1 className="text-3xl font-serif text-launch-ink">Retake my questions</h1>
      resetRhythmConsentForRetake();
          <p className="text-lg text-launch-ink/75">I still have my earlier answers saved. How would I like to go on?</p>
      resetRhythmConsentForRetake();
          <div className="space-y-3">
      resetRhythmConsentForRetake();
            <LaunchButton className="w-full min-h-[56px]" onClick={startFresh}>Start fresh</LaunchButton>
      resetRhythmConsentForRetake();
            <LaunchButton variant="secondary" className="w-full min-h-[56px]" onClick={() => setAskRetake(false)}>Continue where I left off</LaunchButton>
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();
          <p className="text-sm text-launch-ink/60">My earlier results stay safe in my history either way.</p>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();
      </LaunchLayout>
      resetRhythmConsentForRetake();
    );
      resetRhythmConsentForRetake();
  }
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  if (showWelcome) {
      resetRhythmConsentForRetake();
    return (
      resetRhythmConsentForRetake();
      <LaunchLayout>
      resetRhythmConsentForRetake();
        <div className="max-w-md mx-auto w-full px-4 md:px-8 py-10 pb-24">
      resetRhythmConsentForRetake();
          <h1 className="text-3xl font-bold text-launch-ink font-display mb-3 text-center">
      resetRhythmConsentForRetake();
            Welcome, {displayName}
      resetRhythmConsentForRetake();
          </h1>
      resetRhythmConsentForRetake();
          <p className="text-launch-ink/70 text-center mb-8">
      resetRhythmConsentForRetake();
            Before anything else, eight quick questions — here's what to expect.
      resetRhythmConsentForRetake();
          </p>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <ol className="space-y-3 mb-8">
      resetRhythmConsentForRetake();
            {[
      resetRhythmConsentForRetake();
              'Eight questions, about three minutes — no right or wrong answers.',
      resetRhythmConsentForRetake();
              "At the end, I'll see my MYRHYTHM snapshot and one complete key insight.",
      resetRhythmConsentForRetake();
              "I'll choose one action to try. The full personalized plan and ongoing follow-through are included with membership.",
      resetRhythmConsentForRetake();
            ].map((line, i) => (
      resetRhythmConsentForRetake();
              <li
      resetRhythmConsentForRetake();
                key={i}
      resetRhythmConsentForRetake();
                className="flex items-start gap-3 rounded-2xl border border-launch-gold/30 bg-launch-ivory p-4"
      resetRhythmConsentForRetake();
              >
      resetRhythmConsentForRetake();
                <span className="w-8 h-8 rounded-full bg-launch-ember text-white flex items-center justify-center font-semibold flex-shrink-0">
      resetRhythmConsentForRetake();
                  {i + 1}
      resetRhythmConsentForRetake();
                </span>
      resetRhythmConsentForRetake();
                <p className="text-launch-ink/80 text-sm pt-1.5">{line}</p>
      resetRhythmConsentForRetake();
              </li>
      resetRhythmConsentForRetake();
            ))}
      resetRhythmConsentForRetake();
          </ol>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <LaunchButton onClick={() => setShowWelcome(false)} className="w-full">
      resetRhythmConsentForRetake();
            I'm ready
      resetRhythmConsentForRetake();
            <ArrowRight className="h-5 w-5" />
      resetRhythmConsentForRetake();
          </LaunchButton>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <button
      resetRhythmConsentForRetake();
            type="button"
      resetRhythmConsentForRetake();
            onClick={() => {
      resetRhythmConsentForRetake();
              deferAssessment();
      resetRhythmConsentForRetake();
              navigate('/launch/home', { replace: true });
      resetRhythmConsentForRetake();
            }}
      resetRhythmConsentForRetake();
            className="mt-4 w-full min-h-[56px] text-sm text-launch-ink/60 underline underline-offset-4"
      resetRhythmConsentForRetake();
          >
      resetRhythmConsentForRetake();
            Not now — take me to my day
      resetRhythmConsentForRetake();
          </button>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();
      </LaunchLayout>
      resetRhythmConsentForRetake();
    );
      resetRhythmConsentForRetake();
  }
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  /* ------------------- Recency phase ------------------- */
      resetRhythmConsentForRetake();
  if (phase === 'recency') {
      resetRhythmConsentForRetake();
    return (
      resetRhythmConsentForRetake();
      <LaunchLayout>
      resetRhythmConsentForRetake();
        <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
      resetRhythmConsentForRetake();
          <p className="text-xs text-launch-ink/50 mb-4 -mt-2">
      resetRhythmConsentForRetake();
            {PERSONA_LABEL[bank.persona]}{' '}
      resetRhythmConsentForRetake();
            ·{' '}
      resetRhythmConsentForRetake();
            <button
      resetRhythmConsentForRetake();
              type="button"
      resetRhythmConsentForRetake();
              onClick={() => navigate('/launch/user-type')}
      resetRhythmConsentForRetake();
              className="underline underline-offset-2 hover:text-launch-ink"
      resetRhythmConsentForRetake();
            >
      resetRhythmConsentForRetake();
              Not me — change this
      resetRhythmConsentForRetake();
            </button>
      resetRhythmConsentForRetake();
          </p>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <div className="mb-6">
      resetRhythmConsentForRetake();
            <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
      resetRhythmConsentForRetake();
              <div
      resetRhythmConsentForRetake();
                className="h-full bg-gradient-to-r from-launch-teal to-launch-gold transition-all duration-500"
      resetRhythmConsentForRetake();
                style={{ width: `6%` }}
      resetRhythmConsentForRetake();
              />
      resetRhythmConsentForRetake();
            </div>
      resetRhythmConsentForRetake();
            <p className="text-xs text-launch-ink/50 mt-2 text-center">
      resetRhythmConsentForRetake();
              Before we begin
      resetRhythmConsentForRetake();
            </p>
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <div className="text-center mb-6">
      resetRhythmConsentForRetake();
            <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">
      resetRhythmConsentForRetake();
              {bank.preQuestion.title}
      resetRhythmConsentForRetake();
            </h2>
      resetRhythmConsentForRetake();
            <p className="text-launch-ink/70 text-sm">
      resetRhythmConsentForRetake();
              {bank.preQuestion.subtitle}
      resetRhythmConsentForRetake();
            </p>
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <div className="space-y-2 pb-4">
      resetRhythmConsentForRetake();
            {RECENCY_OPTIONS.map((opt) => {
      resetRhythmConsentForRetake();
              const selected = eventRecency === opt.value;
      resetRhythmConsentForRetake();
              return (
      resetRhythmConsentForRetake();
                <button
      resetRhythmConsentForRetake();
                  key={opt.value}
      resetRhythmConsentForRetake();
                  type="button"
      resetRhythmConsentForRetake();
                  onClick={() => setEventRecency(opt.value)}
      resetRhythmConsentForRetake();
                  className={cn(
      resetRhythmConsentForRetake();
                    'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-start gap-3',
      resetRhythmConsentForRetake();
                    selected
      resetRhythmConsentForRetake();
                      ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
      resetRhythmConsentForRetake();
                      : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-moss'
      resetRhythmConsentForRetake();
                  )}
      resetRhythmConsentForRetake();
                >
      resetRhythmConsentForRetake();
                  <span
      resetRhythmConsentForRetake();
                    className={cn(
      resetRhythmConsentForRetake();
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 flex-shrink-0',
      resetRhythmConsentForRetake();
                      selected
      resetRhythmConsentForRetake();
                        ? 'border-launch-ember bg-launch-ember'
      resetRhythmConsentForRetake();
                        : 'border-launch-ink/20'
      resetRhythmConsentForRetake();
                    )}
      resetRhythmConsentForRetake();
                  >
      resetRhythmConsentForRetake();
                    {selected && <Check className="h-4 w-4 text-white" />}
      resetRhythmConsentForRetake();
                  </span>
      resetRhythmConsentForRetake();
                  <div className="flex-1">
      resetRhythmConsentForRetake();
                    <p className="font-semibold text-launch-ink">{opt.label}</p>
      resetRhythmConsentForRetake();
                    {opt.hint && <p className="text-sm text-launch-ink/60 mt-0.5">{opt.hint}</p>}
      resetRhythmConsentForRetake();
                  </div>
      resetRhythmConsentForRetake();
                </button>
      resetRhythmConsentForRetake();
              );
      resetRhythmConsentForRetake();
            })}
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
          <div className="pt-2 pb-8">
      resetRhythmConsentForRetake();
            <LaunchButton
      resetRhythmConsentForRetake();
              onClick={() => setPhase('questions')}
      resetRhythmConsentForRetake();
              disabled={!eventRecency}
      resetRhythmConsentForRetake();
              className="w-full"
      resetRhythmConsentForRetake();
            >
      resetRhythmConsentForRetake();
              Continue
      resetRhythmConsentForRetake();
              <ArrowRight className="h-5 w-5" />
      resetRhythmConsentForRetake();
            </LaunchButton>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
            {isFirstRun && (
      resetRhythmConsentForRetake();
              <button
      resetRhythmConsentForRetake();
                type="button"
      resetRhythmConsentForRetake();
                onClick={() => {
      resetRhythmConsentForRetake();
                  deferAssessment();
      resetRhythmConsentForRetake();
                  navigate('/launch/home', { replace: true });
      resetRhythmConsentForRetake();
                }}
      resetRhythmConsentForRetake();
                className="mt-4 w-full min-h-[56px] text-sm text-launch-ink/60 underline underline-offset-4"
      resetRhythmConsentForRetake();
              >
      resetRhythmConsentForRetake();
                Not now — take me to my day
      resetRhythmConsentForRetake();
              </button>
      resetRhythmConsentForRetake();
            )}
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();
      </LaunchLayout>
      resetRhythmConsentForRetake();
    );
      resetRhythmConsentForRetake();
  }
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  /* ------------------- Question phase ------------------- */
      resetRhythmConsentForRetake();
  const questions = bank.questions;
      resetRhythmConsentForRetake();
  const question = questions[currentQuestion];
      resetRhythmConsentForRetake();
  const isLast = currentQuestion === questions.length - 1;
      resetRhythmConsentForRetake();
  const progress = ((currentQuestion + 1) / questions.length) * 100;
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const current: AssessmentAnswer = answers[question.id] ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
  const isNoneFits = current.primary === NONE_FITS_VALUE;
      resetRhythmConsentForRetake();
  const noneNote = freeform[question.id] ?? '';
      resetRhythmConsentForRetake();
  const savedRhythmDetail = answers.rhythmDetail ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
  const rhythmDetailValues = question.kind === 'rhythm-detail'
      resetRhythmConsentForRetake();
    ? { focusLength: current.primary, energyDrain: current.alsoFits[0] ?? '' }
      resetRhythmConsentForRetake();
    : { focusLength: savedRhythmDetail.primary, energyDrain: savedRhythmDetail.alsoFits[0] ?? '' };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const setPrimary = (value: string) => {
      resetRhythmConsentForRetake();
    setAnswers((prev) => {
      resetRhythmConsentForRetake();
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
      if (existing.primary === value) {
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { primary: '', alsoFits: existing.alsoFits } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      // Selecting the "None fits" escape hatch clears any regular alsoFits picks.
      resetRhythmConsentForRetake();
      if (value === NONE_FITS_VALUE) {
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      let alsoFits = existing.alsoFits.filter((v) => v !== value && v !== NONE_FITS_VALUE);
      resetRhythmConsentForRetake();
      if (existing.primary && existing.primary !== value && existing.primary !== NONE_FITS_VALUE) {
      resetRhythmConsentForRetake();
        if (!alsoFits.includes(existing.primary)) alsoFits = [existing.primary, ...alsoFits];
      resetRhythmConsentForRetake();
        toast("Switched primary — your earlier pick is kept as 'also fits'.", { duration: 2200 });
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      return { ...prev, [question.id]: { primary: value, alsoFits } };
      resetRhythmConsentForRetake();
    });
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  /**
      resetRhythmConsentForRetake();
   * First tap = primary, later taps = secondary ("also fits").
      resetRhythmConsentForRetake();
   * Tapping a secondary removes it; tapping the primary deselects it and
      resetRhythmConsentForRetake();
   * promotes the first secondary. "Make primary" swaps explicitly.
      resetRhythmConsentForRetake();
   */
      resetRhythmConsentForRetake();
  const handleOptionTap = (value: string) => {
      resetRhythmConsentForRetake();
    setAnswers((prev) => {
      resetRhythmConsentForRetake();
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
      // "None fits" is selected — tapping a real option replaces it as primary.
      resetRhythmConsentForRetake();
      if (existing.primary === NONE_FITS_VALUE) {
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      // Tapping the primary deselects it; the first secondary is promoted.
      resetRhythmConsentForRetake();
      if (existing.primary === value) {
      resetRhythmConsentForRetake();
        const [nextPrimary, ...rest] = existing.alsoFits;
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { primary: nextPrimary ?? '', alsoFits: nextPrimary ? rest : [] } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      // Tapping a secondary removes it.
      resetRhythmConsentForRetake();
      if (existing.alsoFits.includes(value)) {
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { ...existing, alsoFits: existing.alsoFits.filter((v) => v !== value) } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      // First tap → primary; later taps → secondary.
      resetRhythmConsentForRetake();
      if (!existing.primary) {
      resetRhythmConsentForRetake();
        return { ...prev, [question.id]: { primary: value, alsoFits: existing.alsoFits } };
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      return { ...prev, [question.id]: { ...existing, alsoFits: [...existing.alsoFits, value] } };
      resetRhythmConsentForRetake();
    });
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const makePrimary = (value: string, e: React.MouseEvent) => {
      resetRhythmConsentForRetake();
    e.stopPropagation();
      resetRhythmConsentForRetake();
    setAnswers((prev) => {
      resetRhythmConsentForRetake();
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
      if (existing.primary === value) return prev;
      resetRhythmConsentForRetake();
      const alsoFits = existing.alsoFits.filter((v) => v !== value && v !== NONE_FITS_VALUE);
      resetRhythmConsentForRetake();
      if (existing.primary && existing.primary !== NONE_FITS_VALUE) {
      resetRhythmConsentForRetake();
        alsoFits.unshift(existing.primary);
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
      return { ...prev, [question.id]: { primary: value, alsoFits } };
      resetRhythmConsentForRetake();
    });
      resetRhythmConsentForRetake();
    toast("Switched primary — your earlier pick is kept as 'also fits'.", { duration: 2200 });
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const canContinue = question.kind === 'rhythm-detail'
      resetRhythmConsentForRetake();
    ? Boolean(rhythmDetailValues.focusLength && rhythmDetailValues.energyDrain)
      resetRhythmConsentForRetake();
    : !!current.primary;
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const setRhythmDetail = (rowId: string, value: string) => {
      resetRhythmConsentForRetake();
    setAnswers((prev) => {
      resetRhythmConsentForRetake();
      const existing = prev.rhythmDetail ?? { primary: '', alsoFits: [] };
      resetRhythmConsentForRetake();
      return {
      resetRhythmConsentForRetake();
        ...prev,
      resetRhythmConsentForRetake();
        rhythmDetail: rowId === 'focusLength'
      resetRhythmConsentForRetake();
          ? { primary: value, alsoFits: existing.alsoFits }
      resetRhythmConsentForRetake();
          : { primary: existing.primary, alsoFits: [value] },
      resetRhythmConsentForRetake();
      };
      resetRhythmConsentForRetake();
    });
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const handleNext = () => {
      resetRhythmConsentForRetake();
    if (!isLast) {
      resetRhythmConsentForRetake();
      setCurrentQuestion((p) => p + 1);
      resetRhythmConsentForRetake();
      return;
      resetRhythmConsentForRetake();
    }
      resetRhythmConsentForRetake();
    const combined = (id: string) => {
      resetRhythmConsentForRetake();
      const a = answers[id];
      resetRhythmConsentForRetake();
      if (!a || a.primary === NONE_FITS_VALUE) return [];
      resetRhythmConsentForRetake();
      return [a.primary, ...a.alsoFits];
      resetRhythmConsentForRetake();
    };
      resetRhythmConsentForRetake();
    const primaryOf = (id: string) => {
      resetRhythmConsentForRetake();
      const p = answers[id]?.primary ?? '';
      resetRhythmConsentForRetake();
      return p === NONE_FITS_VALUE ? '' : p;
      resetRhythmConsentForRetake();
    };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
    let results: Record<string, unknown>;
      resetRhythmConsentForRetake();
    let brainHealthScore: ReturnType<typeof computeBrainHealthScore>;
      resetRhythmConsentForRetake();
    try {
      resetRhythmConsentForRetake();
      brainHealthScore = computeBrainHealthScore(bank, answers);
      resetRhythmConsentForRetake();
      const noneFitsCount = Object.values(answers).filter(a => a.primary === NONE_FITS_VALUE).length;
      resetRhythmConsentForRetake();
      results = {
      resetRhythmConsentForRetake();
        userType: persona,
      resetRhythmConsentForRetake();
        answers,
      resetRhythmConsentForRetake();
        freeformNotes: freeform,
      resetRhythmConsentForRetake();
        eventRecency,
      resetRhythmConsentForRetake();
        noneFitsCount,
      resetRhythmConsentForRetake();
        mindset: primaryOf('mindset'),
      resetRhythmConsentForRetake();
        yesReality: primaryOf('yesReality'),
      resetRhythmConsentForRetake();
        rhythm: primaryOf('rhythm'),
      resetRhythmConsentForRetake();
        harnessSupport: primaryOf('harnessSupport'),
      resetRhythmConsentForRetake();
        yourVictories: combined('yourVictories'),
      resetRhythmConsentForRetake();
        transform: combined('transform'),
      resetRhythmConsentForRetake();
        followThrough: primaryOf('followThrough'),
      resetRhythmConsentForRetake();
        heal: primaryOf('heal'),
      resetRhythmConsentForRetake();
        multiply: primaryOf('multiply'),
      resetRhythmConsentForRetake();
        rhythmPreference: primaryOf('rhythm'),
      resetRhythmConsentForRetake();
        productivityWindow: deriveProductivityWindow(
      resetRhythmConsentForRetake();
          {
      resetRhythmConsentForRetake();
            rhythm: primaryOf('rhythm'),
      resetRhythmConsentForRetake();
            focusLength: savedRhythmDetail.primary,
      resetRhythmConsentForRetake();
            energyDrain: savedRhythmDetail.alsoFits[0] ?? '',
      resetRhythmConsentForRetake();
            heal: primaryOf('heal'),
      resetRhythmConsentForRetake();
            transform: combined('transform'),
      resetRhythmConsentForRetake();
          },
      resetRhythmConsentForRetake();
          brainHealthScore
      resetRhythmConsentForRetake();
        ),
      resetRhythmConsentForRetake();
        keyStruggles: combined('transform'),
      resetRhythmConsentForRetake();
        goals: combined('yourVictories'),
      resetRhythmConsentForRetake();
        hasSupport: resolveHasSupport(primaryOf('harnessSupport')),
      resetRhythmConsentForRetake();
        brainHealthScore,
      resetRhythmConsentForRetake();
        completedAt: new Date().toISOString(),
      resetRhythmConsentForRetake();
      };
      resetRhythmConsentForRetake();
      localStorage.setItem(
      resetRhythmConsentForRetake();
        'myrhythm_launch_mode',
      resetRhythmConsentForRetake();
        JSON.stringify({
      resetRhythmConsentForRetake();
          isLaunchMode: true,
      resetRhythmConsentForRetake();
          assessmentCompleted: true,
      resetRhythmConsentForRetake();
          assessmentResults: results,
      resetRhythmConsentForRetake();
          brainHealthScore,
      resetRhythmConsentForRetake();
          lastViewedWhatsNew: null,
      resetRhythmConsentForRetake();
          purchasedFeatures: [],
      resetRhythmConsentForRetake();
        })
      resetRhythmConsentForRetake();
       );
      resetRhythmConsentForRetake();
       localStorage.removeItem(PROGRESS_KEY);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
       if (user?.id) {
      resetRhythmConsentForRetake();
         const window = deriveProductivityWindow(
      resetRhythmConsentForRetake();
           {
      resetRhythmConsentForRetake();
             rhythm: primaryOf('rhythm'),
      resetRhythmConsentForRetake();
             focusLength: savedRhythmDetail.primary,
      resetRhythmConsentForRetake();
             energyDrain: savedRhythmDetail.alsoFits[0] ?? '',
      resetRhythmConsentForRetake();
             heal: primaryOf('heal'),
      resetRhythmConsentForRetake();
             transform: combined('transform'),
      resetRhythmConsentForRetake();
           },
      resetRhythmConsentForRetake();
           brainHealthScore
      resetRhythmConsentForRetake();
         );
      resetRhythmConsentForRetake();
          void (async () => {
      resetRhythmConsentForRetake();
            try {
      resetRhythmConsentForRetake();
              const { data, error } = await supabase
      resetRhythmConsentForRetake();
                .from('user_schedule_preferences')
      resetRhythmConsentForRetake();
                .select('id')
      resetRhythmConsentForRetake();
                .eq('user_id', user.id)
      resetRhythmConsentForRetake();
                .eq('preference_type', 'brain_healthy')
      resetRhythmConsentForRetake();
                .limit(1)
      resetRhythmConsentForRetake();
                .maybeSingle();
      resetRhythmConsentForRetake();
              if (error) throw error;
      resetRhythmConsentForRetake();
              const payload = {
      resetRhythmConsentForRetake();
                user_id: user.id,
      resetRhythmConsentForRetake();
                preference_type: 'brain_healthy',
      resetRhythmConsentForRetake();
                best_window_enabled: true,
      resetRhythmConsentForRetake();
                best_window_start: window.productiveStart,
      resetRhythmConsentForRetake();
                best_window_end: window.productiveEnd,
      resetRhythmConsentForRetake();
                focus_block_minutes: window.focusBlockMinutes,
      resetRhythmConsentForRetake();
                 time_slots: {
      resetRhythmConsentForRetake();
                   productive: [window.productiveStart, window.productiveEnd],
      resetRhythmConsentForRetake();
                   energy_peak: window.peak,
      resetRhythmConsentForRetake();
                   best_window_summary: window.summary,
      resetRhythmConsentForRetake();
                   buffer_minutes: window.bufferMinutes,
      resetRhythmConsentForRetake();
                   max_demanding_per_day: window.maxDemandingPerDay,
      resetRhythmConsentForRetake();
                   window_minutes: window.windowMinutes,
      resetRhythmConsentForRetake();
                   reasons: window.reasons,
      resetRhythmConsentForRetake();
                 },
      resetRhythmConsentForRetake();
                notes: 'My best window, shaped by my MYRHYTHM snapshot',
      resetRhythmConsentForRetake();
              };
      resetRhythmConsentForRetake();
              const result = data?.id
      resetRhythmConsentForRetake();
                ? await supabase.from('user_schedule_preferences').update(payload).eq('id', data.id)
      resetRhythmConsentForRetake();
                : await supabase.from('user_schedule_preferences').insert(payload);
      resetRhythmConsentForRetake();
              if (result.error) throw result.error;
      resetRhythmConsentForRetake();
            } catch (error) {
      resetRhythmConsentForRetake();
              console.warn('[assessment] schedule preference save failed:', error);
      resetRhythmConsentForRetake();
            }
      resetRhythmConsentForRetake();
          })();
      resetRhythmConsentForRetake();
       }
      resetRhythmConsentForRetake();
     } catch (err) {
      resetRhythmConsentForRetake();
      console.error('[assessment] could not build results', err);
      resetRhythmConsentForRetake();
      toast.error("We couldn't finish your snapshot", {
      resetRhythmConsentForRetake();
        description: 'Your answers are still saved. Tap Complete again, or go Back one step and retry.',
      resetRhythmConsentForRetake();
        duration: 8000,
      resetRhythmConsentForRetake();
      });
      resetRhythmConsentForRetake();
      return;
      resetRhythmConsentForRetake();
    }
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
    // Show the processing state immediately, save in the background.
      resetRhythmConsentForRetake();
    pendingNav.current = '/launch/welcome';
      resetRhythmConsentForRetake();
    setSaveWarning(null);
      resetRhythmConsentForRetake();
    setProcessing(true);
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
    saveAssessmentRun({
      resetRhythmConsentForRetake();
      persona,
      resetRhythmConsentForRetake();
      answers,
      resetRhythmConsentForRetake();
      freeform,
      resetRhythmConsentForRetake();
      eventRecency,
      resetRhythmConsentForRetake();
      results,
      resetRhythmConsentForRetake();
      brainHealthScore,
      resetRhythmConsentForRetake();
    }).then((res) => {
      resetRhythmConsentForRetake();
      if (!res.ok && res.error !== 'not-signed-in') {
      resetRhythmConsentForRetake();
        console.warn('[assessment] save failed:', res.error);
      resetRhythmConsentForRetake();
        setSaveWarning(
      resetRhythmConsentForRetake();
          "My snapshot is ready, but we couldn't save it to my account yet. It's kept on this device and will sync next time I'm online."
      resetRhythmConsentForRetake();
        );
      resetRhythmConsentForRetake();
      }
      resetRhythmConsentForRetake();
    });
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  const handleBack = () => {
      resetRhythmConsentForRetake();
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
      resetRhythmConsentForRetake();
    else setPhase('recency');
      resetRhythmConsentForRetake();
  };
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
  return (
      resetRhythmConsentForRetake();
    <LaunchLayout>
      resetRhythmConsentForRetake();
      <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
      resetRhythmConsentForRetake();
        <div className="flex items-center justify-between gap-2 mb-3 -mt-2">
      resetRhythmConsentForRetake();
          <p className="text-xs text-launch-ink/50">
      resetRhythmConsentForRetake();
            {PERSONA_LABEL[bank.persona]}{' '}
      resetRhythmConsentForRetake();
            ·{' '}
      resetRhythmConsentForRetake();
            <button
      resetRhythmConsentForRetake();
              type="button"
      resetRhythmConsentForRetake();
              onClick={() => navigate('/launch/user-type')}
      resetRhythmConsentForRetake();
              className="underline underline-offset-2 hover:text-launch-ink"
      resetRhythmConsentForRetake();
            >
      resetRhythmConsentForRetake();
              Not me — change this
      resetRhythmConsentForRetake();
            </button>
      resetRhythmConsentForRetake();
          </p>
      resetRhythmConsentForRetake();
          <FrameworkInfoSheet />
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <div className="mb-4">
      resetRhythmConsentForRetake();
          <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
      resetRhythmConsentForRetake();
            <div
      resetRhythmConsentForRetake();
              className="h-full bg-gradient-to-r from-launch-teal to-launch-gold transition-all duration-500"
      resetRhythmConsentForRetake();
              style={{ width: `${progress}%` }}
      resetRhythmConsentForRetake();
            />
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <MyRhythmStrip
      resetRhythmConsentForRetake();
          questions={questions}
      resetRhythmConsentForRetake();
          currentIndex={currentQuestion}
      resetRhythmConsentForRetake();
          answeredIds={new Set(Object.keys(answers).filter((k) => answers[k]?.primary))}
      resetRhythmConsentForRetake();
          onJump={(i) => setCurrentQuestion(i)}
      resetRhythmConsentForRetake();
        />
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <div className="flex items-center justify-center gap-3 mb-4">
      resetRhythmConsentForRetake();
          <span
      resetRhythmConsentForRetake();
            aria-hidden="true"
      resetRhythmConsentForRetake();
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-launch-ember text-launch-cream font-bold text-lg shadow-sm"
      resetRhythmConsentForRetake();
          >
      resetRhythmConsentForRetake();
            {question.letter}
      resetRhythmConsentForRetake();
          </span>
      resetRhythmConsentForRetake();
          <span className="text-sm font-semibold tracking-wide uppercase text-launch-ink/80">
      resetRhythmConsentForRetake();
            {question.letter} is for {question.word}
      resetRhythmConsentForRetake();
          </span>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <div className="text-center mb-4">
      resetRhythmConsentForRetake();
          <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">{question.title}</h2>
      resetRhythmConsentForRetake();
          {question.subtitle && <p className="text-launch-ink/70">{question.subtitle}</p>}
      resetRhythmConsentForRetake();
          <p className="text-xs italic text-launch-ink/60 mt-3">
      resetRhythmConsentForRetake();
            Brain-health lens: {question.brainHealthLens}
      resetRhythmConsentForRetake();
          </p>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <p className="text-sm text-launch-ink/60 text-center mb-4 px-2">
      resetRhythmConsentForRetake();
          Tap the one that fits best <span className="font-semibold">first</span> — that's your primary. Tap any others that also fit. You can change which is primary at any time.
      resetRhythmConsentForRetake();
        </p>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        {question.kind === 'rhythm-detail' ? (
      resetRhythmConsentForRetake();
          <RhythmDetailStep
      resetRhythmConsentForRetake();
            rows={question.rows ?? []}
      resetRhythmConsentForRetake();
            values={rhythmDetailValues}
      resetRhythmConsentForRetake();
            onSelect={setRhythmDetail}
      resetRhythmConsentForRetake();
          />
      resetRhythmConsentForRetake();
        ) : (
      resetRhythmConsentForRetake();
          <div className="space-y-3 pb-4">
      resetRhythmConsentForRetake();
            {question.options.map((option) => {
      resetRhythmConsentForRetake();
              const isPrimary = current.primary === option.value;
      resetRhythmConsentForRetake();
              const isAlso = current.alsoFits.includes(option.value);
      resetRhythmConsentForRetake();
              const dimmed = isNoneFits;
      resetRhythmConsentForRetake();
              const ariaLabel = isPrimary
      resetRhythmConsentForRetake();
                ? `${option.label} — primary answer, tap to remove`
      resetRhythmConsentForRetake();
                : isAlso
      resetRhythmConsentForRetake();
                  ? `${option.label} — also fits, tap to remove`
      resetRhythmConsentForRetake();
                  : `${option.label} — tap to select`;
      resetRhythmConsentForRetake();
              return (
      resetRhythmConsentForRetake();
                <div
      resetRhythmConsentForRetake();
                  key={option.value}
      resetRhythmConsentForRetake();
                  role="button"
      resetRhythmConsentForRetake();
                  tabIndex={0}
      resetRhythmConsentForRetake();
                  aria-pressed={isPrimary || isAlso}
      resetRhythmConsentForRetake();
                  aria-label={ariaLabel}
      resetRhythmConsentForRetake();
                  onClick={() => handleOptionTap(option.value)}
      resetRhythmConsentForRetake();
                  onKeyDown={(e) => {
      resetRhythmConsentForRetake();
                    if (e.key === 'Enter' || e.key === ' ') {
      resetRhythmConsentForRetake();
                      e.preventDefault();
      resetRhythmConsentForRetake();
                      handleOptionTap(option.value);
      resetRhythmConsentForRetake();
                    }
      resetRhythmConsentForRetake();
                  }}
      resetRhythmConsentForRetake();
                  className={cn(
      resetRhythmConsentForRetake();
                    'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] cursor-pointer',
      resetRhythmConsentForRetake();
                    dimmed && 'opacity-50',
      resetRhythmConsentForRetake();
                    isPrimary
      resetRhythmConsentForRetake();
                      ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
      resetRhythmConsentForRetake();
                      : isAlso
      resetRhythmConsentForRetake();
                        ? 'border-launch-moss/60 bg-launch-moss/10'
      resetRhythmConsentForRetake();
                        : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-moss'
      resetRhythmConsentForRetake();
                  )}
      resetRhythmConsentForRetake();
                >
      resetRhythmConsentForRetake();
                  <div className="flex items-start gap-3">
      resetRhythmConsentForRetake();
                    <span
      resetRhythmConsentForRetake();
                      aria-hidden="true"
      resetRhythmConsentForRetake();
                      className={cn(
      resetRhythmConsentForRetake();
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 flex-shrink-0',
      resetRhythmConsentForRetake();
                        isPrimary
      resetRhythmConsentForRetake();
                          ? 'border-launch-ember bg-launch-ember'
      resetRhythmConsentForRetake();
                          : isAlso
      resetRhythmConsentForRetake();
                            ? 'border-launch-moss bg-launch-moss'
      resetRhythmConsentForRetake();
                            : 'border-launch-ink/20'
      resetRhythmConsentForRetake();
                      )}
      resetRhythmConsentForRetake();
                    >
      resetRhythmConsentForRetake();
                      {(isPrimary || isAlso) && <Check className="h-4 w-4 text-white" />}
      resetRhythmConsentForRetake();
                    </span>
      resetRhythmConsentForRetake();
                    <div className="flex-1 min-w-0">
      resetRhythmConsentForRetake();
                      <div className="flex items-center gap-2 flex-wrap">
      resetRhythmConsentForRetake();
                        <p className="font-semibold text-launch-ink">{option.label}</p>
      resetRhythmConsentForRetake();
                        {isPrimary && (
      resetRhythmConsentForRetake();
                          <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-launch-ember text-launch-cream">
      resetRhythmConsentForRetake();
                            Primary
      resetRhythmConsentForRetake();
                          </span>
      resetRhythmConsentForRetake();
                        )}
      resetRhythmConsentForRetake();
                        {isAlso && !isPrimary && (
      resetRhythmConsentForRetake();
                          <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-launch-moss/20 text-launch-moss">
      resetRhythmConsentForRetake();
                            Also fits
      resetRhythmConsentForRetake();
                          </span>
      resetRhythmConsentForRetake();
                        )}
      resetRhythmConsentForRetake();
                      </div>
      resetRhythmConsentForRetake();
                      {option.description && (
      resetRhythmConsentForRetake();
                        <p className="text-sm text-launch-ink/60 mt-1">{option.description}</p>
      resetRhythmConsentForRetake();
                      )}
      resetRhythmConsentForRetake();
                    </div>
      resetRhythmConsentForRetake();
                    {isAlso && !isPrimary && !isNoneFits && (
      resetRhythmConsentForRetake();
                      <button
      resetRhythmConsentForRetake();
                        type="button"
      resetRhythmConsentForRetake();
                        onClick={(e) => makePrimary(option.value, e)}
      resetRhythmConsentForRetake();
                        className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border border-launch-ember/50 bg-launch-ivory text-launch-ember hover:bg-launch-ember/10 transition-colors min-h-[36px]"
      resetRhythmConsentForRetake();
                        aria-label={`Make ${option.label} the primary answer`}
      resetRhythmConsentForRetake();
                      >
      resetRhythmConsentForRetake();
                        Make primary
      resetRhythmConsentForRetake();
                      </button>
      resetRhythmConsentForRetake();
                    )}
      resetRhythmConsentForRetake();
                  </div>
      resetRhythmConsentForRetake();
                </div>
      resetRhythmConsentForRetake();
              );
      resetRhythmConsentForRetake();
            })}
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
            {/* Escape hatch: "None of these fit me" */}
      resetRhythmConsentForRetake();
            <button
      resetRhythmConsentForRetake();
              type="button"
      resetRhythmConsentForRetake();
              onClick={() => setPrimary(NONE_FITS_VALUE)}
      resetRhythmConsentForRetake();
              aria-pressed={isNoneFits}
      resetRhythmConsentForRetake();
              className={cn(
      resetRhythmConsentForRetake();
                'w-full p-4 rounded-2xl border-2 border-dashed text-left transition-all min-h-[56px] flex items-start gap-3',
      resetRhythmConsentForRetake();
                isNoneFits
      resetRhythmConsentForRetake();
                  ? 'border-launch-ink/60 bg-launch-ink/5 ring-2 ring-launch-ink/10'
      resetRhythmConsentForRetake();
                  : 'border-launch-ink/20 bg-transparent hover:border-launch-ink/40'
      resetRhythmConsentForRetake();
              )}
      resetRhythmConsentForRetake();
            >
      resetRhythmConsentForRetake();
              <HelpCircle className="h-5 w-5 text-launch-ink/60 mt-0.5 flex-shrink-0" />
      resetRhythmConsentForRetake();
              <div className="flex-1">
      resetRhythmConsentForRetake();
                <p className="font-semibold text-launch-ink">None of these fit me</p>
      resetRhythmConsentForRetake();
                <p className="text-sm text-launch-ink/60 mt-0.5">
      resetRhythmConsentForRetake();
                  We'll leave this one blank and won't guess. Tell us in your own words below if you want to.
      resetRhythmConsentForRetake();
                </p>
      resetRhythmConsentForRetake();
              </div>
      resetRhythmConsentForRetake();
            </button>
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
            {isNoneFits && (
      resetRhythmConsentForRetake();
              <div className="pt-1">
      resetRhythmConsentForRetake();
                <Textarea
      resetRhythmConsentForRetake();
                  value={noneNote}
      resetRhythmConsentForRetake();
                  onChange={(e) =>
      resetRhythmConsentForRetake();
                    setFreeform((prev) => ({ ...prev, [question.id]: e.target.value.slice(0, 500) }))
      resetRhythmConsentForRetake();
                  }
      resetRhythmConsentForRetake();
                  placeholder="Optional — tell us in your own words."
      resetRhythmConsentForRetake();
                  className="min-h-[80px] bg-launch-ivory border-launch-gold/30 focus-visible:ring-launch-moss"
      resetRhythmConsentForRetake();
                />
      resetRhythmConsentForRetake();
                <p className="text-[11px] text-launch-ink/50 mt-1 text-right">
      resetRhythmConsentForRetake();
                  {noneNote.length}/500
      resetRhythmConsentForRetake();
                </p>
      resetRhythmConsentForRetake();
              </div>
      resetRhythmConsentForRetake();
            )}
      resetRhythmConsentForRetake();
          </div>
      resetRhythmConsentForRetake();
        )}
      resetRhythmConsentForRetake();

      resetRhythmConsentForRetake();
        <div className="flex gap-3 pt-2 pb-8">
      resetRhythmConsentForRetake();
          <LaunchButton variant="outline" onClick={handleBack} className="flex-1 border-launch-gold/40 text-launch-ink hover:bg-launch-gold/10">
      resetRhythmConsentForRetake();
            <ArrowLeft className="h-5 w-5" />
      resetRhythmConsentForRetake();
            Back
      resetRhythmConsentForRetake();
          </LaunchButton>
      resetRhythmConsentForRetake();
          <LaunchButton onClick={handleNext} disabled={!canContinue} className="flex-1">
      resetRhythmConsentForRetake();
            {isLast ? 'Complete' : 'Continue'}
      resetRhythmConsentForRetake();
            <ArrowRight className="h-5 w-5" />
      resetRhythmConsentForRetake();
          </LaunchButton>
      resetRhythmConsentForRetake();
        </div>
      resetRhythmConsentForRetake();
      </div>
      resetRhythmConsentForRetake();
    </LaunchLayout>
      resetRhythmConsentForRetake();
  );
      resetRhythmConsentForRetake();
}
      resetRhythmConsentForRetake();
