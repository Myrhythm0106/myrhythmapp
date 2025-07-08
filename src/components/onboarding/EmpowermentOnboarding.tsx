
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Heart, ArrowRight, Target, Users, Briefcase, Activity } from "lucide-react";

type OnboardingStep = "feeling" | "goal" | "ready";

export function EmpowermentOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("feeling");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const feelings = [
    { emoji: "😊", label: "Excellent", value: "excellent", color: "hover:bg-emerald-50 hover:border-emerald-300" },
    { emoji: "😌", label: "Good", value: "good", color: "hover:bg-blue-50 hover:border-blue-300" },
    { emoji: "😐", label: "Neutral", value: "neutral", color: "hover:bg-slate-50 hover:border-slate-300" },
    { emoji: "😔", label: "Challenging", value: "challenging", color: "hover:bg-orange-50 hover:border-orange-300" },
    { emoji: "🤕", label: "Difficult", value: "difficult", color: "hover:bg-red-50 hover:border-red-300" }
  ];

  const goals = [
    { 
      icon: Activity,
      title: "Health & Recovery", 
      description: "Optimize wellness and rehabilitation",
      value: "recovery",
      gradient: "from-emerald-600 to-emerald-800",
      accentColor: "bg-emerald-100"
    },
    { 
      icon: Users,
      title: "Family & Relationships", 
      description: "Strengthen personal connections",
      value: "family",
      gradient: "from-blue-600 to-blue-800",
      accentColor: "bg-blue-100"
    },
    { 
      icon: Briefcase,
      title: "Career & Achievement", 
      description: "Professional development and goals",
      value: "work",
      gradient: "from-indigo-600 to-indigo-800",
      accentColor: "bg-indigo-100"
    },
    { 
      icon: Target,
      title: "Personal Excellence", 
      description: "Daily wellness and self-improvement",
      value: "wellness",
      gradient: "from-purple-600 to-purple-800",
      accentColor: "bg-purple-100"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Professional Progress Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-700">
              Step {getStepNumber()} of 3
            </span>
          </div>
          <Progress value={(getStepNumber() / 3) * 100} className="h-3 bg-slate-200" />
        </div>

        {/* Step 1: Professional Wellness Assessment */}
        {currentStep === "feeling" && (
          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-800">
                  Wellness Assessment
                </h1>
                <p className="text-xl text-slate-600 max-w-lg mx-auto">
                  Please select your current wellness state for personalized support
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                {feelings.map((feeling) => (
                  <button
                    key={feeling.value}
                    onClick={() => handleFeelingSelect(feeling.value)}
                    className={`p-8 bg-white rounded-3xl border-2 border-slate-200 ${feeling.color} transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <div className="text-5xl mb-4">{feeling.emoji}</div>
                    <div className="text-lg font-semibold text-slate-800">{feeling.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional Goal Setting */}
        {currentStep === "goal" && (
          <Card className="border-0 shadow-2xl bg-white">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-800">
                  Priority Focus Area
                </h1>
                <p className="text-xl text-slate-600 max-w-lg mx-auto">
                  Select your primary area of focus for personalized guidance
                </p>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal) => {
                  const IconComponent = goal.icon;
                  return (
                    <button
                      key={goal.value}
                      onClick={() => handleGoalSelect(goal.value)}
                      className="w-full p-8 bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transform hover:scale-102 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 bg-gradient-to-br ${goal.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-800 mb-2">{goal.title}</h3>
                          <p className="text-lg text-slate-600">{goal.description}</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                          <ArrowRight className="h-6 w-6 text-slate-600" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Professional Welcome */}
        {currentStep === "ready" && (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-4xl font-bold">
                  Welcome to Your Journey
                </h1>
                <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Your personalized empowerment platform is ready. We've configured 
                  professional-grade tools to support your independence and wellness goals.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 space-y-4">
                <h3 className="text-2xl font-semibold">Professional Features Available:</h3>
                <div className="grid grid-cols-2 gap-4 text-lg text-slate-200">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5" />
                    <span>Daily focus optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>Professional support network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5" />
                    <span>Progress analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5" />
                    <span>Achievement tracking</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleStart}
                className="w-full max-w-md bg-white text-slate-800 hover:bg-slate-100 py-6 text-xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Launch Platform
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
