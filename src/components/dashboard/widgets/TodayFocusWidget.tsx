
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TodayFocusWidget() {
  const navigate = useNavigate();
  
  // Mock data - in real app this would come from user data
  const todayTasks = [
    { id: 1, title: "Complete morning routine", completed: true },
    { id: 2, title: "Play brain games", completed: false },
    { id: 3, title: "Record mood", completed: true },
    { id: 4, title: "Gratitude practice", completed: false }
  ];

  const completedTasks = todayTasks.filter(task => task.completed).length;
  const totalTasks = todayTasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Today's Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{completedTasks}/{totalTasks} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {todayTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-2 text-sm ${
                task.completed ? 'text-muted-foreground line-through' : ''
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  task.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              {task.title}
            </div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/calendar")}
          className="w-full justify-between"
        >
          View All Tasks
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
