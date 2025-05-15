
import React from "react";
import { format, addDays, subWeeks, addWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekHeaderProps {
  currentDate: Date;
  startDate: Date;
  viewType: "grid" | "timeline";
  showEnergyOverlay: boolean;
  setCurrentDate: (date: Date) => void;
  setViewType: (viewType: "grid" | "timeline") => void;
  setShowEnergyOverlay: (show: boolean) => void;
}

export function WeekHeader({
  currentDate,
  startDate,
  viewType,
  showEnergyOverlay,
  setCurrentDate,
  setViewType,
  setShowEnergyOverlay
}: WeekHeaderProps) {
  const navigatePreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const navigateNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const navigateToday = () => setCurrentDate(new Date());

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={navigatePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={navigateToday}>Today</Button>
        <Button variant="outline" size="sm" onClick={navigateNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-lg font-semibold">
        {format(startDate, "MMMM d")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
      </h2>
      
      <div className="flex space-x-2">
        <Button 
          variant={viewType === "grid" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setViewType("grid")}
        >
          Grid
        </Button>
        <Button 
          variant={viewType === "timeline" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setViewType("timeline")}
        >
          Timeline
        </Button>
        <Button 
          variant={showEnergyOverlay ? "default" : "outline"} 
          size="sm" 
          onClick={() => setShowEnergyOverlay(!showEnergyOverlay)}
        >
          Energy
        </Button>
      </div>
    </div>
  );
}
