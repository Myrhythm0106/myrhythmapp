
import React, { useState } from "react";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { MobileCarousel } from "@/components/dashboard/MobileCarousel";
import { useUserData } from "@/hooks/use-user-data";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [showTutorial, setShowTutorial] = useState(false);
  const userData = useUserData();

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader onShowTutorial={() => setShowTutorial(true)} />
      
      <WelcomeCard name={userData.name} userType={userData.userType} />
      
      {isMobile ? (
        <MobileCarousel />
      ) : (
        <DashboardContent isMobile={isMobile} />
      )}

      <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
    </div>
  );
};

export default Dashboard;
