
import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserData } from "@/hooks/use-user-data";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { GratitudeSnapshotCard } from "@/components/dashboard/GratitudeSnapshotCard";
import { MoodSnapshotCard } from "@/components/dashboard/MoodSnapshotCard";
import { RoutineProgress } from "@/components/dashboard/RoutineProgress";
import { WeekNaming } from "@/components/dashboard/WeekNaming";
import { DashboardCarousel } from "@/components/dashboard/DashboardCarousel";
import { RecentWins } from "@/components/dashboard/RecentWins";

const Dashboard = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const userData = useUserData();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Welcome Section */}
      <WelcomeCard name={userData.name} userType="mental-health" />
      
      {/* Customization Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/customization")}
        >
          <Settings className="h-4 w-4" />
          Customize Dashboard
        </Button>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
          <GratitudeSnapshotCard />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoutineProgress />
            <MoodSnapshotCard />
          </div>
          
          <RecentWins />
        </div>
        
        {/* Right Column - 1/3 width on desktop */}
        <div className="space-y-6">
          <WeekNaming />
          
          {/* Weekly Theme Card */}
          <div className="grid grid-cols-1 gap-6">
            {isMobile ? (
              <DashboardCarousel />
            ) : (
              <>
                {/* Any additional sidebar cards */}
              </>
            )}
          </div>
        </div>
      </div>

      <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
    </div>
  );
};

export default Dashboard;
