
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Music, 
  Target, 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  Brain,
  Zap,
  Award,
  Smile
} from "lucide-react";

export default function PersonalEmpowermentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Personal Empowerment Hub
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Your personalized journey to cognitive wellness and independence. Track your progress, celebrate wins, and build lasting empowerment habits.
          </p>
        </div>

        {/* Today's Focus */}
        <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Target className="h-5 w-5" />
              Today I Will...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-semibold text-teal-900">
              "Complete my morning brain exercises and practice gratitude"
            </div>
            <div className="flex items-center gap-4">
              <Progress value={65} className="flex-1 h-3" />
              <Badge className="bg-teal-600 text-white">65% Complete</Badge>
            </div>
            <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
              <Zap className="h-4 w-4 mr-2" />
              Continue Today's Journey
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">7</div>
              <div className="text-sm text-slate-600">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">94%</div>
              <div className="text-sm text-slate-600">Wellbeing Score</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-sm text-slate-600">Brain Games</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">28</div>
              <div className="text-sm text-slate-600">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Empowerment Activities */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Daily Goals</span>
                    <span>8/10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Exercises</span>
                    <span>6/8</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mood Check-ins</span>
                    <span>7/7</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Detailed Progress
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-yellow-800">7-Day Streak!</div>
                  <div className="text-sm text-yellow-700">Completed daily goals</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Memory Master</div>
                  <div className="text-sm text-green-700">Completed 10 brain games</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Smile className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">Mood Tracker</div>
                  <div className="text-sm text-blue-700">7 days of mood logging</div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Brain className="h-6 w-6" />
                <span className="text-sm">Brain Games</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Heart className="h-6 w-6" />
                <span className="text-sm">Mood Check</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">Set Goal</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
