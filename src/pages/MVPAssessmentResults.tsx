import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Crown, Download, ArrowRight, Brain, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ShareSummary } from '@/components/ui/ShareSummary';

interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  primaryRhythm: string;
  lockedInsights: string[];
}

export default function MVPAssessmentResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasFeature } = useSubscription();
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  
  const isPaid = searchParams.get('paid') === 'true' || hasFeature('fullAssessment');
  const assessmentType = searchParams.get('type') || 'brief';

  useEffect(() => {
    // Load or generate assessment results
    const storedResults = localStorage.getItem('lastAssessmentResults');
    if (storedResults) {
      setAssessmentResult(JSON.parse(storedResults));
    } else {
      // Generate sample results for demo
      const mockResult: AssessmentResult = {
        overallScore: 75,
        categoryScores: {
          memory: 80,
          attention: 70,
          executive: 75,
          mood: 65,
          daily_function: 85
        },
        recommendations: [
          "Memory Bridge will help you capture and organize important information automatically",
          "Your Cognitive Training provides personalized exercises to rebuild focus and attention",
          "Habits & Structure will help you take control of your daily planning and organization"
        ],
        riskLevel: 'moderate',
        primaryRhythm: 'Building Rhythm',
        lockedInsights: [
          "Your executive function scores suggest specific planning strategies would be beneficial",
          "Resilience Building exercises can significantly improve your emotional regulation",
          "Your profile suggests a personalized 90-day recovery protocol would be optimal",
          "Detailed cognitive mapping shows your strongest recovery pathways",
          "Personalized sleep optimization schedule based on your circadian patterns"
        ]
      };
      setAssessmentResult(mockResult);
    }
  }, []);

  const handleUpgrade = () => {
    navigate('/subscribe');
  };

  const handleRetakeAssessment = () => {
    navigate('/mvp-assessment?type=comprehensive');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse text-brain-health-500 mx-auto mb-4" />
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            Assessment Complete
          </Badge>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Your Cognitive Wellness Profile
          </h1>
          <p className="text-brain-health-600 mt-2">
            {isPaid ? 'Complete Results' : 'Preview Results - Upgrade for Full Analysis'}
          </p>
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
              {assessmentResult.overallScore}/100
            </div>
            <p className="text-brain-health-600 mb-4">
              Your rhythm profile: <strong>{assessmentResult.primaryRhythm}</strong>
            </p>
            <Progress value={assessmentResult.overallScore} className="h-3 max-w-md mx-auto" />
          </CardContent>
        </Card>

        {/* Free Results */}
        <Card className="premium-card border-brain-health-200/60 mb-6">
          <CardHeader>
            <CardTitle className="text-brain-health-700 flex items-center">
              <Star className="h-5 w-5 mr-2 text-memory-emerald-500" />
              Your Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessmentResult.recommendations.slice(0, isPaid ? assessmentResult.recommendations.length : 2).map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-brain-health-600">{rec}</p>
              </div>
            ))}
            
            {!isPaid && assessmentResult.recommendations.length > 2 && (
              <div className="flex items-center space-x-3 opacity-60">
                <Lock className="h-5 w-5 text-orange-500" />
                <p className="text-sm text-orange-600">
                  +{assessmentResult.recommendations.length - 2} more personalized recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown - Premium Feature */}
        {isPaid && (
          <Card className="premium-card border-brain-health-200/60 mb-6">
            <CardHeader>
              <CardTitle className="text-brain-health-700 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-brain-health-500" />
                Detailed Category Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(assessmentResult.categoryScores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize text-brain-health-700 font-medium">{category.replace('_', ' ')}</span>
                      <span className="text-brain-health-600">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium Upsell for Free Users */}
        {!isPaid && (
          <Card className="premium-card border-orange-200 bg-gradient-to-r from-orange-50/50 to-sunrise-amber-50/50 mb-6">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Unlock Your Complete Recovery Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-orange-600">
                Your {assessmentType} assessment revealed {assessmentResult.lockedInsights.length} additional insights 
                that could accelerate your recovery by up to 40%.
              </p>
              
              <div className="space-y-2">
                {assessmentResult.lockedInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex items-center space-x-3 opacity-60">
                    <Lock className="h-4 w-4 text-orange-500" />
                    <p className="text-sm text-orange-600">{insight}</p>
                  </div>
                ))}
                <div className="text-center py-2">
                  <p className="text-sm text-orange-500">
                    + {Math.max(0, assessmentResult.lockedInsights.length - 3)} more personalized insights
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
                  onClick={handleRetakeAssessment}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Take Comprehensive Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download Report - Available for both free and paid */}
        <Card className="premium-card border-brain-health-200/60 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brain-health-700 mb-1">
                  Download Your Report
                </h3>
                <p className="text-sm text-brain-health-600">
                  {isPaid ? 'Complete assessment report with all insights' : 'Summary report with basic insights'}
                </p>
              </div>
              <ShareSummary 
                title={`MyRhythm Assessment Results - ${assessmentResult.primaryRhythm}`}
                data={{
                  overallScore: assessmentResult.overallScore,
                  primaryRhythm: assessmentResult.primaryRhythm,
                  recommendations: isPaid ? assessmentResult.recommendations : assessmentResult.recommendations.slice(0, 2),
                  assessmentType: assessmentType,
                  completedAt: new Date().toLocaleDateString()
                }}
                className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white"
                triggerContent={
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleGoToDashboard}
            className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white"
          >
            Log In
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          {!isPaid && (
            <Button 
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-orange-500 to-sunrise-amber-500 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade for Full Access
            </Button>
          )}
          
          <Button 
            onClick={handleRetakeAssessment}
            variant="outline"
            className="border-brain-health-300 text-brain-health-700"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}