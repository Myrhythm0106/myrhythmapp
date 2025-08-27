import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Target, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function JourneyProgressWidget() {
  const navigate = useNavigate();
  
  // Check if guided journey is complete
  const isJourneyComplete = localStorage.getItem('guided_journey_complete') === 'true';
  
  // Mock data for now - in production, this would come from user context/state
  const journeyData = {
    totalSteps: 4,
    completedSteps: 2,
    currentStep: {
      id: 'support-circle',
      title: 'Support Circle Setup',
      description: 'Connect your care team',
      estimatedTime: '4 min'
    },
    nextRecommendation: 'Memory Bridge Practice',
    weeklyGoal: 'Complete foundation setup'
  };

  const progressPercentage = (journeyData.completedSteps / journeyData.totalSteps) * 100;

  if (isJourneyComplete) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg text-green-800">Journey Complete! 🎉</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 text-sm mb-4">
            You've successfully activated your MyRhythm foundation. Ready to explore advanced features?
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/guided-journey')}
              className="w-full border-green-300 text-green-700 hover:bg-green-100"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Unlock Advanced Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-600" />
            Your Journey Progress
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            {journeyData.completedSteps}/{journeyData.totalSteps} steps
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-blue-700 mb-2">
            <span>Setup Progress</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="bg-white/70 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-blue-900">Next Up</h4>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Clock className="h-3 w-3" />
              <span>{journeyData.currentStep.estimatedTime}</span>
            </div>
          </div>
          <p className="text-sm text-blue-700 font-medium">{journeyData.currentStep.title}</p>
          <p className="text-xs text-blue-600">{journeyData.currentStep.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/guided-journey')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="sm"
          >
            Continue Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/guided-journey')}
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            View Full Roadmap
          </Button>
        </div>

        {/* Weekly Goal */}
        <div className="text-center pt-2 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            This week: <span className="font-medium">{journeyData.weeklyGoal}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}