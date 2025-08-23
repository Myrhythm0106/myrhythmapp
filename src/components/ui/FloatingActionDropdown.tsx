import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Zap, Target, Brain, Timer, Coffee, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionDropdownProps {
  onQuickAction: () => void;
  onNewGoal: () => void;
  onPlanDreams: () => void;
  onFocusTimer: () => void;
  onScheduleFamily: () => void;
  onPlanBreak: () => void;
  className?: string;
}

export function FloatingActionDropdown({ 
  onQuickAction,
  onNewGoal,
  onPlanDreams,
  onFocusTimer,
  onScheduleFamily,
  onPlanBreak,
  className 
}: FloatingActionDropdownProps) {
  const handleAction = (action: () => void) => {
    action();
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700"
          >
            <Zap className="mr-2 h-5 w-5" />
            Action
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-background/95 backdrop-blur-sm border shadow-lg"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="font-medium text-primary">
            Quick Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleAction(onQuickAction)} className="gap-3 p-3">
            <Target className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium">Quick Action</div>
              <div className="text-xs text-muted-foreground">Add a new task or activity</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleAction(onNewGoal)} className="gap-3 p-3">
            <Brain className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-medium">New Goal</div>
              <div className="text-xs text-muted-foreground">Create a brain-friendly goal</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleAction(onPlanDreams)} className="gap-3 p-3">
            <Calendar className="h-4 w-4 text-teal-600" />
            <div>
              <div className="font-medium">Plan My Dreams</div>
              <div className="text-xs text-muted-foreground">Long-term planning session</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleAction(onFocusTimer)} className="gap-3 p-3">
            <Timer className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium">Focus Timer</div>
              <div className="text-xs text-muted-foreground">Pomodoro & deep work session</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleAction(onScheduleFamily)} className="gap-3 p-3">
            <Users className="h-4 w-4 text-pink-600" />
            <div>
              <div className="font-medium">Family Time</div>
              <div className="text-xs text-muted-foreground">Schedule family activities</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleAction(onPlanBreak)} className="gap-3 p-3">
            <Coffee className="h-4 w-4 text-amber-600" />
            <div>
              <div className="font-medium">Break Time</div>
              <div className="text-xs text-muted-foreground">Plan therapeutic breaks</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}