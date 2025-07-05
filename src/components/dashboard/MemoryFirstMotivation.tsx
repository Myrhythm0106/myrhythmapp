
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, RefreshCw, TrendingUp, Sparkles, Heart } from "lucide-react";

const rhythmMessages = [
  {
    message: "Every beat of your heart is a note in your recovery symphony. Today, let's add a beautiful melody to your life's rhythm.",
    category: "rhythm",
    emoji: "🎵"
  },
  {
    message: "Your brain is like a musician learning a new song - every practice session makes the melody stronger and clearer.",
    category: "learning",
    emoji: "🧠"
  },
  {
    message: "Life's rhythm isn't about perfection - it's about finding your tempo and dancing to your own beat.",
    category: "acceptance",
    emoji: "💃"
  },
  {
    message: "Today's small actions are tomorrow's powerful crescendo. Keep building your memory symphony.",
    category: "progress",
    emoji: "🎼"
  },
  {
    message: "Like a conductor with an orchestra, you have the power to guide your recovery with intention and grace.",
    category: "empowerment",
    emoji: "🎭"
  },
  {
    message: "Your consistency is creating a beautiful rhythm - each day adds another note to your healing harmony.",
    category: "consistency",
    emoji: "🎹"
  },
  {
    message: "Memory recovery is like tuning an instrument - with patience and practice, everything comes into perfect harmony.",
    category: "patience",
    emoji: "🎸"
  },
  {
    message: "You're not just surviving, you're composing a masterpiece of resilience, one day at a time.",
    category: "resilience",
    emoji: "🎺"
  }
];

interface MemoryFirstMotivationProps {
  streak: number;
  todayScore?: number;
}

export function MemoryFirstMotivation({ streak, todayScore = 8 }: MemoryFirstMotivationProps) {
  const [currentMessage, setCurrentMessage] = useState(rhythmMessages[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Select message based on streak and score
    let messageIndex = 0;
    if (streak >= 7) messageIndex = Math.floor(Math.random() * rhythmMessages.length);
    else if (streak >= 3) messageIndex = Math.floor(Math.random() * 4) + 2;
    else messageIndex = Math.floor(Math.random() * 3);
    
    setCurrentMessage(rhythmMessages[messageIndex]);
  }, [streak]);

  const refreshMessage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * rhythmMessages.length);
      setCurrentMessage(rhythmMessages[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  const getRhythmScore = () => {
    const base = (todayScore / 10) * 100;
    const streakBonus = Math.min(streak * 2, 20);
    return Math.min(Math.round(base + streakBonus), 100);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
      {/* Musical Note Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-8 text-6xl">🎵</div>
        <div className="absolute top-12 right-12 text-4xl">🎼</div>
        <div className="absolute bottom-8 left-16 text-5xl">🎹</div>
        <div className="absolute bottom-4 right-8 text-3xl">🎺</div>
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-full animate-pulse">
            <Music className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Daily Rhythm
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/80">
                  Rhythm Score: {getRhythmScore()}%
                </Badge>
                <Badge variant="outline" className="bg-white/80">
                  Day {streak} Symphony
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
                  New Rhythm
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
                <span>Memory1st Daily Inspiration</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
