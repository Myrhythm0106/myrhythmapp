
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentFocusArea, focusAreas } from "@/utils/rhythmAnalysis";

interface RhythmSummaryViewProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function RhythmSummaryView({ onComplete, onBack }: RhythmSummaryViewProps) {
  const currentFocusArea = getCurrentFocusArea();
  const focusInfo = currentFocusArea ? focusAreas[currentFocusArea] : null;

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
      
      {focusInfo && (
        <div className="space-y-4 text-left bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-green-600" />
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Your Personalized Focus
            </Badge>
          </div>
          
          <h3 className={`text-xl font-semibold bg-gradient-to-r ${focusInfo.gradient} bg-clip-text text-transparent`}>
            {focusInfo.title}
          </h3>
          
          <p className="text-gray-700 leading-relaxed">
            {focusInfo.description}
          </p>
          
          <div className="text-sm text-gray-600">
            <strong>Phase:</strong> {focusInfo.phase}
          </div>
          
          <div className="bg-white/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Your focus will include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {focusInfo.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6 text-left bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <p className="text-lg leading-relaxed text-gray-700">
          Based on your answers, we'll customise your MyRhythm experience. This helps your brain receive the structure, guidance, and rhythm it needs today.
        </p>
        <p className="text-sm text-gray-600 italic">
          Every 6 months, we'll check in again. Because your rhythm will evolve. And we'll evolve with you.
        </p>
      </div>

      <div className="flex justify-between items-center pt-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
        )}
        
        <Button 
          onClick={onComplete}
          className={`py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 ${!onBack ? 'w-full max-w-md mx-auto' : ''}`}
        >
          Personalise MyRhythm
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
