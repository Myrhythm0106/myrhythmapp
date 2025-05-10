
import React, { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ImmediateFocus } from "@/components/dashboard/ImmediateFocus";
import { EnergyLevelIndicator } from "@/components/dashboard/EnergyLevelIndicator";
import { QuickCheckIn } from "@/components/dashboard/QuickCheckIn";
import { TopReminders } from "@/components/dashboard/TopReminders";
import { TopPriorities } from "@/components/dashboard/TopPriorities";
import { format } from "date-fns";
import { useUserData } from "@/hooks/use-user-data";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { MobileCarousel } from "@/components/dashboard/MobileCarousel";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const userData = useUserData();
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <DashboardHeader 
        onShowTutorial={() => setShowTutorial(true)} 
        currentDate={currentDate}
        userName={userData.name}
      />
      
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
      
      {/* Mobile: Use carousel for swipeable experience */}
      {isMobile && (
        <MobileCarousel />
      )}
      
      {/* Desktop layout */}
      {!isMobile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            <ImmediateFocus />
            <TopPriorities />
          </div>
          
          {/* Right column - 1/3 width on desktop */}
          <div className="space-y-6">
            <EnergyLevelIndicator />
            <QuickCheckIn />
            <TopReminders />
          </div>
        </div>
      )}

      <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
    </div>
  );
};

export default Dashboard;
