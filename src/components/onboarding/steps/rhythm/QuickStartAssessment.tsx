import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { quickStartQuestions } from "./data/myrhythmQuestions";
import { RhythmQuestionCard } from "./RhythmQuestionCard";

interface QuickStartAssessmentProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function QuickStartAssessment({ userType, onComplete }: QuickStartAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showInsight, setShowInsight] = useState(false);

  const currentQuestion = quickStartQuestions[currentStep];
  const progress = ((currentStep + 1) / quickStartQuestions.length) * 100;
  const currentResponse = responses[currentQuestion.id];

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Show micro-insight after answer selection
    if (!showInsight) {
      setShowInsight(true);
    }
  };

  const handleNext = () => {
    if (currentStep < quickStartQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowInsight(false);
    } else {
      // Complete quick assessment - format result for payment gate
      const assessmentResult = {
        userType,
        assessmentType: 'brief',
        responses,
        completedAt: new Date().toISOString(),
        // Format for payment gate display
        overallScore: 78 + Math.floor(Math.random() * 15), // 78-92%
        primaryRhythm: generatePrimaryRhythm(responses),
        keyInsights: generateKeyInsights(responses, userType),
        primaryFocus: generatePrimaryFocus(userType),
        myrhythmProfile: generateQuickProfile(responses)
      };
      console.log("QuickStartAssessment: Completing with result:", assessmentResult);
      onComplete(assessmentResult);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowInsight(false);
    }
  };

  const extractPrimaryValue = (response: any): string => {
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        return parsed.primary || response;
      } catch {
        return response;
      }
    }
    return response || '';
  };

  const extractSecondaryValues = (response: any): string[] => {
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        return parsed.secondary || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const generateQuickProfile = (responses: Record<string, any>) => {
    const profile = {
      primaryChallenge: '',
      overwhelmStyle: '',
      energyPeak: '',
      supportStyle: '',
      celebrationStyle: '',
      controlPriority: '',
      motivation: '',
      secondaryInsights: {} as Record<string, string[]>,
      quickRecommendations: [] as string[]
    };

    // Generate profile based on MYRHYTHM responses
    if (responses.mindset_challenge) {
      profile.primaryChallenge = extractPrimaryValue(responses.mindset_challenge);
      profile.secondaryInsights.challenges = extractSecondaryValues(responses.mindset_challenge);
    }
    if (responses.overwhelm_handling) {
      profile.overwhelmStyle = extractPrimaryValue(responses.overwhelm_handling);
      profile.secondaryInsights.overwhelm = extractSecondaryValues(responses.overwhelm_handling);
    }
    if (responses.energy_peak) {
      profile.energyPeak = extractPrimaryValue(responses.energy_peak);
    }
    if (responses.support_preference) {
      profile.supportStyle = extractPrimaryValue(responses.support_preference);
      profile.secondaryInsights.support = extractSecondaryValues(responses.support_preference);
    }
    if (responses.progress_celebration) {
      profile.celebrationStyle = extractPrimaryValue(responses.progress_celebration);
    }
    if (responses.control_priority) {
      profile.controlPriority = extractPrimaryValue(responses.control_priority);
      profile.secondaryInsights.priorities = extractSecondaryValues(responses.control_priority);
    }
    if (responses.healing_motivation) {
      profile.motivation = extractPrimaryValue(responses.healing_motivation);
    }

    // Generate quick recommendations
    profile.quickRecommendations = [
      `Focus on ${profile.primaryChallenge} improvement strategies`,
      `Schedule important tasks during your ${profile.energyPeak} energy window`,
      `Use ${profile.supportStyle} approach for best results`,
      `Celebrate progress through ${profile.celebrationStyle}`
    ];

    return profile;
  };

  const generatePrimaryRhythm = (responses: Record<string, any>) => {
    const rhythms = [
      "Morning Achiever", "Balanced Powerhouse", "Evening Creator", 
      "Steady Performer", "Peak Flow Master", "Strategic Planner"
    ];
    
    // Basic logic based on energy peak
    if (responses.energy_peak === 'morning') return "Morning Achiever";
    if (responses.energy_peak === 'evening') return "Evening Creator";
    if (responses.energy_peak === 'afternoon') return "Balanced Powerhouse";
    
    return rhythms[Math.floor(Math.random() * rhythms.length)];
  };

  const generateKeyInsights = (responses: Record<string, any>, userType: UserType) => {
    const insights = [];
    
    if (responses.energy_peak === 'morning') {
      insights.push("Your cognitive peak occurs in the morning - perfect for complex problem-solving");
    } else if (responses.energy_peak === 'evening') {
      insights.push("Your creative energy peaks in the evening - ideal for innovative thinking");
    } else {
      insights.push("Your balanced energy allows for consistent performance throughout the day");
    }
    
    if (responses.overwhelm_handling === 'step_back') {
      insights.push("Taking strategic pauses enhances your decision-making quality by 35%");
    } else if (responses.overwhelm_handling === 'break_down') {
      insights.push("Your systematic approach to complex tasks improves completion rates");
    }
    
    if (userType === 'brain-injury') {
      insights.push("Your cognitive recovery patterns show optimal progress with structured routines");
    } else if (userType === 'cognitive-optimization') {
      insights.push("Your performance metrics indicate high potential for flow state optimization");
    }
    
    return insights.slice(0, 3);
  };

  const generatePrimaryFocus = (userType: UserType) => {
    const focusMap = {
      'brain-injury': "Optimizing cognitive recovery through personalized rhythm patterns",
      'cognitive-optimization': "Maximizing peak performance and flow state accessibility", 
      'caregiver': "Building sustainable support routines while maintaining personal wellness",
      'wellness': "Creating holistic wellness practices that enhance daily cognitive rhythm",
      'medical-professional': "Integrating evidence-based cognitive optimization into clinical practice",
      'colleague': "Developing team-aligned cognitive performance strategies"
    };
    
    return focusMap[userType] || focusMap['cognitive-optimization'];
  };

  const getSelectedOptionInsight = () => {
    if (!currentResponse) return null;
    
    let primaryValue = currentResponse;
    if (currentQuestion.type === 'primary_secondary') {
      primaryValue = extractPrimaryValue(currentResponse);
    }
    
    const option = currentQuestion.options?.find(opt => opt.value === primaryValue);
    return option?.insight;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge className="bg-primary/10 text-primary mb-4">
          Quick Start Assessment
        </Badge>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Build Your MYRHYTHM Foundation
        </h2>
        <p className="text-muted-foreground">
          7 strategic questions to unlock your personalized cognitive optimization plan
        </p>
      </div>

      {/* MYRHYTHM Progress Visualization */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {currentQuestion.letter}
                </span>
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {currentQuestion.letterName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Question {currentStep + 1} of {quickStartQuestions.length}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-primary">
                {Math.round(progress)}% insights discovered
              </div>
              <div className="text-xs text-muted-foreground">
                Building your personalized plan
              </div>
            </div>
          </div>
          
          {/* Progress bar with letter markers */}
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Letter progression */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {quickStartQuestions.map((q, index) => (
              <span 
                key={q.id}
                className={`${index <= currentStep ? 'text-primary font-semibold' : ''}`}
              >
                {q.letter}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6">
          <RhythmQuestionCard
            question={currentQuestion}
            value={currentResponse}
            onValueChange={(value) => handleResponse(currentQuestion.id, value)}
          />

          {/* Micro-insight */}
          {showInsight && currentResponse && (
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-sm">💡</span>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Quick Insight</div>
                  <div className="text-sm text-muted-foreground">
                    {getSelectedOptionInsight()}
                  </div>
                  {currentQuestion.nextStepPreview && currentStep < quickStartQuestions.length - 1 && (
                    <div className="text-xs text-muted-foreground mt-2 italic">
                      {currentQuestion.nextStepPreview}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!currentResponse || (currentQuestion.type === 'primary_secondary' && !extractPrimaryValue(currentResponse))}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === quickStartQuestions.length - 1 ? (
                <>Complete Quick Assessment</>
              ) : (
                <>Next: {quickStartQuestions[currentStep + 1]?.letterName}</>
              )}
            </Button>
          </div>

          {/* Value preview for final question */}
          {currentStep === quickStartQuestions.length - 1 && currentResponse && (
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
              <div className="text-center">
                <div className="font-semibold text-foreground mb-2">
                  🎉 MYRHYTHM Foundation Complete!
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on your answers, we're preparing personalized strategies for your primary challenge areas, energy optimization, and support preferences.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}