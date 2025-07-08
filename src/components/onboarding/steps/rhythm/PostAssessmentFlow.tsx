
import React, { useState, useEffect } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { FlowStepRenderer } from "./flow/FlowStepRenderer";
import { FlowNavigation } from "./flow/FlowNavigation";
import { useFlowHandlers } from "./flow/FlowHandlers";
import { useEncouragement } from "../../../encouragement/EncouragementEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Crown, Star, Zap, ArrowRight, Lock } from "lucide-react";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

type FlowStep = "teaser-preview" | "registration-prompt" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete }: PostAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("teaser-preview");
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  
  const { triggerEncouragement, EncouragementComponent } = useEncouragement();

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flowHandlers = useFlowHandlers(
    (step: FlowStep) => setCurrentStep(step),
    onComplete,
    triggerEncouragement,
    assessmentResult
  );

  const handleRegistrationPrompt = (action: 'register' | 'continue-guest') => {
    if (action === 'register') {
      // Navigate to registration
      window.location.href = '/auth';
    } else {
      setCurrentStep('results');
    }
  };

  const handleTeaserComplete = () => {
    setCurrentStep('registration-prompt');
  };

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Urgent conversion banner
  const UrgentConversionBanner = () => (
    <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white mb-6 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="h-6 w-6 animate-pulse" />
            <div>
              <p className="font-bold text-lg">⚡ LIMITED TIME OFFER ⚡</p>
              <p className="text-sm opacity-90">Get 20% OFF Premium - Complete assessment today!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xl font-bold">{formatTime(timeLeft)}</p>
            <p className="text-xs opacity-75">Time remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Persistent upgrade reminder
  const PersistentUpgradeReminder = () => (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-300" />
            <div className="flex-1">
              <p className="font-semibold">Missing 7 Key Insights</p>
              <p className="text-xs opacity-90">Upgrade to unlock full potential</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/onboarding'}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Urgent conversion banner */}
      <UrgentConversionBanner />
      
      {/* Encouragement Component */}
      {EncouragementComponent}
      
      {/* Persistent upgrade reminder */}
      <PersistentUpgradeReminder />
      
      {/* Step Content */}
      <div className="min-h-[400px]">
        <FlowStepRenderer
          currentStep={currentStep}
          assessmentResult={assessmentResult}
          onBackToPreview={flowHandlers.handleBackToPreview}
          onExploreGuide={flowHandlers.handleExploreGuide}
          onStartGoals={flowHandlers.handleStartGoals}
          onLifeManagementSetup={flowHandlers.handleLifeManagementSetup}
          onBackToChoice={flowHandlers.handleBackToChoice}
          onGoalCreationComplete={flowHandlers.handleGoalCreationComplete}
          onLifeManagementComplete={flowHandlers.handleLifeManagementComplete}
          onTeaserComplete={handleTeaserComplete}
          onRegistrationPrompt={handleRegistrationPrompt}
        />
      </div>

      {/* Navigation */}
      <FlowNavigation 
        currentStep={currentStep}
        onResultsNext={flowHandlers.handleResultsNext}
      />
      
      {/* Bottom conversion bar */}
      {currentStep === "teaser-preview" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Unlock Your Complete Plan</p>
                <p className="text-sm text-gray-600">Join 10,000+ users who've transformed their lives</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Special Offer Expires:</p>
                <p className="font-mono font-bold text-red-600">{formatTime(timeLeft)}</p>
              </div>
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
