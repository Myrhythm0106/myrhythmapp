
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
          title: "Daily Victory",
          subtitle: message || "Every disciplined step compounds.",
          gradient: "from-amber-500 via-orange-500 to-rose-500",
          bgGradient: "from-amber-50 to-orange-50"
        };
      case 'streak_milestone':
        return {
          icon: Trophy,
          title: `${milestone}-Day Streak`,
          subtitle: message || "Consistency, confirmed.",
          gradient: "from-orange-500 via-rose-500 to-pink-500",
          bgGradient: "from-orange-50 to-rose-50"
        };
      case 'goal_progress':
        return {
          icon: Heart,
          title: "Milestone Reached",
          subtitle: message || "Measured progress on your goal.",
          gradient: "from-emerald-500 via-teal-500 to-blue-500",
          bgGradient: "from-emerald-50 to-teal-50"
        };
      default:
        return {
          icon: Sparkles,
          title: "Milestone",
          subtitle: message || "Forward.",
          gradient: "from-blue-500 to-purple-500",
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
              Continue
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
