
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, Calendar, TrendingUp, Target, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface UserProgressDashboardProps {
  userProgress: any;
  todayStats: any;
  streak: number;
}

export function UserProgressDashboard({ userProgress, todayStats, streak }: UserProgressDashboardProps) {
  // Mock data for charts - in real app this would come from userProgress
  const weeklyData = [
    { day: 'Mon', sequence: 85, matching: 78, spatial: 82 },
    { day: 'Tue', sequence: 88, matching: 82, spatial: 85 },
    { day: 'Wed', sequence: 90, matching: 85, spatial: 88 },
    { day: 'Thu', sequence: 92, matching: 88, spatial: 90 },
    { day: 'Fri', sequence: 89, matching: 91, spatial: 87 },
    { day: 'Sat', sequence: 94, matching: 89, spatial: 92 },
    { day: 'Sun', sequence: 96, matching: 93, spatial: 95 }
  ];

  const totalStats = {
    gamesCompleted: 247,
    levelsCompleted: 89,
    averageScore: 87,
    totalTimeSpent: '42 hours'
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Games Completed</p>
                <p className="text-2xl font-bold">{totalStats.gamesCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Levels Mastered</p>
                <p className="text-2xl font-bold">{totalStats.levelsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{totalStats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            Average scores for each game type over the last 7 days
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sequence" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Sequence Recall"
              />
              <Line 
                type="monotone" 
                dataKey="matching" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Matching Pairs"
              />
              <Line 
                type="monotone" 
                dataKey="spatial" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Spatial Memory"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Game Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sequence Recall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Level</span>
              <Badge variant="secondary">Level 12</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-medium">96%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Games Played</span>
              <span className="font-medium">87</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Matching Pairs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Level</span>
              <Badge variant="secondary">Level 9</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-medium">93%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Games Played</span>
              <span className="font-medium">73</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spatial Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Level</span>
              <Badge variant="secondary">Level 11</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Best Score</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Games Played</span>
              <span className="font-medium">87</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
