
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, Target, Calendar, Clock, Star, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

export function MemoryInsights() {
  // Sample data for memory insights
  const memoryTrendData = [
    { day: "Mon", recall: 65, accuracy: 70, speed: 3.2 },
    { day: "Tue", recall: 72, accuracy: 75, speed: 3.0 },
    { day: "Wed", recall: 68, accuracy: 78, speed: 2.8 },
    { day: "Thu", recall: 75, accuracy: 82, speed: 2.5 },
    { day: "Fri", recall: 78, accuracy: 85, speed: 2.3 },
    { day: "Sat", recall: 82, accuracy: 88, speed: 2.1 },
    { day: "Sun", recall: 85, accuracy: 90, speed: 1.9 }
  ];

  const memoryCategories = [
    { category: "Important Moments", score: 88, trend: "+12%" },
    { category: "Key Decisions", score: 76, trend: "+8%" },
    { category: "Action Sequences", score: 82, trend: "+15%" },
    { category: "Conversation Details", score: 69, trend: "+5%" }
  ];

  return (
    <div className="space-y-6">
      {/* Memory Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Memory Recall</p>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">+18% this week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Response Speed</p>
                <p className="text-2xl font-bold">1.9s</p>
                <p className="text-xs text-muted-foreground">-40% faster</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Consistency</p>
                <p className="text-2xl font-bold">7 days</p>
                <p className="text-xs text-muted-foreground">Current streak</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Memory Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="recall" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Recall Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Recall Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Accuracy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Categories Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Memory Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memoryCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{category.score}%</span>
                    <span className="text-xs text-green-600 font-medium">{category.trend}</span>
                  </div>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              Key Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 leading-relaxed">
              Your memory performance is strongest between 10 AM - 2 PM. Consider scheduling 
              important moments logging and memory exercises during this peak window for 
              maximum effectiveness.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Improvement Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 leading-relaxed">
              Focus on "Conversation Details" category - it's showing the slowest improvement. 
              Try the "Conversation Recall" exercise 2-3 times this week to boost this area.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            This Week's Memory Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Complete 5 memory logging sessions</span>
              </div>
              <span className="text-sm text-green-600 font-medium">4/5 ✓</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Achieve 90% accuracy on recall tasks</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">88% (close!)</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Practice memory exercises daily</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">6/7 days ✓</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
