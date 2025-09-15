import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AffirmationHero } from "./smart/AffirmationHero";
import { PlannerBoard } from "./smart/PlannerBoard";
import { HabitTrackerCard } from "./smart/HabitTrackerCard";
import { CapturesActsCompact } from "./smart/CapturesActsCompact";
import { CoachingRemindersCard } from "./smart/CoachingRemindersCard";
import { EmpoweringDashboardCard } from "./EmpoweringDashboardCard";
import { useNavigate } from "react-router-dom";

type ViewType = "day" | "week" | "month" | "year";

export function BrainFriendlyDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("day");
  const navigate = useNavigate();
  
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AffirmationHero />
      
      {/* View Toggle */}
      <div className="px-6 py-6 bg-gradient-to-br from-brand-teal-50 via-brand-emerald-50 to-brand-blue-50">
        <div className="max-w-6xl mx-auto flex justify-end">
          <div className="flex gap-2 p-1 bg-white/70 backdrop-blur-sm rounded-lg border border-brand-teal-200/50 shadow-sm">
            {(["day", "week", "month"] as const).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  currentView === view
                    ? "bg-brand-teal-500 text-white shadow-sm"
                    : "text-brand-teal-600 hover:bg-brand-teal-100/70"
                )}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12 bg-gradient-to-br from-brand-teal-50 via-brand-emerald-50 to-brand-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-5 animate-fade-in">
            {/* Left: Planner Board (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              <PlannerBoard timeFrame={currentView} />
              {/* Add Empowering Dashboard Card */}
              <EmpoweringDashboardCard timeFrame={currentView} onNavigate={handleNavigate} />
            </div>
            
            {/* Right: Stack of Cards (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <HabitTrackerCard />
              <CapturesActsCompact timeFrame={currentView} />
              <CoachingRemindersCard />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom message - Enhanced for brain-injury users */}
      <div className="text-center py-8 bg-gradient-to-br from-brand-teal-50 via-brand-emerald-50 to-brand-blue-50">
        <p className="text-brand-teal-700 font-medium mb-2">
          Your Calendar is your command center. All updates happen there.
        </p>
        <p className="text-sm text-brand-teal-600">
          Every click above takes you exactly where you need to go. You're making incredible progress! 🌟
        </p>
      </div>
    </div>
  );
}