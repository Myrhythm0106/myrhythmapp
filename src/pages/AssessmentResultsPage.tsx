import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Calendar,
  Users,
  Heart,
  Zap,
  CheckCircle
} from 'lucide-react';

export default function AssessmentResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get assessment result from location state
  const assessmentResult = location.state?.assessmentResult;
  
  if (!assessmentResult) {
    // Redirect to assessment if no results
    navigate('/mvp/assessment-flow');
    return null;
  }

  const handleStartJourney = () => {
    navigate('/guided-journey', { 
      state: { assessmentResult } 
    });
  };

  const handleExploreMode = () => {
    navigate('/explorer', {
      state: { assessmentResult }
    });
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-beacon-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-beacon-500 to-beacon-700 text-white mb-4">
            <Brain className="h-4 w-4 mr-2" />
            Assessment Complete
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Results
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your responses, we've identified your cognitive strengths and areas for support. 
            Here's your pathway to recovery.
          </p>
        </div>

        {/* Results Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-beacon-600 mb-2">
                  {100 - assessmentResult.overallScore}%
                </div>
                <p className="text-sm text-gray-600">Cognitive Wellness Score</p>
                <Progress value={100 - assessmentResult.overallScore} className="mt-2" />
              </div>
              
              <div className={`text-center p-4 rounded-lg ${getRiskLevelBg(assessmentResult.riskLevel)}`}>
                <div className={`text-lg font-semibold mb-1 ${getRiskLevelColor(assessmentResult.riskLevel)}`}>
                  {assessmentResult.riskLevel.charAt(0).toUpperCase() + assessmentResult.riskLevel.slice(1)} Priority
                </div>
                <p className="text-sm">Support Level Needed</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {assessmentResult.recommendations?.length || 3}
                </div>
                <p className="text-sm text-gray-600">Personalized Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Recovery Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessmentResult.recommendations?.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-beacon-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-beacon-600 mt-0.5" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              )) || (
                <div className="text-center text-gray-500">
                  No specific recommendations available. Your guided journey will provide personalized suggestions.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-beacon-50 to-beacon-100 border-beacon-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-beacon-800">
                <Heart className="h-5 w-5" />
                Recommended: Guided Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-beacon-700 mb-4">
                Let our AI coach set up your Memory Bridge and other tools based on your assessment results. 
                Perfect for brain injury recovery.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 text-beacon-600" />
                  <span>Personalized Memory Bridge setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-beacon-600" />
                  <span>Optimized scheduling based on your rhythm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-beacon-600" />
                  <span>Support Circle activation</span>
                </div>
              </div>
              <Button 
                onClick={handleStartJourney}
                className="w-full bg-gradient-to-r from-beacon-600 to-beacon-800"
              >
                Start Guided Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Explorer Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Jump straight into any of your 7 core features. Perfect if you want to explore 
                Memory Bridge and other tools at your own pace.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Immediate access to all features</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Self-paced discovery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Switch to guided mode anytime</span>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={handleExploreMode}
                className="w-full"
              >
                Explore Features
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Your assessment results have been saved. You can view them anytime in your dashboard.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-gray-500"
          >
            Skip setup - go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}