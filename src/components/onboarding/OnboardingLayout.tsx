
import React, { useState } from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BackButtonWarning } from "@/components/navigation/BackButtonWarning";
import { InteractiveProgressBar } from "./InteractiveProgressBar";
import { NavigationControls } from "./NavigationControls";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onStepClick: (stepNumber: number) => void;
  title: string;
  description: string;
  hasUnsavedData?: boolean;
  onSaveProgress?: () => void;
  dataDescription?: string;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  isLoading?: boolean;
  completionPercentage?: number;
}

export const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps, 
  onBack,
  onStepClick,
  title,
  description,
  hasUnsavedData = false,
  onSaveProgress,
  dataDescription = "your progress",
  canGoNext = true,
  canGoPrevious = true,
  onNext,
  nextLabel,
  isLoading = false,
  completionPercentage
}: OnboardingLayoutProps) => {
  console.log("OnboardingLayout: Rendering with step", currentStep, "of", totalSteps);
  
  const [showBackWarning, setShowBackWarning] = useState(false);

  // Calculate completion percentage if not provided
  const calculatedCompletionPercentage = completionPercentage ?? 
    Math.round((currentStep - 1) / (totalSteps - 1) * 100);

  const handleBackClick = () => {
    console.log("OnboardingLayout: Back button clicked, current step:", currentStep);
    
    // If we're on step 1, go to dashboard; otherwise go to previous step
    if (currentStep === 1) {
      // Going back to dashboard from step 1, show warning if unsaved data
      if (hasUnsavedData) {
        setShowBackWarning(true);
      } else {
        // Navigate back to dashboard
        window.location.href = '/dashboard';
      }
    } else {
      // Going to previous onboarding step
      const isAssessmentStep = currentStep === 6; // Assessment is step 6, not 5
      const shouldWarn = hasUnsavedData || isAssessmentStep;
      
      if (shouldWarn) {
        setShowBackWarning(true);
      } else {
        console.log("OnboardingLayout: Calling onBack()");
        onBack();
      }
    }
  };

  const handleConfirmBack = () => {
    setShowBackWarning(false);
    onBack();
  };

  const handleSaveAndBack = () => {
    if (onSaveProgress) {
      onSaveProgress();
    }
    setShowBackWarning(false);
    onBack();
  };

  // Auto-save functionality for assessment steps
  React.useEffect(() => {
    if (currentStep === 5 && hasUnsavedData) {
      const autoSaveInterval = setInterval(() => {
        if (onSaveProgress) {
          onSaveProgress();
          console.log("Auto-saved assessment progress");
        }
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [currentStep, hasUnsavedData, onSaveProgress]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header with Brain Logo */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep > 1 ? `Back to Step ${currentStep - 1}` : 'Back to Dashboard'}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
              <p className="text-sm text-muted-foreground">Setup & Personalization</p>
            </div>
          </div>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Interactive Progress Bar - More Prominent */}
        <InteractiveProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
        />
        
        {/* Progress indicator for assessment */}
        {currentStep === 5 && calculatedCompletionPercentage > 0 && (
          <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-700">Assessment Progress</span>
              <span className="text-blue-600">{calculatedCompletionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculatedCompletionPercentage}%` }}
              />
            </div>
          </Card>
        )}
        
        {/* Main Content Card */}
        <Card className="border-2 border-border/50 shadow-xl bg-background/95 backdrop-blur-sm">
          <div className="p-8">
            {/* Step Content */}
            <div className="min-h-[400px]">
              {children}
            </div>

            {/* Navigation Controls - Always show when onNext is provided */}
            {onNext && (
              <NavigationControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                onNext={onNext}
                onPrevious={handleBackClick}
                nextLabel={nextLabel}
                isLoading={isLoading}
              />
            )}
          </div>
        </Card>

        {/* Confidence Building Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>✨ You're in complete control of your brain health journey</p>
          <p>Your progress is automatically saved • Navigate freely between completed steps</p>
          {currentStep === 5 && (
            <p className="text-blue-600 font-medium">
              💾 Assessment responses are auto-saved every 30 seconds
            </p>
          )}
        </div>
      </div>

      {/* Back button warning dialog */}
      <BackButtonWarning
        open={showBackWarning}
        onClose={() => setShowBackWarning(false)}
        onConfirm={handleConfirmBack}
        onSaveAndContinue={onSaveProgress ? handleSaveAndBack : undefined}
        destination={currentStep === 1 ? "Dashboard" : `Step ${currentStep - 1}`}
        hasUnsavedData={hasUnsavedData}
        dataDescription={dataDescription}
        completionPercentage={calculatedCompletionPercentage}
        isAssessment={currentStep === 5}
      />
    </div>
  );
};
