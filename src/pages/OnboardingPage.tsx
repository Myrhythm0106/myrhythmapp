
import React, { useState } from 'react';
import { SwipeableOnboarding } from '@/components/onboarding/SwipeableOnboarding';

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SwipeableOnboarding
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canGoNext={currentStep < totalSteps}
      canGoPrevious={currentStep > 1}
      title="Welcome to MyRhythm"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Step {currentStep}</h2>
        <p className="text-muted-foreground">
          This is step {currentStep} of the onboarding process.
        </p>
      </div>
    </SwipeableOnboarding>
  );
}
