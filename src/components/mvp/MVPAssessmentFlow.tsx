import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { MVPProgressTracker } from './MVPProgressTracker';
import { FloatingSearch } from '@/components/ui/floating-search';
import { NavbarWithSearch } from '@/components/navigation/NavbarWithSearch';
import { AIPresenceIndicator } from '@/components/shared/AIPresenceIndicator';
import { AssessmentCompiling } from '@/components/onboarding/steps/rhythm/AssessmentCompiling';
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
  Heart,
  ArrowLeft,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { ContinuousGuidance } from "@/components/guidance/ContinuousGuidance";
import { useAnalytics } from '@/hooks/useAnalytics';
import { AssessmentTypeSelection } from './AssessmentTypeSelection';
import { BasicAssessmentResult } from '@/types/assessmentTypes';
import { useAssessmentResults } from '@/hooks/useAssessmentResults';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { useAuth } from '@/contexts/AuthContext';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
  category: 'memory' | 'attention' | 'executive' | 'mood' | 'daily_function';
}

const BRIEF_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'memory_1',
    question: 'How often do you forget important details from conversations?',
    category: 'memory',
    options: [
      { value: 'never', label: 'Never - I remember conversations clearly', score: 0 },
      { value: 'rarely', label: 'Rarely - Only very complex discussions', score: 1 },
      { value: 'sometimes', label: 'Sometimes - I miss key points', score: 2 },
      { value: 'often', label: 'Often - I struggle to remember details', score: 3 },
      { value: 'always', label: 'Always - Conversations feel overwhelming', score: 4 }
    ]
  },
  {
    id: 'attention_1',
    question: 'How easily can you maintain focus throughout your day?',
    category: 'attention',
    options: [
      { value: 'very_easy', label: 'Very Easy - I stay focused naturally', score: 0 },
      { value: 'easy', label: 'Mostly Easy - Minor distractions', score: 1 },
      { value: 'moderate', label: 'Moderate Difficulty - Requires effort', score: 2 },
      { value: 'difficult', label: 'Very Difficult - Constantly distracted', score: 3 },
      { value: 'impossible', label: 'Nearly Impossible - Cannot concentrate', score: 4 }
    ]
  },
  {
    id: 'planning_1',
    question: 'How well can you organize and plan your daily activities?',
    category: 'executive',
    options: [
      { value: 'excellent', label: 'Excellent - I feel in control of my day', score: 0 },
      { value: 'good', label: 'Good - Minor organizational challenges', score: 1 },
      { value: 'fair', label: 'Fair - Need help staying organized', score: 2 },
      { value: 'poor', label: 'Poor - Daily chaos overwhelms me', score: 3 },
      { value: 'very_poor', label: 'Very Poor - Cannot manage tasks', score: 4 }
    ]
  },
  {
    id: 'rhythm_1',
    question: 'How consistent is your daily energy throughout the day?',
    category: 'daily_function',
    options: [
      { value: 'very_consistent', label: 'Very Consistent - Good energy flow', score: 0 },
      { value: 'mostly_consistent', label: 'Mostly Consistent - Predictable patterns', score: 1 },
      { value: 'variable', label: 'Variable - Some good and bad periods', score: 2 },
      { value: 'unpredictable', label: 'Unpredictable - Energy all over the place', score: 3 },
      { value: 'exhausted', label: 'Exhausted - Constantly drained', score: 4 }
    ]
  },
  {
    id: 'healing_1',
    question: 'How often do stress and anxiety interfere with your thinking?',
    category: 'mood',
    options: [
      { value: 'never', label: 'Never - I feel calm and clear', score: 0 },
      { value: 'rarely', label: 'Rarely - Only during major stress', score: 1 },
      { value: 'sometimes', label: 'Sometimes - Manageable but noticeable', score: 2 },
      { value: 'often', label: 'Often - Stress affects my cognition', score: 3 },
      { value: 'constantly', label: 'Constantly - Overwhelmed and anxious', score: 4 }
    ]
  },
  // NEW: Optimal timing questions for meeting scheduling
  {
    id: 'optimal_timing_1',
    question: 'When do you typically feel most mentally sharp and focused?',
    category: 'daily_function',
    options: [
      { value: 'early_morning', label: 'Early Morning (6-9 AM) - I\'m sharpest first thing', score: 0 },
      { value: 'mid_morning', label: 'Mid-Morning (9-11 AM) - After I\'ve warmed up', score: 0 },
      { value: 'late_morning', label: 'Late Morning (11 AM-1 PM) - Just before lunch', score: 0 },
      { value: 'afternoon', label: 'Afternoon (1-4 PM) - Post-lunch energy boost', score: 0 },
      { value: 'evening', label: 'Evening (4-7 PM) - Second wind period', score: 0 }
    ]
  },
  {
    id: 'optimal_timing_2',
    question: 'What time of day do you prefer for important conversations or meetings?',
    category: 'daily_function',
    options: [
      { value: 'morning', label: 'Morning (8-11 AM) - When I\'m fresh and alert', score: 0 },
      { value: 'late_morning', label: 'Late Morning (10 AM-12 PM) - After settling in', score: 0 },
      { value: 'early_afternoon', label: 'Early Afternoon (12-2 PM) - Midday energy', score: 0 },
      { value: 'mid_afternoon', label: 'Mid-Afternoon (2-4 PM) - Avoid post-lunch dip', score: 0 },
      { value: 'flexible', label: 'I\'m flexible - No strong preference', score: 0 }
    ]
  },
  {
    id: 'optimal_timing_3',
    question: 'When can you typically maintain focus for 30+ minutes without interruption?',
    category: 'attention',
    options: [
      { value: 'very_early', label: 'Very Early Morning (6-8 AM) - Before the world wakes up', score: 0 },
      { value: 'morning', label: 'Morning (8-11 AM) - Natural focus time', score: 0 },
      { value: 'midday', label: 'Midday (11 AM-2 PM) - Peak performance hours', score: 0 },
      { value: 'afternoon', label: 'Afternoon (2-5 PM) - Steady concentration', score: 0 },
      { value: 'evening', label: 'Evening (5-8 PM) - Quiet focus time', score: 0 }
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

interface MVPAssessmentFlowProps {
  onComplete?: (result: any) => void;
  onBack?: () => void;
}

export function MVPAssessmentFlow({ onComplete, onBack }: MVPAssessmentFlowProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasFeature, tier } = useSubscription();
  
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const pathType = searchParams.get('path') as 'guided' | 'explorer' || 'guided';
  const nextRoute = searchParams.get('next');
  const { trackEvent } = useAnalytics();
  const { user } = useAuth();
  const { saveAssessmentResult, updateAssessmentResult } = useAssessmentResults();
  const { saveProgress, getCurrentStep } = useOnboardingProgress();
  
  const [showAssessmentTypeSelection, setShowAssessmentTypeSelection] = useState(true);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<'brief' | 'comprehensive'>('brief');
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  
  const assessmentType = selectedAssessmentType;
  const isComprehensive = assessmentType === 'comprehensive';
  const questions = isComprehensive ? COMPREHENSIVE_QUESTIONS : BRIEF_QUESTIONS;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleAssessmentTypeSelect = async (type: 'brief' | 'comprehensive') => {
    setSelectedAssessmentType(type);
    setShowAssessmentTypeSelection(false);

    // Save initial assessment data if user is logged in
    if (user) {
      const result = await saveAssessmentResult(type, {}, {}, {}, 'in_progress');
      if (result) {
        setCurrentAssessmentId(result.id);
        await saveProgress('assessment', { 
          assessmentType: type,
          currentQuestion: 0,
          answers: {}
        }, result.id);
      }
    }
  };

  const handleBackToTypeSelection = () => {
    setShowAssessmentTypeSelection(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  // Show assessment type selection first
  if (showAssessmentTypeSelection) {
    return (
      <AssessmentTypeSelection 
        onSelectType={handleAssessmentTypeSelect}
        onBack={onBack}
      />
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = async (value: string) => {
    const updatedAnswers = {
      ...answers,
      [currentQ.id]: value
    };
    
    setAnswers(updatedAnswers);

    // Save answer to database immediately if user is logged in
    if (user && currentAssessmentId) {
      await updateAssessmentResult(currentAssessmentId, {
        responses: updatedAnswers
      });
      
      // Also update progress
      await saveProgress('assessment', {
        assessmentType: selectedAssessmentType,
        currentQuestion,
        answers: updatedAnswers
      }, currentAssessmentId);
    }

    // Track question response
    trackEvent({
      eventType: 'assessment_question_answered',
      eventData: {
        questionIndex: currentQuestion,
        questionId: currentQ.id,
        response: value
      }
    });

    // Show micro-insights after certain questions
    setTimeout(() => {
      if (currentQ.id === 'attention_1') {
        toast.info("💡 Quick tip: Try 25-minute focus blocks to reduce distraction by 30-40%", { duration: 4000 });
      } else if (currentQ.id === 'rhythm_1') {
        toast.info("⚡ Insight: Align high-cognitive tasks with your peak energy windows for easier wins", { duration: 4000 });
      } else if (currentQ.id === 'memory_1') {
        toast.info("🧠 Memory aid: Write key points during conversations to improve retention by 60%", { duration: 4000 });
      }
    }, 800);
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

  const calculateResults = async () => {
    // Start compilation experience
    setIsCompiling(true);

    // Track assessment completion
    trackEvent({
      eventType: 'assessment_completed',
      eventData: {
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
        responses: answers,
        isPreview
      }
    });

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

    // Save completed assessment to database
    if (user && currentAssessmentId) {
      await updateAssessmentResult(currentAssessmentId, {
        responses: answers,
        scores: categoryScores,
        recommendations: { 
          recommendations: result.recommendations,
          lockedInsights: result.lockedInsights,
          overallScore,
          riskLevel
        },
        completion_status: 'completed'
      });

      // Update progress to results step
      await saveProgress('results', {
        assessmentType: selectedAssessmentType,
        result,
        completed: true
      }, currentAssessmentId);

      toast.success('Assessment results saved! You can access them anytime.');
    }

    // Show payment gate if user is on free tier and wants full results
    if (!hasFeature('fullAssessment') && isComprehensive) {
      setShowPaymentGate(true);
    }
  };

  const handleCompilationComplete = () => {
    setIsCompiling(false);
    setShowResults(true);

    // Call onComplete callback if provided (for MVP flow)
    if (onComplete) {
      onComplete(assessmentResult);
    } else {
        // Navigate based on path type and next route
        if (nextRoute === 'guided-journey' && pathType === 'guided') {
          navigate('/guided-journey', { state: { assessmentResult } });
        } else if (pathType === 'explorer') {
          navigate('/explorer?assessment=completed', { state: { assessmentResult } });
        } else {
          navigate('/assessment-results', { state: { assessmentResult } });
        }
    }
  };

  const generateRecommendations = (categoryScores: Record<string, number>, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    // MYRHYTHM-aligned recommendations
    if (categoryScores.memory > 50) {
      recommendations.push("Memory Bridge will help you capture and organize important information automatically");
    }
    if (categoryScores.attention > 50) {
      recommendations.push("Your Cognitive Training provides personalized exercises to rebuild focus and attention");
    }
    if (categoryScores.executive > 50) {
      recommendations.push("Habits & Structure will help you take control of your daily planning and organization");
    }
    if (categoryScores.daily_function > 50) {
      recommendations.push("Your Daily Rhythm optimization will help stabilize your energy patterns");
    }
    if (categoryScores.mood > 50) {
      recommendations.push("Healing & Mindfulness practices will reduce stress and promote cognitive calm");
    }
    
    // Add tracking for progress monitoring
    recommendations.push("Tracking Progress will show your improvements and keep you motivated");
    
    return recommendations.slice(0, 3); // Limit to top 3 recommendations
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
    trackEvent({
      eventType: 'upgrade_clicked',
      eventData: { source: 'assessment_results' }
    });
    navigate('/in-app-purchase');
  };

  const handleViewMyrhythm = () => {
    // Take users directly to Memory Bridge after assessment completion
    navigate('/memory-bridge');
  };

  const generatePreviewResults = (): BasicAssessmentResult => {
    const totalScore = Object.values(answers).reduce((sum, answerValue) => {
      const question = questions.find(q => answers[q.id] === answerValue);
      const option = question?.options.find(opt => opt.value === answerValue);
      return sum + (option?.score || 0);
    }, 0);
    const averageScore = Math.round((totalScore / questions.length) * 20);
    
    return {
      id: 'preview-' + Date.now(),
      userType: 'preview' as any, // Using preview as a temporary type
      assessmentType: 'brief',
      completedAt: new Date().toISOString(),
      responses: answers,
      overallScore: averageScore,
      primaryRhythm: averageScore >= 70 ? 'Steady Rhythm' : averageScore >= 50 ? 'Building Rhythm' : 'Finding Rhythm',
      keyInsights: [
        'Your memory patterns show potential for improvement',
        'Focus on establishing consistent daily routines',
        'Consider implementing structured memory aids'
      ],
      primaryFocus: averageScore >= 70 
        ? 'Optimizing your existing strengths' 
        : averageScore >= 50 
        ? 'Building sustainable cognitive habits'
        : 'Establishing foundational memory support systems'
    };
  };

  // Show compilation screen
  if (isCompiling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
        <NavbarWithSearch showLogo={true} showMenu={false} />
        <AssessmentCompiling
          onComplete={handleCompilationComplete}
          error={null}
        />
      </div>
    );
  }

  if (showResults && assessmentResult) {
    const canSeeFullResults = hasFeature('fullAssessment') || !isComprehensive;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
        <NavbarWithSearch showLogo={true} showMenu={false} />
        <MVPProgressTracker currentStep="results" />
         <div className="py-8">
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
      </div>
     );
   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      <NavbarWithSearch showLogo={true} showMenu={false} />
      <MVPProgressTracker currentStep="assessment" />
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            {isComprehensive ? 'Comprehensive' : 'Brief'} Assessment
          </Badge>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Understanding Your Rhythm - {isComprehensive ? 'Full Experience' : 'Brief Assessment'}
          </h1>
          <p className="text-brain-health-600 mt-2">
            This assessment helps us create your personalized recovery plan. 
            <span className="font-semibold text-memory-emerald-600"> Every answer helps us help you better.</span>
          </p>
          
          {/* Search hint */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Need help? Press <kbd className="px-2 py-1 bg-white rounded text-xs border">Ctrl+K</kbd> to search anything
              </span>
            </div>
          </div>
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
            <ArrowLeft className="mr-2 h-4 w-4" />
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
        
        {/* Continuous Guidance */}
        <ContinuousGuidance
          currentStep="Assessment"
          nextStep="Personalized Results"
          progress={progress}
          encouragementMessage="Every answer helps us understand how to support you better. You're taking control of your cognitive wellness."
        />
        </div>
      </div>
      
      {/* Floating Search for Help */}
      <FloatingSearch variant="help" />
    </div>
   );
}