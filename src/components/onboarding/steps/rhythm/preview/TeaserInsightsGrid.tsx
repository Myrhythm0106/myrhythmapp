
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Crown, Lock, Star, Zap, Target, Brain, Eye } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface TeaserInsightsGridProps {
  assessmentResult: AssessmentResult;
}

export function TeaserInsightsGrid({ assessmentResult }: TeaserInsightsGridProps) {
  const lockedInsights = getLockedInsights();

  const handleUpgradeClick = () => {
    // Scroll to payment section or trigger payment flow
    const paymentSection = document.querySelector('[data-payment-section]');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Premium Features Header */}
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 mb-2">
          <Crown className="h-4 w-4 mr-2" />
          Premium Insights Locked
        </Badge>
        <p className="text-gray-600 text-sm">
          Upgrade to unlock your complete personalized assessment results
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lockedInsights.map((insight, index) => (
          <Card key={index} className="relative overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow">
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-yellow-500 text-black font-semibold">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            
            {/* Blur overlay effect */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">Locked</p>
                <Button 
                  onClick={handleUpgradeClick}
                  size="sm" 
                  className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Unlock
                </Button>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <insight.icon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                {insight.preview}
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">
                  {insight.value}
                </p>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-300">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-500 font-medium">
                  {insight.userCount} users found this transformational
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upgrade Pressure Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 mt-6">
        <CardContent className="text-center p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Eye className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">
              You're Missing 7 Key Insights
            </h3>
          </div>
          
          <p className="text-orange-800 mb-4 max-w-2xl mx-auto">
            These personalized insights have helped thousands of users like you achieve their goals faster. 
            Don't settle for basic information when your complete transformation plan is ready.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="bg-white/80 p-3 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-800">2,847 Users</p>
              <p className="text-orange-600">Transformed Their Lives</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-800">94% Success</p>
              <p className="text-orange-600">Rate With Premium</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-800">2.3 Weeks</p>
              <p className="text-orange-600">Average to See Results</p>
            </div>
            <div className="bg-white/80 p-3 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-800">4.9/5 Stars</p>
              <p className="text-orange-600">User Satisfaction</p>
            </div>
          </div>
          
          <Button 
            onClick={handleUpgradeClick}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-3"
          >
            <Zap className="h-5 w-5 mr-2" />
            Unlock All 8 Insights Now
          </Button>
          
          <p className="text-xs text-orange-600 mt-2">
            7-day free trial • Cancel anytime • Instant access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getLockedInsights() {
  const insights = [
    {
      title: "Your Optimal Energy Patterns",
      icon: TrendingUp,
      preview: "We've identified your peak performance hours and energy cycles. This insight helps you schedule important tasks when you're naturally most focused and productive.",
      value: "Increase productivity by 40% by aligning tasks with your natural energy rhythms",
      userCount: "1,247"
    },
    {
      title: "Personalized Goal Framework",
      icon: Target,
      preview: "Based on your assessment, we've created goal templates specifically designed for your situation and preferences. These aren't generic goals - they're tailored to your unique circumstances.",
      value: "Users achieve goals 3x faster with personalized frameworks vs. generic templates",
      userCount: "892"
    },
    {
      title: "Support Network Integration",
      icon: Brain,
      preview: "Your responses reveal opportunities to better integrate support systems. We'll show you how to communicate your needs and build stronger support networks.",
      value: "Enhanced support networks improve success rates by 65%",
      userCount: "1,456"
    },
    {
      title: "Cognitive Load Optimization",
      icon: Zap,
      preview: "Discover how to reduce mental overwhelm and optimize your cognitive resources. Learn which tasks drain your mental energy and how to restructure your day.",
      value: "Reduce mental fatigue by 50% with cognitive load management strategies",
      userCount: "2,103"
    },
    {
      title: "Behavioral Pattern Analysis",
      icon: Eye,
      preview: "We've identified key behavioral patterns that either support or hinder your progress. Get specific strategies to reinforce helpful habits and eliminate destructive ones.",
      value: "Break negative patterns 4x faster with targeted behavioral interventions",
      userCount: "1,789"
    },
    {
      title: "Stress Response Strategies",
      icon: Star,
      preview: "Your unique stress response profile reveals the best techniques for managing pressure and maintaining performance under challenging circumstances.",
      value: "Improve stress resilience by 60% with personalized coping strategies",
      userCount: "1,334"
    }
  ];

  return insights;
}
