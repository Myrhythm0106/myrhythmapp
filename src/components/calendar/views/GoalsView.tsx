
import React, { useState } from "react";
import { OrganizedGoalBoard } from "../goals/OrganizedGoalBoard";
import { GoalDisplayCard } from "../../goals/GoalDisplayCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDailyActions } from "@/contexts/DailyActionsContext";

// Sample goal data - in a real app, this would come from your data context
const sampleGoals = [
  {
    id: "goal-1",
    title: "Walk to the mailbox independently",
    description: "Build independence in mobility and confidence in outdoor navigation",
    target: "Walk 200 steps to mailbox and back without assistance, 5 days per week",
    why: "This will help me feel more independent and confident about going places on my own. It's a step toward bigger adventures.",
    timeframe: "Within 4 weeks",
    progress: 65,
    status: "active" as const,
    category: "Independence",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "goal-2", 
    title: "Read one chapter daily",
    description: "Improve cognitive function and concentration through consistent reading",
    target: "Complete one chapter of any book each day for 30 days",
    why: "Reading helps my brain stay active and gives me joy. I want to finish the books I started before my injury.",
    timeframe: "30 days",
    progress: 40,
    status: "active" as const,
    category: "Cognitive",
    createdAt: "2024-01-20T14:30:00Z"
  }
];

export function GoalsView() {
  const navigate = useNavigate();
  const [goals] = useState(sampleGoals);
  
  // Find the most recently worked on goal as featured
  const featuredGoal = goals.find(goal => goal.status === 'active') || goals[0];
  const otherGoals = goals.filter(goal => goal.id !== featuredGoal?.id);

  const handleCreateNewGoal = () => {
    navigate("/calendar?newGoal=true");
  };

  const handleEditGoal = (goal: any) => {
    // In a real app, this would open an edit dialog
    console.log("Edit goal:", goal);
  };

  const handleViewActions = (goal: any) => {
    // Navigate to goal details or actions view
    navigate(`/calendar?goalId=${goal.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-memory-emerald-600" />
            Your Goals
          </h2>
          <p className="text-gray-600 mt-1">Focus areas that matter to you</p>
        </div>
        <Button 
          onClick={handleCreateNewGoal}
          className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start by creating your first goal. Break it down into manageable steps and track your progress.
            </p>
            <Button 
              onClick={handleCreateNewGoal}
              className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Featured Goal - Current Focus */}
          {featuredGoal && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-memory-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Focus</h3>
                <Badge className="bg-memory-emerald-100 text-memory-emerald-700">
                  {featuredGoal.progress}% Complete
                </Badge>
              </div>
              <GoalDisplayCard
                goal={featuredGoal}
                onEdit={handleEditGoal}
                onViewActions={handleViewActions}
                featured={true}
              />
            </div>
          )}

          {/* Other Goals */}
          {otherGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">All Goals</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {otherGoals.map((goal) => (
                  <GoalDisplayCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onViewActions={handleViewActions}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Original organized board for additional functionality */}
          <div className="border-t pt-6">
            <OrganizedGoalBoard />
          </div>
        </div>
      )}
    </div>
  );
}
