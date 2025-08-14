import React from "react";
import { MonthlyTheme } from "../MonthlyTheme";
import { WeekNaming } from "../WeekNaming";
import { DailyIChooseWidget } from "../DailyIChooseWidget";

// Get current month's focus theme
const getMonthlyFocus = () => {
  const month = new Date().getMonth();
  const themes = [
    "New Beginnings", "Building Strength", "Growing Forward", "Fresh Starts",
    "Renewed Energy", "Summer Focus", "Mid-Year Reset", "Peak Performance",
    "Autumn Planning", "Harvest Season", "Reflection Time", "Year's End Victory"
  ];
  return themes[month];
};

interface HeroSectionProps {
  onUpgradeClick: () => void;
  userType?: string;
}

export function HeroSection({ onUpgradeClick, userType }: HeroSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Personalized Commanding Headlines */}
      <div className="text-center space-y-4 p-8 bg-gradient-to-br from-memory-emerald-50/80 via-brain-health-50/60 to-clarity-teal-50/80 rounded-2xl border-2 border-brain-health-200/50 shadow-xl">
        <div className="space-y-2">
          <p className="text-lg text-brain-health-700 font-medium">
            Hello {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'Champion'}, Today will be about
          </p>
          <div className="text-xl text-clarity-teal-600 font-semibold mb-2">
            {getMonthlyFocus()}
          </div>
          <h1 className="text-4xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
              YOUR COMMAND CENTER
            </span>
          </h1>
        </div>
        <p className="text-lg md:text-xl text-brain-health-700 font-medium">
          Everything you need to feel empowered, in control, and unstoppable
        </p>
      </div>

      {/* Monthly Theme & #IChoose - Premium Placement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTheme />
        </div>
        <div>
          <WeekNaming />
        </div>
      </div>

      {/* Daily #IChoose Statement - Centerpiece */}
      <div className="max-w-4xl mx-auto">
        <DailyIChooseWidget 
          onUpgradeClick={onUpgradeClick} 
          userType={userType} 
        />
      </div>
    </div>
  );
}