
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center items-center space-x-4">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isActive ? 'bg-memory-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < totalSteps && <ArrowRight className="h-4 w-4 text-gray-400" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
