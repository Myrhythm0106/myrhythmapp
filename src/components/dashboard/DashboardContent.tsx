import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useDashboard } from "@/contexts/DashboardContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { CalmModeProvider } from "@/contexts/CalmModeContext";
import { HeroStack } from "./hero/HeroStack";
import { SimplifiedQuickActions } from "./actions/SimplifiedQuickActions";
import { TodayStrip } from "./calendar/TodayStrip";
import { FloatingCaptureButton } from "./floating/FloatingCaptureButton";
import { ReportsWidget } from "./widgets/ReportsWidget";

function DashboardContentInner() {
  const { user } = useAuth();
  const { interactionMode } = useDashboard();

  const handleUpgradeClick = () => {
    toast.success("Upgrade to Premium for unlimited features! 🚀");
  };

  const userType = user?.user_metadata?.user_type || "recovery";

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto min-h-screen">
      {/* Hero Stack - Revolutionary empowering experience */}
      <HeroStack 
        onUpgradeClick={handleUpgradeClick}
        userType={userType}
      />
      
      {/* Today Strip - Compact calendar integration */}
      <TodayStrip />
      
      {/* Reports Widget - Assessment results and progress */}
      <ReportsWidget />
      
      {/* Simplified Quick Actions - 6 clean cards */}
      <SimplifiedQuickActions />
      
      {/* Floating Capture Button */}
      <FloatingCaptureButton />
    </div>
  );
}

export function DashboardContent() {
  return (
    <CalmModeProvider>
      <DashboardProvider>
        <DashboardContentInner />
      </DashboardProvider>
    </CalmModeProvider>
  );
}