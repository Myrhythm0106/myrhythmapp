
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, RefreshCw, TrendingUp, Sparkles, Heart } from "lucide-react";

const empowermentMessages = [
  {
    message: "Your strength and determination are writing a powerful story of resilience. Today, let's add another chapter of triumph to your LEAP journey.",
    category: "empowerment",
    emoji: "🚀"
  },
  {
    message: "You are capable of incredible things, and your brain is adapting and growing stronger with every challenge you face.",
    category: "strength",
    emoji: "💪"
  },
  {
    message: "Despite any challenges you face, your ability to LEAP forward - Lead, Empower, Achieve, Persist - remains unshakeable.",
    category: "leap",
    emoji: "🌟"
  },
  {
    message: "Today's small victories are tomorrow's foundation for greatness. Your progress is building something beautiful.",
    category: "progress",
    emoji: "🏆"
  },
  {
    message: "You have the power to shape your day with intention and purpose. Your potential is limitless.",
    category: "empowerment",
    emoji: "⚡"
  },
  {
    message: "Your consistency is creating positive change in your life and inspiring your brain to build new pathways of strength.",
    category: "consistency",
    emoji: "🔥"
  },
  {
    message: "Recovery and growth go hand in hand. You're not just healing, you're becoming stronger than before.",
    category: "growth",
    emoji: "🌱"
  },
  {
    message: "You're not defined by your challenges - you're defined by how you rise to meet them with courage and determination.",
    category: "resilience",
    emoji: "🦋"
  }
];

interface DailyEmpowermentBoostProps {
  streak: number;
  todayScore?: number;
}

export function DailyEmpowermentBoost({ streak, todayScore = 8 }: DailyEmpowermentBoostProps) {
  const [currentMessage, setCurrentMessage] = useState(empowermentMessages[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Select message based on streak and score
    let messageIndex = 0;
    if (streak >= 7) messageIndex = Math.floor(Math.random() * empowermentMessages.length);
    else if (streak >= 3) messageIndex = Math.floor(Math.random() * 4) + 2;
    else messageIndex = Math.floor(Math.random() * 3);
    
    setCurrentMessage(empowermentMessages[messageIndex]);
  }, [streak]);

  const refreshMessage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * empowermentMessages.length);
      setCurrentMessage(empowermentMessages[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const getEmpowermentScore = () => {
    const base = (todayScore / 10) * 100;
    const streakBonus = Math.min(streak * 2, 20);
    return Math.min(Math.round(base + streakBonus), 100);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
      {/* Empowerment Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-8 text-6xl">🚀</div>
        <div className="absolute top-12 right-12 text-4xl">⚡</div>
        <div className="absolute bottom-8 left-16 text-5xl">🌟</div>
        <div className="absolute bottom-4 right-8 text-3xl">💪</div>
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-full animate-pulse">
            <Music className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Daily Empowerment Boost
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/80">
                  Empowerment Score: {getEmpowermentScore()}%
                </Badge>
                <Badge variant="outline" className="bg-white/80">
                  Day {streak} LEAP Journey
                </Badge>
              </div>
            </div>
            
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{currentMessage.emoji}</span>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    "{currentMessage.message}"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshMessage}
                  disabled={isAnimating}
                  className="text-purple-600 hover:bg-purple-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isAnimating ? 'animate-spin' : ''}`} />
                  New Boost
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Love This
                </Button>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>MyRhythm LEAP Inspiration</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
