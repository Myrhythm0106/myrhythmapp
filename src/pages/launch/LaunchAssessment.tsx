import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { resetRhythmConsentForRetake } from '@/launch/calendar/rhythmConsent';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, ArrowLeft, Check, Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { RhythmDetailStep } from '@/components/launch/assessment/RhythmDetailStep';
import { useAuth } from '@/hooks/useAuth';
import { deriveProductivityWindow } from '@/launch/assessment/productivityWindow';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FrameworkInfoSheet } from '@/components/launch/assessment/FrameworkInfoSheet';
import { AssessmentProcessing } from '@/components/launch/assessment/AssessmentProcessing';
import { saveAssessmentRun } from '@/launch/assessment/assessmentHistory';
import { setResumePoint } from '@/launch/onboarding/resumePoint';
import { deferAssessment } from '@/launch/onboarding/nextDestination';
import { useDisplayName } from '@/launch/profile/useDisplayName';
import {
  getAssessmentBank,
  resolveHasSupport,
  computeBrainHealthScore,
  normalizeAnswer,
  ASSESSMENT_SCHEMA_VERSION,
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
  { value: '10y+', label: '10 years or more' },
];

type StoredProgress = {
  persona: PersonaKey | null;
  currentQuestion: number;
  answers: AnswerMap;
  freeform?: FreeformMap;
  eventRecency?: RecencyValue | null;
  phase?: 'recency' | 'questions';
  schemaVersion?: number;
};

function loadProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.schemaVersion !== ASSESSMENT_SCHEMA_VERSION) {
      localStorage.removeItem(PROGRESS_KEY);
      return null;
    }
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
      phase: 'questions',
      schemaVersion: parsed.schemaVersion,
    };
  } catch {
    return null;
  }
}

/** Benefit-only helper lines — never scoring or scheduling rules. */
const QUESTION_HELPS: Record<string, string> = {
  habitSleep: 'Helps me avoid planning demanding things after a poor night.',
  habitMove: 'Helps me fit movement into my day at a time that suits me.',
  habitFuel: 'Helps me plan steady energy through the day.',
  habitProtect: 'Helps me keep my plans realistic and kind to me.',
  habitExposure: 'Helps me spot small everyday changes that make days easier.',
  habitCalm: 'Helps me place calm moments where they matter most.',
  habitLearnConnect: 'Helps me keep time for people and learning in my week.',
  habitPurpose: 'Helps me keep what matters most to me in my plan.',
  planningRhythm: "This is when I'll suggest my most important tasks.",
  rhythmDetail: 'Sets how long my planned blocks and breaks are.',
  planningSupport: 'Decides who, if anyone, I can choose to share with.',
  planningGoal: 'Becomes the first focus in my diary this week.',
};

export default function LaunchAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initial = useMemo(() => loadProgress(), []);
  const [persona, setPersona] = useState<PersonaKey | null>(initial?.persona ?? null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(initial?.currentQuestion ?? 0);
  const [answers, setAnswers] = useState<AnswerMap>(initial?.answers ?? {});
  const [freeform, setFreeform] = useState<FreeformMap>(initial?.freeform ?? {});
  const [eventRecency, setEventRecency] = useState<RecencyValue | null>(initial?.eventRecency ?? null);
  const [phase, setPhase] = useState<'recency' | 'questions'>('questions');
  const [processing, setProcessing] = useState(false);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const pendingNav = useRef<string>('/launch/welcome');
  const displayName = useDisplayName();
  // Sent here straight after signing in, before Home.
  const isFirstRun = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('first') === '1';
  }, []);
  // First-timers get a warm welcome before any question appears.
  const [showWelcome, setShowWelcome] = useState<boolean>(isFirstRun);
  // Retake from Profile/dial: ask before reusing earlier answers.
  const [askRetake, setAskRetake] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isRetake = new URLSearchParams(window.location.search).get('mode') === 'retake';
    return isRetake && !!initial && Object.keys(initial.answers).length > 0;
  });
  const startFresh = () => {
    try { localStorage.removeItem(PROGRESS_KEY); } catch {/* noop */}
    setAnswers({}); setFreeform({}); setCurrentQuestion(0); setEventRecency(null); setPhase('questions');
    setAskRetake(false);
  };


  useEffect(() => {
    setResumePoint('/launch/assessment');
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('myrhythm_user_type');
    // The questions are shared. A first-time user can begin immediately;
    // personalisation is offered once, after their free snapshot.
    const bank = getAssessmentBank(stored ?? 'brain-injury');
    if (!bank) return;
    // If the stored user type no longer matches saved progress, start the
    // matching bank clean — never carry another persona's answers over.
    if (initial?.persona && initial.persona !== bank.persona) {
      try {
        localStorage.removeItem(PROGRESS_KEY);
      } catch {/* noop */}
      setAnswers({});
      setFreeform({});
      setCurrentQuestion(0);
      setEventRecency(null);
      setPhase('questions');
    }
    setPersona((prev) => (prev === bank.persona ? prev : bank.persona));
  }, [initial]);

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
          schemaVersion: ASSESSMENT_SCHEMA_VERSION,
          updatedAt: Date.now(),
        })
      );
    } catch {/* noop */}
  }, [persona, currentQuestion, answers, freeform, eventRecency, phase]);

  const handleProcessingDone = useCallback(() => {
    navigate(pendingNav.current, { replace: true });
  }, [navigate]);

  if (!bank) return null;

  /* ------------------- Processing phase ------------------- */
  if (processing) {
    return (
      <LaunchLayout showHeader={false}>
        <AssessmentProcessing onDone={handleProcessingDone} />
        {saveWarning && (
          <p className="text-xs text-launch-ink/60 text-center px-8 pb-8 max-w-sm mx-auto">
            {saveWarning}
          </p>
        )}
      </LaunchLayout>
    );
  }



  /* ------------------- Welcome phase (first-timers) ------------------- */
  if (askRetake) {
    return (
      <LaunchLayout>
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
          <h1 className="text-3xl font-serif text-launch-ink">Retake my questions</h1>
          <p className="text-lg text-launch-ink/75">I still have my earlier answers saved. How would I like to go on?</p>
          <div className="space-y-3">
            <LaunchButton className="w-full min-h-[56px]" onClick={startFresh}>Start fresh</LaunchButton>
            <LaunchButton variant="secondary" className="w-full min-h-[56px]" onClick={() => setAskRetake(false)}>Continue where I left off</LaunchButton>
          </div>
          <p className="text-sm text-launch-ink/60">My earlier results stay safe in my history either way.</p>
        </div>
      </LaunchLayout>
    );
  }

  if (showWelcome) {
    return (
      <LaunchLayout>
        <div className="max-w-md mx-auto w-full px-4 md:px-8 py-10 pb-24">
          <h1 className="text-3xl font-bold text-launch-ink font-display mb-3 text-center">
            Welcome, {displayName}
          </h1>
          <p className="text-launch-ink/70 text-center mb-8">
            My answers shape how MyRhythm works for me.
          </p>

          <ol className="space-y-3 mb-4">
            {[
              <><strong className="text-launch-ink">My diary</strong> — important things planned for the times I'm usually at my best.</>,
              <><strong className="text-launch-ink">My reminders and breaks</strong> — spaced to suit my energy, not a generic timetable.</>,
              <><strong className="text-launch-ink">My snapshot</strong> — a free personal report at the end, mine to keep.</>,
            ].map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-launch-gold/30 bg-launch-ivory p-4"
              >
                <span className="w-8 h-8 rounded-full bg-launch-ember text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-launch-ink/80 text-sm pt-1.5">{line}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-launch-ink/60 text-center mb-8">
            About 5 minutes. No right or wrong answers. I can change anything later.
          </p>

          <LaunchButton onClick={() => setShowWelcome(false)} className="w-full">
            I'm ready
            <ArrowRight className="h-5 w-5" />
          </LaunchButton>

          <button
            type="button"
            onClick={() => {
              deferAssessment();
              navigate('/launch/home', { replace: true });
            }}
            className="mt-4 w-full min-h-[56px] text-sm text-launch-ink/60 underline underline-offset-4"
          >
            Not now — go to Home
          </button>
        </div>
      </LaunchLayout>
    );
  }

  /* ------------------- Recency phase ------------------- */
  if (phase === 'recency') {
    return (
      <LaunchLayout>
        <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
          <div className="mb-6">
            <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-launch-teal to-launch-gold transition-all duration-500"
                style={{ width: `6%` }}
              />
            </div>
            <p className="text-xs text-launch-ink/50 mt-2 text-center">
              Before we begin
            </p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">
              {bank.preQuestion.title}
            </h2>
            <p className="text-launch-ink/70 text-sm">
              {bank.preQuestion.subtitle}
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

          <div className="pt-2 pb-8">
            <LaunchButton
              onClick={() => setPhase('questions')}
              disabled={!eventRecency}
              className="w-full"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </LaunchButton>

            {isFirstRun && (
              <button
                type="button"
                onClick={() => {
                  deferAssessment();
                  navigate('/launch/home', { replace: true });
                }}
                className="mt-4 w-full min-h-[56px] text-sm text-launch-ink/60 underline underline-offset-4"
              >
                Not now — go to Home
              </button>
            )}
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
  const savedRhythmDetail = answers.rhythmDetail ?? { primary: '', alsoFits: [] };
  const rhythmDetailValues = question.kind === 'rhythm-detail'
    ? { focusLength: current.primary, energyDrain: current.alsoFits[0] ?? '' }
    : { focusLength: savedRhythmDetail.primary, energyDrain: savedRhythmDetail.alsoFits[0] ?? '' };

  const setPrimary = (value: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (existing.primary === value) {
        return { ...prev, [question.id]: { primary: '', alsoFits: existing.alsoFits } };
      }
      if (!question.multiSelect) {
        return { ...prev, [question.id]: { primary: value, alsoFits: [] } };
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

  /** The small "Also fits" control adds or removes a secondary pick. */
  const toggleAlso = (value: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (existing.alsoFits.includes(value)) {
        return { ...prev, [question.id]: { ...existing, alsoFits: existing.alsoFits.filter((v) => v !== value) } };
      }
      const alsoFits = existing.alsoFits.filter((v) => v !== NONE_FITS_VALUE);
      return { ...prev, [question.id]: { ...existing, alsoFits: [...alsoFits, value] } };
    });
  };

  const makePrimary = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnswers((prev) => {
      const existing = prev[question.id] ?? { primary: '', alsoFits: [] };
      if (existing.primary === value) return prev;
      const alsoFits = existing.alsoFits.filter((v) => v !== value && v !== NONE_FITS_VALUE);
      if (existing.primary && existing.primary !== NONE_FITS_VALUE) {
        alsoFits.unshift(existing.primary);
      }
      return { ...prev, [question.id]: { primary: value, alsoFits } };
    });
    toast("Switched primary — your earlier pick is kept as 'also fits'.", { duration: 2200 });
  };

  const canContinue = question.kind === 'rhythm-detail'
    ? Boolean(rhythmDetailValues.focusLength && rhythmDetailValues.energyDrain)
    : !!current.primary;

  const setRhythmDetail = (rowId: string, value: string) => {
    setAnswers((prev) => {
      const existing = prev.rhythmDetail ?? { primary: '', alsoFits: [] };
      return {
        ...prev,
        rhythmDetail: rowId === 'focusLength'
          ? { primary: value, alsoFits: existing.alsoFits }
          : { primary: existing.primary, alsoFits: [value] },
      };
    });
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentQuestion((p) => p + 1);
      return;
    }
    const combined = (id: string) => {
      const a = answers[id];
      if (!a || a.primary === NONE_FITS_VALUE) return [];
      return [a.primary, ...a.alsoFits];
    };
    const primaryOf = (id: string) => {
      const p = answers[id]?.primary ?? '';
      return p === NONE_FITS_VALUE ? '' : p;
    };

    let results: Record<string, unknown>;
    let brainHealthScore: ReturnType<typeof computeBrainHealthScore>;
    try {
      brainHealthScore = computeBrainHealthScore(bank, answers);
      const noneFitsCount = Object.values(answers).filter(a => a.primary === NONE_FITS_VALUE).length;
      results = {
        userType: persona,
        schemaVersion: ASSESSMENT_SCHEMA_VERSION,
        answers,
        freeformNotes: freeform,
        eventRecency,
        noneFitsCount,
        mindset: primaryOf('habitExposure'),
        yesReality: primaryOf('habitProtect'),
        rhythm: primaryOf('planningRhythm'),
        harnessSupport: primaryOf('planningSupport'),
        yourVictories: combined('planningGoal'),
        transform: [savedRhythmDetail.alsoFits[0] ?? ''],
        followThrough: '',
        heal: primaryOf('habitSleep'),
        sleep: primaryOf('habitSleep'),
        calm: primaryOf('habitCalm'),
        multiply: primaryOf('habitPurpose'),
        rhythmPreference: primaryOf('planningRhythm'),
        productivityWindow: deriveProductivityWindow(
          {
            rhythm: primaryOf('planningRhythm'),
            focusLength: savedRhythmDetail.primary,
            energyDrain: savedRhythmDetail.alsoFits[0] ?? '',
            heal: primaryOf('habitSleep'),
            sleep: primaryOf('habitSleep'),
            calm: primaryOf('habitCalm'),
            transform: [savedRhythmDetail.alsoFits[0] ?? ''],
          },
          brainHealthScore
        ),
        keyStruggles: [savedRhythmDetail.alsoFits[0] ?? ''].filter(Boolean),
        goals: combined('planningGoal'),
        hasSupport: resolveHasSupport(primaryOf('planningSupport')),
        brainHealthScore,
        completedAt: new Date().toISOString(),
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
       resetRhythmConsentForRetake();

       if (user?.id) {
         const window = deriveProductivityWindow(
           {
             rhythm: primaryOf('planningRhythm'),
             focusLength: savedRhythmDetail.primary,
             energyDrain: savedRhythmDetail.alsoFits[0] ?? '',
             heal: primaryOf('habitSleep'),
             sleep: primaryOf('habitSleep'),
             calm: primaryOf('habitCalm'),
             transform: [savedRhythmDetail.alsoFits[0] ?? ''],
           },
           brainHealthScore
         );
          void (async () => {
            try {
              const { data, error } = await supabase
                .from('user_schedule_preferences')
                .select('id')
                .eq('user_id', user.id)
                .eq('preference_type', 'brain_healthy')
                .limit(1)
                .maybeSingle();
              if (error) throw error;
              const payload = {
                user_id: user.id,
                preference_type: 'brain_healthy',
                best_window_enabled: true,
                best_window_start: window.productiveStart,
                best_window_end: window.productiveEnd,
                focus_block_minutes: window.focusBlockMinutes,
                 time_slots: {
                   productive: [window.productiveStart, window.productiveEnd],
                   energy_peak: window.peak,
                   best_window_summary: window.summary,
                   buffer_minutes: window.bufferMinutes,
                   max_demanding_per_day: window.maxDemandingPerDay,
                   window_minutes: window.windowMinutes,
                   reasons: window.reasons,
                 },
                notes: 'My best window, shaped by my MYRHYTHM snapshot',
              };
              const result = data?.id
                ? await supabase.from('user_schedule_preferences').update(payload).eq('id', data.id)
                : await supabase.from('user_schedule_preferences').insert(payload);
              if (result.error) throw result.error;
            } catch (error) {
              console.warn('[assessment] schedule preference save failed:', error);
            }
          })();
       }
     } catch (err) {
      console.error('[assessment] could not build results', err);
      toast.error("We couldn't finish your snapshot", {
        description: 'Your answers are still saved. Tap Complete again, or go Back one step and retry.',
        duration: 8000,
      });
      return;
    }

    // Show the processing state immediately, save in the background.
    pendingNav.current = '/launch/welcome';
    setSaveWarning(null);
    setProcessing(true);

    saveAssessmentRun({
      persona,
      answers,
      freeform,
      eventRecency,
      results,
      brainHealthScore,
    }).then((res) => {
      if (!res.ok && res.error !== 'not-signed-in') {
        console.warn('[assessment] save failed:', res.error);
        setSaveWarning(
          "My snapshot is ready, but we couldn't save it to my account yet. It's kept on this device and will sync next time I'm online."
        );
      }
    });
  };


  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else navigate('/launch/register');
  };

  return (
    <LaunchLayout>
      <div className="max-w-md mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-24">
        <div className="flex items-center justify-end gap-2 mb-3 -mt-2">
          <FrameworkInfoSheet />
        </div>

        <div className="mb-4">
          <div className="h-2 bg-launch-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-launch-teal to-launch-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-sm font-semibold text-launch-moss text-center mb-4">
          {question.section === 'brain-health' ? 'Part 1 of 2 · My everyday brain health' : 'Part 2 of 2 · How I like to plan'}
          {' · '}Question {currentQuestion + 1} of {questions.length}
        </p>

        <div className="flex items-center justify-center mb-4">
          <span className="text-sm font-semibold text-launch-ink/75">{question.word}</span>
        </div>


        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-launch-ink mb-2 font-display">{question.title}</h2>
          {question.subtitle && <p className="text-launch-ink/70">{question.subtitle}</p>}
          {QUESTION_HELPS[question.id] && (
            <p className="mt-3 inline-block rounded-full border border-launch-gold/40 bg-launch-ivory px-4 py-2 text-sm font-medium text-launch-teal">
              {QUESTION_HELPS[question.id]}
            </p>
          )}
        </div>

        <p className="text-sm text-launch-ink/60 text-center mb-4 px-2">
          {question.multiSelect
            ? 'Choose one main answer with the circle. Use + Also fits for every other answer that matters too.'
            : 'Choose the answer that fits best today.'}{' '}
          You can change it later.
        </p>

        {question.kind === 'rhythm-detail' ? (
          <RhythmDetailStep
            rows={question.rows ?? []}
            values={rhythmDetailValues}
            onSelect={setRhythmDetail}
          />
        ) : (
          <div className="space-y-3 pb-4">
            {question.options.map((option) => {
              const isPrimary = current.primary === option.value;
              const isAlso = current.alsoFits.includes(option.value);
              const dimmed = isNoneFits;
              const ariaLabel = isPrimary
                ? `${option.label} — primary answer, tap to remove`
                : isAlso
                  ? `${option.label} — also fits, selected as a secondary answer`
                  : `${option.label} — tap to choose as your primary answer`;
              return (
                <div
                  key={option.value}
                  className={cn(
                    'relative w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[96px]',
                    dimmed && 'opacity-50',
                    isPrimary
                      ? 'border-launch-ember bg-launch-ember/10 ring-2 ring-launch-ember/20'
                      : isAlso
                        ? 'border-launch-moss/60 bg-launch-moss/10'
                        : 'border-launch-gold/30 bg-launch-ivory hover:border-launch-moss'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setPrimary(option.value)}
                      aria-pressed={isPrimary}
                      aria-label={ariaLabel}
                      className={cn(
                        'w-11 h-11 -m-2 rounded-full flex items-center justify-center transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal',
                      )}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                        isPrimary
                          ? 'border-launch-ember bg-launch-ember'
                          : 'border-launch-ink/20'
                      )}>
                        {isPrimary && <Check className="h-4 w-4 text-white" />}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimary(option.value)}
                      aria-label={ariaLabel}
                      className="flex-1 min-w-0 text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
                    >
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-launch-ink">{option.label}</span>
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
                      </span>
                      {option.description && (
                        <span className="block text-sm text-launch-ink/60 mt-1">{option.description}</span>
                      )}
                    </button>
                  </div>

                  {question.multiSelect && !isPrimary && !dimmed && (
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAlso(option.value)}
                        aria-pressed={isAlso}
                        aria-label={`${option.label} also fits — ${isAlso ? 'tap to remove' : 'tap to add as a secondary answer'}`}
                        className={cn(
                          'shrink-0 inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-colors min-h-[44px]',
                          isAlso
                            ? 'border-launch-moss bg-launch-moss text-launch-cream'
                            : 'border-launch-moss/50 bg-launch-ivory text-launch-ink hover:border-launch-moss'
                        )}
                      >
                        {isAlso ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                        <span className="text-xs font-semibold">{isAlso ? 'Also fits' : '+ Also fits'}</span>
                      </button>
                      {isAlso && !isPrimary && (
                        <button
                          type="button"
                          onClick={(e) => makePrimary(option.value, e)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border border-launch-ember/50 bg-launch-ivory text-launch-ember hover:bg-launch-ember/10 transition-colors min-h-[44px]"
                          aria-label={`Make ${option.label} the primary answer`}
                        >
                          Make primary
                        </button>
                      )}
                    </div>
                  )}
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
        )}

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
