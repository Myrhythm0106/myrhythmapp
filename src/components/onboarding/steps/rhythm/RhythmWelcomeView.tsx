
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

interface RhythmWelcomeViewProps {
  onBegin: () => void;
}

export function RhythmWelcomeView({ onBegin }: RhythmWelcomeViewProps) {
  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
          Let's Find Your Rhythm
        </h1>
      </div>
      
      <div className="space-y-6 text-left bg-gradient-to-r from-beacon-50 to-indigo-50 p-8 rounded-2xl">
        <p className="text-lg leading-relaxed text-gray-700">
          Your story matters. Not just what happened, but how it changed your rhythm of life.
        </p>
        <p className="text-lg leading-relaxed text-gray-700">
          We'll ask a few short questions. Just answer honestly. There are no right or wrong answers—only your truth.
        </p>
      </div>

      <Button 
        onClick={onBegin}
        className="w-full max-w-md mx-auto py-6 text-lg bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900 transition-all duration-300 transform hover:scale-105"
      >
        Begin My Rhythm
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
