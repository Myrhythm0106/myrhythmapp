
import React from "react";
import { RecentWinsCard } from "@/components/dashboard/RecentWinsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function KeepInMindView() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Week Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Week Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Goals Completed</span>
                <span>5/8</span>
              </div>
              <Progress value={62.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Routine Consistency</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/calendar")}
              className="w-full justify-between"
            >
              View Weekly Calendar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Weekly Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Mood Average</span>
              <span className="text-sm font-medium text-green-600">↗ 7.2/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Energy Level</span>
              <span className="text-sm font-medium text-blue-600">↗ 6.8/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sleep Quality</span>
              <span className="text-sm font-medium text-purple-600">→ 7.5/10</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/tracking")}
              className="w-full justify-between"
            >
              View Full Report
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Complete 5 brain games
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Daily mood tracking
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                3 gratitude entries
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                Weekly check-in call
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/calendar?view=goals")}
              className="w-full justify-between"
            >
              Manage Goals
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Wins and Weekly Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentWinsCard />
        
        {/* Weekly Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900">Weekly Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Great progress!</span> You've maintained your morning routine 6 out of 7 days this week.
              </p>
              <p className="text-sm text-blue-800">
                Your mood tends to be highest on days when you complete brain games in the morning.
              </p>
              <p className="text-sm text-blue-800">
                Consider scheduling your weekly check-in call for Thursday afternoons when your energy is typically higher.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
