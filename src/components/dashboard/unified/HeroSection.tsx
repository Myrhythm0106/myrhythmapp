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
      {/* Personalized headline */}
      <div className="text-left p-8 bg-white border border-brain-health-100 rounded-2xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
          {getMonthlyFocus()}
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-brain-health-900 leading-tight tracking-tight">
          {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'Your'} command centre
        </h1>
        <p className="mt-2 text-base text-brain-health-600 max-w-xl">
          Everything you need to feel in control today — calmly, in one place.
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