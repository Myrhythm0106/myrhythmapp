import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Sun, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFrame } from "@/hooks/useDateRanges";
import { PlannerBoard } from "./smart/PlannerBoard";
import { AffirmationCard } from "./smart/AffirmationCard";
import { HabitTrackerCard } from "./smart/HabitTrackerCard";
import { CapturesActsCompact } from "./smart/CapturesActsCompact";
import { CoachingRemindersCard } from "./smart/CoachingRemindersCard";

type ViewType = "day" | "week" | "month" | "year";

export function BrainFriendlyDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>("day");

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const getViewLabel = () => {
    switch (currentView) {
      case "day": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "year": return "This Year";
      default: return "Today";
    }
  };

  const handleCalendarNavigation = () => {
    navigate(`/calendar?view=${currentView}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-background to-clarity-teal-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Smart Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text-brand">
            Your SMART Dashboard
          </h1>
          
          {/* Time Frame View Switcher */}
          <div className="flex items-center gap-1 bg-brain-health-50 rounded-lg p-1">
            {[
              { key: "day", label: "Day", icon: Sun },
              { key: "week", label: "Week", icon: Calendar },
              { key: "month", label: "Month", icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange(key as ViewType)}
                className={currentView === key 
                  ? "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white shadow-sm" 
                  : "text-brain-health-600 hover:bg-brain-health-100"
                }
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Planner Board (takes 2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <PlannerBoard timeFrame={currentView as TimeFrame} />
          </div>
          
          {/* Right Column - Vertical Stack */}
          <div className="space-y-4">
            <AffirmationCard />
            <HabitTrackerCard />
            <CapturesActsCompact timeFrame={currentView as TimeFrame} />
            <CoachingRemindersCard />
          </div>
        </div>

        {/* Empowering Footer Message */}
        <div className="text-center p-4 bg-gradient-to-r from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50 rounded-lg border border-memory-emerald-200">
          <p className="text-brain-health-700 font-medium">
            🎯 Your calendar is the source of truth - everything flows from there
          </p>
          <p className="text-sm text-brain-health-600 mt-1">
            Stay calm, stay focused, stay empowered.
          </p>
        </div>
      </div>
    </div>
  );
}