
import React from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { WeekNaming } from "@/components/dashboard/WeekNaming";

interface DashboardHeaderProps {
  onShowTutorial?: () => void;
  currentDate?: string;
  userName?: string;
}

export function DashboardHeader({ 
  onShowTutorial = () => console.log("Tutorial clicked"), 
  currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  userName 
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">MyRhythm</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShowTutorial}
          className="flex items-center gap-2"
          aria-label="View tutorial"
        >
          <Info className="h-4 w-4" />
          Help
        </Button>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg text-muted-foreground">{currentDate}</p>
        {userName && (
          <p className="text-xl font-medium">Hello, {userName}</p>
        )}
        <WeekNaming />
      </div>
    </div>
  );
}
