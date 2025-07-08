
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

export function EmpowermentMoodWidget() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const moods = [
    { emoji: "😊", label: "Amazing", value: "amazing", color: "from-green-400 to-green-600" },
    { emoji: "😌", label: "Good", value: "good", color: "from-blue-400 to-blue-600" },
    { emoji: "😐", label: "Okay", value: "okay", color: "from-yellow-400 to-yellow-600" },
    { emoji: "😔", label: "Tough", value: "tough", color: "from-orange-400 to-orange-600" },
    { emoji: "😰", label: "Struggling", value: "struggling", color: "from-red-400 to-red-600" }
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowCelebration(true);
    
    // Save mood selection
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`mood_${today}`, mood);
    
    // Auto-hide celebration after 2 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 2000);
  };

  if (showCelebration) {
    return (
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <div className="animate-bounce">
            <Sparkles className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold">Thank you for sharing! 💖</h3>
          <p className="text-purple-100">
            Your feelings matter. We're here to support you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-purple-600" />
          How are you feeling right now?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          Tap the emoji that matches your mood
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className="p-3 bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium text-gray-700">{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Your mood helps us support you better 💙
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
