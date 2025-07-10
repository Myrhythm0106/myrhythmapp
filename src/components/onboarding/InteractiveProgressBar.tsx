
import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (stepNumber: number) => void;
}

const stepLabels = [
  { id: 1, title: "About You", short: "You" },
  { id: 2, title: "Location", short: "Location" },
  { id: 3, title: "Plan", short: "Plan" },
  { id: 4, title: "Pre-Assessment", short: "Prep" },
  { id: 5, title: "Assessment", short: "Test" }
];

export const InteractiveProgressBar = ({
  currentStep,
  totalSteps,
  onStepClick,
}: InteractiveProgressBarProps) => {
  console.log("InteractiveProgressBar: currentStep:", currentStep, "totalSteps:", totalSteps);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Mobile-friendly progress bar */}
      <div className="flex items-center justify-between mb-6 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {stepLabels.slice(0, totalSteps).map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= currentStep;
            
            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <button
                  onClick={() => isAccessible && onStepClick(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex flex-col items-center space-y-1 transition-all duration-200 min-w-0",
                    isAccessible ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 flex-shrink-0",
                      isCompleted && "bg-green-600 text-white shadow-lg",
                      isCurrent && "bg-blue-600 text-white shadow-lg ring-2 ring-blue-200",
                      !isCompleted && !isCurrent && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {isCompleted ? "✓" : step.id}
                  </div>
                  
                  {/* Step Label - Responsive */}
                  <span className={cn(
                    "text-xs font-medium text-center transition-colors duration-200 whitespace-nowrap",
                    isCurrent && "text-blue-700 font-semibold",
                    isCompleted && "text-green-700",
                    !isCompleted && !isCurrent && "text-gray-500"
                  )}>
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.short}</span>
                  </span>
                </button>
                
                {/* Connector Line */}
                {index < totalSteps - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 transition-colors duration-200 flex-shrink-0",
                    step.id < currentStep ? "bg-green-600" : "bg-gray-300"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]?.title}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
