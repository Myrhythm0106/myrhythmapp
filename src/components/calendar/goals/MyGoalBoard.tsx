
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Sample goals data with icons
const sampleGoals = [
  {
    id: "goal1",
    title: "Walk to the mailbox by myself",
    type: "daily" as const,
    description: "Build independence in mobility",
    progress: 65,
    icon: "walking",
    dueDate: "2024-02-15",
    createdAt: "2024-01-15",
    smallSteps: [
      {
        id: "step1",
        goalId: "goal1",
        title: "Walk to the front door",
        description: "First step towards mailbox",
        progress: 80,
        actions: []
      },
      {
        id: "step2", 
        goalId: "goal1",
        title: "Walk to the driveway",
        description: "Second step towards mailbox",
        progress: 60,
        actions: []
      }
    ]
  },
  {
    id: "goal2",
    title: "Read a whole book",
    type: "weekly" as const,
    description: "Improve cognitive function through reading",
    progress: 45,
    icon: "book",
    dueDate: "2024-03-01",
    createdAt: "2024-01-20",
    smallSteps: [
      {
        id: "step3",
        goalId: "goal2", 
        title: "Read for 15 minutes daily",
        description: "Build reading habit",
        progress: 70,
        actions: []
      },
      {
        id: "step4",
        goalId: "goal2",
        title: "Finish first chapter",
        description: "Complete initial reading goal",
        progress: 30,
        actions: []
      }
    ]
  },
  {
    id: "goal3",
    title: "Cook a simple meal",
    type: "weekly" as const,
    description: "Regain independence in kitchen tasks",
    progress: 25,
    icon: "cooking",
    dueDate: "2024-02-28",
    createdAt: "2024-01-25",
    smallSteps: [
      {
        id: "step5",
        goalId: "goal3",
        title: "Prepare ingredients",
        description: "Practice chopping and measuring",
        progress: 40,
        actions: []
      }
    ]
  }
];

export function MyGoalBoard() {
  const navigate = useNavigate();

  const handleGoalClick = (goalId: string) => {
    navigate(`/calendar/goal/${goalId}`);
  };

  const handleAddGoal = () => {
    navigate("/calendar?planMyDreams=true");
    toast.info("Starting Plan My Dreams flow!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            My Goal Board
          </h2>
          <p className="text-gray-600 mt-1">Your dreams in progress</p>
        </div>
        
        <Button onClick={handleAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Plan New Dream
        </Button>
      </div>

      {/* Goals Grid */}
      {sampleGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onClick={handleGoalClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Start by planning your first dream!</p>
          <Button onClick={handleAddGoal} className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Plan My First Dream
          </Button>
        </div>
      )}
    </div>
  );
}
