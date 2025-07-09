
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WellnessAssessmentStepProps {
  onFeelingSelect: (feeling: string) => void;
}

export function WellnessAssessmentStep({ onFeelingSelect }: WellnessAssessmentStepProps) {
  const feelings = [
    { emoji: "😊", label: "Excellent", value: "excellent", color: "hover:bg-emerald-50 hover:border-emerald-300" },
    { emoji: "😌", label: "Good", value: "good", color: "hover:bg-blue-50 hover:border-blue-300" },
    { emoji: "😐", label: "Neutral", value: "neutral", color: "hover:bg-slate-50 hover:border-slate-300" },
    { emoji: "😔", label: "Challenging", value: "challenging", color: "hover:bg-orange-50 hover:border-orange-300" },
    { emoji: "🤕", label: "Difficult", value: "difficult", color: "hover:bg-red-50 hover:border-red-300" }
  ];

  return (
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
              onClick={() => onFeelingSelect(feeling.value)}
              className={`p-8 bg-white rounded-3xl border-2 border-slate-200 ${feeling.color} transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="text-5xl mb-4">{feeling.emoji}</div>
              <div className="text-lg font-semibold text-slate-800">{feeling.label}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
