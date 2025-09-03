import React from 'react';
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
  Trophy,
  Target,
  Zap,
  Star
} from 'lucide-react';

interface YourJourneyAwaitsProps {
  selectedPackage: string;
  onBeginJourney: () => void;
  onExploreDashboard: () => void;
}

export function YourJourneyAwaits({ 
  selectedPackage, 
  onBeginJourney, 
  onExploreDashboard 
}: YourJourneyAwaitsProps) {
  
  const packageColors = {
    starter: 'from-memory-emerald-500 to-brain-health-500',
    plus: 'from-brain-health-500 to-clarity-teal-500', 
    pro: 'from-clarity-teal-500 to-sunrise-amber-500'
  };

  const congratulationsMessages = {
    starter: "You've taken the first powerful step towards cognitive empowerment!",
    plus: "Excellent choice! You're ready for enhanced brain wellness support!",
    pro: "Outstanding! You've unlocked the full MyRhythm transformation experience!"
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Celebration Header */}
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-brain-health-900">
            🎉 Congratulations! 🎉
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-brain-health-800">
            Your Journey Awaits!
          </h2>
          <p className="text-lg text-brain-health-700 max-w-2xl mx-auto">
            {congratulationsMessages[selectedPackage as keyof typeof congratulationsMessages]}
          </p>
        </div>

        <Badge className={`bg-gradient-to-r ${packageColors[selectedPackage as keyof typeof packageColors]} text-white px-6 py-3 text-lg animate-bounce`}>
          <Sparkles className="h-5 w-5 mr-2" />
          {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Plan Activated!
        </Badge>
      </div>

      {/* What to Expect */}
      <Card className="border-2 border-sunrise-amber-200 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-sunrise-amber-800 flex items-center justify-center gap-2">
            <Star className="h-6 w-6" />
            What to Expect Next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-brain-health-900">Personalized Assessment</h3>
              <p className="text-sm text-brain-health-700">
                Complete your cognitive profile with our smart assessment (2-10 minutes)
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-brain-health-900">Instant Insights</h3>
              <p className="text-sm text-brain-health-700">
                Get your personalized brain health dashboard with actionable recommendations
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-brain-health-900">Your Daily Rhythm</h3>
              <p className="text-sm text-brain-health-700">
                Start building habits that support your brain's natural patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Options - Clear Explanation */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-brain-health-900 mb-3">
            Choose How You'd Like to Begin
          </h3>
          <p className="text-brain-health-700 text-lg max-w-3xl mx-auto">
            We offer two paths to help you get the most from MyRhythm. Both lead to the same powerful tools - 
            the difference is in how much guidance you'd like along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guided Journey */}
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/70 to-white">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-memory-emerald-800">
                🧭 Guided Journey
              </CardTitle>
              <Badge className="bg-memory-emerald-100 text-memory-emerald-700 mx-auto text-sm">
                Recommended for First-Time Users
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-memory-emerald-50 p-4 rounded-lg border border-memory-emerald-200">
                <p className="text-center text-memory-emerald-800 font-semibold text-sm mb-2">
                  🎯 What This Means:
                </p>
                <p className="text-center text-brain-health-700 text-sm">
                  Our AI coach will guide you step-by-step through MyRhythm, suggesting which features to use when, 
                  and helping you build sustainable habits gradually.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Daily coaching prompts</strong> - Get personalized suggestions each morning
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Progressive feature unlocking</strong> - Master one tool before moving to the next
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Encouraging progress tracking</strong> - Celebrate every small win
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={onBeginJourney}
                className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:opacity-90 text-white py-6 text-lg font-semibold"
              >
                Begin My Guided Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-brain-health-500">
                Perfect if you want: Structure • Support • Gentle Learning Curve
              </p>
            </CardContent>
          </Card>

          {/* Explorer Journey */}
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-brain-health-200 bg-gradient-to-br from-brain-health-50/70 to-white">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-brain-health-800">
                🚀 Explorer Journey
              </CardTitle>
              <Badge className="bg-brain-health-100 text-brain-health-700 mx-auto text-sm">
                For Independent Learners
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-brain-health-50 p-4 rounded-lg border border-brain-health-200">
                <p className="text-center text-brain-health-800 font-semibold text-sm mb-2">
                  🎯 What This Means:
                </p>
                <p className="text-center text-brain-health-700 text-sm">
                  Jump straight into your full MyRhythm dashboard with all features available. 
                  You'll have complete freedom to explore and use tools in your own way.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brain-health-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Immediate full access</strong> - All features available from day one
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brain-health-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Self-directed learning</strong> - Discover features at your own pace
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-brain-health-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brain-health-700">
                    <strong>Advanced analytics</strong> - Deep insights and comprehensive data
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={onExploreDashboard}
                className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:opacity-90 text-white py-6 text-lg font-semibold"
              >
                Explore Full Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-brain-health-500">
                Perfect if you want: Freedom • Full Control • Immediate Access
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Preview */}
      <Card className="border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/30 to-brain-health-50/30">
        <CardHeader>
          <CardTitle className="text-center text-clarity-teal-800 text-xl">
            <Sparkles className="h-6 w-6 inline mr-2" />
            Your MyRhythm Tools Await
          </CardTitle>
          <p className="text-center text-brain-health-700">
            Regardless of which path you choose, you'll have access to all these powerful features:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <Brain className="h-10 w-10 mx-auto text-memory-emerald-500" />
              <p className="text-sm font-semibold text-brain-health-700">Memory Bridge</p>
              <p className="text-xs text-brain-health-600">Capture and connect important moments</p>
            </div>
            <div className="space-y-3">
              <Calendar className="h-10 w-10 mx-auto text-brain-health-500" />
              <p className="text-sm font-semibold text-brain-health-700">Smart Calendar</p>
              <p className="text-xs text-brain-health-600">AI-optimized scheduling for your rhythm</p>
            </div>
            <div className="space-y-3">
              <Heart className="h-10 w-10 mx-auto text-clarity-teal-500" />
              <p className="text-sm font-semibold text-brain-health-700">ACTS Repository</p>
              <p className="text-xs text-brain-health-600">Track achievements and action items</p>
            </div>
            <div className="space-y-3">
              <Users className="h-10 w-10 mx-auto text-sunrise-amber-500" />
              <p className="text-sm font-semibold text-brain-health-700">Support Circle</p>
              <p className="text-xs text-brain-health-600">Connect with your caring community</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Footer */}
      <div className="text-center bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 p-6 rounded-xl border border-memory-emerald-200">
        <p className="text-lg font-semibold text-brain-health-800 mb-2">
          🌟 Remember: This is YOUR journey to cognitive empowerment
        </p>
        <p className="text-brain-health-700">
          Every small step you take strengthens your brain's resilience and unlocks your potential. 
          We're here to support you every step of the way.
        </p>
      </div>
    </div>
  );
}