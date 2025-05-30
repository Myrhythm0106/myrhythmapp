
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

interface RhythmSummaryViewProps {
  onComplete: () => void;
}

export function RhythmSummaryView({ onComplete }: RhythmSummaryViewProps) {
  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          We Found Your Rhythm
        </h1>
      </div>
      
      <div className="space-y-6 text-left bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl">
        <p className="text-lg leading-relaxed text-gray-700">
          Based on your answers, we'll customize your MyRhythm experience. This helps your brain receive the structure, guidance, and rhythm it needs today.
        </p>
        <p className="text-sm text-gray-600 italic">
          Every 6 months, we'll check in again. Because your rhythm will evolve. And we'll evolve with you.
        </p>
      </div>

      <Button 
        onClick={onComplete}
        className="w-full max-w-md mx-auto py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105"
      >
        Personalize MyRhythm
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
