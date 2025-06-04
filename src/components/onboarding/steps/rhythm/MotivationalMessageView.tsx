
import React from "react";
import { Heart } from "lucide-react";

export function MotivationalMessageView() {
  return (
    <div className="text-center space-y-8 py-12 max-w-2xl mx-auto">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
        <Heart className="h-12 w-12 text-white" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Welcome to Your Journey!
        </h1>
        <div className="space-y-3 text-lg leading-relaxed text-gray-700">
          <p className="font-semibold">
            🌟 You've taken the most important step – starting.
          </p>
          <p>
            Your brain is already beginning to heal, and MyRhythm is here to guide you every step of the way.
          </p>
          <p className="text-emerald-700 font-medium">
            Get ready to discover your strength, celebrate small wins, and build the rhythm that works for YOU.
          </p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Preparing your personalized guide...
      </div>
    </div>
  );
}
