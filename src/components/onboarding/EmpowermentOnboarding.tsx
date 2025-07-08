
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

type OnboardingStep = "feeling" | "goal" | "ready";

export function EmpowermentOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("feeling");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const feelings = [
    { emoji: "😊", label: "Great", value: "great" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😔", label: "Tough", value: "tough" },
    { emoji: "😴", label: "Tired", value: "tired" },
    { emoji: "🤕", label: "Struggling", value: "struggling" }
  ];

  const goals = [
    { 
      emoji: "🏃‍♀️", 
      title: "Get Stronger", 
      description: "Recovery & wellness",
      value: "recovery",
      image: "💪"
    },
    { 
      emoji: "👨‍👩‍👧‍👦", 
      title: "Be With Family", 
      description: "Connect with loved ones",
      value: "family",
      image: "❤️"
    },
    { 
      emoji: "💼", 
      title: "Work & Achieve", 
      description: "Career & goals",
      value: "work",
      image: "🎯"
    },
    { 
      emoji: "🌟", 
      title: "Feel Amazing", 
      description: "Daily wellness",
      value: "wellness",
      image: "✨"
    }
  ];

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    setTimeout(() => {
      setCurrentStep("goal");
    }, 500);
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setTimeout(() => {
      setCurrentStep("ready");
    }, 500);
  };

  const handleStart = () => {
    // Store selections
    localStorage.setItem('myrhythm_initial_feeling', selectedFeeling || '');
    localStorage.setItem('myrhythm_primary_goal', selectedGoal || '');
    localStorage.setItem('myrhythm_empowerment_onboarding_completed', 'true');
    
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "feeling": return 1;
      case "goal": return 2;
      case "ready": return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Step {getStepNumber()} of 3
            </span>
          </div>
          <Progress value={(getStepNumber() / 3) * 100} className="h-2" />
        </div>

        {/* Step 1: How are you feeling? */}
        {currentStep === "feeling" && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  How are you feeling today?
                </h1>
                <p className="text-gray-600">
                  Just tap the face that matches your mood
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {feelings.map((feeling) => (
                  <button
                    key={feeling.value}
                    onClick={() => handleFeelingSelect(feeling.value)}
                    className="p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="text-4xl mb-2">{feeling.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{feeling.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: What brings you here? */}
        {currentStep === "goal" && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  What brings you here?
                </h1>
                <p className="text-gray-600">
                  Choose what matters most to you right now
                </p>
              </div>
              
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => handleGoalSelect(goal.value)}
                    className="w-full p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transform hover:scale-102 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{goal.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <div className="text-2xl">{goal.image}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Ready to start! */}
        {currentStep === "ready" && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                
                <h1 className="text-2xl font-bold">
                  You're Ready to Shine! ✨
                </h1>
                <p className="text-purple-100">
                  Your personalized empowerment journey starts now. 
                  We're here to support you every step of the way.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 space-y-2">
                <h3 className="font-semibold">What's waiting for you:</h3>
                <div className="text-sm space-y-1 text-purple-100">
                  <div>🎯 Daily focus that empowers you</div>
                  <div>🦸‍♀️ Your personal support team</div>
                  <div>🏆 Celebrate every win, big or small</div>
                  <div>🗻 Track your independence journey</div>
                </div>
              </div>
              
              <Button
                onClick={handleStart}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 py-4 text-lg font-bold rounded-2xl"
                size="lg"
              >
                Let's Go! 🚀
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
