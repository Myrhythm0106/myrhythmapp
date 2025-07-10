
import React, { useState, useEffect } from "react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { FlowStepRenderer } from "./flow/FlowStepRenderer";
import { FlowNavigation } from "./flow/FlowNavigation";
import { useFlowHandlers } from "./flow/FlowHandlers";
import { useEncouragement } from "../../../encouragement/EncouragementEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Crown, Star, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { UserType } from "../UserTypeStep";
import { SmartPricingDisplay } from "./SmartPricingDisplay";
import { FullAssessmentResults } from "./FullAssessmentResults";

interface PostAssessmentFlowProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
  userType?: UserType | null;
  hasPaidPremium?: boolean;
}

type FlowStep = "teaser-preview" | "registration-prompt" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export function PostAssessmentFlow({ assessmentResult, onComplete, userType, hasPaidPremium = false }: PostAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>(hasPaidPremium ? "results" : "teaser-preview");
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showPricing, setShowPricing] = useState(false);
  
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
    if (hasPaidPremium) {
      setCurrentStep('results');
    } else {
      setCurrentStep('registration-prompt');
    }
  };

  const handleSeePricing = () => {
    setShowPricing(true);
  };

  const handleSubscribeClick = () => {
    // Navigate to subscription page
    window.location.href = '/subscription';
  };

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get user type display name
  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'brain-injury': return 'Brain Injury Recovery';
      case 'caregiver': return 'Caregiver Support';
      case 'cognitive-optimization': return 'Cognitive Optimization';
      case 'wellness': return 'General Wellness';
      default: return 'Personal Development';
    }
  };

  // Success banner for premium users
  const PremiumSuccessBanner = () => (
    <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-6 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="h-6 w-6" />
          <div className="text-center">
            <p className="font-bold text-lg">🎉 Welcome to Premium MyRhythm!</p>
            <p className="text-sm opacity-90">Your complete {getUserTypeDisplay()} assessment results are ready</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Conversion banner for basic users
  const ConversionBanner = () => (
    <Card className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white mb-6 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6" />
            <div>
              <p className="font-bold text-lg">✨ SPECIAL OFFER ✨</p>
              <p className="text-sm opacity-90">Get Premium access with 7-day free trial</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xl font-bold">{formatTime(timeLeft)}</p>
            <p className="text-xs opacity-75">Offer expires</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Show pricing overlay
  if (showPricing) {
    return (
      <SmartPricingDisplay 
        userType={userType}
        onClose={() => setShowPricing(false)}
        onSubscribe={handleSubscribeClick}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Banner based on payment status */}
      {hasPaidPremium ? <PremiumSuccessBanner /> : <ConversionBanner />}
      
      {/* Encouragement Component */}
      {EncouragementComponent}
      
      {/* Step Content */}
      <div className="min-h-[400px]">
        {hasPaidPremium ? (
          <FullAssessmentResults 
            assessmentResult={assessmentResult}
            userType={userType}
            onContinue={() => setCurrentStep('user-guide')}
          />
        ) : (
          <FlowStepRenderer
            currentStep={currentStep}
            assessmentResult={assessmentResult}
            userType={userType}
            onBackToPreview={flowHandlers.handleBackToPreview}
            onExploreGuide={flowHandlers.handleExploreGuide}
            onStartGoals={flowHandlers.handleStartGoals}
            onLifeManagementSetup={flowHandlers.handleLifeManagementSetup}
            onBackToChoice={flowHandlers.handleBackToChoice}
            onGoalCreationComplete={flowHandlers.handleGoalCreationComplete}
            onLifeManagementComplete={flowHandlers.handleLifeManagementComplete}
            onTeaserComplete={handleTeaserComplete}
            onRegistrationPrompt={handleRegistrationPrompt}
            onSeePricing={handleSeePricing}
          />
        )}
      </div>

      {/* Navigation */}
      <FlowNavigation 
        currentStep={currentStep}
        onResultsNext={flowHandlers.handleResultsNext}
        hasPaidPremium={hasPaidPremium}
      />
      
      {/* Bottom conversion bar for basic users only */}
      {!hasPaidPremium && currentStep === "teaser-preview" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-teal-200 p-4 z-30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-teal-600" />
              <div>
                <p className="font-semibold text-slate-900">Unlock Your Complete {getUserTypeDisplay()} Journey</p>
                <p className="text-sm text-slate-600">Join thousands who've transformed their lives</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSeePricing}
                variant="outline"
                className="px-4"
              >
                See Pricing
              </Button>
              <Button 
                onClick={handleSubscribeClick}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 px-6"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
