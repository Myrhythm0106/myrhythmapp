import React from "react";
import { MonthlyTheme } from "../MonthlyTheme";
import { WeekNaming } from "../WeekNaming";
import { DailyIChooseWidget } from "../DailyIChooseWidget";

interface HeroSectionProps {
  onUpgradeClick: () => void;
  userType?: string;
}

export function HeroSection({ onUpgradeClick, userType }: HeroSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Commanding Headlines */}
      <div className="text-center space-y-4 p-8 bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-teal-50/80 rounded-2xl border-2 border-purple-200/50 shadow-xl">
        <h1 className="text-4xl md:text-6xl font-black">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            YOUR COMMAND CENTER
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium">
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