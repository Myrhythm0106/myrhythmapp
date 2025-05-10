
import React, { useState, useEffect } from "react";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { MobileCarousel } from "@/components/dashboard/MobileCarousel";
import { useUserData } from "@/hooks/use-user-data";
import { WeekNaming } from "@/components/dashboard/WeekNaming";
import { UpcomingEvent } from "@/components/dashboard/UpcomingEvent";
import { TopPriorities } from "@/components/dashboard/TopPriorities";
import { RoutineProgress } from "@/components/dashboard/RoutineProgress";
import { RecentWins } from "@/components/dashboard/RecentWins";
import { format } from "date-fns";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [showTutorial, setShowTutorial] = useState(false);
  const userData = useUserData();
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");
  
  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader 
        onShowTutorial={() => setShowTutorial(true)} 
        currentDate={currentDate}
      />
      
      <WeekNaming />
      
      <WelcomeCard name={userData.name} userType={userData.userType} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingEvent />
        <div className="flex flex-col gap-6">
          <TopPriorities />
          <RoutineProgress />
          <RecentWins />
        </div>
      </div>
      
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
