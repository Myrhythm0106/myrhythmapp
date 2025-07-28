
import React, { useState } from "react";
import { Calendar, Settings, User, Crown, Target, TrendingUp, Sparkles, Heart, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InAppPurchasePage } from "@/components/empowerment/InAppPurchasePage";
import { PlanningSpotlight } from "@/components/planning/PlanningSpotlight";
import { WeekPrioritiesCard } from "@/components/planning/WeekPrioritiesCard";
import { TodaysPriority } from "@/components/dashboard/TodaysPriority";
import { DailyIChooseWidget } from "@/components/dashboard/DailyIChooseWidget";
import { useNavigate } from "react-router-dom";

export function EmpowermentDashboard() {
  const [showPurchasePage, setShowPurchasePage] = useState(false);
  const navigate = useNavigate();

  // Mock data for week priorities
  const mockWeeklyGoals = [
    { id: 1, title: "Improve Energy Management", progress_percentage: 75 },
    { id: 2, title: "Strengthen Focus & Memory", progress_percentage: 60 },
    { id: 3, title: "Build Family Connections", progress_percentage: 45 }
  ];

  const mockThisWeekActions = [
    { id: 1, status: 'completed' },
    { id: 2, status: 'completed' },
    { id: 3, status: 'pending' },
    { id: 4, status: 'pending' }
  ];

  const handleUpgradeClick = () => {
    navigate("/in-app-purchase");
  };

  if (showPurchasePage) {
    return <InAppPurchasePage onBack={() => setShowPurchasePage(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        
        {/* Welcome Section - purple-blue-teal dominant with tiny emerald therapeutic touches */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg border border-emerald-200/20">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyRhythm Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            Your personalized command center for cognitive wellness and empowered living
          </p>
          
          {/* Upgrade Banner - purple-blue-teal with tiny emerald therapeutic touches */}
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-amber-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Unlock Premium Features</p>
                  <p className="text-sm text-gray-600">Advanced brain training, care team collaboration, and more</p>
                </div>
              </div>
              <Button onClick={handleUpgradeClick} variant="premium" className="px-6">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
          
          {/* Quick streak info - purple-blue-teal dominant */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">7-day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">3 goals active</span>
            </div>
          </div>
        </div>

        {/* Daily #IChoose Statement */}
        <div className="mb-8">
          <DailyIChooseWidget onUpgradeClick={handleUpgradeClick} />
        </div>

        {/* Today's Priority */}
        <div className="mb-8">
          <TodaysPriority />
        </div>

        {/* Planning Command Center */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Planning Command Center
            </h2>
            <p className="text-gray-600">Strategic overview and weekly priorities</p>
          </div>
          <PlanningSpotlight />
        </div>

        {/* Week Priorities & Goals */}
        <div className="mb-8">
          <WeekPrioritiesCard 
            weeklyGoals={mockWeeklyGoals}
            thisWeekActions={mockThisWeekActions}
            onViewGoals={() => navigate("/goals")}
          />
        </div>

        {/* Quick Actions - purple-blue-teal with tiny emerald therapeutic touches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-purple-200/60 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 hover:border-purple-300 transition-colors shadow-sm hover:shadow-md border-l border-l-emerald-200/30">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900">Plan My Day</h3>
              <p className="text-sm text-gray-600 mb-4">Create brain-friendly schedules</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-blue-50/30"
                onClick={() => navigate("/calendar")}
              >
                Open Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200/60 bg-gradient-to-br from-white via-blue-50/30 to-teal-50/20 hover:border-blue-300 transition-colors shadow-sm hover:shadow-md border-l border-l-emerald-200/30">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900">Track Progress</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor your recovery journey</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-blue-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-teal-50/30"
                onClick={() => navigate("/goals")}
              >
                View Goals
              </Button>
            </CardContent>
          </Card>

          <Card className="border-teal-200/60 bg-gradient-to-br from-white via-teal-50/30 to-purple-50/20 hover:border-teal-300 transition-colors shadow-sm hover:shadow-md border-l border-l-emerald-200/30">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-gray-900">Support Circle</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with your care team</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-teal-300 hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-purple-50/30"
                onClick={() => navigate("/accountability")}
              >
                Manage Circle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
