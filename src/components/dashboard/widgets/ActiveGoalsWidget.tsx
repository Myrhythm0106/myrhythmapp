
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trophy, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SetNewGoalDialog } from "../../goals/SetNewGoalDialog";
import { GoalDetailsDialog } from "../../goals/GoalDetailsDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  myRhythmFocus?: string;
  target: string;
  deadline?: Date;
  progress: number;
  actions: any[];
  createdAt: string;
}

// Sample data - in real app this would come from state/API
const sampleGoals: Goal[] = [
  {
    id: "goal1",
    title: "Walk to mailbox independently",
    myRhythmFocus: "independence",
    target: "Complete the full walk without assistance",
    progress: 65,
    actions: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "goal2", 
    title: "Improve sleep quality",
    myRhythmFocus: "physical",
    target: "Average 7+ hours of quality sleep per night",
    progress: 40,
    actions: [],
    createdAt: new Date().toISOString()
  }
];

const focusConfig = {
  cognitive: { label: "Cognitive Recovery", color: "bg-purple-100 text-purple-800" },
  physical: { label: "Physical Health", color: "bg-green-100 text-green-800" },
  emotional: { label: "Emotional Wellbeing", color: "bg-pink-100 text-pink-800" },
  independence: { label: "Daily Independence", color: "bg-blue-100 text-blue-800" }
};

export function ActiveGoalsWidget() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            My Active Goals
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowNewGoalDialog(true)}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Goal
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-4">No goals set yet</p>
            <Button 
              onClick={() => setShowNewGoalDialog(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <>
            {goals.map((goal) => {
              const focus = goal.myRhythmFocus ? focusConfig[goal.myRhythmFocus as keyof typeof focusConfig] : null;
              
              return (
                <Card 
                  key={goal.id}
                  className="border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-all duration-300 group"
                  onClick={() => handleGoalClick(goal)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {goal.title}
                          </h4>
                          {focus && (
                            <Badge className={`${focus.color} text-xs mt-1`}>
                              {focus.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {goal.progress}%
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoalClick(goal);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="space-y-1">
                        <Progress 
                          value={goal.progress} 
                          className="h-2 transition-all duration-500"
                          indicatorClassName={cn(
                            getProgressColor(goal.progress),
                            "transition-all duration-500"
                          )}
                        />
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {goal.target}
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex justify-between items-center pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/calendar?goalId=${goal.id}`);
                          }}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Add Actions
                        </Button>
                        
                        {goal.progress >= 75 && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Trophy className="h-3 w-3 mr-1" />
                            Almost there!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate("/calendar?view=goals")}
            >
              View All Goals
            </Button>
          </>
        )}
      </CardContent>

      <SetNewGoalDialog
        open={showNewGoalDialog}
        onOpenChange={setShowNewGoalDialog}
        onGoalCreated={handleGoalCreated}
      />

      <GoalDetailsDialog
        goal={selectedGoal}
        open={!!selectedGoal}
        onOpenChange={(open) => !open && setSelectedGoal(null)}
      />
    </Card>
  );
}
