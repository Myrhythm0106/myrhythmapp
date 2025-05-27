
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TinyAction } from "@/components/calendar/types/goalTypes";
import { format } from "date-fns";

// Sample today's actions data with explicit goal linkage
const todaysActions: TinyAction[] = [
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
];

// Goal context for actions with explicit titles
const goalContext: Record<string, string> = {
  "goal1": "Walk to the mailbox by myself",
  "goal2": "Read a whole book"
};

export function TodaysActions() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<TinyAction[]>(todaysActions);

  const handleActionComplete = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: "completed" as const }
        : action
    ));

    const action = actions.find(a => a.id === actionId);
    const goalTitle = action ? goalContext[action.goalId] : "";
    
    toast.success("Daily Do Complete! 🎉", {
      description: `You're one step closer to "${goalTitle}"! Keep going!`,
      duration: 4000
    });
  };

  const handleActionClick = (action: TinyAction) => {
    navigate(`/calendar/goal/${action.goalId}`);
  };

  const handleCardClick = () => {
    navigate("/calendar?view=goals");
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

  const pendingActions = actions.filter(action => action.status === "pending");
  const completedActions = actions.filter(action => action.status === "completed");

  return (
    <Card 
      className="hover:shadow-md transition-shadow border-l-4 border-l-primary cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Do
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your daily steps toward your goals
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {pendingActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-orange-700">To Complete Today:</h4>
            {pendingActions.map((action) => (
              <div 
                key={action.id}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionComplete(action.id);
                    }}
                    className="w-6 h-6 rounded border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 text-sm">{action.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-amber-700">
                        <Clock className="h-3 w-3" />
                        {action.startTime}
                        {action.duration && ` (${action.duration} min)`}
                      </div>
                    </div>
                    
                    {/* Explicit Goal Linkage */}
                    <div className="flex items-center gap-1 mt-2 bg-primary/10 px-2 py-1 rounded text-xs">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-primary font-medium">
                        Goal: {goalContext[action.goalId]}
                      </span>
                    </div>
                  </div>

                  <Badge className={cn("text-xs", getActionTypeStyles(action.type))} variant="outline">
                    {action.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {completedActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-700">Completed Today:</h4>
            {completedActions.map((action) => (
              <div 
                key={action.id}
                className="p-3 bg-green-50 border border-green-200 rounded-lg opacity-75"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-green-900 text-sm line-through">{action.title}</p>
                    <div className="flex items-center gap-1 mt-1 bg-green-100 px-2 py-1 rounded text-xs">
                      <Target className="h-3 w-3 text-green-600" />
                      <span className="text-green-700">
                        Goal: {goalContext[action.goalId]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No actions scheduled for today</p>
            <Button variant="outline" size="sm" className="mt-2">
              Add Action
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
