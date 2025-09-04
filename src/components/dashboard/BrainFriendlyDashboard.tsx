import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BrainFriendlyWeekView } from "./brain-friendly/BrainFriendlyWeekView";
import { BrainFriendlyMonthView } from "./brain-friendly/BrainFriendlyMonthView";
import { BrainFriendlyYearView } from "./brain-friendly/BrainFriendlyYearView";
import { IChooseSection } from "./brain-friendly/IChooseSection";

type ViewType = "week" | "month" | "year";

export function BrainFriendlyDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>("week");

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "week":
        return <BrainFriendlyWeekView />;
      case "month":
        return <BrainFriendlyMonthView />;
      case "year":
        return <BrainFriendlyYearView />;
      default:
        return <BrainFriendlyWeekView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-background to-clarity-teal-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Prominent #IChoose Section */}
        <IChooseSection />

        {/* Dashboard Header with View Switching */}
        <Card className="premium-card">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-brand">
                  My Progress Overview
                </h1>
                <p className="text-sm text-muted-foreground">
                  Glanceable insights to guide your next steps
                </p>
              </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex items-center gap-2 bg-brain-health-50 rounded-lg p-1">
              {[
                { key: "week", label: "Week", icon: Calendar },
                { key: "month", label: "Month", icon: Target },
                { key: "year", label: "Year", icon: TrendingUp }
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
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Dynamic View Content */}
        <div className="space-y-6">
          {renderCurrentView()}
        </div>

        {/* Quick Navigation Footer */}
        <Card className="premium-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text-brand">
              Take Action
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/calendar?view=week")}
                className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white hover:from-brain-health-600 hover:to-clarity-teal-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Plan My Week
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/goals")}
                className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
              >
                <Target className="h-4 w-4 mr-2" />
                Review Goals
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/brain-games")}
                className="border-clarity-teal-300 text-clarity-teal-700 hover:bg-clarity-teal-50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Brain Training
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}