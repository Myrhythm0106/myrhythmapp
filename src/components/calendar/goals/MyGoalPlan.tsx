
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, CheckCircle2, Circle, Edit3, Target, Book, Footprints } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const iconMap = {
  "walking": Footprints,
  "book": Book,
  "target": Target
};

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
  
  const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target;

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

  const getStepStatusIcon = (status: string, progress: number) => {
    if (progress === 100) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (progress > 0) return <Circle className="h-5 w-5 text-amber-500 fill-amber-100" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500"; 
    return "bg-blue-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Goal Plan</h1>
              <p className="text-gray-600">{goal.title}</p>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-lg font-bold text-primary">{goal.progress}% Complete</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-3"
              indicatorClassName={cn(getProgressColor(goal.progress))}
            />
          </div>
        </div>
      </div>

      {/* Smaller Parts */}
      <div className="space-y-6">
        {goal.smallSteps.map((step, index) => (
          <Card key={step.id} className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                {getStepStatusIcon(step.status, step.progress)}
                <span>Smaller Part {index + 1}: {step.title}</span>
                <Badge variant="outline" className="ml-auto">
                  {step.progress}% Complete
                </Badge>
              </CardTitle>
              {step.progress > 0 && (
                <Progress 
                  value={step.progress} 
                  className="h-2"
                  indicatorClassName={cn(getProgressColor(step.progress))}
                />
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Daily Do Actions */}
              {step.actions.length > 0 ? (
                <div className="space-y-3">
                  {step.actions.map((action) => (
                    <div 
                      key={action.id}
                      className={cn(
                        "p-4 border rounded-lg transition-all",
                        action.completed 
                          ? "bg-green-50 border-green-200" 
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleCompleteAction(step.id, action.id)}
                          className={cn(
                            "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            action.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-primary"
                          )}
                        >
                          {action.completed && <CheckCircle2 className="h-3 w-3" />}
                        </button>
                        
                        <div className="flex-1">
                          <div className={cn(
                            "space-y-1",
                            action.completed && "opacity-75"
                          )}>
                            <p className={cn(
                              "font-medium",
                              action.completed && "line-through"
                            )}>
                              What I'll do: {action.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              How I'll know: {action.measurement}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {action.timing}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {action.dueDate}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAction(action.id)}
                          className="opacity-50 hover:opacity-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No daily actions planned yet for this part</p>
                </div>
              )}
              
              {/* Add Daily Do Button */}
              <Button
                variant="outline"
                onClick={() => handleAddDailyDo(step.id)}
                className="w-full border-dashed border-2 text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Daily Do
              </Button>
            </CardContent>
          </Card>
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
