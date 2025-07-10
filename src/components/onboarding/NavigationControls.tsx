
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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

  return (
    <div className={cn("flex justify-between items-center pt-6 border-t", className)}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {previousLabel || defaultPreviousLabel}
      </Button>

      <div className="flex items-center gap-4">
        {/* Progress Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < currentStep - 1 && "bg-primary",
                  i === currentStep - 1 && "bg-primary animate-pulse",
                  i > currentStep - 1 && "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={cn(
            "flex items-center gap-2 px-6",
            isLastStep && "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {nextLabel || defaultNextLabel}
              {isLastStep ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
