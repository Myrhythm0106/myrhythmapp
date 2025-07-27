import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, Target, Users, Brain } from "lucide-react";

interface WelcomeIntroductionProps {
  onGetStarted: () => void;
}

export function WelcomeIntroduction({ onGetStarted }: WelcomeIntroductionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
            Welcome to MyRhythm
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal journey to wellness, recovery, and empowerment starts here. 
            Let's create a rhythm that works for your life.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-beacon-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Personalized Goals</h3>
              <p className="text-gray-600 text-sm">
                Set and track goals that matter to your recovery and personal growth journey.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-beacon-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Brain Health Tools</h3>
              <p className="text-gray-600 text-sm">
                Access evidence-based tools and exercises designed to support cognitive wellness.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-beacon-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Support Network</h3>
              <p className="text-gray-600 text-sm">
                Connect with others, build your support circle, and share your journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect */}
        <Card className="bg-gradient-to-r from-beacon-50 to-indigo-50 border-beacon-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              What to Expect Next
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                  1
                </div>
                <p><strong>Tell us about yourself</strong> - We'll ask about your goals and what you're looking to achieve.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                  2
                </div>
                <p><strong>Complete a brief assessment</strong> - This helps us understand your unique needs and situation.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-beacon-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                  3
                </div>
                <p><strong>Customize your experience</strong> - We'll tailor the app to work best for you and your rhythm.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-8 py-4 text-lg bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900 transition-all duration-300 transform hover:scale-105"
          >
            Start My Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            This will take about 5-10 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
}