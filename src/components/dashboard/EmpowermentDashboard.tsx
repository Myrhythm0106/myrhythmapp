
import React, { useState } from "react";
import { Calendar, Settings, User, Crown, Target, TrendingUp, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedEmpowermentHub } from "@/components/empowerment/EnhancedEmpowermentHub";
import { InAppPurchasePage } from "@/components/empowerment/InAppPurchasePage";
import { PlanningSpotlight } from "@/components/planning/PlanningSpotlight";
import { WeekPrioritiesCard } from "@/components/planning/WeekPrioritiesCard";
import { DailyIChooseWidget } from "@/components/dashboard/DailyIChooseWidget";

export function EmpowermentDashboard() {
  const [showPurchasePage, setShowPurchasePage] = useState(false);

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

  if (showPurchasePage) {
    return <InAppPurchasePage onBack={() => setShowPurchasePage(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-white to-clarity-teal-50/30">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        
        {/* Welcome Section with Quick Stats */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
              MyRhythm Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            Your personalized command center for cognitive wellness and empowered living
          </p>
          
          {/* Quick streak info */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">7-day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clarity-teal-500" />
              <span className="text-sm font-medium text-gray-700">3 goals active</span>
            </div>
          </div>
        </div>

        {/* DAILY EMPOWERMENT - FIRST PRIORITY */}
        <div className="mb-12">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="animate-pulse">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                Start Your Day with Empowerment
              </h2>
              <div className="animate-pulse">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Set the perfect mindset for success. Your personalized #IChoose statement creates the foundation for an empowered, productive day.
            </p>
          </div>
          
          {/* Enhanced Daily Empowerment Widget */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-xl blur opacity-30 animate-pulse"></div>
            <div className="relative">
              <DailyIChooseWidget onUpgradeClick={() => setShowPurchasePage(true)} />
            </div>
          </div>
        </div>

        {/* Planning Command Center - Secondary Position */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-clarity-teal-500" />
              Planning Command Center
            </h2>
            <p className="text-gray-600">Strategic overview and weekly priorities</p>
          </div>
          <PlanningSpotlight />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Week Priorities & Goals - Replaces Planning Details */}
          <WeekPrioritiesCard 
            weeklyGoals={mockWeeklyGoals}
            thisWeekActions={mockThisWeekActions}
            onViewGoals={() => {/* Navigate to goals */}}
          />

          {/* Enhanced Empowerment Hub */}
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Empowerment Tools</h3>
              <p className="text-gray-600">Additional empowerment resources and activities</p>
            </div>
            <EnhancedEmpowermentHub
              userType="brain-injury"
              onUpgradeClick={() => setShowPurchasePage(true)}
            />
          </div>
        </div>

        {/* Quick Actions & Journey Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-memory-emerald-200 hover:border-memory-emerald-300 transition-colors">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-memory-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Plan My Day</h3>
              <p className="text-sm text-gray-600 mb-4">Create brain-friendly schedules</p>
              <Button size="sm" variant="outline" className="border-memory-emerald-300">
                Open Calendar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-clarity-teal-200 hover:border-clarity-teal-300 transition-colors">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-clarity-teal-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor your recovery journey</p>
              <Button size="sm" variant="outline" className="border-clarity-teal-300">
                View Stats
              </Button>
            </CardContent>
          </Card>

          <Card className="border-heart-300 hover:border-heart-400 transition-colors">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-heart-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Support Circle</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with your care team</p>
              <Button size="sm" variant="outline" className="border-heart-300">
                Manage Circle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
