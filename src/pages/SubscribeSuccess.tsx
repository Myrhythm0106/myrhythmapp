import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Brain, Calendar, Users, TrendingUp, BookOpen, Target, MessageCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscribeSuccess() {
  const navigate = useNavigate();

  const handleViewTimeline = () => {
    navigate("/onboarding/life-empowerment-guide");
  };

  const handleStartAssessment = () => {
    navigate("/onboarding/assessment");
  };

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Welcome to MyRhythm!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Your subscription is now active. Let's begin your journey to cognitive wellness.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Feature Overview */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Memory Bridge</h4>
                <p className="text-sm text-gray-600">
                  Record conversations and meetings with AI-powered action extraction
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Smart Calendar</h4>
                <p className="text-sm text-gray-600">
                  Intelligent scheduling with cognitive load management
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg">
              <Users className="h-6 w-6 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Support Circle</h4>
                <p className="text-sm text-gray-600">
                  Connect with family, friends, and care team for collaborative support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Progress Tracking</h4>
                <p className="text-sm text-gray-600">
                  Monitor your cognitive wellness journey with detailed insights
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Get Started
            </h3>
            
            <div className="grid gap-3">
              <div className="flex gap-3">
                <Button 
                  onClick={handleViewTimeline}
                  variant="outline" 
                  className="flex-1"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View MyRhythm Timeline
                </Button>
                <Button 
                  onClick={handleStartAssessment}
                  className="flex-1"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
              
              <Button 
                onClick={handleGoDashboard}
                variant="default"
                size="lg" 
                className="w-full"
              >
                Enter MyRhythm Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Need help getting started?
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                View Help Center
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
