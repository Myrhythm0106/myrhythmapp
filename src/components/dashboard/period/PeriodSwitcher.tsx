import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { TimeFrame } from "@/hooks/useDashboardInsights";

interface PeriodSwitcherProps {
  currentPeriod: TimeFrame;
  onPeriodChange: (period: TimeFrame) => void;
  className?: string;
}

const periodConfig = {
  day: {
    label: "Today",
    icon: Clock,
    gradient: "from-sunrise-amber-500 to-memory-emerald-500",
    description: "Daily view"
  },
  week: {
    label: "Week",
    icon: Calendar,
    gradient: "from-brain-health-500 to-clarity-teal-500",
    description: "Weekly overview"
  },
  month: {
    label: "Month",
    icon: Target,
    gradient: "from-clarity-teal-500 to-beacon-500",
    description: "Monthly insights"
  },
  year: {
    label: "Year",
    icon: TrendingUp,
    gradient: "from-beacon-500 to-brain-health-500",
    description: "Annual progress"
  }
};

export function PeriodSwitcher({ currentPeriod, onPeriodChange, className }: PeriodSwitcherProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 p-2 bg-background/50 backdrop-blur-sm rounded-xl border border-brain-health-200/50", className)}>
      {Object.entries(periodConfig).map(([period, config]) => {
        const isActive = currentPeriod === period;
        const IconComponent = config.icon;
        
        return (
          <Button
            key={period}
            onClick={() => onPeriodChange(period as TimeFrame)}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:scale-105",
              isActive 
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg border-0 font-semibold`
                : "text-brain-health-700 hover:text-brain-health-900 hover:bg-brain-health-50"
            )}
          >
            <IconComponent className={cn("h-4 w-4", isActive && "animate-pulse")} />
            <span className="hidden sm:inline">{config.label}</span>
            <span className="sm:hidden">{config.label.charAt(0)}</span>
          </Button>
        );
      })}
    </div>
  );
}