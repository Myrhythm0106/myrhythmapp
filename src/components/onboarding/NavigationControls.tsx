
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
  stepTitle?: string;
  stepDescription?: string;
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
  className,
  stepTitle,
  stepDescription
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
      {/* Enhanced Progress indicator */}
      <div className="text-center mb-4 space-y-3">
        {stepTitle && (
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{stepTitle}</h3>
            {stepDescription && (
              <p className="text-sm text-muted-foreground">{stepDescription}</p>
            )}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="w-full bg-muted rounded-full h-2 max-w-sm mx-auto">
          <div
            className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        {/* Step completion indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < currentStep
                  ? 'bg-memory-emerald-500'
                  : i === currentStep - 1
                  ? 'bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
        {canGoNext && (
          <p className="text-xs text-green-600 font-medium">
            ✓ Ready to continue
          </p>
        )}
        {!canGoNext && (
          <p className="text-xs text-amber-600">
            {currentStep === 1 && "👆 Please select your user type above to continue"}
            {currentStep === 2 && "📍 Fill in your location or click 'Skip This Step'"}
            {currentStep === 3 && "💳 Please choose a plan above to continue"}
            {currentStep === 4 && "⏳ Preparing your personalized assessment..."}
            {currentStep === 5 && "📝 Complete your assessment to continue"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        {/* Previous Button - Always show but sometimes disabled */}
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious || isLoading || currentStep === 1}
          className="flex items-center gap-2"
          size="default"
          title={currentStep === 1 ? "You're on the first step" : "Go back to previous step"}
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 1 ? "First Step" : (previousLabel || defaultPreviousLabel)}
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
