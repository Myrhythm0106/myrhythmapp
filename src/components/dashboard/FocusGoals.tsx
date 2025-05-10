
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Book, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface FocusGoal {
  id: string;
  title: string;
  category: "mobility" | "cognitive" | "health" | "other";
  progress: number;
}

export function FocusGoals() {
  const navigate = useNavigate();
  
  // Sample data - in a real app, fetch from API or context
  const focusGoals: FocusGoal[] = [
    {
      id: "goal1",
      title: "Walk for 15 mins daily",
      category: "mobility",
      progress: 70
    },
    {
      id: "goal2",
      title: "Read for 30 mins daily",
      category: "cognitive",
      progress: 45
    }
  ];
  
  const getGoalIcon = (category: FocusGoal["category"]) => {
    switch(category) {
      case "mobility":
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case "cognitive":
        return <Book className="h-4 w-4 text-purple-500" />;
      default:
        return <Target className="h-4 w-4 text-green-500" />;
    }
  };
  
  const handleViewAllGoals = () => {
    navigate("/calendar?view=goals");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          My Focus Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          {focusGoals.map((goal) => (
            <li key={goal.id} className="flex items-center gap-3 border rounded-md p-3 hover:bg-muted/20 transition-colors">
              <div className="flex-shrink-0">
                {getGoalIcon(goal.category)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{goal.title}</p>
                <Progress 
                  value={goal.progress} 
                  className="h-1.5 mt-1.5"
                  indicatorClassName={cn(
                    goal.progress >= 70 ? "bg-green-500" : 
                    goal.progress >= 40 ? "bg-amber-500" : 
                    "bg-red-500"
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={handleViewAllGoals}
        >
          View All Goals
        </Button>
      </CardFooter>
    </Card>
  );
}
