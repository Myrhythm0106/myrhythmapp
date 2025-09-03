import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { useSetupProgress } from '@/contexts/SetupProgressContext';
import { cn } from '@/lib/utils';

export function SetupProgressBar() {
  const { 
    steps, 
    completedSteps, 
    totalSteps, 
    progressPercentage,
    isVisible 
  } = useSetupProgress();

  if (!isVisible) {
    return null;
  }

  const currentStep = steps.find(step => step.isCurrent);
  const nextStep = steps.find(step => !step.isCompleted && !step.isCurrent);

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brain-health-100 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Mobile: Compact Progress */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-brain-health-600">
                Step {completedSteps + 1} of {totalSteps}
              </div>
              <div className="w-16">
                <Progress 
                  value={progressPercentage} 
                  className="h-1.5" 
                  showPulse={progressPercentage > 0 && progressPercentage < 100}
                />
              </div>
            </div>
            {nextStep && (
              <div className="text-xs text-brain-health-500">
                Next: {nextStep.label}
              </div>
            )}
          </div>

          {/* Desktop: Full Progress */}
          <div className="hidden md:flex items-center gap-6 w-full">
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {steps.slice(0, 4).map((step, index) => (
                <div key={step.id} className="flex items-center gap-1">
                  {step.isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                  ) : step.isCurrent ? (
                    <Circle className="h-4 w-4 text-brain-health-500 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4 text-brain-health-200" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    step.isCompleted ? "text-memory-emerald-600" :
                    step.isCurrent ? "text-brain-health-600" :
                    "text-brain-health-400"
                  )}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className="h-px w-4 bg-brain-health-200 mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-3">
              <div className="w-24">
                <Progress 
                  value={progressPercentage} 
                  className="h-2" 
                  showPulse={progressPercentage > 0 && progressPercentage < 100}
                />
              </div>
              
              {currentStep && (
                <Badge variant="secondary" className="bg-brain-health-50 text-brain-health-700 border-brain-health-200">
                  {currentStep.description}
                </Badge>
              )}
            </div>
          </div>

          {/* Time Estimate */}
          <div className="hidden sm:block text-xs text-brain-health-500">
            ~{Math.max(1, 6 - completedSteps)} min remaining
          </div>
        </div>
      </div>
    </div>
  );
}