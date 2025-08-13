import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Calendar,
  Brain,
  Heart,
  Target,
  ArrowRight,
  Crown,
  Sparkles
} from "lucide-react";

interface DashboardWelcomeProps {
  userName?: string;
}

export function DashboardWelcome({ userName = "Champion" }: DashboardWelcomeProps) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour < 12) {
      return {
        greeting: "Good morning",
        message: "Your brain is fresh and ready for today's recovery journey!",
        icon: Sunrise,
        colors: "from-sunrise-amber-500 to-memory-emerald-500"
      };
    } else if (hour < 18) {
      return {
        greeting: "Good afternoon",
        message: "Keep the momentum going - every action strengthens your neural pathways!",
        icon: Sun,
        colors: "from-brain-health-500 to-clarity-teal-500"
      };
    } else {
      return {
        greeting: "Good evening",
        message: "Reflect on today's progress - your consistency is building resilience!",
        icon: Moon,
        colors: "from-clarity-teal-500 to-memory-emerald-500"
      };
    }
  };

  const getCurrentMonthTheme = () => {
    const month = currentTime.getMonth();
    const themes = [
      { title: "New Beginnings", focus: "Setting intentions and building healthy routines" },
      { title: "Heart & Connection", focus: "Strengthening relationships and social support" },
      { title: "Growth & Renewal", focus: "Embracing change and cognitive flexibility" },
      { title: "Clarity & Focus", focus: "Sharpening attention and concentration skills" },
      { title: "Strength & Resilience", focus: "Building mental toughness and perseverance" },
      { title: "Balance & Harmony", focus: "Creating sustainable wellness practices" },
      { title: "Freedom & Expression", focus: "Exploring creativity and self-discovery" },
      { title: "Reflection & Wisdom", focus: "Integrating lessons and celebrating progress" },
      { title: "Preparation & Planning", focus: "Organizing thoughts and setting goals" },
      { title: "Gratitude & Abundance", focus: "Appreciating progress and recognizing growth" },
      { title: "Community & Support", focus: "Connecting with others and sharing experiences" },
      { title: "Reflection & Renewal", focus: "Looking back with pride and planning ahead" }
    ];
    
    return themes[month];
  };

  const timeInfo = getTimeBasedGreeting();
  const monthTheme = getCurrentMonthTheme();
  const TimeIcon = timeInfo.icon;

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Card */}
      <Card className="premium-card border-brain-health-200/60 bg-gradient-to-r from-background via-brain-health-50/20 to-clarity-teal-50/15">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${timeInfo.colors} text-white`}>
                  <TimeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                    {timeInfo.greeting}, {userName}!
                  </h1>
                  <p className="text-brain-health-600 text-lg">
                    Today will be awesome! ✨
                  </p>
                </div>
              </div>
              
              <p className="text-brain-health-700 leading-relaxed max-w-2xl">
                {timeInfo.message}
              </p>
            </div>
            
            <div className="hidden md:flex flex-col items-center gap-2">
              <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Brain Champion
              </Badge>
              <div className="text-center">
                <p className="text-sm text-brain-health-600">Active Recovery</p>
                <p className="text-lg font-bold text-memory-emerald-600">Day 47</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Theme Card */}
      <Card className="premium-card border-sunrise-amber-200/60 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sunrise-amber-700">
                  This Month's Focus: {monthTheme.title}
                </h3>
                <p className="text-sm text-sunrise-amber-600">
                  {monthTheme.focus}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/mvp')}
              className="border-sunrise-amber-300 text-sunrise-amber-700 hover:bg-sunrise-amber-50"
            >
              Explore MYRHYTHM
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="premium-card border-memory-emerald-200/60 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => navigate('/gratitude')}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-memory-emerald-700">Daily Gratitude</h3>
            <p className="text-sm text-memory-emerald-600">Strengthen neural pathways through appreciation</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white">
              Practice Now
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="premium-card border-brain-health-200/60 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => navigate('/brain-games')}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-brain-health-700">Cognitive Training</h3>
            <p className="text-sm text-brain-health-600">5-minute brain exercises for recovery</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white">
              Train Brain
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="premium-card border-clarity-teal-200/60 cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => navigate('/calendar')}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 text-white flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-clarity-teal-700">Today's Plan</h3>
            <p className="text-sm text-clarity-teal-600">Interactive calendar overview</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 text-white">
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Empowerment Message */}
      <Card className="premium-card border-brain-health-200/60 bg-gradient-to-r from-brain-health-50/50 to-memory-emerald-50/50">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white">
              <Brain className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-brain-health-700 mb-2">
            Remember: You're Not Walking Alone
          </h3>
          <p className="text-brain-health-600 leading-relaxed">
            Every click, every practice, every moment of reflection is rewiring your brain for strength. 
            Your commitment to recovery is inspiring, and your progress matters deeply.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}