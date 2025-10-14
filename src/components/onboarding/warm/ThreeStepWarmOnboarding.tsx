import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Step1WelcomeSeeMe } from './Step1WelcomeSeeMe';
import { Step2FeelDifferenceChoosePath } from './Step2FeelDifferenceChoosePath';
import { Step3AssessmentPlanPackages } from './Step3AssessmentPlanPackages';
import { useWarmOnboarding } from '@/hooks/useWarmOnboarding';

export function ThreeStepWarmOnboarding({ variant = 'default' }: { variant?: 'default' | 'mvp' }) {
  const {
    state,
    nextStep,
    prevStep,
    setPersonaAndConditions,
    setPath,
    setCheckIn,
    setPackage,
    completeOnboarding,
    startOnboarding,
    updateState,
  } = useWarmOnboarding();

  useEffect(() => {
    // Track onboarding start when component mounts
    if (state.step === 1 && !state.persona) {
      startOnboarding();
    }
  }, []);

  const handleStep1Complete = (persona: string, primaryCondition: string, challenges: string[], additionalInfo: string) => {
    setPersonaAndConditions(persona, primaryCondition, challenges, additionalInfo);
    nextStep();
  };

  const handleStep2Complete = () => {
    nextStep();
  };

  const handleStep3Complete = (assessmentResult: any, selectedPackage: 'starter' | 'plus' | 'pro', paymentChoice: 'premium' | 'free') => {
    setCheckIn(assessmentResult);
    setPackage(selectedPackage);
    updateState({ paymentChoice });
    
    // Complete onboarding - useWarmOnboarding hook will handle routing
    completeOnboarding();
  };

  const progress = (state.step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-memory-emerald-600" />
              <span className="text-xl font-bold text-brain-health-900">MyRhythm</span>
            </div>
            
            <div className="flex items-center gap-4">
              {state.step > 1 && (
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="text-sm text-brain-health-600">
                Step {state.step} of 3
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <Progress value={progress} className="h-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {state.step === 1 && (
          <Step1WelcomeSeeMe 
            onComplete={handleStep1Complete}
            variant={variant}
          />
        )}
        
        {state.step === 2 && state.persona && state.primaryCondition && (
          <Step2FeelDifferenceChoosePath
            persona={state.persona}
            intents={state.challenges}
            onComplete={handleStep2Complete}
            setPath={setPath}
            variant={variant}
          />
        )}
        
        {state.step === 3 && state.persona && state.primaryCondition && (
          <Step3AssessmentPlanPackages
            persona={state.persona}
            intents={state.challenges}
            onComplete={handleStep3Complete}
            variant={variant}
          />
        )}
      </div>
    </div>
  );
}