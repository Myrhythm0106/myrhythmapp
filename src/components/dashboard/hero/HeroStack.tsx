import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Heart } from "lucide-react";
import { MonthlyIChooseWidget } from "./MonthlyIChooseWidget";
import { useAuth } from "@/contexts/AuthContext";

interface HeroStackProps {
  onUpgradeClick?: () => void;
  userType?: string;
}

export function HeroStack({ onUpgradeClick, userType }: HeroStackProps) {
  const { user } = useAuth();
  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Champion";

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return {
        greeting: "Good morning",
        message: "Your brain is fresh and ready",
        gradient: "from-sunrise-amber-400 to-memory-emerald-400"
      };
    } else if (hour < 18) {
      return {
        greeting: "Good afternoon", 
        message: "Keep building momentum",
        gradient: "from-brain-health-400 to-clarity-teal-400"
      };
    } else {
      return {
        greeting: "Good evening",
        message: "Reflect on today's wins",
        gradient: "from-clarity-teal-400 to-memory-emerald-400"
      };
    }
  };

  const getCurrentMonthTheme = () => {
    const month = new Date().getMonth();
    const themes = [
      "New Beginnings", "Heart & Connection", "Growth & Renewal", 
      "Clarity & Focus", "Strength & Resilience", "Balance & Harmony",
      "Freedom & Expression", "Reflection & Wisdom", "Preparation & Planning",
      "Gratitude & Abundance", "Community & Support", "Reflection & Renewal"
    ];
    return themes[month];
  };

  const timeInfo = getTimeBasedGreeting();
  const monthTheme = getCurrentMonthTheme();

  return (
    <div className="space-y-4">
      {/* Welcome Message */}
      <Card className="premium-card border-0 bg-gradient-to-r from-brain-health-50/80 via-clarity-teal-50/60 to-memory-emerald-50/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-gradient-to-r ${timeInfo.gradient} text-white shadow-lg`}>
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text-brand">
                    {timeInfo.greeting}, {userName}
                  </h1>
                  <p className="text-brain-health-600 text-sm">
                    {timeInfo.message}
                  </p>
                </div>
              </div>
            </div>
            
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 shadow-sm">
              <Crown className="h-3 w-3 mr-1" />
              Recovery Journey
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Theme */}
      <Card className="premium-card border-0 bg-gradient-to-r from-sunrise-amber-50/70 to-memory-emerald-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sunrise-amber-700 text-sm">
                This Month: {monthTheme}
              </h3>
              <p className="text-xs text-sunrise-amber-600">
                Focus on building strength, one day at a time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily #IChoose Statement */}
      <MonthlyIChooseWidget 
        onUpgradeClick={onUpgradeClick}
        userType={userType}
        monthlyTheme={monthTheme}
      />
    </div>
  );
}