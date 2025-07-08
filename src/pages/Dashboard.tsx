
import React from "react";
import { BrainHealthDashboard } from "@/components/dashboard/BrainHealthDashboard";
import { EmpowermentDashboard } from "@/components/dashboard/EmpowermentDashboard";
import { usePlatform } from "@/components/platform/PlatformProvider";
import { Preview3Background } from "@/components/ui/Preview3Background";

const Dashboard = () => {
  const { isMobile } = usePlatform();

  // Always use empowerment dashboard for mobile-first approach
  if (isMobile) {
    return (
      <Preview3Background>
        <EmpowermentDashboard />
      </Preview3Background>
    );
  }

  // Web users get choice - but default to empowerment for brain-friendly experience
  return (
    <Preview3Background>
      <EmpowermentDashboard />
    </Preview3Background>
  );
};

export default Dashboard;
