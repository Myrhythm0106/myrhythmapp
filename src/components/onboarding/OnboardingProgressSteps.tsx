import React from 'react';
import { Check, Clock, Users, Brain } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  estimatedTime?: string;
}

interface OnboardingProgressStepsProps {
  currentStepId: string;
  completedSteps: string[];
  steps: OnboardingStep[];
  className?: string;
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'user-type',
    title: 'Tell Us About Yourself',
    description: 'Help us understand your unique journey',
    icon: Users,
    estimatedTime: '1 min'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Secure your personal information',
    icon: Clock,
    estimatedTime: '2 min'
  },
  {
    id: 'assessment',
    title: 'Personal Assessment', 
    description: 'Discover your cognitive rhythm',
    icon: Brain,
    estimatedTime: '5 min'
  }
];

export function OnboardingProgressSteps({
  currentStepId,
  completedSteps,
  steps = defaultSteps,
  className = ""
}: OnboardingProgressStepsProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStepId);
  };

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId);
  };

  const isStepCurrent = (stepId: string) => {
    return stepId === currentStepId;
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Journey to Better Living
        </h2>
        <p className="text-muted-foreground">
          We'll guide you through a few quick steps to personalize your experience
        </p>
      </div>

      {/* Steps Progress */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = isStepCurrent(step.id);
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 border-l-4 border-memory-emerald-500'
                  : isCompleted
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-muted/30'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg font-semibold ${
                      isCurrent
                        ? 'text-memory-emerald-700'
                        : isCompleted
                        ? 'text-green-700'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.estimatedTime && (
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        isCurrent
                          ? 'bg-memory-emerald-100 text-memory-emerald-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.estimatedTime}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    isCurrent
                      ? 'text-brain-health-600'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-9 mt-12 w-0.5 h-8 ${
                    isPast || isCompleted ? 'bg-green-300' : 'bg-muted'
                  }`}
                  style={{ marginLeft: '1.25rem' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Encouragement Message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex === 0 && "Let's start with the basics - it only takes a moment"}
          {currentIndex === 1 && "Great progress! Now let's secure your information"}
          {currentIndex === 2 && "Almost there! Time to discover your unique rhythm"}
          {currentIndex >= steps.length - 1 && "You're doing amazing! Just one more step"}
        </p>
      </div>
    </div>
  );
}