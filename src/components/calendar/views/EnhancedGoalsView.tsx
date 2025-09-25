
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, Clock, Calendar, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Goal, SmallStep, TinyAction } from "../types/goalTypes";
import { format } from "date-fns";

// Sample data - represents the structure described in requirements
const sampleGoalsData: Goal[] = [
  {
    id: "goal1",
    title: "Walk to the mailbox by myself",
    type: "long-term",
    description: "Build confidence and independence in mobility",
    progress: 35,
    dueDate: "2024-12-25",
    createdAt: "2024-01-01",
    smallSteps: [
      {
        id: "step1",
        goalId: "goal1",
        title: "Walk to the front door and back",
        description: "Practice short distance walking",
        progress: 75,
        actions: [
          {
            id: "action1",
            goalId: "goal1",
            smallStepId: "step1",
            title: "Walk from chair to front door, touch door, walk back",
            type: "activity",
            date: format(new Date(), "yyyy-MM-dd"),
            startTime: "10:00",
            status: "pending",
            duration: 5,
            isToday: true
          },
          {
            id: "action2",
            goalId: "goal1",
            smallStepId: "step1",
            title: "Walk to front door, open it, close it, walk back",
            type: "activity",
            date: "2024-11-28",
            startTime: "10:00",
            status: "done",
            duration: 5
          }
        ]
      },
      {
        id: "step2",
        goalId: "goal1",
        title: "Walk to the driveway and back",
        description: "Increase distance gradually",
        progress: 0,
        actions: [
          {
            id: "action3",
            goalId: "goal1",
            smallStepId: "step2",
            title: "Walk to the driveway, count to 10, walk back",
            type: "activity",
            date: "2024-12-02",
            startTime: "10:00",
            status: "pending",
            duration: 10
          }
        ]
      }
    ]
  },
  {
    id: "goal2",
    title: "Read a whole book",
    type: "monthly",
    description: "Improve cognitive function through reading",
    progress: 60,
    dueDate: "2024-12-31",
    createdAt: "2024-10-01",
    smallSteps: [
      {
        id: "step3",
        goalId: "goal2",
        title: "Read one page daily",
        description: "Build reading habit",
        progress: 80,
        actions: [
          {
            id: "action4",
            goalId: "goal2",
            smallStepId: "step3",
            title: "Read one page of my book out loud",
            type: "activity",
            date: format(new Date(), "yyyy-MM-dd"),
            startTime: "09:00",
            status: "pending",
            duration: 10,
            isToday: true
          }
        ]
      }
    ]
  }
];

export function EnhancedGoalsView() {
  const navigate = useNavigate();
  const [goals] = useState<Goal[]>(sampleGoalsData);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(["goal1"]));

  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const handleActionComplete = (actionId: string, goalTitle: string) => {
    toast.success("Action Complete! 🎉", {
      description: `You're one step closer to "${goalTitle}"! Keep going!`
    });
  };

  const handleActionClick = (action: TinyAction) => {
    navigate(`/calendar?actionId=${action.id}`);
  };

  const getActionTypeStyles = (type: string) => {
    switch (type) {
      case "appointment": return "bg-blue-100 text-blue-800";
      case "therapy": return "bg-purple-100 text-purple-800";
      case "medication": return "bg-red-100 text-red-800";
      case "activity": return "bg-green-100 text-green-800";
      case "personal": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-3 px-4 border-b flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Goals & Actions
        </h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Goal
        </Button>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => toggleGoalExpansion(goal.id)}
                    className="flex items-center gap-2 text-left w-full hover:opacity-75 transition-opacity"
                  >
                    {expandedGoals.has(goal.id) ? 
                      <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" /> : 
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                    }
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary flex items-center gap-2">
                        🎯 GOAL: {goal.title}
                      </CardTitle>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                  </button>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm font-medium">{goal.progress}% Complete</div>
                    <Progress value={goal.progress} className="w-20 h-2 mt-1" />
                  </div>
                </div>
              </CardHeader>

              {expandedGoals.has(goal.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {goal.smallSteps.map((step) => (
                      <div key={step.id} className="ml-6 border-l-2 border-orange-200 pl-4">
                        <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-orange-900">
                              📋 Small Step: {step.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-orange-700">{step.progress}%</span>
                              <Progress value={step.progress} className="w-16 h-1.5" />
                            </div>
                          </div>
                          {step.description && (
                            <p className="text-sm text-orange-800 mt-1">{step.description}</p>
                          )}
                        </div>

                        <div className="mt-3 ml-4 space-y-2">
                          {step.actions.map((action) => (
                            <div 
                              key={action.id} 
                              className={cn(
                                "p-3 rounded border cursor-pointer transition-all hover:shadow-md",
                                action.status === "done" ? "bg-green-50 border-green-200" : "bg-white border-gray-200",
                                action.isToday && "ring-2 ring-primary/20"
                              )}
                              onClick={() => handleActionClick(action)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionComplete(action.id, goal.title);
                                    }}
                                    className={cn(
                                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                       action.status === "done" 
                                        ? "bg-green-500 border-green-500 text-white" 
                                        : "border-gray-300 hover:border-green-500"
                                    )}
                                  >
                                    {action.status === "done" && <CheckCircle2 className="h-3 w-3" />}
                                  </button>
                                  
                                  <div className="flex-1">
                                    <p className={cn(
                                      "text-sm font-medium",
                                      action.status === "done" && "line-through text-muted-foreground"
                                    )}>
                                      → {action.title}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {action.date}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {action.startTime}
                                      </div>
                                      {action.duration && (
                                        <div>({action.duration} min)</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {action.isToday && (
                                    <Badge variant="default" className="text-xs bg-primary">
                                      Today
                                    </Badge>
                                  )}
                                  <Badge className={cn("text-xs", getActionTypeStyles(action.type))} variant="outline">
                                    {action.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
