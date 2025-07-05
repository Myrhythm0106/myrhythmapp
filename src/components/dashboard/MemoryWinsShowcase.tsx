
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Calendar, Target, Sparkles, PartyPopper } from "lucide-react";

interface MemoryWinsShowcaseProps {
  streakDays: number;
  recentAchievements?: string[];
}

export function MemoryWinsShowcase({ 
  streakDays, 
  recentAchievements = [
    "Completed 5 brain training sessions this week",
    "Maintained consistent sleep schedule for 10 days", 
    "Successfully used memory techniques in daily tasks"
  ]
}: MemoryWinsShowcaseProps) {
  
  const getStreakBadge = (days: number) => {
    if (days >= 30) return { icon: Trophy, label: "Rhythm Master", color: "bg-yellow-500", glow: "shadow-yellow-200" };
    if (days >= 14) return { icon: Star, label: "Harmony Builder", color: "bg-purple-500", glow: "shadow-purple-200" };
    if (days >= 7) return { icon: Target, label: "Beat Keeper", color: "bg-blue-500", glow: "shadow-blue-200" };
    return { icon: Sparkles, label: "Tempo Starter", color: "bg-green-500", glow: "shadow-green-200" };
  };

  const streakBadge = getStreakBadge(streakDays);
  const IconComponent = streakBadge.icon;

  return (
    <Card className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50/50 to-orange-50/50 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-full">
            <PartyPopper className="h-4 w-4 text-white" />
          </div>
          Memory Wins Celebration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Achievement */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${streakBadge.color} text-white shadow-lg ${streakBadge.glow} animate-pulse`}>
            <IconComponent className="h-5 w-5" />
            <span className="font-bold">{streakBadge.label}</span>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
            <div className="text-2xl font-bold text-amber-700 mb-1">
              🎉 {streakDays} Day Symphony! 🎉
            </div>
            <p className="text-sm text-amber-600">
              Your consistency is building a beautiful memory rhythm
            </p>
          </div>
        </div>

        {/* Recent Wins */}
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
              "Every small win is a note in your recovery symphony. Keep playing!" 🎼
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
