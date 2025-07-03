
import React, { useState, useEffect } from "react";
import { PreAssessmentCompiling } from "./PreAssessmentCompiling";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { UserType } from "../UserTypeStep";

interface PreAssessmentStepProps {
  onComplete: () => void;
  userType?: UserType | null;
}

export function PreAssessmentStep({ onComplete, userType }: PreAssessmentStepProps) {
  const [isCompiling, setIsCompiling] = useState(true);
  const [showManualContinue, setShowManualContinue] = useState(false);
  const [compilationError, setCompilationError] = useState(false);

  console.log("PreAssessmentStep: Starting with userType:", userType);

  // Auto-proceed after 4 seconds, with manual option after 6 seconds
  useEffect(() => {
    const autoTimer = setTimeout(() => {
      console.log("PreAssessmentStep: Auto-proceeding after 4 seconds");
      handleComplete();
    }, 4000);

    const manualTimer = setTimeout(() => {
      console.log("PreAssessmentStep: Showing manual continue option");
      setShowManualContinue(true);
    }, 6000);

    return () => {
      clearTimeout(autoTimer);
      clearTimeout(manualTimer);
    };
  }, []);

  const handleComplete = () => {
    try {
      console.log("PreAssessmentStep: Completing pre-assessment");
      setIsCompiling(false);
      onComplete();
    } catch (error) {
      console.error("PreAssessmentStep: Error during completion:", error);
      setCompilationError(true);
    }
  };

  const handleRetry = () => {
    console.log("PreAssessmentStep: Retrying pre-assessment");
    setCompilationError(false);
    setIsCompiling(true);
    setShowManualContinue(false);
    // Restart the timers
    setTimeout(handleComplete, 4000);
    setTimeout(() => setShowManualContinue(true), 6000);
  };

  if (compilationError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800">
              Preparation Taking Longer
            </h3>
            <p className="text-gray-600">
              We're still preparing your personalized assessment. You can continue manually or try again.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleComplete} className="w-full" size="lg">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue to Assessment
            </Button>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary onRetry={handleRetry}>
        <PreAssessmentCompiling onComplete={handleComplete} userType={userType} />
      </ErrorBoundary>
      
      {showManualContinue && (
        <div className="text-center">
          <Button 
            onClick={handleComplete} 
            variant="outline" 
            className="mx-auto"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Continue Manually
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Taking longer than expected? Click to continue.
          </p>
        </div>
      )}
    </div>
  );
}
