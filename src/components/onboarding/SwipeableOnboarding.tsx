
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
        <div className="text-center mb-6">
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i < currentStep
                    ? 'bg-memory-emerald-500 transform scale-110'
                    : i === currentStep
                    ? 'bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 transform scale-110'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          {/* Encouraging step message */}
          <p className="text-sm text-muted-foreground mt-3">
            {currentStep === 1 && "Welcome! Let's get to know you better"}
            {currentStep === 2 && "Great start! Now let's personalize your experience"}
            {currentStep === 3 && "You're doing great! Almost there"}
            {currentStep > 3 && "Excellent progress! Just a few more steps"}
          </p>
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
