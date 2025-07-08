
import React from "react";
import { BrainHealthDashboard } from "@/components/dashboard/BrainHealthDashboard";
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";
import { usePlatform } from "@/components/platform/PlatformProvider";
import { Preview3Background } from "@/components/ui/Preview3Background";

const Dashboard = () => {
  const { isMobile } = usePlatform();

  // Mobile-first approach: use mobile dashboard by default
  if (isMobile) {
    return (
      <Preview3Background>
        <MobileDashboard />
      </Preview3Background>
    );
  }

  // Web fallback: use the comprehensive dashboard
  return <BrainHealthDashboard />;
};

export default Dashboard;
