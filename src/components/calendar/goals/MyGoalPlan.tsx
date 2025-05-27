
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { GoalSufficiencyAnalyzer } from "./GoalSufficiencyAnalyzer";
import { GoalPlanHeader } from "./plan/GoalPlanHeader";
import { SmallStepCard } from "./plan/SmallStepCard";

// Sample goal data - in real app this would come from props or API
const sampleGoal = {
  id: "goal1",
  title: "Walk to the mailbox by myself",
  type: "daily" as const,
  progress: 65,
  icon: "walking",
  smallSteps: [
    {
      id: "step1",
      title: "Walk to the front door",
      progress: 80,
      status: "in-progress" as const,
      actions: [
        {
          id: "action1",
          title: "Stand up from chair and walk 5 steps",
          measurement: "I walked 5 steps without support",
          timing: "morning",
          completed: true,
          dueDate: "today"
        },
        {
          id: "action2", 
          title: "Touch the front door handle",
          measurement: "I touched the door handle",
          timing: "afternoon",
          completed: false,
          dueDate: "today"
        }
      ]
    },
    {
      id: "step2",
      title: "Walk to the driveway", 
      progress: 40,
      status: "pending" as const,
      actions: [
        {
          id: "action3",
          title: "Walk from door to driveway",
          measurement: "I reached the driveway",
          timing: "morning",
          completed: false,
          dueDate: "tomorrow"
        }
      ]
    },
    {
      id: "step3",
      title: "Walk to the mailbox",
      progress: 0,
      status: "pending" as const,
      actions: []
    }
  ]
};

export function MyGoalPlan() {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const [goal, setGoal] = useState(sampleGoal);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleBack = () => {
    navigate("/calendar?view=goals");
  };

  const handleCompleteAction = (stepId: string, actionId: string) => {
    setGoal(prev => ({
      ...prev,
      smallSteps: prev.smallSteps.map(step => 
        step.id === stepId 
          ? {
              ...step,
              actions: step.actions.map(action =>
                action.id === actionId
                  ? { ...action, completed: !action.completed }
                  : action
              )
            }
          : step
      )
    }));
    
    toast.success("Great job! Action completed! 🎉", {
      description: "You're making amazing progress!",
      duration: 3000
    });
  };

  const handleEditAction = (actionId: string) => {
    toast.info(`Editing action ${actionId} - Edit functionality coming soon!`);
  };

  const handleAddDailyDo = (stepId: string) => {
    toast.info(`Adding new Daily Do to step ${stepId} - Feature coming soon!`);
  };

  const handleAddSmallerPart = () => {
    toast.info("Adding new Smaller Part - Feature coming soon!");
  };

  const handleAddSuggestion = (suggestion: any) => {
    if (suggestion.type === "smaller-part") {
      // Add new smaller part
      const newStep = {
        id: `step-${Date.now()}`,
        title: suggestion.title,
        progress: 0,
        status: "pending" as const,
        actions: []
      };
      setGoal(prev => ({
        ...prev,
        smallSteps: [...prev.smallSteps, newStep]
      }));
    } else if (suggestion.type === "daily-do" && suggestion.targetStepId) {
      // Add daily do to specific step
      const newAction = {
        id: `action-${Date.now()}`,
        title: suggestion.title,
        measurement: suggestion.description,
        timing: "morning",
        completed: false,
        dueDate: "today"
      };
      setGoal(prev => ({
        ...prev,
        smallSteps: prev.smallSteps.map(step =>
          step.id === suggestion.targetStepId
            ? { ...step, actions: [...step.actions, newAction] }
            : step
        )
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <GoalPlanHeader goal={goal} onBack={handleBack} />

      {/* Smart Suggestions */}
      {showSuggestions && (
        <GoalSufficiencyAnalyzer
          goalTitle={goal.title}
          smallSteps={goal.smallSteps}
          onAddSuggestion={handleAddSuggestion}
          onDismiss={() => setShowSuggestions(false)}
        />
      )}

      {/* Smaller Parts */}
      <div className="space-y-6">
        {goal.smallSteps.map((step, index) => (
          <SmallStepCard
            key={step.id}
            step={step}
            stepIndex={index}
            onCompleteAction={handleCompleteAction}
            onEditAction={handleEditAction}
            onAddDailyDo={handleAddDailyDo}
          />
        ))}
        
        {/* Add Smaller Part Button */}
        <Button
          variant="outline"
          onClick={handleAddSmallerPart}
          className="w-full border-dashed border-2 text-primary hover:bg-primary/5 p-6"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add a Smaller Part
        </Button>
      </div>
    </div>
  );
}
