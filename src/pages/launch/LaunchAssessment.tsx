import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  getAssessmentBank,
  resolveHasSupport,
  computeBrainHealthScore,
  PERSONA_LABEL,
  type PersonaKey,
} from '@/data/launchAssessmentBanks';

export default function LaunchAssessment() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<PersonaKey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Load persona once; redirect to /launch/user-type if missing.
  useEffect(() => {
    const stored = localStorage.getItem('myrhythm_user_type');
    const bank = getAssessmentBank(stored);
    if (!bank) {
      navigate('/launch/user-type', { replace: true });
      return;
    }
    setPersona(bank.persona);
  }, [navigate]);

  const bank = useMemo(() => getAssessmentBank(persona), [persona]);

  if (!bank) {
    return null; // redirecting
  }

  const questions = bank.questions;
  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    if (question.multiSelect) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const isSelected = (value: string) => {
    if (question.multiSelect) {
      return ((answers[question.id] as string[]) || []).includes(value);
    }
    return answers[question.id] === value;
  };

  const canContinue = question.multiSelect
    ? ((answers[question.id] as string[]) || []).length > 0
    : !!answers[question.id];

  const handleNext = () => {
    if (isLast) {
      const results = {
        userType: persona,
        rhythmPreference: answers.rhythmPreference as string,
        keyStruggles: (answers.keyStruggles as string[]) || [],
        goals: (answers.goals as string[]) || [],
        hasSupport: resolveHasSupport(answers.hasSupport as string),
      };
      localStorage.setItem(
        'myrhythm_launch_mode',
        JSON.stringify({
          isLaunchMode: true,
          assessmentCompleted: true,
          assessmentResults: results,
          lastViewedWhatsNew: null,
          purchasedFeatures: [],
        })
      );

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => navigate('/launch/welcome'), 500);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      navigate('/launch/user-type');
    }
  };

  return (
    <LaunchLayout>
      <div className="max-w-md mx-auto w-full">
        <p className="text-xs text-brain-health-500 mb-4 -mt-2">
          {PERSONA_LABEL[bank.persona]}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h2>
          {question.subtitle && (
            <p className="text-gray-600">{question.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 pb-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px]',
                isSelected(option.value)
                  ? 'border-brand-emerald-500 bg-brand-emerald-50'
                  : 'border-gray-200 bg-white hover:border-brand-emerald-200'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    isSelected(option.value)
                      ? 'border-brand-emerald-500 bg-brand-emerald-500'
                      : 'border-gray-300'
                  )}
                >
                  {isSelected(option.value) && <Check className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-gray-600">{option.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
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
