import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewSliderProps {
  view: "day" | "week" | "month" | "year" | "goals";
  onViewChange: (view: "day" | "week" | "month" | "year" | "goals") => void;
  className?: string;
}

export function CalendarViewSlider({ view, onViewChange, className }: CalendarViewSliderProps) {
  const viewOptions = [
    { key: "day", icon: Clock, label: "Today" },
    { key: "week", icon: Calendar, label: "Week" },
    { key: "month", icon: Calendar, label: "Month" },
    { key: "year", icon: Calendar, label: "Year" },
    { key: "goals", icon: Target, label: "Goals" }
  ] as const;

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border border-brain-health-200 rounded-xl p-1 shadow-sm">
        <div className="flex relative">
          {viewOptions.map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 z-10",
                view === key 
                  ? "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white shadow-md hover:shadow-lg" 
                  : "text-brain-health-700 hover:bg-brain-health-100/50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}