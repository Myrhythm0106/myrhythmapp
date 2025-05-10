
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleCheck } from "lucide-react";

interface RoutineStep {
  id: string;
  title: string;
  completed: boolean;
}

interface Routine {
  id: string;
  title: string;
  steps: RoutineStep[];
}

export function RoutineProgress() {
  // In a real app, we would fetch this data from an API
  // For now, we'll use sample data
  const currentRoutine: Routine = {
    id: "morning-routine",
    title: "Morning Routine",
    steps: [
      { id: "step1", title: "Drink water", completed: true },
      { id: "step2", title: "Take medication", completed: true },
      { id: "step3", title: "Light stretching", completed: true },
      { id: "step4", title: "Healthy breakfast", completed: false },
      { id: "step5", title: "Daily planning", completed: false },
    ],
  };

  const completedSteps = currentRoutine.steps.filter(step => step.completed).length;
  const progress = (completedSteps / currentRoutine.steps.length) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CircleCheck className="h-5 w-5 text-green-500" />
          Routine Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>{currentRoutine.title}</span>
            <span className="font-medium">{completedSteps}/{currentRoutine.steps.length} Steps Completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <ul className="space-y-1">
          {currentRoutine.steps.map((step) => (
            <li 
              key={step.id} 
              className={`text-xs px-2 py-1 rounded ${
                step.completed 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {step.title}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
