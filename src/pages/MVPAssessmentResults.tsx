import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Crown, Download, ArrowRight, Brain, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ShareSummary } from '@/components/ui/ShareSummary';
import { FloatingUpgradeBanner } from '@/components/ui/FloatingUpgradeBanner';

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

  const handleStartJourney = () => {
    if (assessmentResult) {
      // Set flag to trigger assessment-to-calendar flow
      localStorage.setItem('startAssessmentToCalendarFlow', 'true');
      navigate('/assessment-to-calendar');
    }
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
      {/* Floating Upgrade Banner */}
      <FloatingUpgradeBanner show={!isPaid} />
      
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
          <Card className="premium-card border-2 border-gradient-to-r from-teal-500 to-emerald-500 bg-gradient-to-br from-teal-50/80 to-emerald-50/80 mb-6 shadow-2xl animate-pulse">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-8 w-8 text-yellow-500 animate-bounce" />
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 animate-pulse font-bold">
                  🔥 TRANSFORMATION READY
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                ✨ Begin Your Cognitive Renaissance
              </CardTitle>
              <p className="text-teal-700 font-semibold text-lg">
                Experience these life-changing improvements in the next 30 days
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Outcome-focused messaging */}
              <div className="grid gap-4">
                <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-4 rounded-xl border-2 border-teal-300 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🧠</span>
                    </div>
                    <h4 className="font-bold text-teal-800">CLARITY BREAKTHROUGH</h4>
                  </div>
                  <p className="text-teal-700 font-medium">Experience your 'aha moments' return as cognitive fog lifts</p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border-2 border-yellow-300 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">⚡</span>
                    </div>
                    <h4 className="font-bold text-yellow-800">ENERGY SURGE</h4>
                  </div>
                  <p className="text-yellow-700 font-medium">Feel sustained mental energy throughout your day (not just morning coffee boosts)</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl border-2 border-purple-300 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🎯</span>
                    </div>
                    <h4 className="font-bold text-purple-800">FOCUS MASTERY</h4>
                  </div>
                  <p className="text-purple-700 font-medium">Watch tasks that once felt overwhelming become manageable and satisfying</p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 rounded-xl border-2 border-pink-300 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">😌</span>
                    </div>
                    <h4 className="font-bold text-pink-800">EMOTIONAL BALANCE</h4>
                  </div>
                  <p className="text-pink-700 font-medium">Experience steady moods and resilience that friends and family notice</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-xl border-2 border-green-300 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🏆</span>
                    </div>
                    <h4 className="font-bold text-green-800">DAILY WINS</h4>
                  </div>
                  <p className="text-green-700 font-medium">Celebrate completing goals that seemed impossible just weeks ago</p>
                </div>
              </div>

              {/* Social proof and urgency */}
              <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-xl border-2 border-red-300 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="h-6 w-6 text-yellow-500 animate-spin" />
                  <h4 className="font-bold text-red-800 text-lg">🎉 Join 15,847 survivors who transformed their lives!</h4>
                  <Star className="h-6 w-6 text-yellow-500 animate-spin" />
                </div>
                <p className="text-red-700 font-semibold mb-2">
                  "Sarah felt her memory return in just 21 days"
                </p>
                <p className="text-red-600 text-sm font-medium">
                  ⏰ Your cognitive renaissance begins the moment you upgrade
                </p>
              </div>
              
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

              <div className="flex flex-col gap-4 pt-6">
                <Button 
                  onClick={handleUpgrade}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-lg py-6 shadow-2xl animate-bounce"
                >
                  <Crown className="h-6 w-6 mr-3" />
                  🚀 BEGIN MY TRANSFORMATION JOURNEY - £7.99/month
                  <Badge className="ml-3 bg-yellow-400 text-black font-bold animate-pulse">
                    30-DAY GUARANTEE
                  </Badge>
                </Button>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white p-2 rounded-lg border border-teal-200 shadow-sm">
                    <p className="font-bold text-teal-800">⚡ Instant</p>
                    <p className="text-teal-600">Access</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-200 shadow-sm">
                    <p className="font-bold text-teal-800">🛡️ Money-back</p>
                    <p className="text-teal-600">Promise</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-200 shadow-sm">
                    <p className="font-bold text-teal-800">📈 Proven</p>
                    <p className="text-teal-600">Results</p>
                  </div>
                </div>
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
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleStartJourney}
            size="lg"
            className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 hover:from-brain-health-600 hover:to-memory-emerald-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🎯 START MY TRANSFORMATION
          </Button>
          
          {!isPaid && (
            <Button 
              onClick={handleUpgrade}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold shadow-xl animate-pulse"
            >
              <Crown className="h-5 w-5 mr-2" />
              🎯 UNLOCK MY TRANSFORMATION
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