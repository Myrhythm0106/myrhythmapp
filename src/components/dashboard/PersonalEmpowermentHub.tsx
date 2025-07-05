
import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Target, Calendar, TrendingUp, Award, Music, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/use-user-data";
import { useAuth } from "@/contexts/AuthContext";
import { DailyEmpowermentBoost } from "./DailyEmpowermentBoost";
import { PersonalEmpowermentMeter } from "./PersonalEmpowermentMeter";
import { VictoryCelebrations } from "./VictoryCelebrations";

export function PersonalEmpowermentHub() {
  const navigate = useNavigate();
  const userData = useUserData();
  const { user } = useAuth();
  
  const displayName = userData.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  
  const todayStats = {
    empowermentActions: 3,
    moodScore: 8,
    goalsProgress: 65,
    streakDays: 7
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-white to-clarity-teal-50">
      <MemoryEffectsContainer nodeCount={8} showPathways={true} className="relative">
        <div className="container mx-auto px-4 py-6 space-y-6">
          
          {/* Enhanced Welcome Header */}
          <div className="text-center space-y-4 py-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Music className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome to MyRhythm, {displayName}
                </h1>
                <p className="text-lg text-gray-600">Your Personal Empowerment Hub</p>
                <p className="text-sm text-gray-500">Live empowered, achieve progress, persist with purpose</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200 px-4 py-1">
              🚀 Day {todayStats.streakDays} of Your LEAP Journey
            </Badge>
          </div>

          {/* Daily Empowerment Boost - Prominent Position */}
          <DailyEmpowermentBoost 
            streak={todayStats.streakDays} 
            todayScore={todayStats.moodScore} 
          />

          {/* Enhanced Dashboard Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Personal Empowerment Meter */}
            <MemoryEffectsContainer nodeCount={4}>
              <PersonalEmpowermentMeter 
                moodScore={todayStats.moodScore}
                activitiesCompleted={todayStats.empowermentActions}
                streakDays={todayStats.streakDays}
                goalsProgress={todayStats.goalsProgress}
              />
            </MemoryEffectsContainer>

            {/* Victory Celebrations */}
            <MemoryEffectsContainer nodeCount={3}>
              <VictoryCelebrations 
                streakDays={todayStats.streakDays}
              />
            </MemoryEffectsContainer>

            {/* Today's LEAP Focus */}
            <MemoryEffectsContainer nodeCount={4}>
              <Card className="h-full border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-full">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Today's LEAP Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      Lead with Intention Today
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Your strength and determination are powerful tools. Today's focus: building momentum through purposeful action.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        onClick={() => navigate("/brain-games")}
                      >
                        🧠 Strengthen Skills
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/calendar")}
                      >
                        📅 Plan Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Today's Empowerment Schedule */}
            <MemoryEffectsContainer nodeCount={2}>
              <Card className="h-full border-l-4 border-l-emerald-400 bg-gradient-to-br from-emerald-50/50 to-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Your Empowerment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-sm flex-1">Morning empowerment boost</span>
                      <span className="text-xs text-gray-500">9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                      <span className="text-sm flex-1">Skill building session</span>
                      <span className="text-xs text-gray-500">2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
                      <span className="text-sm flex-1">Victory reflection</span>
                      <span className="text-xs text-gray-500">7:00 PM</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-emerald-600 hover:bg-emerald-50"
                    onClick={() => navigate("/calendar")}
                  >
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Quick Empowerment Actions */}
            <MemoryEffectsContainer nodeCount={2} className="lg:col-span-2">
              <Card className="h-full bg-gradient-to-br from-gray-50/50 to-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Quick Empowerment Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:scale-105"
                      onClick={() => navigate("/brain-games")}
                    >
                      <Brain className="h-6 w-6 text-purple-600" />
                      <span className="text-xs font-medium">Skill Building</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-2 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:scale-105"
                      onClick={() => navigate("/mood")}
                    >
                      <Heart className="h-6 w-6 text-red-600" />
                      <span className="text-xs font-medium">Check Mood</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                      onClick={() => navigate("/calendar")}
                    >
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <span className="text-xs font-medium">Plan Actions</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col gap-2 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 hover:scale-105"
                      onClick={() => navigate("/goals")}
                    >
                      <Target className="h-6 w-6 text-green-600" />
                      <span className="text-xs font-medium">Set Goals</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>
          </div>

          {/* Bottom Inspiration */}
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <Music className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Every day you're building strength and creating your empowered life 🚀
              </span>
            </div>
          </div>
        </div>
      </MemoryEffectsContainer>
    </div>
  );
}
