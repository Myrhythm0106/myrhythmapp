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
      <div className="text-center space-y-4 p-8 bg-gradient-to-br from-neural-purple-50/40 via-neural-indigo-50/30 to-neural-blue-50/40 rounded-2xl border-2 border-neural-indigo-200/50 shadow-xl backdrop-blur-sm">
        <div className="space-y-2">
          <p className="text-lg text-neural-indigo-700 font-medium">
            Hello {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'Champion'}, Today will be about
          </p>
          <div className="text-xl text-brain-health-600 font-semibold mb-2">
            {getMonthlyFocus()}
          </div>
          <h1 className="text-4xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600 bg-clip-text text-transparent">
              YOUR COMMAND CENTER
            </span>
          </h1>
        </div>
        <p className="text-lg md:text-xl text-neural-indigo-700 font-medium">
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