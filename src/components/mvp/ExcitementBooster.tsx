import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Trophy, 
  Target,
  Zap,
  Heart,
  TrendingUp
} from "lucide-react";

interface ExcitementBoosterProps {
  trigger: 'assessment-complete' | 'first-recording' | 'action-scheduled' | 'feature-discovered';
  onComplete?: () => void;
}

export function ExcitementBooster({ trigger, onComplete }: ExcitementBoosterProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getContent = () => {
    switch (trigger) {
      case 'assessment-complete':
        return {
          icon: <Trophy className="h-8 w-8" />,
          title: "🎉 Assessment Complete!",
          message: "Incredible! You just unlocked your personalized MyRhythm experience.",
          prediction: "Based on your responses, I predict you'll love Memory Bridge and Calendar features most!",
          stats: "Users with similar profiles see 45% better organization in their first week"
        };
      
      case 'first-recording':
        return {
          icon: <Zap className="h-8 w-8" />,
          title: "⚡ You Just Created Magic!",
          message: "Did you see that? Your voice became organized actions automatically!",
          prediction: "This is the moment everything clicks - you're about to transform how you stay organized",
          stats: "People who record their first note are 3x more likely to stick with MyRhythm"
        };
      
      case 'action-scheduled':
        return {
          icon: <Target className="h-8 w-8" />,
          title: "🚀 Mission Accomplished!",
          message: "You just completed the full Memory Bridge flow: Record → Extract → Schedule",
          prediction: "I can already see you're going to be one of our power users!",
          stats: "You're ahead of 78% of users who take longer to schedule their first action"
        };
      
      case 'feature-discovered':
        return {
          icon: <Sparkles className="h-8 w-8" />,
          title: "✨ Explorer Mode Activated!",
          message: "Look at you discovering features like a pro!",
          prediction: "Your curiosity tells me you'll master MyRhythm in no time",
          stats: "Self-guided explorers become our most engaged users"
        };
      
      default:
        return {
          icon: <Heart className="h-8 w-8" />,
          title: "🎯 You're Crushing It!",
          message: "Every step you take makes MyRhythm more powerful for you",
          prediction: "I can see you're building something amazing",
          stats: "Keep going - the best is yet to come!"
        };
    }
  };

  if (!isVisible) return null;

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <Card className={`
        max-w-lg w-full transform transition-all duration-1000 
        ${animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        bg-gradient-to-br from-white to-beacon-50 border-2 border-beacon-200 shadow-2xl
      `}>
        <CardContent className="p-8 text-center space-y-6">
          <div className={`
            transform transition-all duration-1000 delay-500
            ${animationPhase >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
          `}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center text-white">
              {content.icon}
            </div>
          </div>

          <div className={`
            space-y-4 transform transition-all duration-1000 delay-1000
            ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
              {content.title}
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.message}
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-200">
              <p className="text-blue-800 font-medium">
                {content.prediction}
              </p>
            </div>
            
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              {content.stats}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}