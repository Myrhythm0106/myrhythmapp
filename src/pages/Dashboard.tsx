
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { EmergencyResourcesCard } from "@/components/dashboard/EmergencyResourcesCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { SwipeableCarousel } from "@/components/dashboard/SwipeableCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { TutorialModal } from "@/components/tutorial/TutorialModal";
import { DailyCheckin } from "@/components/dashboard/DailyCheckin";

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showTutorial, setShowTutorial] = useState(false);
  
  // In a real app, we would fetch the user data from a database or API
  const userData = {
    name: "Alex",
    userType: "tbi" as const,
  };

  // Cards for the swipeable carousel
  const dashboardCards = [
    <DailyCheckin key="checkin" />,
    <SymptomTracker key="symptom" />,
    <CommunityCard key="community" />,
    <EmergencyResourcesCard key="emergency" />
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          subtitle="Your personalized brain health hub"
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 premium-button"
            aria-label="View tutorial"
          >
            <Info className="h-4 w-4" />
            Help
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      
      <WelcomeCard name={userData.name} userType={userData.userType} />
      
      {isMobile ? (
        <SwipeableCarousel items={dashboardCards} title="Your Health Overview" />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <DailyCheckin />
          </div>
          <div onClick={() => handleCardClick("/tracking")} className="cursor-pointer">
            <SymptomTracker />
          </div>
          <div onClick={() => handleCardClick("/community")} className="cursor-pointer">
            <CommunityCard />
          </div>
          <div onClick={() => handleCardClick("/useful-info")} className="cursor-pointer md:col-span-2 lg:col-span-1">
            <EmergencyResourcesCard />
          </div>
        </div>
      )}

      <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
    </div>
  );
};

export default Dashboard;
