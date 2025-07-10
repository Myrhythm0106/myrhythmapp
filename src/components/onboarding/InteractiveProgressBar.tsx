
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Lock } from "lucide-react";
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
      {/* Main Progress Bar */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
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
                "flex flex-col items-center p-3 h-auto min-w-[120px] transition-all duration-300",
                "hover:bg-background/80 rounded-xl",
                step.isCurrent && "bg-primary/5 border border-primary/20",
                step.isCompleted && "text-primary",
                !step.isAccessible && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Step Icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                step.isCompleted && "bg-primary text-primary-foreground",
                step.isCurrent && "bg-primary/10 text-primary border-2 border-primary",
                !step.isCompleted && !step.isCurrent && step.isAccessible && "bg-muted text-muted-foreground",
                !step.isAccessible && "bg-muted/50 text-muted-foreground/50"
              )}>
                {step.isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : step.isAccessible ? (
                  <span className="text-sm font-medium">{step.id}</span>
                ) : (
                  <Lock className="h-3 w-3" />
                )}
              </div>
              
              {/* Step Info */}
              <div className="text-center space-y-1">
                <div className={cn(
                  "font-medium text-sm",
                  step.isCurrent && "text-primary",
                  step.isCompleted && "text-primary"
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground max-w-[100px]">
                  {step.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Step {currentStep} of {totalSteps}
          </Badge>
          <span>•</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="text-xs">
          Click on previous steps to review or edit
        </div>
      </div>
    </div>
  );
}
