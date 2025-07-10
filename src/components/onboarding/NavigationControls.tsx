
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function NavigationControls({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  nextLabel,
  previousLabel,
  isLoading = false,
  className
}: NavigationControlsProps) {
  const isLastStep = currentStep === totalSteps;
  
  const defaultNextLabel = isLastStep ? "Complete Setup" : "Continue";
  const defaultPreviousLabel = "Back";

  const getNextStepName = () => {
    const stepNames = [
      "User Type",
      "Location Setup", 
      "Plan Selection",
      "Pre-Assessment",
      "Rhythm Assessment"
    ];
    
    if (currentStep < totalSteps) {
      return stepNames[currentStep]; // Next step (0-indexed)
    }
    return "Complete";
  };

  return (
    <div className={cn("pt-8 border-t-2 border-border/50", className)}>
      {/* Progress Reminder */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps} • {Math.round((currentStep / totalSteps) * 100)}% Complete
        </p>
        {canGoNext && !isLastStep && (
          <p className="text-xs text-primary mt-1 font-medium">
            Ready to continue to {getNextStepName()}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          className={cn(
            "flex items-center gap-2 px-6 py-3",
            !canGoPrevious && "opacity-50"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel || defaultPreviousLabel}
        </Button>

        {/* Status Message */}
        <div className="flex-1 text-center">
          {!canGoNext && !isLoading && (
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
              {currentStep === 1 && "Please select your user type to continue"}
              {currentStep === 2 && "Location setup (optional - you can skip)"}
              {currentStep === 3 && "Please choose a plan to continue"}
              {currentStep === 4 && "Preparing your assessment..."}
              {currentStep === 5 && "Complete your assessment"}
            </p>
          )}
          {canGoNext && !isLoading && (
            <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              ✓ Ready to proceed!
            </p>
          )}
        </div>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={cn(
            "flex items-center gap-2 px-8 py-3 text-lg font-medium transition-all duration-200",
            isLastStep && "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg",
            !isLastStep && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg",
            canGoNext && "hover:scale-105 hover:shadow-xl",
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {nextLabel || defaultNextLabel}
              {isLastStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center mt-4 text-xs text-muted-foreground">
        You can navigate back to previous steps at any time using the progress bar above
      </div>
    </div>
  );
}
