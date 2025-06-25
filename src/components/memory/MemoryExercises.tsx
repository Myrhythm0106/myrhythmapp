
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, Star, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MemoryExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Visual" | "Verbal" | "Sequential" | "Spatial";
  completed: boolean;
  accuracy?: number;
}

export function MemoryExercises() {
  const navigate = useNavigate();
  
  const exercises: MemoryExercise[] = [
    {
      id: "1",
      title: "Important Moments Sequence",
      description: "Practice recalling the sequence of important events from your day",
      duration: "5 min",
      difficulty: "Beginner",
      category: "Sequential",
      completed: true,
      accuracy: 87
    },
    {
      id: "2",
      title: "Decision Memory Palace",
      description: "Build a mental map of important decisions and their outcomes",
      duration: "8 min",
      difficulty: "Intermediate",
      category: "Spatial",
      completed: false
    },
    {
      id: "3",
      title: "Action Recall Challenge",
      description: "Remember and reproduce sequences of important actions taken",
      duration: "6 min",
      difficulty: "Beginner",
      category: "Sequential",
      completed: true,
      accuracy: 92
    },
    {
      id: "4",
      title: "Visual Memory Log",
      description: "Practice remembering visual details from important moments",
      duration: "7 min",
      difficulty: "Intermediate",
      category: "Visual",
      completed: false
    },
    {
      id: "5",
      title: "Conversation Recall",
      description: "Train your ability to remember key points from important conversations",
      duration: "10 min",
      difficulty: "Advanced",
      category: "Verbal",
      completed: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Visual": return "👁️";
      case "Verbal": return "💬";
      case "Sequential": return "🔢";
      case "Spatial": return "🗺️";
      default: return "🧠";
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Recommended Exercise */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Today's Memory Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Decision Memory Palace</h3>
              <p className="text-muted-foreground">
                Perfect for strengthening your ability to recall important decisions and their context
              </p>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor("Intermediate")}>Intermediate</Badge>
                <Badge variant="outline">{getCategoryIcon("Spatial")} Spatial</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  8 min
                </span>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              <Play className="h-4 w-4 mr-2" />
              Start Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Memory Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Memory Training Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  exercise.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                      <h3 className="font-semibold flex items-center gap-2">
                        {exercise.title}
                        {exercise.completed && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {exercise.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline">{exercise.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exercise.duration}
                      </span>
                      {exercise.accuracy && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {exercise.accuracy}% accuracy
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button 
                      variant={exercise.completed ? "outline" : "default"}
                      onClick={() => navigate("/health-fitness?tab=brainGames")}
                    >
                      {exercise.completed ? "Practice Again" : "Start Exercise"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Memory Exercise Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Target className="h-5 w-5" />
            Memory Enhancement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-amber-800">
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <p className="text-sm">
                <strong>Consistency is key:</strong> Practice memory exercises for just 5-10 minutes daily for best results
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <p className="text-sm">
                <strong>Connect to real life:</strong> Apply memory techniques to your daily important moments and decisions
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <p className="text-sm">
                <strong>Track your progress:</strong> Notice improvements in recall speed and accuracy over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
