
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isAccessible: boolean;
}

interface InteractiveProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (stepNumber: number) => void;
  className?: string;
}

export function InteractiveProgressBar({
  currentStep,
  totalSteps,
  onStepClick,
  className
}: InteractiveProgressBarProps) {
  const steps: ProgressStep[] = [
    {
      id: 1,
      title: "User Type",
      description: "Tell us about yourself",
      isCompleted: currentStep > 1,
      isCurrent: currentStep === 1,
      isAccessible: true
    },
    {
      id: 2,
      title: "Location",
      description: "Where are you based?",
      isCompleted: currentStep > 2,
      isCurrent: currentStep === 2,
      isAccessible: currentStep >= 2
    },
    {
      id: 3,
      title: "Plan Selection",
      description: "Choose your subscription",
      isCompleted: currentStep > 3,
      isCurrent: currentStep === 3,
      isAccessible: currentStep >= 3
    },
    {
      id: 4,
      title: "Pre-Assessment",
      description: "Preparing your assessment",
      isCompleted: currentStep > 4,
      isCurrent: currentStep === 4,
      isAccessible: currentStep >= 4
    },
    {
      id: 5,
      title: "Assessment",
      description: "Discover your patterns",
      isCompleted: currentStep > 5,
      isCurrent: currentStep === 5,
      isAccessible: currentStep >= 5
    }
  ];

  const handleStepClick = (step: ProgressStep) => {
    if (step.isAccessible && (step.isCompleted || step.isCurrent)) {
      onStepClick(step.id);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Main Progress Indicator - More Prominent */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              Step {currentStep} of {totalSteps}
            </h3>
            <p className="text-lg text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.title} - {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-lg">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </Badge>
        </div>
        
        {/* Visual Progress Bar */}
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />
          <div 
            className="absolute top-4 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
          
          <div className="flex justify-between relative">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant="ghost"
                size="sm"
                onClick={() => handleStepClick(step)}
                disabled={!step.isAccessible}
                className={cn(
                  "flex flex-col items-center p-3 h-auto min-w-[100px] transition-all duration-300",
                  "hover:bg-background/80 rounded-xl",
                  step.isCurrent && "bg-primary/10 border-2 border-primary/30 shadow-lg",
                  step.isCompleted && "text-primary",
                  !step.isAccessible && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Step Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                  step.isCompleted && "bg-primary text-primary-foreground shadow-md",
                  step.isCurrent && "bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/20",
                  !step.isCompleted && !step.isCurrent && step.isAccessible && "bg-muted text-muted-foreground",
                  !step.isAccessible && "bg-muted/50 text-muted-foreground/50"
                )}>
                  {step.isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : step.isAccessible ? (
                    <span className="text-sm font-bold">{step.id}</span>
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="text-center space-y-1">
                  <div className={cn(
                    "font-medium text-xs",
                    step.isCurrent && "text-primary font-bold",
                    step.isCompleted && "text-primary"
                  )}>
                    {step.title}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Next Step Preview */}
      {currentStep < totalSteps && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Next:</span>
          <span className="font-medium">{steps.find(s => s.id === currentStep + 1)?.title}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
