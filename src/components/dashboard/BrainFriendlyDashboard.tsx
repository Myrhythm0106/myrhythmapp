import React, { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDateRanges } from "@/hooks/useDateRanges";
import { useAuth } from "@/contexts/AuthContext";
import { PlannerBoard } from "./smart/PlannerBoard";
import { AffirmationCard } from "./smart/AffirmationCard";
import { HabitTrackerCard } from "./smart/HabitTrackerCard";
import { CapturesActsCompact } from "./smart/CapturesActsCompact";
import { CoachingRemindersCard } from "./smart/CoachingRemindersCard";

type ViewType = "day" | "week" | "month" | "year";

export function BrainFriendlyDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("day");
  const { user } = useAuth();
  
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const getViewLabel = () => {
    switch (currentView) {
      case "day": return "Today";
      case "week": return "This Week";  
      case "month": return "This Month";
    }
  };

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || "Friend";

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-brand-teal-50 via-brand-emerald-50 to-brand-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-brand-orange-600 uppercase tracking-wider">
            {displayName}, make it courageous
          </div>
          <h1 className="text-2xl font-bold text-brand-teal-800">
            {format(new Date(), "EEEE, MMMM do")}
          </h1>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-lg border border-brand-teal-200/50">
          {(["day", "week", "month"] as const).map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                currentView === view
                  ? "bg-brand-teal-500 text-white shadow-sm"
                  : "text-brand-teal-600 hover:bg-brand-teal-100/50"
              )}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-5 animate-fade-in">
        {/* Left: Planner Board (3 columns) */}
        <div className="lg:col-span-3">
          <PlannerBoard timeFrame={currentView} />
        </div>
        
        {/* Right: Stack of Cards (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <AffirmationCard />
          <HabitTrackerCard />
          <CapturesActsCompact timeFrame={currentView} />
          <CoachingRemindersCard />
        </div>
      </div>

      {/* Bottom message */}
      <div className="text-center py-8">
        <p className="text-brand-teal-600 font-medium">
          Your Calendar is your command center. All updates happen there.
        </p>
      </div>
    </div>
  );
}