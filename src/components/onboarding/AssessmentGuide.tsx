
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Target, Zap, CheckCircle, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { UserType } from "./steps/UserTypeStep";

interface AssessmentGuideProps {
  userType?: UserType | null;
  isCompact?: boolean;
  onStartAssessment?: () => void;
}

const assessmentSteps = [
  {
    icon: Brain,
    title: "Understanding Your Brain Profile",
    description: "Every brain is unique. Our assessment adapts to your specific journey type.",
    tips: [
      "Answer honestly - there are no 'wrong' answers",
      "Think about your typical patterns, not exceptional days",
      "Consider your experiences over the past few weeks"
    ],
    userTypeSpecific: {
      "brain-injury": "Focus on your recovery journey and current capabilities",
      "cognitive-optimization": "Consider your performance goals and growth areas",
      "caregiver": "Think about both your own needs and caregiving challenges",
      "wellness": "Reflect on your overall well-being and lifestyle patterns"
    }
  },
  {
    icon: Target,
    title: "Personalized Question Selection",
    description: "Questions are tailored to your brain health journey for maximum relevance.",
    tips: [
      "Each question builds on previous responses",
      "Skip patterns that don't apply to your situation",
      "Rate based on your personal scale, not comparisons to others"
    ],
    userTypeSpecific: {
      "brain-injury": "Questions focus on recovery patterns and adaptive strategies",
      "cognitive-optimization": "Emphasizes performance metrics and enhancement opportunities",
      "caregiver": "Includes both self-care and caregiving-specific challenges",
      "wellness": "Covers holistic well-being across multiple life domains"
    }
  },
  {
    icon: Zap,
    title: "AI-Powered Insights Engine",
    description: "Advanced analysis provides personalized recommendations based on your responses.",
    tips: [
      "Results include your unique cognitive rhythm patterns",
      "Recommendations are actionable and specific to your situation",
      "Progress tracking helps you see improvements over time"
    ],
    userTypeSpecific: {
      "brain-injury": "Insights focus on safe, evidence-based recovery strategies",
      "cognitive-optimization": "Recommendations target peak performance enhancement",
      "caregiver": "Balances self-care with effective caregiving approaches",
      "wellness": "Provides comprehensive lifestyle optimization suggestions"
    }
  },
  {
    icon: CheckCircle,
    title: "Your Personalized Action Plan",
    description: "Transform insights into daily practices that fit your lifestyle and goals.",
    tips: [
      "Start with small, manageable changes",
      "Build habits gradually for lasting impact",
      "Regular reassessment helps track progress"
    ],
    userTypeSpecific: {
      "brain-injury": "Emphasizes gradual progression and safety",
      "cognitive-optimization": "Focuses on measurable performance improvements",
      "caregiver": "Balances personal growth with caregiving responsibilities",
      "wellness": "Integrates multiple wellness dimensions"
    }
  }
];

export function AssessmentGuide({ userType, isCompact = false, onStartAssessment }: AssessmentGuideProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [readinessScore, setReadinessScore] = useState(0);

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    
    // Update readiness score based on engagement
    const newScore = Math.min(100, (expandedSteps.length + 1) * 25);
    setReadinessScore(newScore);
  };

  const getScoreColor = () => {
    if (readinessScore >= 75) return "text-green-600 bg-green-100";
    if (readinessScore >= 50) return "text-amber-600 bg-amber-100";
    return "text-blue-600 bg-blue-100";
  };

  if (isCompact) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Assessment Guide
            </CardTitle>
            <Badge className={`text-xs ${getScoreColor()}`}>
              {readinessScore}% Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            Quick tips for your brain health assessment
          </p>
          <div className="grid grid-cols-4 gap-2">
            {assessmentSteps.map((step, index) => {
              const Icon = step.icon;
              const isExpanded = expandedSteps.includes(index);
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-2 flex flex-col gap-1 ${isExpanded ? 'bg-primary/10' : ''}`}
                  onClick={() => toggleStep(index)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{step.title.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Assessment Preparation Guide
            </CardTitle>
            <Badge className={getScoreColor()}>
              Assessment Readiness: {readinessScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentSteps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedSteps.includes(index);
            const userSpecificInfo = userType ? step.userTypeSpecific[userType] : null;

            return (
              <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleStep(index)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="ml-13 space-y-3">
                    {userSpecificInfo && (
                      <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                        <p className="text-sm font-medium text-primary mb-1">For Your Journey:</p>
                        <p className="text-sm">{userSpecificInfo}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-2">Key Tips:</p>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>

      {onStartAssessment && readinessScore >= 50 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-2">Ready to Begin!</h3>
            <p className="text-sm text-green-700 mb-4">
              You've reviewed the assessment guide. Time to discover your unique brain health profile!
            </p>
            <Button onClick={onStartAssessment} className="bg-green-600 hover:bg-green-700">
              Start Your Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
