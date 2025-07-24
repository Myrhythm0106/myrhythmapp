import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Zap, Target, Heart, Timer, Coffee, Users, Calendar, Brain } from "lucide-react";

interface UnifiedActionDropdownProps {
  onQuickAction: () => void;
  onNewGoal: () => void;
  onPlanDreams: () => void;
  onFocusTimer: () => void;
  onScheduleFamily: () => void;
  onPlanBreak: () => void;
  selectedDate?: Date;
}

export function UnifiedActionDropdown({
  onQuickAction,
  onNewGoal,
  onPlanDreams,
  onFocusTimer,
  onScheduleFamily,
  onPlanBreak,
  selectedDate
}: UnifiedActionDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleAction = (actionFn: () => void) => {
    actionFn();
    setOpen(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "Today";
    return selectedDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white shadow-md"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-sm border shadow-lg">
        <DropdownMenuLabel className="font-medium text-primary">
          Actions for {formatSelectedDate()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Core Planning Actions */}
        <DropdownMenuItem 
          onClick={() => handleAction(onQuickAction)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Calendar className="h-4 w-4 mr-3 text-brain-health-500" />
          <div>
            <div className="font-medium text-foreground">Create Action</div>
            <div className="text-xs text-muted-foreground">Plan your next brain-friendly step</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleAction(onNewGoal)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Target className="h-4 w-4 mr-3 text-clarity-teal-500" />
          <div>
            <div className="font-medium">Create Future Goal</div>
            <div className="text-xs text-muted-foreground">Build neural pathways for success</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleAction(onPlanDreams)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Heart className="h-4 w-4 mr-3 text-memory-emerald-500" />
          <div>
            <div className="font-medium">Plan Future Dreams</div>
            <div className="text-xs text-muted-foreground">Design your ideal future</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* Wellness & Productivity */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Wellness & Focus
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => handleAction(onFocusTimer)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Timer className="h-4 w-4 mr-3 text-clarity-teal-500" />
          <div>
            <div className="font-medium">Focus Timer & Smart Breaks</div>
            <div className="text-xs text-muted-foreground">Pomodoro with brain-healthy breaks</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleAction(onScheduleFamily)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Users className="h-4 w-4 mr-3 text-heart-500" />
          <div>
            <div className="font-medium">Schedule Family Time</div>
            <div className="text-xs text-muted-foreground">Plan meaningful moments together</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleAction(onPlanBreak)}
          className="cursor-pointer hover:bg-muted/60"
        >
          <Coffee className="h-4 w-4 mr-3 text-memory-emerald-500" />
          <div>
            <div className="font-medium">Plan Smart Break</div>
            <div className="text-xs text-muted-foreground">Schedule restorative brain breaks</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}