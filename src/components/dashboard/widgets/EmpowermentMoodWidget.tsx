
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";

export function EmpowermentMoodWidget() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const moods = [
    { emoji: "😊", label: "Excellent", value: "excellent", gradient: "from-emerald-500 to-emerald-700", bgColor: "hover:bg-emerald-50" },
    { emoji: "😌", label: "Good", value: "good", gradient: "from-blue-500 to-blue-700", bgColor: "hover:bg-blue-50" },
    { emoji: "😐", label: "Neutral", value: "neutral", gradient: "from-slate-500 to-slate-700", bgColor: "hover:bg-slate-50" },
    { emoji: "😔", label: "Challenging", value: "challenging", gradient: "from-orange-500 to-orange-700", bgColor: "hover:bg-orange-50" },
    { emoji: "🤕", label: "Difficult", value: "difficult", gradient: "from-red-500 to-red-700", bgColor: "hover:bg-red-50" }
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowCelebration(true);
    
    // Save mood selection
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`mood_${today}`, mood);
    
    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  if (showCelebration) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white border-0 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold">Assessment Recorded</h3>
          <p className="text-slate-200 text-lg">
            Your wellness data has been professionally logged for analysis and personalized support.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <TrendingUp className="h-5 w-5" />
            <span>Building your wellness profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          Daily Wellness Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-600 text-center text-lg">
          Select your current wellness state for personalized support
        </p>
        
        <div className="grid grid-cols-5 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`p-4 bg-white rounded-2xl border-2 border-slate-200 ${mood.bgColor} hover:border-slate-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center group`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{mood.emoji}</div>
              <div className="text-sm font-semibold text-slate-700">{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Professional wellness tracking for optimized care
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
