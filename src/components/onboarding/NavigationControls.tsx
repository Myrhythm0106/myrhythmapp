
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  console.log("NavigationControls: Step", currentStep, "canGoNext:", canGoNext, "canGoPrevious:", canGoPrevious);
  
  // Only show "Complete Assessment" on the actual final step (step 5) and only when ready
  const isLastStep = currentStep === totalSteps;
  const shouldShowComplete = isLastStep && canGoNext;
  
  const defaultNextLabel = shouldShowComplete ? "Complete Assessment" : "Continue";
  const defaultPreviousLabel = "Back";

  const handleNext = () => {
    console.log("NavigationControls: Next clicked, step:", currentStep, "canGoNext:", canGoNext);
    if (canGoNext && !isLoading) {
      onNext();
    }
  };

  const handlePrevious = () => {
    console.log("NavigationControls: Previous clicked, step:", currentStep, "canGoPrevious:", canGoPrevious);
    if (canGoPrevious && !isLoading) {
      onPrevious();
    }
  };

  return (
    <div className={cn("pt-6 border-t border-border/50", className)}>
      {/* Progress Status */}
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
        {canGoNext && (
          <p className="text-xs text-green-600 mt-1 font-medium">
            ✓ Ready to continue
          </p>
        )}
        {!canGoNext && (
          <p className="text-xs text-amber-600 mt-1">
            {currentStep === 1 && "Please select your user type"}
            {currentStep === 2 && "Location setup (optional)"}
            {currentStep === 3 && "Please choose a plan"}
            {currentStep === 4 && "Preparing assessment..."}
            {currentStep === 5 && "Complete your assessment"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious || isLoading}
          className="flex items-center gap-2"
          size="default"
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel || defaultPreviousLabel}
        </Button>

        {/* Next/Complete Button */}
        <Button
          onClick={handleNext}
          disabled={!canGoNext || isLoading}
          className={cn(
            "flex items-center gap-2",
            shouldShowComplete && "bg-green-600 hover:bg-green-700"
          )}
          size="default"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {nextLabel || defaultNextLabel}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
