import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WarmOnboardingState {
  step: number;
  sessionId: string;
  
  // Step 1: Welcome & See Me
  persona: string | null;
  intent: string | null;
  additionalInfo: string;
  
  // Step 2: Feel the Difference + Choose Path
  selectedPath: 'guided' | 'explorer' | null;
  
  // Step 3: 60-second Check-in
  checkIn: {
    energy: number;
    stress: number;
    focus: number;
    memoryConfidence: number;
    sleepQuality: number;
  } | null;
  selectedPackage: 'starter' | 'plus' | 'pro' | null;
}

const STORAGE_KEY = 'myrhythm_warm_onboarding';
const COMPLETED_KEY = 'myrhythm_onboarding_completed';

export function useWarmOnboarding() {
  const navigate = useNavigate();
  
  const [state, setState] = useState<WarmOnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to default if parsing fails
      }
    }
    
    return {
      step: 1,
      sessionId: crypto.randomUUID(),
      persona: null,
      intent: null,
      additionalInfo: '',
      selectedPath: null,
      checkIn: null,
      selectedPackage: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    try {
      const user = await supabase.auth.getUser();
      await supabase.from('analytics_events').insert({
        event_type: eventName,
        user_id: user.data.user?.id || null,
        session_id: state.sessionId,
        event_data: {
          ...properties,
          step: state.step,
          source: 'warm_onboarding'
        }
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
    trackEvent('step_complete', { completed_step: state.step });
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const setPersonaAndIntent = (persona: string, intent: string, additionalInfo: string = '') => {
    setState(prev => ({ ...prev, persona, intent, additionalInfo }));
    trackEvent('persona_selected', { persona, intent, has_additional_info: additionalInfo.length > 0 });
  };

  const setPath = (path: 'guided' | 'explorer') => {
    setState(prev => ({ ...prev, selectedPath: path }));
    trackEvent('path_selected', { path });
  };

  const setCheckIn = (checkIn: WarmOnboardingState['checkIn']) => {
    setState(prev => ({ ...prev, checkIn }));
    trackEvent('checkin_submitted', { 
      energy: checkIn?.energy,
      stress: checkIn?.stress,
      focus: checkIn?.focus,
      memory_confidence: checkIn?.memoryConfidence,
      sleep_quality: checkIn?.sleepQuality
    });
  };

  const setPackage = (pkg: 'starter' | 'plus' | 'pro') => {
    setState(prev => ({ ...prev, selectedPackage: pkg }));
    trackEvent('package_selected', { package: pkg });
  };

  const completeOnboarding = async () => {
    try {
      const user = await supabase.auth.getUser();
      
      if (user.data.user) {
        // Save onboarding summary to notes
        await supabase.from('notes').insert({
          user_id: user.data.user.id,
          title: 'Onboarding Summary',
          content: JSON.stringify({
            sessionId: state.sessionId,
            persona: state.persona,
            intent: state.intent,
            additionalInfo: state.additionalInfo,
            selectedPath: state.selectedPath,
            checkIn: state.checkIn,
            selectedPackage: state.selectedPackage,
            completedAt: new Date().toISOString()
          })
        });
      }

      // Mark onboarding as completed
      localStorage.setItem(COMPLETED_KEY, 'true');
      localStorage.removeItem(STORAGE_KEY);
      
      await trackEvent('onboarding_complete', {
        package: state.selectedPackage,
        path: state.selectedPath,
        persona: state.persona,
        intent: state.intent
      });

      // Navigate based on their path choice
      if (state.selectedPath === 'guided') {
        navigate('/dashboard');
      } else {
        navigate('/calendar');
      }
      
      toast.success('Welcome to MyRhythm! Your journey begins now.');
      
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const isOnboardingCompleted = () => {
    return localStorage.getItem(COMPLETED_KEY) === 'true';
  };

  const startOnboarding = () => {
    trackEvent('onboarding_start');
  };

  return {
    state,
    nextStep,
    prevStep,
    setPersonaAndIntent,
    setPath,
    setCheckIn,
    setPackage,
    completeOnboarding,
    isOnboardingCompleted,
    startOnboarding,
  };
}