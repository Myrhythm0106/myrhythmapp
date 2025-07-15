
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Brain, Heart, Target, Calendar, Download } from "lucide-react";

const Analytics = () => {
  const metrics = [
    { label: "Cognitive Score", value: "78", change: "+12%", color: "text-blue-600" },
    { label: "Daily Streak", value: "23", change: "+5 days", color: "text-green-600" },
    { label: "Energy Level", value: "7.2", change: "+0.8", color: "text-orange-600" },
    { label: "Goal Completion", value: "85%", change: "+15%", color: "text-purple-600" }
  ];

  const weeklyData = [
    { day: "Mon", cognitive: 72, mood: 7, energy: 6 },
    { day: "Tue", cognitive: 75, mood: 8, energy: 7 },
    { day: "Wed", cognitive: 73, mood: 6, energy: 5 },
    { day: "Thu", cognitive: 78, mood: 8, energy: 8 },
    { day: "Fri", cognitive: 80, mood: 9, energy: 7 },
    { day: "Sat", cognitive: 77, mood: 8, energy: 6 },
    { day: "Sun", cognitive: 79, mood: 7, energy: 7 }
  ];

  const achievements = [
    { title: "First Week Complete", date: "Jan 8, 2024", type: "milestone" },
    { title: "Perfect Medication Week", date: "Jan 12, 2024", type: "health" },
    { title: "10 Brain Games Streak", date: "Jan 15, 2024", type: "cognitive" },
    { title: "High Energy Week", date: "Jan 18, 2024", type: "wellness" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics & Progress
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your recovery journey with detailed insights and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  index === 0 ? 'bg-blue-100' :
                  index === 1 ? 'bg-green-100' :
                  index === 2 ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  {index === 0 && <Brain className="h-6 w-6 text-blue-600" />}
                  {index === 1 && <Target className="h-6 w-6 text-green-600" />}
                  {index === 2 && <Heart className="h-6 w-6 text-orange-600" />}
                  {index === 3 && <TrendingUp className="h-6 w-6 text-purple-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                  <div className="font-medium">{day.day}</div>
                  <div className="flex items-center">
                    <div className="w-full bg-blue-100 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${day.cognitive}%` }}
                      />
                    </div>
                    <span className="text-xs">{day.cognitive}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-green-100 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${day.mood * 10}%` }}
                      />
                    </div>
                    <span className="text-xs">{day.mood}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-orange-100 rounded-full h-2 mr-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${day.energy * 10}%` }}
                      />
                    </div>
                    <span className="text-xs">{day.energy}</span>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground mt-2">
                <div></div>
                <div>Cognitive</div>
                <div>Mood</div>
                <div>Energy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    achievement.type === 'milestone' ? 'bg-yellow-100' :
                    achievement.type === 'health' ? 'bg-red-100' :
                    achievement.type === 'cognitive' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {achievement.type === 'milestone' && <Target className="h-4 w-4 text-yellow-600" />}
                    {achievement.type === 'health' && <Heart className="h-4 w-4 text-red-600" />}
                    {achievement.type === 'cognitive' && <Brain className="h-4 w-4 text-blue-600" />}
                    {achievement.type === 'wellness' && <TrendingUp className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          View Monthly Report
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Detailed Analytics
        </Button>
      </div>
    </div>
  );
};

export default Analytics;
