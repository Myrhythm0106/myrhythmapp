import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Lock,
  Crown,
  Star,
  AlertTriangle,
  Zap,
  Heart
} from "lucide-react";
import { toast } from "sonner";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
  category: 'memory' | 'attention' | 'executive' | 'mood' | 'daily_function';
}

const BRIEF_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'memory_1',
    question: 'How often do you have difficulty remembering recent conversations?',
    category: 'memory',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'Rarely', score: 1 },
      { value: 'sometimes', label: 'Sometimes', score: 2 },
      { value: 'often', label: 'Often', score: 3 },
      { value: 'always', label: 'Always', score: 4 }
    ]
  },
  {
    id: 'attention_1',
    question: 'How easily can you focus on tasks for 30 minutes?',
    category: 'attention',
    options: [
      { value: 'very_easy', label: 'Very Easy', score: 0 },
      { value: 'easy', label: 'Somewhat Easy', score: 1 },
      { value: 'moderate', label: 'Moderate Difficulty', score: 2 },
      { value: 'difficult', label: 'Very Difficult', score: 3 },
      { value: 'impossible', label: 'Nearly Impossible', score: 4 }
    ]
  },
  {
    id: 'executive_1',
    question: 'How challenging is it to plan and organize daily activities?',
    category: 'executive',
    options: [
      { value: 'not_challenging', label: 'Not Challenging', score: 0 },
      { value: 'slightly', label: 'Slightly Challenging', score: 1 },
      { value: 'moderately', label: 'Moderately Challenging', score: 2 },
      { value: 'very', label: 'Very Challenging', score: 3 },
      { value: 'extremely', label: 'Extremely Challenging', score: 4 }
    ]
  },
  {
    id: 'mood_1',
    question: 'How would you describe your overall emotional state?',
    category: 'mood',
    options: [
      { value: 'excellent', label: 'Excellent', score: 0 },
      { value: 'good', label: 'Good', score: 1 },
      { value: 'fair', label: 'Fair', score: 2 },
      { value: 'poor', label: 'Poor', score: 3 },
      { value: 'very_poor', label: 'Very Poor', score: 4 }
    ]
  },
  {
    id: 'daily_1',
    question: 'How much do cognitive difficulties impact your daily life?',
    category: 'daily_function',
    options: [
      { value: 'no_impact', label: 'No Impact', score: 0 },
      { value: 'minimal', label: 'Minimal Impact', score: 1 },
      { value: 'moderate', label: 'Moderate Impact', score: 2 },
      { value: 'significant', label: 'Significant Impact', score: 3 },
      { value: 'severe', label: 'Severe Impact', score: 4 }
    ]
  }
];

const COMPREHENSIVE_QUESTIONS: AssessmentQuestion[] = [
  ...BRIEF_QUESTIONS,
  {
    id: 'memory_2',
    question: 'Do you have trouble remembering where you placed everyday items?',
    category: 'memory',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'Rarely', score: 1 },
      { value: 'sometimes', label: 'Sometimes', score: 2 },
      { value: 'often', label: 'Often', score: 3 },
      { value: 'always', label: 'Always', score: 4 }
    ]
  },
  {
    id: 'attention_2',
    question: 'How often do you get distracted during conversations?',
    category: 'attention',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'Rarely', score: 1 },
      { value: 'sometimes', label: 'Sometimes', score: 2 },
      { value: 'often', label: 'Often', score: 3 },
      { value: 'always', label: 'Always', score: 4 }
    ]
  },
  {
    id: 'executive_2',
    question: 'How difficult is it to make decisions, even simple ones?',
    category: 'executive',
    options: [
      { value: 'not_difficult', label: 'Not Difficult', score: 0 },
      { value: 'slightly', label: 'Slightly Difficult', score: 1 },
      { value: 'moderately', label: 'Moderately Difficult', score: 2 },
      { value: 'very', label: 'Very Difficult', score: 3 },
      { value: 'extremely', label: 'Extremely Difficult', score: 4 }
    ]
  }
];

interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  lockedInsights: string[];
}

export function MVPAssessmentFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeature, tier } = useSubscription();
  
  const assessmentType = location.state?.assessmentType || 'brief';
  const isComprehensive = assessmentType === 'comprehensive';
  const questions = isComprehensive ? COMPREHENSIVE_QUESTIONS : BRIEF_QUESTIONS;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showPaymentGate, setShowPaymentGate] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const handleNext = () => {
    if (!answers[currentQ.id]) {
      toast.error("Please select an answer before continuing");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    
    let totalScore = 0;
    let totalQuestions = 0;

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          const score = option.score;
          totalScore += score;
          totalQuestions++;
          
          if (!categoryScores[question.category]) {
            categoryScores[question.category] = 0;
            categoryCounts[question.category] = 0;
          }
          categoryScores[question.category] += score;
          categoryCounts[question.category]++;
        }
      }
    });

    // Normalize category scores (0-100 scale)
    Object.keys(categoryScores).forEach(category => {
      const avgScore = categoryScores[category] / categoryCounts[category];
      categoryScores[category] = Math.round((avgScore / 4) * 100); // Convert to percentage
    });

    const overallScore = Math.round((totalScore / (totalQuestions * 4)) * 100);
    const riskLevel: 'low' | 'moderate' | 'high' = 
      overallScore < 30 ? 'low' : overallScore < 60 ? 'moderate' : 'high';

    const result: AssessmentResult = {
      overallScore,
      categoryScores,
      riskLevel,
      recommendations: generateRecommendations(categoryScores, riskLevel),
      lockedInsights: generateLockedInsights(categoryScores, riskLevel)
    };

    setAssessmentResult(result);
    setShowResults(true);

    // Show payment gate if user is on free tier and wants full results
    if (!hasFeature('fullAssessment') && isComprehensive) {
      setShowPaymentGate(true);
    }
  };

  const generateRecommendations = (categoryScores: Record<string, number>, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    // Free insights (always visible)
    if (categoryScores.memory > 50) {
      recommendations.push("Memory Bridge sessions will help strengthen your memory networks");
    }
    if (categoryScores.attention > 50) {
      recommendations.push("Cognitive Training games can improve your focus and attention");
    }
    
    return recommendations;
  };

  const generateLockedInsights = (categoryScores: Record<string, number>, riskLevel: string): string[] => {
    const insights: string[] = [];
    
    // Premium insights (locked for free users)
    if (categoryScores.executive > 40) {
      insights.push("Your executive function scores suggest specific planning strategies would be beneficial");
    }
    if (categoryScores.mood > 30) {
      insights.push("Resilience Building exercises can significantly improve your emotional regulation");
    }
    if (riskLevel === 'high') {
      insights.push("Your profile suggests a personalized 90-day recovery protocol would be optimal");
    }
    insights.push("Detailed cognitive mapping shows your strongest recovery pathways");
    insights.push("Personalized sleep optimization schedule based on your circadian patterns");
    
    return insights;
  };

  const handleUpgrade = () => {
    // Navigate to payment/upgrade flow
    navigate('/subscription', { 
      state: { 
        from: 'assessment',
        assessmentData: assessmentResult 
      }
    });
  };

  const handleViewMyrhythm = () => {
    navigate('/mvp');
  };

  if (showResults && assessmentResult) {
    const canSeeFullResults = hasFeature('fullAssessment') || !isComprehensive;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Assessment Complete
            </Badge>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
              Your Cognitive Recovery Profile
            </h1>
          </div>

          {/* Overall Score */}
          <Card className="premium-card border-brain-health-200/60 mb-6">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${
                  assessmentResult.riskLevel === 'low' ? 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500' :
                  assessmentResult.riskLevel === 'moderate' ? 'bg-gradient-to-r from-sunrise-amber-500 to-clarity-teal-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                } text-white`}>
                  <Brain className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-brain-health-700 mb-2">
                Overall Cognitive Wellness Score
              </h3>
              <div className="text-4xl font-bold text-brain-health-600 mb-2">
                {100 - assessmentResult.overallScore}/100
              </div>
              <p className="text-brain-health-600">
                This indicates your current cognitive functioning level
              </p>
            </CardContent>
          </Card>

          {/* Free Results */}
          <Card className="premium-card border-brain-health-200/60 mb-6">
            <CardHeader>
              <CardTitle className="text-brain-health-700 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-memory-emerald-500" />
                Your Immediate Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-brain-health-600">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium Results Gate */}
          {!canSeeFullResults && (
            <Card className="premium-card border-orange-200 bg-gradient-to-r from-orange-50/50 to-sunrise-amber-50/50 mb-6">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Unlock Your Complete Recovery Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-orange-600">
                  Your comprehensive assessment revealed {assessmentResult.lockedInsights.length} additional insights 
                  that could accelerate your recovery by up to 40%.
                </p>
                
                <div className="space-y-2">
                  {assessmentResult.lockedInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className="flex items-center space-x-3 opacity-60">
                      <Lock className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-orange-600">{insight}</p>
                    </div>
                  ))}
                  <div className="text-center py-2">
                    <p className="text-sm text-orange-500">
                      + {assessmentResult.lockedInsights.length - 2} more personalized insights
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-orange-500 to-sunrise-amber-500 hover:from-orange-600 hover:to-sunrise-amber-600 text-white flex-1"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Unlock Full Results - £7.99/month
                  </Button>
                  <Button 
                    onClick={handleViewMyrhythm}
                    variant="outline"
                    className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
                  >
                    Continue with Free Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Results (Premium) */}
          {canSeeFullResults && (
            <>
              <Card className="premium-card border-brain-health-200/60 mb-6">
                <CardHeader>
                  <CardTitle className="text-brain-health-700 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-clarity-teal-500" />
                    Detailed Cognitive Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(assessmentResult.categoryScores).map(([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-brain-health-700 capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-brain-health-600">{100 - score}/100</span>
                      </div>
                      <Progress value={100 - score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="premium-card border-brain-health-200/60 mb-6">
                <CardHeader>
                  <CardTitle className="text-brain-health-700">
                    Your Personalized Recovery Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.lockedInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-clarity-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-brain-health-600">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* Action Buttons */}
          <div className="text-center">
            <Button 
              onClick={handleViewMyrhythm}
              className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Begin Your MYRHYTHM Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            {isComprehensive ? 'Comprehensive' : 'Brief'} Assessment
          </Badge>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Understanding Your Cognitive Wellness
          </h1>
          <p className="text-brain-health-600 mt-2">
            This assessment helps us create your personalized recovery plan. 
            <span className="font-semibold text-memory-emerald-600"> Every answer helps us help you better.</span>
          </p>
        </div>

        {/* Progress */}
        <Card className="premium-card border-brain-health-200/60 mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-brain-health-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-brain-health-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="premium-card border-brain-health-200/60 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-brain-health-700">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQ.id] || ''} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="text-brain-health-600 cursor-pointer flex-1 py-2"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-brain-health-300 text-brain-health-700"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Encouragement */}
        <Card className="premium-card border-sunrise-amber-200/60 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50 mt-8">
          <CardContent className="p-6 text-center">
            <Heart className="h-6 w-6 text-memory-emerald-500 mx-auto mb-2" />
            <p className="text-brain-health-600">
              <span className="font-semibold text-memory-emerald-600">You're taking a powerful step</span> towards 
              understanding and improving your cognitive health. This information helps us provide the most effective support for your unique needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}