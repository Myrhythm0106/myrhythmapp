
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardViewSelectorProps {
  currentView: "now" | "week";
  onViewChange: (view: "now" | "week") => void;
}

export function DashboardViewSelector({ currentView, onViewChange }: DashboardViewSelectorProps) {
  return (
    <Card className="p-1 bg-muted/30 w-fit">
      <div className="flex gap-1">
        <Button
          variant={currentView === "now" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("now")}
          className={cn(
            "h-9 px-4",
            currentView === "now" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Clock className="h-4 w-4 mr-2" />
          Need to Know NOW
        </Button>
        <Button
          variant={currentView === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("week")}
          className={cn(
            "h-9 px-4",
            currentView === "week" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Keep in Mind
        </Button>
      </div>
    </Card>
  );
}
