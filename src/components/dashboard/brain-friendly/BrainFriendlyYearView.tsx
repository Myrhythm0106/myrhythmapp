import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Award, TrendingUp, ChevronRight, Crown, Zap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function BrainFriendlyYearView() {
  const navigate = useNavigate();
  const { data: metrics } = useDashboardMetrics();

  const yearlyMetrics = {
    completedDays: metrics?.yearlyMetrics?.daysCompleted || 0,
    totalDays: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)),
    longestStreak: metrics?.yearlyMetrics?.longestStreak || 0,
    majorGoals: metrics?.yearlyMetrics?.majorGoalsCompleted || 0,
    totalMilestones: 12
  };

  const yearProgress = yearlyMetrics.totalDays > 0 
    ? (yearlyMetrics.completedDays / yearlyMetrics.totalDays) * 100 
    : 0;

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const diffTime = endOfYear.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const quarterlyData = [
    { name: "Q1", progress: 95, goals: 3, streak: 21, color: "memory-emerald" },
    { name: "Q2", progress: 88, goals: 4, streak: 18, color: "brain-health" },
    { name: "Q3", progress: 92, goals: 2, streak: 25, color: "clarity-teal" },
    { name: "Q4", progress: 45, goals: 1, streak: 8, color: "sunrise-amber" }
  ];

  const majorMilestones = [
    { title: "First 30-Day Streak", date: "March 2024", achievement: "Consistency Master", color: "memory-emerald" },
    { title: "50 Brain Training Sessions", date: "June 2024", achievement: "Cognitive Champion", color: "brain-health" },
    { title: "Perfect Energy Week", date: "August 2024", achievement: "Energy Optimizer", color: "clarity-teal" },
    { title: "Year-Long Goal Achieved", date: "October 2024", achievement: "Vision Keeper", color: "sunrise-amber" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Year Overview Header */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        onClick={() => navigate("/calendar?view=year")}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {getCurrentYear()} Journey
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Year Progress</span>
            <span>{Math.round(yearProgress)}%</span>
          </div>
          <Progress value={yearProgress} className="h-3" />
          <div className="text-xs text-muted-foreground text-center">
            {getDaysRemaining()} days remaining in {getCurrentYear()}
          </div>
        </CardHeader>
      </Card>

      {/* Quarterly Breakdown */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => navigate("/analytics?view=quarterly")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand">Quarterly Performance</CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quarterlyData.map((quarter, index) => (
              <div
                key={index}
                className={`p-4 bg-${quarter.color}-50 border border-${quarter.color}-200 rounded-lg hover:bg-${quarter.color}-100 transition-colors cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/analytics?view=quarter&q=${index + 1}`);
                }}
              >
                <div className="text-center space-y-3">
                  <div className={`text-lg font-bold text-${quarter.color}-800`}>
                    {quarter.name}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{quarter.progress}%</span>
                    </div>
                    <Progress value={quarter.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`text-${quarter.color}-700`}>
                      <div className="font-semibold">{quarter.goals}</div>
                      <div>Goals</div>
                    </div>
                    <div className={`text-${quarter.color}-700`}>
                      <div className="font-semibold">{quarter.streak}</div>
                      <div>Best Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yearly Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=year&metric=active-days")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-brain-health-500" />
            <div className="text-2xl font-bold text-brain-health-800">
              {yearlyMetrics.completedDays}
            </div>
            <div className="text-sm text-muted-foreground">Days Active</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/analytics?view=year&metric=streak")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Zap className="h-8 w-8 mx-auto text-memory-emerald-500" />
            <div className="text-2xl font-bold text-memory-emerald-800">
              {yearlyMetrics.longestStreak}
            </div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/goals?view=major")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Crown className="h-8 w-8 mx-auto text-clarity-teal-500" />
            <div className="text-2xl font-bold text-clarity-teal-800">
              {yearlyMetrics.majorGoals}/5
            </div>
            <div className="text-sm text-muted-foreground">Major Goals</div>
          </CardContent>
        </Card>

        <Card 
          className="premium-card cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={() => navigate("/achievements?view=yearly")}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Trophy className="h-8 w-8 mx-auto text-sunrise-amber-500" />
            <div className="text-2xl font-bold text-sunrise-amber-800">
              {majorMilestones.length}
            </div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </CardContent>
        </Card>
      </div>

      {/* Major Milestones */}
      <Card 
        className="premium-card cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => navigate("/achievements?view=major")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text-brand flex items-center gap-2">
              <Award className="h-5 w-5" />
              Major Milestones
            </CardTitle>
            <ChevronRight className="h-5 w-5 text-brain-health-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {majorMilestones.map((milestone, index) => (
            <div key={index} className={`p-4 bg-${milestone.color}-50 border border-${milestone.color}-200 rounded-lg`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className={`text-base font-semibold text-${milestone.color}-800`}>
                    {milestone.title}
                  </div>
                  <div className={`text-sm text-${milestone.color}-600`}>
                    {milestone.date}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`bg-${milestone.color}-100 text-${milestone.color}-700 border-${milestone.color}-300`}
                  >
                    {milestone.achievement}
                  </Badge>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r from-${milestone.color}-400 to-${milestone.color}-500 rounded-full flex items-center justify-center`}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Year-End Projection */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="gradient-text-brand">Year-End Projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold gradient-text-brand">
              {Math.round(yearProgress)}% Complete
            </div>
            <div className="text-sm text-muted-foreground">
              On track to achieve your {getCurrentYear()} vision
            </div>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="text-center p-3 bg-brain-health-50 rounded-lg border border-brain-health-200">
              <div className="text-lg font-semibold text-brain-health-800">
                {Math.round((yearlyMetrics.completedDays / yearlyMetrics.totalDays) * 365)}
              </div>
              <div className="text-xs text-brain-health-600">Projected Active Days</div>
            </div>
            <div className="text-center p-3 bg-memory-emerald-50 rounded-lg border border-memory-emerald-200">
              <div className="text-lg font-semibold text-memory-emerald-800">
                {Math.round(yearlyMetrics.majorGoals * 1.5)}
              </div>
              <div className="text-xs text-memory-emerald-600">Projected Goals Met</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}