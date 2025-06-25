
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, TrendingUp, Calendar, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemoryProgress } from "@/hooks/use-memory-progress";

export function MemoryJourney() {
  const navigate = useNavigate();
  const { memoryMilestones, weeklyProgress } = useMemoryProgress();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "logging": return Calendar;
      case "exercises": return Brain;
      case "recall": return Target;
      case "consistency": return Clock;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "logging": return "text-blue-600";
      case "exercises": return "text-purple-600";
      case "recall": return "text-green-600";
      case "consistency": return "text-amber-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Memory Journey Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((week, index) => (
              <div key={week.week} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{week.week}</span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Tasks: {week.memoryTasks}</span>
                    <span>Accuracy: {week.accuracyScore}%</span>
                    <span>Recall: {week.recallTime}s</span>
                  </div>
                </div>
                <Progress value={week.accuracyScore} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Memory Improvement Insight</span>
            </div>
            <p className="text-sm text-blue-800">
              Your recall time has improved by 34% over the past 3 weeks! Keep logging important moments 
              and practicing memory exercises to maintain this positive trajectory.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Memory Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Memory Enhancement Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {memoryMilestones.map((milestone) => {
              const IconComponent = getCategoryIcon(milestone.category);
              const iconColor = getCategoryColor(milestone.category);
              const progress = (milestone.currentValue / milestone.targetValue) * 100;
              const isCompleted = milestone.achievedAt !== null;
              
              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {milestone.title}
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.currentValue} / {milestone.targetValue}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {isCompleted && milestone.achievedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Achieved on {new Date(milestone.achievedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Log Important Moments</h3>
              <p className="text-sm text-muted-foreground">
                Capture key decisions and actions to strengthen your memory patterns
              </p>
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Start Logging
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Memory Exercises</h3>
              <p className="text-sm text-muted-foreground">
                Practice targeted exercises to boost recall and cognitive function
              </p>
              <Button 
                onClick={() => navigate("/health-fitness?tab=brainGames")} 
                variant="outline"
                className="w-full border-purple-200 text-purple-700"
              >
                Practice Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
