import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Heart, Edit3, Zap, Target } from "lucide-react";
import { MonthlyIChooseWidget } from "./MonthlyIChooseWidget";
import { MonthlyThemeCustomizer } from "./MonthlyThemeCustomizer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface EmpowermentHeroProps {
  onUpgradeClick?: () => void;
  userType?: string;
}

export function EmpowermentHero({ onUpgradeClick, userType }: EmpowermentHeroProps) {
  const { user } = useAuth();
  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Champion";
  const [monthlyTheme, setMonthlyTheme] = useState<string>('');

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return {
        greeting: "Rise and Shine",
        message: "Your journey to clarity begins now",
        accent: "Every dawn brings new possibilities",
        gradient: "from-sunrise-amber-400 via-memory-emerald-400 to-brain-health-400",
        icon: Zap,
        bgGradient: "from-sunrise-amber-50/90 via-memory-emerald-50/70 to-brain-health-50/50"
      };
    } else if (hour < 18) {
      return {
        greeting: "Powering Forward", 
        message: "Building momentum, creating change",
        accent: "You're stronger than you know",
        gradient: "from-brain-health-400 via-clarity-teal-400 to-beacon-400",
        icon: Target,
        bgGradient: "from-brain-health-50/90 via-clarity-teal-50/70 to-beacon-50/50"
      };
    } else {
      return {
        greeting: "Evening Victory",
        message: "Reflecting on today's wins",
        accent: "Progress isn't just made, it's celebrated",
        gradient: "from-clarity-teal-400 via-memory-emerald-400 to-beacon-400",
        icon: Crown,
        bgGradient: "from-clarity-teal-50/90 via-memory-emerald-50/70 to-beacon-50/50"
      };
    }
  };

  const getDefaultMonthTheme = () => {
    const month = new Date().getMonth();
    const themes = [
      "New Beginnings", "Heart & Connection", "Growth & Renewal", 
      "Clarity & Focus", "Strength & Resilience", "Balance & Harmony",
      "Freedom & Expression", "Reflection & Wisdom", "Preparation & Planning",
      "Gratitude & Abundance", "Community & Support", "Reflection & Renewal"
    ];
    return themes[month];
  };

  // Load user's custom theme or use default
  useEffect(() => {
    const loadMonthlyTheme = async () => {
      if (!user) return;

      try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const { data, error } = await supabase
          .from('notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('title', 'Monthly Theme Setting')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const themeData = JSON.parse(data[0].content);
          if (themeData.month === currentMonth && themeData.year === currentYear) {
            setMonthlyTheme(themeData.theme);
            return;
          }
        }
        
        setMonthlyTheme(getDefaultMonthTheme());
      } catch (error) {
        console.error('Error loading monthly theme:', error);
        setMonthlyTheme(getDefaultMonthTheme());
      }
    };

    loadMonthlyTheme();
  }, [user]);

  const timeInfo = getTimeBasedGreeting();
  const displayTheme = monthlyTheme || getDefaultMonthTheme();
  const IconComponent = timeInfo.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl animate-fade-in">
      {/* Hero Background with Animated Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${timeInfo.bgGradient} animate-cognitive-flow`} />
      
      {/* Empowering Hero Content */}
      <Card className="relative border-0 bg-transparent shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            
            {/* Main Empowering Message */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className={`p-4 rounded-full bg-gradient-to-r ${timeInfo.gradient} text-white shadow-xl animate-neural-pulse`}>
                  <IconComponent className="h-8 w-8" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text-brand">
                  {timeInfo.greeting}, {userName}
                </h1>
                <p className="text-xl font-semibold text-brain-health-700">
                  {timeInfo.message}
                </p>
                <p className="text-base text-brain-health-600 italic">
                  {timeInfo.accent}
                </p>
              </div>

              {/* Time Control Messaging */}
              <div className="mt-4 p-4 bg-white/40 rounded-xl border border-white/60 backdrop-blur-sm">
                <p className="text-sm text-brain-health-700 font-medium">
                  You control your <span className="font-bold text-memory-emerald-600">day</span>, 
                  your <span className="font-bold text-brain-health-600">week</span>, 
                  your <span className="font-bold text-clarity-teal-600">month</span>, 
                  and your <span className="font-bold text-sunrise-amber-600">year</span>
                </p>
                <p className="text-xs text-brain-health-500 mt-1 italic">
                  Every moment is a chance to build the life you envision
                </p>
              </div>
            </div>

              {/* Monthly Theme Integration */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className={`bg-gradient-to-r ${timeInfo.gradient} text-white border-0 shadow-lg px-4 py-2 text-sm font-medium`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  This Month: {displayTheme}
                </Badge>
                <MonthlyThemeCustomizer
                  currentTheme={displayTheme}
                  onThemeUpdate={setMonthlyTheme}
                />
              </div>

            {/* Integrated I Choose Widget */}
            <div className="max-w-2xl mx-auto">
              <MonthlyIChooseWidget 
                onUpgradeClick={onUpgradeClick}
                userType={userType}
                monthlyTheme={displayTheme}
              />
            </div>

            {/* Recovery Journey Badge */}
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 shadow-lg px-4 py-2">
                <Heart className="h-4 w-4 mr-2" />
                Your Recovery Journey
              </Badge>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}