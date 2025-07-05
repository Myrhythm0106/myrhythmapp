
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Calendar, Target, Sparkles, PartyPopper } from "lucide-react";

interface VictoryCelebrationsProps {
  streakDays: number;
  recentAchievements?: string[];
}

export function VictoryCelebrations({ 
  streakDays, 
  recentAchievements = [
    "Completed 5 empowerment activities this week",
    "Maintained consistent daily routine for 10 days", 
    "Successfully used LEAP principles in challenging situations"
  ]
}: VictoryCelebrationsProps) {
  
  const getVictoryBadge = (days: number) => {
    if (days >= 30) return { icon: Trophy, label: "LEAP Master", color: "bg-yellow-500", glow: "shadow-yellow-200" };
    if (days >= 14) return { icon: Star, label: "Empowerment Builder", color: "bg-purple-500", glow: "shadow-purple-200" };
    if (days >= 7) return { icon: Target, label: "Momentum Maker", color: "bg-blue-500", glow: "shadow-blue-200" };
    return { icon: Sparkles, label: "Victory Starter", color: "bg-green-500", glow: "shadow-green-200" };
  };

  const victoryBadge = getVictoryBadge(streakDays);
  const IconComponent = victoryBadge.icon;

  return (
    <Card className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50/50 to-orange-50/50 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-full">
            <PartyPopper className="h-4 w-4 text-white" />
          </div>
          Victory Celebrations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Achievement */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${victoryBadge.color} text-white shadow-lg ${victoryBadge.glow} animate-pulse`}>
            <IconComponent className="h-5 w-5" />
            <span className="font-bold">{victoryBadge.label}</span>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
            <div className="text-2xl font-bold text-amber-700 mb-1">
              🎉 {streakDays} Day Victory Streak! 🎉
            </div>
            <p className="text-sm text-amber-600">
              Your consistency is building incredible empowerment momentum
            </p>
          </div>
        </div>

        {/* Recent Victories */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 text-sm">Recent Victories:</h4>
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-white/60 rounded">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 animate-pulse" />
              <span className="text-sm text-gray-700 flex-1">{achievement}</span>
              {index === 0 && <Badge variant="secondary" className="text-xs">Today</Badge>}
            </div>
          ))}
        </div>

        {/* Motivational Call to Action */}
        <div className="pt-2 border-t border-amber-200">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-lg">
            <p className="text-xs text-amber-800 text-center font-medium">
              "Every victory, no matter how small, is proof of your incredible strength!" 🏆
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
