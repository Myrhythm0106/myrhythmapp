import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { quickStartQuestions } from "./data/myrhythmQuestions";
import { RhythmQuestionCard } from "./RhythmQuestionCard";
import { BasicAssessmentResult } from "@/types/assessmentTypes";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Lightbulb, Target, Zap, TrendingUp } from "lucide-react";

interface EnhancedQuickStartAssessmentProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function EnhancedQuickStartAssessment({ userType, onComplete }: EnhancedQuickStartAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showInsight, setShowInsight] = useState(false);
  const [realTimeProfile, setRealTimeProfile] = useState<any>(null);
  const { hasFeature } = useSubscription();

  const currentQuestion = quickStartQuestions[currentStep];
  const progress = ((currentStep + 1) / quickStartQuestions.length) * 100;
  const currentResponse = responses[currentQuestion.id];

  const handleResponse = (questionId: string, value: any) => {
    const newResponses = {
      ...responses,
      [questionId]: value
    };
    setResponses(newResponses);
    
    // Generate real-time insights and profile preview
    const profile = generateRealTimeProfile(newResponses, currentStep + 1);
    setRealTimeProfile(profile);
    
    if (!showInsight) {
      setShowInsight(true);
    }
  };

  const generateRealTimeProfile = (responses: Record<string, any>, questionsAnswered: number) => {
    const totalQuestions = quickStartQuestions.length;
    const completionRate = (questionsAnswered / totalQuestions) * 100;
    
    return {
      completionRate,
      emergingPattern: getEmergingPattern(responses),
      strengthsDiscovered: getStrengthsDiscovered(responses),
      nextFocusArea: getNextFocusArea(responses, questionsAnswered),
      confidenceLevel: Math.min(95, 40 + (questionsAnswered * 8))
    };
  };

  const getEmergingPattern = (responses: Record<string, any>) => {
    if (responses.energy_peak === 'morning') return "🌅 Morning Achiever Pattern";
    if (responses.energy_peak === 'evening') return "🌙 Evening Flow Pattern";
    if (responses.overwhelm_handling === 'step_back') return "🧘 Reflective Processing Pattern";
    if (responses.overwhelm_handling === 'break_down') return "🎯 Strategic Planning Pattern";
    return "🔄 Adaptive Learning Pattern";
  };

  const getStrengthsDiscovered = (responses: Record<string, any>) => {
    const strengths = [];
    if (responses.mindset_challenge) strengths.push("Self-awareness");
    if (responses.support_preference) strengths.push("Support clarity");
    if (responses.energy_peak) strengths.push("Energy awareness");
    if (responses.progress_celebration) strengths.push("Recognition skills");
    return strengths;
  };

  const getNextFocusArea = (responses: Record<string, any>, questionsAnswered: number) => {
    if (questionsAnswered < 3) return "Cognitive patterns";
    if (questionsAnswered < 5) return "Energy optimization";
    if (questionsAnswered < 7) return "Support systems";
    return "Personalized plan";
  };

  const handleNext = () => {
    if (currentStep < quickStartQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowInsight(false);
    } else {
      const hasPersonalizedInsights = hasFeature('cognitiveInsights');
      
      const basicResult: BasicAssessmentResult = {
        id: `enhanced-quick-${Date.now()}`,
        userType,
        assessmentType: 'brief' as const,
        responses,
        completedAt: new Date().toISOString(),
        overallScore: 78 + Math.floor(Math.random() * 15),
        primaryRhythm: generatePrimaryRhythm(responses),
        keyInsights: generateBasicInsights(responses, userType),
        primaryFocus: generatePrimaryFocus(userType),
        myrhythmProfile: generateQuickProfile(responses)
      };
      
      onComplete(basicResult);
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

  const generateQuickProfile = (responses: Record<string, any>) => {
    return {
      primaryChallenge: extractPrimaryValue(responses.mindset_challenge) || 'Cognitive optimization',
      energyPeak: extractPrimaryValue(responses.energy_peak) || 'Variable',
      supportStyle: extractPrimaryValue(responses.support_preference) || 'Adaptive',
      quickRecommendations: [
        'Start with energy-aligned scheduling',
        'Build consistent check-in routines',
        'Practice mindful cognitive breaks'
      ]
    };
  };

  const generatePrimaryRhythm = (responses: Record<string, any>) => {
    if (responses.energy_peak === 'morning') return "Morning Achiever";
    if (responses.energy_peak === 'evening') return "Evening Creator";
    return "Balanced Powerhouse";
  };

  const generateBasicInsights = (responses: Record<string, any>, userType: UserType) => {
    return [
      "Your energy patterns show clear optimization opportunities",
      "Cognitive strategies can be personalized to your rhythm",
      "Support systems align well with your preferences"
    ];
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
      {/* Enhanced Header with Real-time Profile */}
      <div className="text-center">
        <Badge className="bg-primary/10 text-primary mb-4">
          Enhanced Quick Assessment
        </Badge>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Build Your MYRHYTHM Foundation
        </h2>
        <p className="text-muted-foreground">
          7 strategic questions with real-time insights as you discover your cognitive optimization plan
        </p>
      </div>

      {/* Real-time Profile Preview */}
      {realTimeProfile && (
        <Card className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 border-brain-health-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-brain-health-600" />
                  <span className="text-xs font-medium text-brain-health-700">Progress</span>
                </div>
                <div className="text-lg font-bold text-brain-health-800">
                  {Math.round(realTimeProfile.completionRate)}%
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-clarity-teal-600" />
                  <span className="text-xs font-medium text-clarity-teal-700">Pattern</span>
                </div>
                <div className="text-sm font-semibold text-clarity-teal-800">
                  {realTimeProfile.emergingPattern.split(' ')[0]}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-xs font-medium text-memory-emerald-700">Focus</span>
                </div>
                <div className="text-sm font-semibold text-memory-emerald-800">
                  {realTimeProfile.nextFocusArea}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Lightbulb className="h-4 w-4 text-sunrise-amber-600" />
                  <span className="text-xs font-medium text-sunrise-amber-700">Confidence</span>
                </div>
                <div className="text-sm font-bold text-sunrise-amber-800">
                  {realTimeProfile.confidenceLevel}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
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

          {/* Enhanced Micro-insight with "Why this matters" */}
          {showInsight && currentResponse && (
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">
                    💡 Why this matters for your rhythm
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {getSelectedOptionInsight()}
                  </div>
                  {realTimeProfile && (
                    <div className="text-xs text-brain-health-600 bg-brain-health-50 p-2 rounded">
                      <strong>Real-time insight:</strong> You're developing a {realTimeProfile.emergingPattern.toLowerCase()} - 
                      this helps us understand your optimal {realTimeProfile.nextFocusArea} approach.
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
              disabled={!currentResponse}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === quickStartQuestions.length - 1 ? (
                <>Complete Enhanced Assessment</>
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
                  🎉 Enhanced MYRHYTHM Foundation Complete!
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Based on your responses, we've identified your {realTimeProfile?.emergingPattern.toLowerCase()} 
                  with {realTimeProfile?.strengthsDiscovered.length} key strengths discovered.
                </div>
                <div className="text-xs text-brain-health-600">
                  Your personalized cognitive optimization plan is being prepared...
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
