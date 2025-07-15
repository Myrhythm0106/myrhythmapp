import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, Plus } from "lucide-react";
import { UserType } from "@/types/user";

interface GoalCreationFlowProps {
  userType: UserType;
  onComplete: (goals: Goal[]) => void;
}

interface Goal {
  id: string;
  title: string;
  description: string;
}

export function GoalCreationFlow({ userType, onComplete }: GoalCreationFlowProps) {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "", description: "" }
  ]);

  const addGoal = () => {
    setGoals(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: "", description: "" }
    ]);
  };

  const updateGoal = (id: string, field: keyof Goal, value: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleSubmit = () => {
    // Filter out empty goals
    const filteredGoals = goals.filter(goal => goal.title.trim() !== "");
    onComplete(filteredGoals);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Set Your Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => (
          <div key={goal.id} className="space-y-2 border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Goal {index + 1}</h4>
              {goals.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(goal.id)}
                  aria-label={`Remove goal ${index + 1}`}
                >
                  &times;
                </Button>
              )}
            </div>
            <Input
              placeholder="Goal title"
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
            />
            <Textarea
              placeholder="Goal description (optional)"
              value={goal.description}
              onChange={(e) => updateGoal(goal.id, "description", e.target.value)}
              rows={3}
            />
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={addGoal}
        >
          <Plus className="h-4 w-4" />
          Add Another Goal
        </Button>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={goals.every(goal => goal.title.trim() === "")}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
