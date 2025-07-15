import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UserType } from "@/types/user";

interface ProgressManager {
  currentStep: number;
  totalSteps: number;
  isCompiling: boolean;
  isFinished: boolean;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  startCompilation: () => void;
  finishCompilation: () => void;
  resetProgress: () => void;
}

export function useProgressManager(totalSteps: number): ProgressManager {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);

  const startCompilation = useCallback(() => {
    setIsCompiling(true);
    toast.loading("Compiling your assessment results...");
  }, []);

  const finishCompilation = useCallback(() => {
    setIsCompiling(false);
    setIsFinished(true);
    toast.dismiss();
    toast.success("Assessment compilation complete!");
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentStep(0);
    setIsCompiling(false);
    setIsFinished(false);
  }, []);

  return {
    currentStep,
    totalSteps,
    isCompiling,
    isFinished,
    goToNextStep,
    goToPrevStep,
    startCompilation,
    finishCompilation,
    resetProgress
  };
}
