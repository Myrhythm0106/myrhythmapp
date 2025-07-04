
import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Target, Calendar, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/use-user-data";
import { useAuth } from "@/contexts/AuthContext";

export function BrainHealthDashboard() {
  const navigate = useNavigate();
  const userData = useUserData();
  const { user } = useAuth();
  
  const displayName = userData.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  
  const todayStats = {
    memoryActivities: 3,
    moodScore: 8,
    goalsProgress: 65,
    streakDays: 7
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-white to-clarity-teal-50">
      <MemoryEffectsContainer nodeCount={8} showPathways={true} className="relative">
        <div className="container mx-auto px-4 py-6 space-y-6">
          
          {/* Brain-Health Welcome Header */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center animate-memory-pulse">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
                Welcome back, {displayName}
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every step matters in your journey. Let's continue building momentum together.
            </p>
            <Badge variant="outline" className="bg-brain-health-50 text-brain-health-700 border-brain-health-200">
              Memory1st Active • Day {todayStats.streakDays} Streak
            </Badge>
          </div>

          {/* Core Dashboard Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Today's Memory Focus */}
            <MemoryEffectsContainer nodeCount={4} className="lg:col-span-2">
              <Card className="h-full border-l-4 border-l-memory-emerald-400 bg-gradient-to-br from-memory-emerald-50/50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brain-xl">
                    <Target className="h-6 w-6 text-memory-emerald-600" />
                    Your Memory Focus Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-lg border border-memory-emerald-100">
                    <h3 className="font-semibold text-brain-lg text-memory-emerald-800 mb-2">
                      Building Consistent Routines
                    </h3>
                    <p className="text-brain-base text-gray-600 mb-3">
                      Small, consistent actions create lasting neural pathways. Today's focus helps strengthen memory formation.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-memory-emerald-600 hover:bg-memory-emerald-700"
                        onClick={() => navigate("/brain-games")}
                      >
                        Start Brain Training
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/calendar")}
                      >
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Memory Vitals - Mood & Energy */}
            <MemoryEffectsContainer nodeCount={3}>
              <Card className="h-full border-l-4 border-l-clarity-teal-400 bg-gradient-to-br from-clarity-teal-50/50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brain-lg">
                    <Heart className="h-5 w-5 text-clarity-teal-600" />
                    Memory Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-brain-sm text-gray-600">Mood Today</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-clarity-teal-400 to-memory-emerald-400 rounded-full transition-all"
                            style={{ width: `${(todayStats.moodScore / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-brain-sm font-medium">{todayStats.moodScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-brain-sm text-gray-600">Memory Activities</span>
                      <span className="text-brain-sm font-medium text-memory-emerald-600">
                        {todayStats.memoryActivities} completed
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-brain-sm text-gray-600">Goals Progress</span>
                      <span className="text-brain-sm font-medium text-brain-health-600">
                        {todayStats.goalsProgress}%
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-clarity-teal-600 hover:bg-clarity-teal-50"
                    onClick={() => navigate("/mood")}
                  >
                    Update Status
                  </Button>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Upcoming Memory Moments */}
            <MemoryEffectsContainer nodeCount={2}>
              <Card className="h-full border-l-4 border-l-brain-health-400 bg-gradient-to-br from-brain-health-50/50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brain-lg">
                    <Calendar className="h-5 w-5 text-brain-health-600" />
                    Today's Rhythm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded">
                      <div className="w-2 h-2 bg-memory-emerald-400 rounded-full animate-memory-pulse" />
                      <span className="text-brain-sm">Morning routine</span>
                      <span className="text-xs text-gray-500 ml-auto">9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded">
                      <div className="w-2 h-2 bg-clarity-teal-400 rounded-full animate-memory-pulse" style={{animationDelay: '0.5s'}} />
                      <span className="text-brain-sm">Brain games session</span>
                      <span className="text-xs text-gray-500 ml-auto">2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded">
                      <div className="w-2 h-2 bg-brain-health-400 rounded-full animate-memory-pulse" style={{animationDelay: '1s'}} />
                      <span className="text-brain-sm">Evening reflection</span>
                      <span className="text-xs text-gray-500 ml-auto">7:00 PM</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-brain-health-600 hover:bg-brain-health-50"
                    onClick={() => navigate("/calendar")}
                  >
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Recent Achievements */}
            <MemoryEffectsContainer nodeCount={3}>
              <Card className="h-full border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50/50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-brain-lg">
                    <Award className="h-5 w-5 text-amber-600" />
                    Memory Wins
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <p className="text-brain-sm font-medium text-amber-800">
                        7-day consistency streak! 🎉
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Your routine is becoming a strong memory pathway
                      </p>
                    </div>
                    <div className="p-2 bg-white/60 rounded">
                      <p className="text-brain-sm text-gray-700">Completed brain training</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-amber-600 hover:bg-amber-50"
                    onClick={() => navigate("/goals")}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    View Progress
                  </Button>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>

            {/* Quick Actions */}
            <MemoryEffectsContainer nodeCount={2} className="lg:col-span-2">
              <Card className="h-full bg-gradient-to-br from-gray-50/50 to-white">
                <CardHeader>
                  <CardTitle className="text-brain-lg text-gray-800">
                    Quick Memory Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 border-memory-emerald-200 hover:bg-memory-emerald-50"
                      onClick={() => navigate("/brain-games")}
                    >
                      <Brain className="h-5 w-5 text-memory-emerald-600" />
                      <span className="text-xs">Brain Games</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 border-clarity-teal-200 hover:bg-clarity-teal-50"
                      onClick={() => navigate("/mood")}
                    >
                      <Heart className="h-5 w-5 text-clarity-teal-600" />
                      <span className="text-xs">Log Mood</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 border-brain-health-200 hover:bg-brain-health-50"
                      onClick={() => navigate("/calendar")}
                    >
                      <Calendar className="h-5 w-5 text-brain-health-600" />
                      <span className="text-xs">Schedule</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 border-amber-200 hover:bg-amber-50"
                      onClick={() => navigate("/goals")}
                    >
                      <Target className="h-5 w-5 text-amber-600" />
                      <span className="text-xs">Goals</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </MemoryEffectsContainer>
          </div>
        </div>
      </MemoryEffectsContainer>
    </div>
  );
}
