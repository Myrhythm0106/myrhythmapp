import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Sun, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* Empowering Header with Time Frame Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">
              MAKE IT COURAGEOUS
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </h1>
          </div>
          
          {/* Time Frame View Switcher */}
          <div className="flex items-center gap-0 bg-orange-100 rounded-xl p-1 shadow-sm">
            {[
              { key: "day", label: "Today" },
              { key: "week", label: "Week" },
              { key: "month", label: "Month" }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange(key as ViewType)}
                className={currentView === key 
                  ? "bg-white text-orange-700 shadow-sm font-medium px-4 py-2 rounded-lg" 
                  : "text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-lg"
                }
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Planner Board (takes 3/5 width on large screens) */}
          <div className="lg:col-span-3">
            <PlannerBoard timeFrame={currentView as TimeFrame} />
          </div>
          
          {/* Right Column - Vertical Stack (takes 2/5 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <AffirmationCard />
            <HabitTrackerCard />
            <CapturesActsCompact timeFrame={currentView as TimeFrame} />
            <CoachingRemindersCard />
          </div>
        </div>

        {/* Empowering Footer Message */}
        <div className="text-center p-6 bg-gradient-to-r from-orange-100 via-amber-100 to-rose-100 rounded-2xl border border-orange-200">
          <p className="text-orange-800 font-semibold text-lg">
            🎯 Your calendar is the source of truth - everything flows from there
          </p>
          <p className="text-orange-700 mt-2">
            Stay calm, stay focused, stay empowered.
          </p>
        </div>
      </div>
    </div>
  );
}