
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentFocusArea, focusAreas } from "@/utils/rhythmAnalysis";
import { useNavigate } from "react-router-dom";

interface RhythmSummaryViewProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function RhythmSummaryView({ onComplete, onBack }: RhythmSummaryViewProps) {
  const navigate = useNavigate();
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false);
  const currentFocusArea = getCurrentFocusArea();
  const focusInfo = currentFocusArea ? focusAreas[currentFocusArea] : null;

  const handlePersonalizeClick = () => {
    setShowMotivationalMessage(true);
    
    // Show motivational message for 4 seconds, then navigate to user guide
    setTimeout(() => {
      navigate("/guide");
    }, 4000);
  };

  const handleUserGuideClick = () => {
    navigate("/guide");
  };

  // Map focus areas to MYRHYTHM steps (0-based index)
  const getFocusAreaStepIndex = (focusArea: string) => {
    switch (focusArea) {
      case 'structure': return 2; // R - Routine
      case 'emotional': return 1; // Y - Yearning 
      case 'achievement': return 0; // M - Mindful
      case 'community': return 3; // H - Health
      case 'growth': return 4; // T - Thrive
      default: return 0;
    }
  };

  const currentStepIndex = currentFocusArea ? getFocusAreaStepIndex(currentFocusArea) : -1;

  if (showMotivationalMessage) {
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

  return (
    <div className="space-y-8 text-center max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          We Found Your Rhythm
        </h1>
      </div>
      
      {/* MyRhythm Framework Visualization */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">The MyRhythm Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {['Mindful', 'Yearning', 'Routine', 'Health', 'Thrive'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
                currentStepIndex === index
                  ? 'bg-green-600 ring-4 ring-green-300' 
                  : 'bg-gray-400'
              }`}>
                {step.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{step}</span>
              {currentStepIndex === index && (
                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  You are here
                </div>
              )}
              {index < 4 && (
                <div className="hidden md:block absolute transform translate-x-12 w-8 h-0.5 bg-gray-300 mt-8"></div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-gray-600 text-sm">
          Your personalized journey follows the MyRhythm framework, designed to support your unique path to recovery and growth.
        </p>
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <div className="flex gap-3">
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
            onClick={handleUserGuideClick}
            variant="outline"
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <BookOpen className="h-4 w-4" />
            Access User Guide
          </Button>
        </div>
        
        <Button 
          onClick={handlePersonalizeClick}
          className="py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105"
        >
          Personalise MyRhythm
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
