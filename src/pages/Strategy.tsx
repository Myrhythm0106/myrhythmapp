
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Lightbulb, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const Strategy = () => {
  const strategies = [
    {
      id: 1,
      title: "Morning Routine Optimization",
      description: "Establish a consistent morning routine to boost cognitive function",
      status: "active",
      progress: 75,
      nextAction: "Practice for 3 more days",
      category: "routine"
    },
    {
      id: 2,
      title: "Energy Management",
      description: "Learn to recognize and manage energy levels throughout the day",
      status: "in-progress",
      progress: 45,
      nextAction: "Complete energy tracking for 1 week",
      category: "wellness"
    },
    {
      id: 3,
      title: "Memory Techniques",
      description: "Implement spaced repetition and visualization for better recall",
      status: "planned",
      progress: 0,
      nextAction: "Start with basic memory exercises",
      category: "cognitive"
    }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Cognitive Improvement",
      insight: "Your attention span has increased by 23% over the past month",
      action: "Continue current brain training routine"
    },
    {
      icon: Target,
      title: "Goal Progress",
      insight: "You're 80% towards your monthly goal completion target",
      action: "Focus on 2-3 key goals this week"
    },
    {
      icon: Lightbulb,
      title: "Optimization Opportunity",
      insight: "Your best performance times are 10AM-12PM and 3PM-5PM",
      action: "Schedule important tasks during these windows"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'in-progress': return AlertCircle;
      case 'planned': return Calendar;
      default: return Calendar;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Strategy & Planning
        </h1>
        <p className="text-lg text-muted-foreground">
          Develop personalized strategies to optimize your cognitive recovery
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Active Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strategies.map((strategy) => {
                const StatusIcon = getStatusIcon(strategy.status);
                return (
                  <div key={strategy.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{strategy.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(strategy.status)}`}>
                            {strategy.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                      </div>
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{strategy.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${strategy.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Next: {strategy.nextAction}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              <Button className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Create New Strategy
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{insight.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{insight.insight}</p>
                    <p className="text-xs font-medium text-primary">{insight.action}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Strategy Review
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Progress Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Set New Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Strategy;
