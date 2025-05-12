
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { PomodoroDialog } from "@/components/pomodoro/PomodoroDialog";

export interface Action {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  watchers?: string[];
  linkedGoal?: {
    id: string;
    title: string;
    type: "mobility" | "cognitive" | "health" | "other";
  };
}

interface ActionItemProps {
  action: Action;
  getActionStatusStyles: (actionDate: string) => string;
  getActionTypeStyles: (type: Action["type"]) => string;
  getGoalTypeStyles: (type: string) => string;
}

export function ActionItem({ 
  action, 
  getActionStatusStyles, 
  getActionTypeStyles, 
  getGoalTypeStyles 
}: ActionItemProps) {
  return (
    <div 
      key={action.id} 
      className={`border rounded-md p-3 transition-all ${getActionStatusStyles(action.date)}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium truncate">{action.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getActionTypeStyles(action.type)}`}>
          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
        </span>
      </div>
      
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{action.date}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{action.time}</span>
        </div>
        
        {action.location && (
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{action.location}</span>
          </div>
        )}

        {action.watchers && action.watchers.length > 0 && (
          <div className="flex items-center text-muted-foreground mt-1">
            <WatchersDisplay watchers={action.watchers} compact />
          </div>
        )}
        
        {/* Display linked goal with enhanced visual styling */}
        {action.linkedGoal && (
          <div className="flex items-center mt-2 bg-primary/5 px-2 py-1 rounded-md border-l-2 border-primary/30 overflow-hidden">
            <Target className="h-3.5 w-3.5 mr-1 text-primary flex-shrink-0" />
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium truncate max-w-full",
                getGoalTypeStyles(action.linkedGoal.type)
              )}
            >
              Goal: {action.linkedGoal.title}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between gap-2">
        <div className="flex-1">
          <PomodoroDialog title={action.title} />
        </div>
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Cancel</Button>
      </div>
    </div>
  );
}
