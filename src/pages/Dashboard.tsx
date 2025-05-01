
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { SymptomTracker } from "@/components/dashboard/SymptomTracker";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { EmergencyResourcesCard } from "@/components/dashboard/EmergencyResourcesCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  // In a real app, we would fetch the user data from a database or API
  const userData = {
    name: "Alex",
    userType: "tbi" as const,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          subtitle="Your personalized brain health hub"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <WelcomeCard name={userData.name} userType={userData.userType} />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SymptomTracker />
        <CommunityCard />
        <div className="md:col-span-2 lg:col-span-1">
          <EmergencyResourcesCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
