import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SetupStep {
  id: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface SetupProgressContextType {
  steps: SetupStep[];
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  progressPercentage: number;
  setCompleted: (stepId: string) => void;
  setCurrentStep: (stepId: string) => void;
  isVisible: boolean;
}

const SetupProgressContext = createContext<SetupProgressContextType | undefined>(undefined);

const ONBOARDING_STEPS: Omit<SetupStep, 'isCompleted' | 'isCurrent'>[] = [
  { id: 'plan', label: 'Choose Plan', description: 'Select your MyRhythm subscription' },
  { id: 'payment', label: 'Payment', description: 'Complete secure checkout' },
  { id: 'welcome', label: 'Welcome', description: 'Your journey begins' },
  { id: 'assessment', label: 'Assessment', description: 'Understand your cognitive profile' },
  { id: 'setup', label: 'Setup', description: 'Personalize your experience' },
  { id: 'ready', label: 'Ready', description: 'Start using MyRhythm' }
];

interface SetupProgressProviderProps {
  children: ReactNode;
}

export function SetupProgressProvider({ children }: SetupProgressProviderProps) {
  const [currentStepId, setCurrentStepId] = useState('plan');
  const [completedSteps, setCompletedStepsState] = useState<Set<string>>(new Set());

  // Initialize completed steps from localStorage
  useEffect(() => {
    const completed = new Set<string>();
    
    // Check localStorage flags
    if (localStorage.getItem('payment_success') === 'true') {
      completed.add('plan');
      completed.add('payment');
    }
    
    if (localStorage.getItem('myrhythm_assessment_complete') === 'true') {
      completed.add('assessment');
    }
    
    if (localStorage.getItem('myrhythm_initial_setup_complete') === 'true') {
      completed.add('setup');
    }
    
    if (localStorage.getItem('myrhythm_onboarding_complete') === 'true') {
      completed.add('ready');
    }

    setCompletedStepsState(completed);
  }, []);

  const setCompleted = (stepId: string) => {
    setCompletedStepsState(prev => {
      const newSet = new Set(prev);
      newSet.add(stepId);
      
      // Save to localStorage
      switch (stepId) {
        case 'payment':
          localStorage.setItem('payment_success', 'true');
          break;
        case 'assessment':
          localStorage.setItem('myrhythm_assessment_complete', 'true');
          break;
        case 'setup':
          localStorage.setItem('myrhythm_initial_setup_complete', 'true');
          break;
        case 'ready':
          localStorage.setItem('myrhythm_onboarding_complete', 'true');
          break;
      }
      
      return newSet;
    });
  };

  const setCurrentStep = (stepId: string) => {
    setCurrentStepId(stepId);
  };

  // Build steps with completion status
  const steps = ONBOARDING_STEPS.map(step => ({
    ...step,
    isCompleted: completedSteps.has(step.id),
    isCurrent: step.id === currentStepId
  }));

  const completedCount = completedSteps.size;
  const progressPercentage = Math.round((completedCount / ONBOARDING_STEPS.length) * 100);

  // Determine if progress bar should be visible
  const currentPath = window.location.pathname;
  const isVisible = [
    '/subscribe',
    '/onboarding',
    '/mvp/assessment-flow',
    '/setup-wizard'
  ].some(path => currentPath.startsWith(path)) && 
  !currentPath.startsWith('/dashboard');

  const value: SetupProgressContextType = {
    steps,
    currentStep: currentStepId,
    totalSteps: ONBOARDING_STEPS.length,
    completedSteps: completedCount,
    progressPercentage,
    setCompleted,
    setCurrentStep,
    isVisible
  };

  return (
    <SetupProgressContext.Provider value={value}>
      {children}
    </SetupProgressContext.Provider>
  );
}

export function useSetupProgress() {
  const context = useContext(SetupProgressContext);
  if (context === undefined) {
    throw new Error('useSetupProgress must be used within a SetupProgressProvider');
  }
  return context;
}