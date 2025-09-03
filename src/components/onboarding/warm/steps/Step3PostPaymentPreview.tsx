import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Calendar, 
  Heart,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';

interface Step3PostPaymentPreviewProps {
  selectedPackage: string;
  onPathSelect: (path: 'guided' | 'explorer') => void;
  onAssessmentSelect: (type: 'brief' | 'comprehensive') => void;
}

export function Step3PostPaymentPreview({ 
  selectedPackage, 
  onPathSelect, 
  onAssessmentSelect 
}: Step3PostPaymentPreviewProps) {
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);

  const handlePathAndAssessment = (path: 'guided' | 'explorer', assessmentType: 'brief' | 'comprehensive') => {
    setSelectedPath(path);
    onPathSelect(path);
    onAssessmentSelect(assessmentType);
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-brain-health-900">
            Welcome to MyRhythm!
          </h2>
          <p className="text-lg text-brain-health-700">
            Your cognitive empowerment journey starts now
          </p>
        </div>

        <Badge className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Plan Activated
        </Badge>
      </div>

      {/* #IChoose Affirmation */}
      <Card className="border-sunrise-amber-200 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-sunrise-amber-800">
              #IChoose Empowerment
            </h3>
            <p className="text-lg font-medium text-sunrise-amber-700">
              "I choose to believe in my brain's ability to heal, grow, and thrive"
            </p>
            <p className="text-sm text-sunrise-amber-600">
              This month's theme: <strong>RESILIENCE</strong> - Your daily statements will align with building inner strength
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Choose Your Path */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-brain-health-900 mb-2">
            How Would You Like to Begin?
          </h3>
          <p className="text-brain-health-700 max-w-3xl mx-auto">
            Choose your preferred learning style. Both paths give you access to all MyRhythm features - 
            the difference is in how much guidance you receive along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guided Path */}
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-memory-emerald-800">
                Guided Journey
              </CardTitle>
              <Badge className="bg-memory-emerald-100 text-memory-emerald-700 mx-auto">
                Recommended for Beginners
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-memory-emerald-50 p-3 rounded-lg border border-memory-emerald-200">
                <p className="text-center text-memory-emerald-800 font-semibold text-sm mb-1">
                  🎯 Perfect if you want coaching & support
                </p>
                <p className="text-center text-brain-health-700 text-sm">
                  Our AI coach guides you step-by-step, suggesting which features to use when and helping you build sustainable habits.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Zap className="h-4 w-4 text-memory-emerald-500" />
                  <span>Coach-like daily recommendations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Brain className="h-4 w-4 text-memory-emerald-500" />
                  <span>Predictive feature suggestions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Heart className="h-4 w-4 text-memory-emerald-500" />
                  <span>Encouraging progress tracking</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handlePathAndAssessment('guided', 'brief')}
                className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:opacity-90 text-white"
                disabled={!!selectedPath}
              >
                Start Guided Journey
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-brain-health-500">
                Includes: Brief Assessment (2-3 minutes)
              </p>
            </CardContent>
          </Card>

          {/* Explorer Path */}
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-brain-health-200 bg-gradient-to-br from-brain-health-50/50 to-white">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-brain-health-800">
                Explorer Journey
              </CardTitle>
              <Badge className="bg-brain-health-100 text-brain-health-700 mx-auto">
                For Independent Users
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-brain-health-50 p-3 rounded-lg border border-brain-health-200">
                <p className="text-center text-brain-health-800 font-semibold text-sm mb-1">
                  🎯 Perfect if you want independence & full control
                </p>
                <p className="text-center text-brain-health-700 text-sm">
                  Jump straight into your full dashboard with all features available. Learn and explore at your own pace.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Calendar className="h-4 w-4 text-brain-health-500" />
                  <span>Full feature access from day 1</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Brain className="h-4 w-4 text-brain-health-500" />
                  <span>Comprehensive assessment option</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-brain-health-600">
                  <Sparkles className="h-4 w-4 text-brain-health-500" />
                  <span>Personalized insights & analytics</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => handlePathAndAssessment('explorer', 'brief')}
                  className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:opacity-90 text-white"
                  disabled={!!selectedPath}
                >
                  Start with Brief Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handlePathAndAssessment('explorer', 'comprehensive')}
                  className="w-full border-brain-health-300 hover:bg-brain-health-50"
                  disabled={!!selectedPath}
                >
                  Start with Comprehensive Assessment
                </Button>
              </div>
              
              <p className="text-xs text-center text-brain-health-500">
                Brief: 2-3 minutes | Comprehensive: 8-10 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Features Preview */}
      <Card className="border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/30 to-brain-health-50/30">
        <CardHeader>
          <CardTitle className="text-center text-clarity-teal-800">
            <Sparkles className="h-5 w-5 inline mr-2" />
            What's Waiting for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Brain className="h-8 w-8 mx-auto text-memory-emerald-500" />
              <p className="text-sm font-medium text-brain-health-700">Memory Bridge</p>
              <p className="text-xs text-brain-health-600">Never forget important moments</p>
            </div>
            <div className="space-y-2">
              <Calendar className="h-8 w-8 mx-auto text-brain-health-500" />
              <p className="text-sm font-medium text-brain-health-700">Smart Calendar</p>
              <p className="text-xs text-brain-health-600">Your personalized rhythm</p>
            </div>
            <div className="space-y-2">
              <Heart className="h-8 w-8 mx-auto text-clarity-teal-500" />
              <p className="text-sm font-medium text-brain-health-700">ACTS Repository</p>
              <p className="text-xs text-brain-health-600">Track your action items</p>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 mx-auto text-sunrise-amber-500" />
              <p className="text-sm font-medium text-brain-health-700">Support Circle</p>
              <p className="text-xs text-brain-health-600">Your caring community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}