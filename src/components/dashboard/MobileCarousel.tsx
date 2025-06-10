
import React from "react";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { MobileInteractionGuide } from "./components/MobileInteractionGuide";
import { createDashboardCards } from "./factories/dashboardCardFactory";
import { handleRefreshDashboard, handleShareDashboard } from "./utils/dashboardActions";

export function MobileCarousel() {
  const dashboardCards = createDashboardCards({
    onRefresh: handleRefreshDashboard,
    onShare: handleShareDashboard
  });

  return (
    <div className="space-y-4">
      <SwipeableCarousel 
        items={dashboardCards} 
        title="Your Wellness Dashboard"
        enableAutoScroll={false}
      />
      
      <MobileInteractionGuide />
    </div>
  );
}
