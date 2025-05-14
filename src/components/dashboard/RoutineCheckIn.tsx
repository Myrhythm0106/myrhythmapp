
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Routine {
  id: string;
  name: string;
  completed: boolean;
  time?: string;
  color: "blue" | "green" | "amber" | "purple" | "pink";
}

export function RoutineCheckIn() {
  const [routines, setRoutines] = useState<Routine[]>([
    { id: "1", name: "Morning Medication", completed: true, time: "8:00 AM", color: "blue" },
    { id: "2", name: "15 Min Meditation", completed: false, time: "9:30 AM", color: "purple" },
    { id: "3", name: "Hydrate (32oz)", completed: false, color: "green" },
    { id: "4", name: "Evening Medication", completed: false, time: "8:00 PM", color: "pink" },
  ]);
  
  const completedCount = routines.filter(routine => routine.completed).length;
  const progressPercentage = (completedCount / routines.length) * 100;
  
  const getColorClass = (color: string, isBackground = false) => {
    const prefix = isBackground ? "bg" : "text";
    switch(color) {
      case "blue": return `${prefix}-blue-500`;
      case "green": return `${prefix}-green-500`;
      case "amber": return `${prefix}-amber-500`;
      case "purple": return `${prefix}-purple-500`;
      case "pink": return `${prefix}-pink-500`;
      default: return `${prefix}-primary`;
    }
  };
  
  const handleToggleRoutine = (id: string) => {
    setRoutines(prev => 
      prev.map(routine => 
        routine.id === id ? { ...routine, completed: !routine.completed } : routine
      )
    );
    
    // Check if this completes all routines
    const updatedRoutine = routines.find(r => r.id === id);
    if (updatedRoutine && !updatedRoutine.completed) {
      const newCompletedCount = completedCount + 1;
      if (newCompletedCount === routines.length) {
        toast.success("All routines completed for today! Great job! 🎉");
      } else {
        toast.success("Routine checked off!");
      }
    }
  };
  
  return (
    <Card className="border-l-4 border-l-green-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Check className="h-5 w-5 text-green-500" />
          Routine Check-in
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{completedCount}/{routines.length}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            indicatorClassName={cn(
              progressPercentage === 100 ? "bg-green-500" :
              progressPercentage >= 50 ? "bg-blue-500" :
              "bg-amber-500"
            )}
          />
        </div>
        
        <ul className="space-y-2">
          {routines.map(routine => (
            <li key={routine.id} className="flex items-center gap-2">
              <Button 
                variant={routine.completed ? "default" : "outline"} 
                size="icon"
                className={cn(
                  "h-7 w-7 transition-colors", 
                  routine.completed && getColorClass(routine.color, true)
                )}
                onClick={() => handleToggleRoutine(routine.id)}
              >
                <Check className={cn("h-4 w-4", routine.completed ? "text-white" : getColorClass(routine.color))} />
              </Button>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={routine.completed ? "text-muted-foreground line-through" : ""}>
                    {routine.name}
                  </span>
                  {routine.time && (
                    <span className="text-xs text-muted-foreground">{routine.time}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-0 justify-between">
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <Plus className="h-3 w-3" />
          Add Routine
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <Info className="h-3 w-3" />
          View All
        </Button>
      </CardFooter>
    </Card>
  );
}
