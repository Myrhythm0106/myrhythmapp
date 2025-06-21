
import React from "react";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SwipeableOnboardingProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  title?: string;
}

export function SwipeableOnboarding({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  title
}: SwipeableOnboardingProps) {
  const isMobile = useIsMobile();

  const handleNext = () => {
    if (canGoNext && onNext) {
      onNext();
      toast.success("Next step", { duration: 1000 });
    } else {
      toast.info("Complete current step to continue", { duration: 2000 });
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious && onPrevious) {
      onPrevious();
      toast.success("Previous step", { duration: 1000 });
    } else {
      toast.info("Cannot go back from this step", { duration: 2000 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <div className="flex-1 bg-muted rounded-full h-2 max-w-xs">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious || currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext || currentStep === totalSteps}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        onSwipeLeft={canGoNext && currentStep < totalSteps ? {
          label: "Next Step",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNext
        } : undefined}
        onSwipeRight={canGoPrevious && currentStep > 1 ? {
          label: "Previous Step",
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePrevious
        } : undefined}
        className="min-h-[400px]"
      >
        <div className="animate-fade-in">
          {children}
        </div>
      </SwipeableContainer>

      {/* Mobile step indicators */}
      {isMobile && (
        <div className="flex justify-center space-x-2 mt-6">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === index + 1
                  ? "w-6 bg-primary"
                  : currentStep > index + 1
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      )}

      {/* Mobile swipe hints */}
      {isMobile && (
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left for next step, right for previous
          </p>
        </div>
      )}
    </div>
  );
}
