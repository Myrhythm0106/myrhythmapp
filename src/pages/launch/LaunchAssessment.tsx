import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Clock, Target, Heart, Users, Check } from 'lucide-react';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  options: { value: string; label: string; description: string }[];
  multiSelect?: boolean;
}

const questions: Question[] = [
  {
    id: 'userType',
    title: "What brings you here?",
    subtitle: "This helps us personalize your experience",
    icon: User,
    options: [
      { value: 'recovery', label: "Recovery Journey", description: "Post-rehabilitation, building new routines" },
      { value: 'goal-achiever', label: "Achieving Goals", description: "Organizing life, hitting targets" },
      { value: 'caregiver', label: "Supporting Someone", description: "Helping a family member or friend" },
    ],
  },
  {
    id: 'rhythmPreference',
    title: "When's your best time?",
    subtitle: "We'll suggest tasks during your peak hours",
    icon: Clock,
    options: [
      { value: 'morning', label: "Morning Person", description: "I'm sharpest before noon" },
      { value: 'afternoon', label: "Afternoon Focus", description: "I hit my stride mid-day" },
      { value: 'evening', label: "Night Owl", description: "I do my best work later" },
    ],
  },
  {
    id: 'keyStruggles',
    title: "What's your biggest challenge?",
    subtitle: "Select all that apply",
    icon: Target,
    multiSelect: true,
    options: [
      { value: 'memory', label: "Remembering things", description: "Forgetting appointments, tasks" },
      { value: 'motivation', label: "Staying motivated", description: "Starting and finishing tasks" },
      { value: 'overwhelm', label: "Feeling overwhelmed", description: "Too much to do" },
      { value: 'routine', label: "Building routines", description: "Creating consistent habits" },
    ],
  },
  {
    id: 'goals',
    title: "What do you want to achieve?",
    subtitle: "Select all that apply",
    icon: Heart,
    multiSelect: true,
    options: [
      { value: 'organize', label: "Get organized", description: "Clear head, clear schedule" },
      { value: 'follow-through', label: "Follow through", description: "Actually do what I plan" },
      { value: 'connect', label: "Stay connected", description: "Keep my support team in loop" },
      { value: 'progress', label: "Track progress", description: "See how far I've come" },
    ],
  },
  {
    id: 'hasSupport',
    title: "Do you have support people?",
    subtitle: "Family, friends, caregivers, or medical team",
    icon: Users,
    options: [
      { value: 'yes', label: "Yes, I do", description: "I have people who help me" },
      { value: 'no', label: "Not yet", description: "I'm building my network" },
    ],
  },
];

export default function LaunchAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const question = questions[currentQuestion];
  const isLast = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    if (question.multiSelect) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
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
      // Store in localStorage for useLaunchMode
      const results = {
        userType: answers.userType as string,
        rhythmPreference: answers.rhythmPreference as string,
        keyStruggles: answers.keyStruggles as string[],
        goals: answers.goals as string[],
        hasSupport: answers.hasSupport === 'yes',
      };
      localStorage.setItem('myrhythm_launch_mode', JSON.stringify({
        isLaunchMode: true,
        assessmentCompleted: true,
        assessmentResults: results,
        lastViewedWhatsNew: null,
        purchasedFeatures: [],
      }));
      
      // Celebration!
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      setTimeout(() => navigate('/launch/welcome'), 500);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigate('/launch');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 flex flex-col px-6 py-8">
      {/* Progress Bar */}
      <div className="max-w-md mx-auto w-full mb-8">
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
      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-emerald-100 rounded-2xl flex items-center justify-center">
            <question.icon className="h-8 w-8 text-brand-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h2>
          <p className="text-gray-600">{question.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 text-left transition-all",
                isSelected(option.value)
                  ? "border-brand-emerald-500 bg-brand-emerald-50"
                  : "border-gray-200 bg-white hover:border-brand-emerald-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                  isSelected(option.value)
                    ? "border-brand-emerald-500 bg-brand-emerald-500"
                    : "border-gray-300"
                )}>
                  {isSelected(option.value) && <Check className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-md mx-auto w-full flex gap-3">
        <LaunchButton
          variant="outline"
          onClick={handleBack}
          className="flex-1"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </LaunchButton>
        <LaunchButton
          onClick={handleNext}
          disabled={!canContinue}
          className="flex-1"
        >
          {isLast ? 'Complete' : 'Continue'}
          <ArrowRight className="h-5 w-5" />
        </LaunchButton>
      </div>
    </div>
  );
}
