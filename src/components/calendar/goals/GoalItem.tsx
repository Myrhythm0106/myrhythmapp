
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Goal, Action } from "../types/goalTypes";
import { ChevronDown, ChevronRight, CalendarClock, Flag, Target, ListCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTable } from "./ActionTable";
import { getGoalActions } from "../utils/goalUtils";

interface GoalItemProps {
  goal: Goal;
  isExpanded: boolean;
  onToggle: () => void;
  actions: Action[];
}

export const GoalItem: React.FC<GoalItemProps> = ({ 
  goal, 
  isExpanded, 
  onToggle,
  actions 
}) => {
  const goalActions = getGoalActions(goal.id, actions);
  
  const getGoalTypeIcon = () => {
    switch(goal.type) {
      case "daily":
        return <Flag className="h-4 w-4 mr-1" />;
      case "weekly":
        return <Flag className="h-4 w-4 mr-1" />;
      case "monthly":
        return <Target className="h-4 w-4 mr-1" />;
      case "long-term":
        return <ListCheck className="h-4 w-4 mr-1" />;
      default:
        return <Target className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-0">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            }
            <div className="flex items-center">
              {getGoalTypeIcon()}
              <span className="font-medium">{goal.title}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground flex items-center">
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              {goal.dueDate || "No due date"}
            </div>
            
            <div className="w-24">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    goal.progress >= 70 ? "bg-green-500" : 
                    goal.progress >= 40 ? "bg-amber-500" : 
                    "bg-red-500"
                  )} 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 pt-0">
            {goal.description && (
              <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
            )}
            
            <ActionTable actions={goalActions} goalId={goal.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
