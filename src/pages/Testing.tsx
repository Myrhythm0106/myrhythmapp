
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Brain, Clock, Target, CheckCircle, AlertTriangle } from "lucide-react";

const Testing = () => {
  const cognitiveTests = [
    {
      id: 1,
      name: "Working Memory Test",
      description: "Assess your ability to hold and manipulate information",
      duration: "15 minutes",
      difficulty: "Moderate",
      lastScore: 78,
      status: "available"
    },
    {
      id: 2,
      name: "Attention & Focus Assessment",
      description: "Measure sustained attention and concentration abilities",
      duration: "12 minutes",
      difficulty: "Easy",
      lastScore: 85,
      status: "available"
    },
    {
      id: 3,
      name: "Processing Speed Evaluation",
      description: "Test how quickly you can process visual information",
      duration: "10 minutes",
      difficulty: "Hard",
      lastScore: 65,
      status: "recommended"
    },
    {
      id: 4,
      name: "Executive Function Battery",
      description: "Comprehensive test of planning and decision-making",
      duration: "25 minutes",
      difficulty: "Advanced",
      lastScore: null,
      status: "locked"
    }
  ];

  const recentResults = [
    { test: "Working Memory", score: 78, date: "Jan 15", change: "+5" },
    { test: "Attention & Focus", score: 85, date: "Jan 12", change: "+3" },
    { test: "Processing Speed", score: 65, date: "Jan 10", change: "-2" },
    { test: "Memory Recall", score: 72, date: "Jan 8", change: "+8" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'recommended': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'recommended': return Target;
      case 'locked': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Hard': return 'text-orange-600';
      case 'Advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Cognitive Testing
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your cognitive abilities with scientifically validated assessments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Available Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cognitiveTests.map((test) => {
                const StatusIcon = getStatusIcon(test.status);
                return (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{test.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {test.duration}
                          </span>
                          <span className={`flex items-center font-medium ${getDifficultyColor(test.difficulty)}`}>
                            <Brain className="h-4 w-4 mr-1" />
                            {test.difficulty}
                          </span>
                          {test.lastScore && (
                            <span className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              Last: {test.lastScore}%
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusIcon className={`h-5 w-5 ${
                        test.status === 'available' ? 'text-green-600' :
                        test.status === 'recommended' ? 'text-blue-600' :
                        'text-gray-400'
                      }`} />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={test.status === 'locked'}
                      variant={test.status === 'recommended' ? 'default' : 'outline'}
                    >
                      {test.status === 'locked' ? 'Coming Soon' : 'Start Test'}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{result.test}</div>
                    <div className="text-xs text-muted-foreground">{result.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{result.score}%</div>
                    <div className={`text-xs ${
                      result.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.change}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Best Time to Test</div>
                <div className="text-blue-600">When you're well-rested and focused</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Environment</div>
                <div className="text-green-600">Quiet space without distractions</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-800">Frequency</div>
                <div className="text-yellow-600">Weekly tests show best progress</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <TestTube className="h-4 w-4 mr-2" />
                View Test History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Set Testing Reminders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testing;
