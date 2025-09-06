import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Target, Sun, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmpowermentHero } from "./hero/EmpowermentHero";
import { ACTsStatusPanel } from "./acts/ACTsStatusPanel";
import { CapturesSummaryPanel } from "./captures/CapturesSummaryPanel";
import { SupportCircleAccessChip } from "./SupportCircleAccessChip";
import { TimeFrame } from "@/hooks/useDateRanges";

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
        
        {/* Empowering Hero Section */}
        <EmpowermentHero />

        {/* Smart Dashboard Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text-brand">
              Your SMART Dashboard
            </h1>
            <SupportCircleAccessChip />
          </div>
          
          {/* Time Frame View Switcher */}
          <div className="flex items-center gap-2 bg-brain-health-50 rounded-lg p-1">
            {[
              { key: "day", label: "Today", icon: Sun },
              { key: "week", label: "Week", icon: Calendar },
              { key: "month", label: "Month", icon: Target },
              { key: "year", label: "Year", icon: Clock }
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

        {/* Summary Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Captures Summary */}
          <CapturesSummaryPanel timeFrame={currentView as TimeFrame} />
          
          {/* ACTs Status Panel */}
          <ACTsStatusPanel />
          
          {/* Calendar Action Card */}
          <Card className="bg-gradient-to-br from-clarity-teal-50 to-brain-health-50 border-clarity-teal-200 shadow-sm">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold gradient-text-brand">
                  {getViewLabel()} Schedule
                </h3>
                <p className="text-sm text-brain-health-600">
                  All data flows from your calendar - the source of truth
                </p>
              </div>
              <Button 
                onClick={handleCalendarNavigation}
                className="w-full bg-gradient-to-r from-clarity-teal-500 to-brain-health-500 text-white hover:from-clarity-teal-600 hover:to-brain-health-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Open {getViewLabel()} Calendar
              </Button>
            </div>
          </Card>
        </div>

        {/* Empowering Footer Message */}
        <Card className="bg-gradient-to-r from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50 border-memory-emerald-200">
          <div className="p-6 text-center">
            <p className="text-brain-health-700 font-medium">
              🎯 Your dashboard shows what you've captured and created - every entry builds your future
            </p>
            <p className="text-sm text-brain-health-600 mt-2">
              Remember: You are in control. Every action counts. Every moment matters.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}