import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JourneyLayout } from '@/components/journey/JourneyLayout';
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation';
import { BRAIN_INJURY_QUESTIONS } from '@/components/mvp/PersonaAssessmentQuestions';

export default function JourneyAssessment() {
  const navigate = useNavigate();
  const { updateState } = useJourneyNavigation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = BRAIN_INJURY_QUESTIONS.slice(0, 3); // Use first 3 questions for journey
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedValue = answers[currentQuestion.id];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (isLastQuestion) {
        // Save answers and navigate to support
        updateState({
          currentStep: 4,
          profile: {
            name: '',
            email: '',
            priority: newAnswers['biggest-challenge'] || null,
            challenge: newAnswers['daily-goal'] || null,
          }
        });
        navigate('/journey/brain-injury/support');
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      navigate('/journey/brain-injury/energy');
    }
  };

  return (
    <JourneyLayout
      currentStep={3}
      totalSteps={5}
      onBack={handleBack}
      showBack={true}
    >
      {/* Progress within assessment */}
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 w-12 rounded-full transition-all ${
              idx < currentQuestionIndex
                ? 'bg-brand-orange-500'
                : idx === currentQuestionIndex
                ? 'bg-brand-orange-400'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Header */}
          <div className="text-center mb-8">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center mb-5 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {currentQuestion.question}
            </h1>

            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedValue === option.value
                    ? 'border-brand-orange-500 bg-brand-orange-50 dark:bg-brand-orange-500/10'
                    : 'border-border bg-card/80 hover:border-brand-orange-300 hover:bg-card'
                } active:scale-[0.98]`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedValue === option.value
                      ? 'border-brand-orange-500 bg-brand-orange-500'
                      : 'border-muted-foreground/40'
                  }`}>
                    {selectedValue === option.value && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-foreground leading-snug">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      → {option.benefit}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip option */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={() => {
            if (isLastQuestion) {
              updateState({ currentStep: 4 });
              navigate('/journey/brain-injury/support');
            } else {
              setCurrentQuestionIndex(prev => prev + 1);
            }
          }}
          className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
        >
          Skip this question
        </button>
      </motion.div>
    </JourneyLayout>
  );
}
