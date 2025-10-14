import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WarmOnboardingState {
  step: number;
  sessionId: string;
  
  // Step 1: Welcome & See Me
  persona: string | null;
  primaryCondition: string | null;
  challenges: string[];
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
  paymentChoice: 'premium' | 'free' | null;
}

const STORAGE_KEY = 'myrhythm_warm_onboarding';
const COMPLETED_KEY = 'myrhythm_onboarding_completed'; // kept for backward reference

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
      primaryCondition: null,
      challenges: [],
      additionalInfo: '',
      selectedPath: null,
      checkIn: null,
      selectedPackage: null,
      paymentChoice: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Load incomplete onboarding from database on mount (Phase 5: Resume functionality)
  useEffect(() => {
    const loadIncompleteOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Only load if not already loaded and not completed
      if (state.step > 1 || isOnboardingCompleted()) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_step, onboarding_data')
        .eq('id', user.id)
        .single();
        
      if (error || !data || data.onboarding_step === 'complete') return;
      
      // If onboarding is incomplete and has saved data, restore state
      if (data.onboarding_step !== 'not_started' && data.onboarding_data) {
        const savedData = data.onboarding_data as any;
        
        // Map onboarding_step to step number
        const stepMap: Record<string, number> = {
          'not_started': 1,
          'authentication': 1,
          'user-profile': 1,
          'path-selection': 2,
          'assessment': 3,
          'plan-selection': 3,
          'complete': 3
        };
        
        const resumeStep = stepMap[data.onboarding_step] || 1;
        
        setState(prev => ({
          ...prev,
          step: resumeStep,
          sessionId: savedData.sessionId || prev.sessionId,
          persona: savedData.persona || prev.persona,
          primaryCondition: savedData.primaryCondition || prev.primaryCondition,
          challenges: savedData.challenges || prev.challenges,
          additionalInfo: savedData.additionalInfo || prev.additionalInfo,
          selectedPath: savedData.selectedPath || prev.selectedPath,
          checkIn: savedData.checkIn || prev.checkIn,
          selectedPackage: savedData.selectedPackage || prev.selectedPackage,
          paymentChoice: savedData.paymentChoice || prev.paymentChoice
        }));
        
        toast.success('Welcome back!', {
          description: 'Continuing where you left off.',
          duration: 3000
        });
      }
    };
    
    loadIncompleteOnboarding();
  }, []);

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

  const setPersonaAndConditions = (persona: string, primaryCondition: string, challenges: string[], additionalInfo: string = '') => {
    setState(prev => ({ ...prev, persona, primaryCondition, challenges, additionalInfo }));
    trackEvent('persona_selected', { 
      persona, 
      primaryCondition, 
      challenges, 
      has_additional_info: additionalInfo.length > 0 
    });
  };

  const setPath = (path: 'guided' | 'explorer') => {
    setState(prev => ({ ...prev, selectedPath: path }));
    trackEvent('path_selected', { path });
  };

  const setCheckIn = (checkIn: WarmOnboardingState['checkIn']) => {
    setState(prev => ({ ...prev, checkIn }));
    
    // Check if this is assessment data or old check-in data
    if (checkIn && 'assessmentType' in checkIn) {
      // New assessment data
      trackEvent('assessment_completed', { 
        assessmentType: (checkIn as any).assessmentType || 'brief',
        overallScore: (checkIn as any).overallScore || 0,
        primaryRhythm: (checkIn as any).primaryRhythm || 'unknown'
      });
    } else if (checkIn) {
      // Legacy check-in data
      trackEvent('checkin_submitted', { 
        energy: checkIn?.energy,
        stress: checkIn?.stress,
        focus: checkIn?.focus,
        memory_confidence: checkIn?.memoryConfidence,
        sleep_quality: checkIn?.sleepQuality
      });
    }
  };

  const setPackage = (pkg: 'starter' | 'plus' | 'pro') => {
    setState(prev => ({ ...prev, selectedPackage: pkg }));
    trackEvent('package_selected', { package: pkg });
  };

  const completeOnboarding = async () => {
    try {
      const user = await supabase.auth.getUser();
      
      if (user.data.user) {
        // Update profiles table with onboarding completion and data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            onboarding_step: 'complete',
            onboarding_data: {
              sessionId: state.sessionId,
              persona: state.persona,
              primaryCondition: state.primaryCondition,
              challenges: state.challenges,
              additionalInfo: state.additionalInfo,
              selectedPath: state.selectedPath,
              checkIn: state.checkIn,
              selectedPackage: state.selectedPackage,
              paymentChoice: state.paymentChoice,
              completedAt: new Date().toISOString()
            }
          })
          .eq('id', user.data.user.id);
        
        if (profileError) {
          console.error('Failed to update profile onboarding status:', profileError);
        }
      }

      // Mark onboarding as completed in localStorage (backup)
      localStorage.setItem('myrhythm_onboarding_completed', 'true');
      localStorage.setItem('myrhythm_onboarding_complete', 'true');
      localStorage.removeItem(STORAGE_KEY);
      
      // Track payment choice
      await trackEvent('assessment_preview_shown');
      if (state.paymentChoice === 'premium') {
        await trackEvent('unlock_clicked', { package: state.selectedPackage });
      } else {
        await trackEvent('free_trial_started');
      }
      
      await trackEvent('onboarding_complete', {
        package: state.selectedPackage,
        path: state.selectedPath,
        persona: state.persona,
        primaryCondition: state.primaryCondition,
        challenges: state.challenges,
        paymentChoice: state.paymentChoice
      });

      // Navigate based on chosen path
      const chosenPath = localStorage.getItem('myrhythm_chosen_path') as 'guided' | 'explorer' | null;
      
      toast.success('Welcome to MyRhythm! Your journey begins now.', {
        description: chosenPath === 'guided' 
          ? 'Let\'s get started with your personalized guidance' 
          : 'Ready to explore at your own pace',
        duration: 5000
      });
      
      if (chosenPath === 'guided') {
        navigate('/guided-journey');
      } else if (chosenPath === 'explorer') {
        navigate('/explorer');
      } else {
        // Fallback to memory bridge
        navigate('/memory-bridge?firstTime=true&tab=quick-capture');
      }
      
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const isOnboardingCompleted = () => {
    return localStorage.getItem('myrhythm_onboarding_completed') === 'true' || localStorage.getItem('myrhythm_onboarding_complete') === 'true';
  };

  const startOnboarding = () => {
    trackEvent('onboarding_start');
  };

  const updateState = (updates: Partial<WarmOnboardingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    nextStep,
    prevStep,
    setPersonaAndConditions,
    setPath,
    setCheckIn,
    setPackage,
    completeOnboarding,
    isOnboardingCompleted,
    startOnboarding,
    updateState,
  };
}