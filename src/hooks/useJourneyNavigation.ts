import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface JourneyStep {
  id: string;
  path: string;
  title: string;
}

const BRAIN_INJURY_JOURNEY_STEPS: JourneyStep[] = [
  { id: 'register', path: '/journey/brain-injury/register', title: 'Create Account' },
  { id: 'energy', path: '/journey/brain-injury/energy', title: 'Energy Check' },
  { id: 'profile', path: '/journey/brain-injury/profile', title: 'About You' },
  { id: 'support', path: '/journey/brain-injury/support', title: 'Support Circle' },
  { id: 'ready', path: '/journey/brain-injury/ready', title: 'Ready!' },
];

export interface JourneyState {
  userType: 'brain-injury' | 'caregiver' | 'medical' | 'student' | 'executive';
  currentStep: number;
  energyLevel: 'high' | 'moderate' | 'low' | null;
  profile: {
    name: string;
    email: string;
    priority: string | null;
    challenge: string | null;
  };
  hasSupport: boolean | null;
  completedAt: string | null;
}

const INITIAL_STATE: JourneyState = {
  userType: 'brain-injury',
  currentStep: 1,
  energyLevel: null,
  profile: {
    name: '',
    email: '',
    priority: null,
    challenge: null,
  },
  hasSupport: null,
  completedAt: null,
};

const STORAGE_KEY = 'myrhythm_journey_state';

export function useJourneyNavigation(userType: 'brain-injury' = 'brain-injury') {
  const navigate = useNavigate();
  const steps = BRAIN_INJURY_JOURNEY_STEPS;
  const totalSteps = steps.length;

  // Load state from localStorage
  const loadState = useCallback((): JourneyState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load journey state:', error);
    }
    return { ...INITIAL_STATE, userType };
  }, [userType]);

  const [state, setState] = useState<JourneyState>(loadState);

  // Save state to localStorage
  const saveState = useCallback((newState: JourneyState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save journey state:', error);
    }
  }, []);

  // Update state
  const updateState = useCallback((updates: Partial<JourneyState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    const nextStepIndex = state.currentStep; // 0-indexed for array
    if (nextStepIndex < steps.length) {
      const newStep = state.currentStep + 1;
      updateState({ currentStep: newStep });
      navigate(steps[nextStepIndex].path);
    }
  }, [state.currentStep, steps, navigate, updateState]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      const prevStepIndex = state.currentStep - 2; // 0-indexed for array
      const newStep = state.currentStep - 1;
      updateState({ currentStep: newStep });
      navigate(steps[prevStepIndex].path);
    }
  }, [state.currentStep, steps, navigate, updateState]);

  // Go to specific step
  const goToStep = useCallback((stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      updateState({ currentStep: stepNumber });
      navigate(steps[stepNumber - 1].path);
    }
  }, [steps, totalSteps, navigate, updateState]);

  // Complete journey
  const completeJourney = useCallback(() => {
    updateState({ completedAt: new Date().toISOString() });
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('selected_user_type', userType);
    navigate('/launch/home');
  }, [navigate, updateState, userType]);

  // Reset journey
  const resetJourney = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...INITIAL_STATE, userType });
  }, [userType]);

  return {
    state,
    updateState,
    currentStep: state.currentStep,
    totalSteps,
    steps,
    nextStep,
    prevStep,
    goToStep,
    completeJourney,
    resetJourney,
  };
}
