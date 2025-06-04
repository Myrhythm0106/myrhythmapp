
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface VictoryCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'daily_win' | 'streak_milestone' | 'goal_progress';
  milestone?: number;
  message?: string;
}

export function VictoryCelebration({ 
  isVisible, 
  onClose, 
  type, 
  milestone, 
  message 
}: VictoryCelebrationProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getCelebrationConfig = () => {
    switch (type) {
      case 'daily_win':
        return {
          icon: Star,
          title: "Daily Victory Complete! 🌟",
          subtitle: message || "Every small win builds your strength!",
          gradient: "from-yellow-400 via-orange-500 to-red-500",
          bgGradient: "from-yellow-50 to-orange-50"
        };
      case 'streak_milestone':
        return {
          icon: Trophy,
          title: `🔥 ${milestone} Day Victory Streak!`,
          subtitle: message || "Your consistency is incredible!",
          gradient: "from-orange-400 via-red-500 to-pink-500",
          bgGradient: "from-orange-50 to-red-50"
        };
      case 'goal_progress':
        return {
          icon: Heart,
          title: "Goal Progress Milestone! 💪",
          subtitle: message || "You're making amazing progress!",
          gradient: "from-green-400 via-blue-500 to-purple-500",
          bgGradient: "from-green-50 to-blue-50"
        };
      default:
        return {
          icon: Sparkles,
          title: "Celebration! ✨",
          subtitle: message || "Keep up the great work!",
          gradient: "from-blue-400 to-purple-500",
          bgGradient: "from-blue-50 to-purple-50"
        };
    }
  };

  const config = getCelebrationConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card className={cn(
        "w-96 max-w-[90vw] border-0 shadow-2xl transform transition-all duration-500",
        animate ? "scale-100 opacity-100" : "scale-95 opacity-0",
        `bg-gradient-to-br ${config.bgGradient}`
      )}>
        <CardContent className="p-8 text-center">
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-700",
            animate && "animate-bounce",
            `bg-gradient-to-r ${config.gradient}`
          )}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            {config.title}
          </h2>
          
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            {config.subtitle}
          </p>
          
          <div className="flex justify-center gap-3">
            <Button 
              onClick={onClose}
              className={cn(
                "bg-gradient-to-r text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all",
                config.gradient
              )}
            >
              Amazing! ✨
            </Button>
          </div>
          
          {/* Floating sparkles animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute animate-pulse",
                  animate && "animate-bounce"
                )}
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${10 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + (i % 2)}s`
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400 opacity-70" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
