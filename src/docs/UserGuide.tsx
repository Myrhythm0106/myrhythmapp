
import React, { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  HeartPulse, 
  Brain, 
  Users, 
  Home
} from "lucide-react";

// Import all components
import { GuideHeader } from "./components/GuideHeader";
import { IntroSection } from "./components/IntroSection";
import { DashboardGuide } from "./components/DashboardGuide";
import { CalendarGuide } from "./components/CalendarGuide";
import { HealthTrackingGuide } from "./components/HealthTrackingGuide";
import { BrainRecoveryGuide } from "./components/BrainRecoveryGuide";
import { CommunityGuide } from "./components/CommunityGuide";
import { AdditionalFeatures } from "./components/AdditionalFeatures";
import { MobileExperience } from "./components/MobileExperience";
import { SupportInfo } from "./components/SupportInfo";
import { GuideFooter } from "./components/GuideFooter";

export function UserGuide() {
  const componentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="max-w-5xl mx-auto py-8 text-foreground">
      <GuideHeader printRef={componentRef} />
      
      <div ref={componentRef} className="space-y-8 p-4">
        <IntroSection />
        
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full flex justify-between overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-1">
              <HeartPulse className="w-4 h-4" />
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="brain" className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              <span>Brain</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <DashboardGuide />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <CalendarGuide />
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4 mt-4">
            <HealthTrackingGuide />
          </TabsContent>
          
          <TabsContent value="brain" className="space-y-4 mt-4">
            <BrainRecoveryGuide />
          </TabsContent>
          
          <TabsContent value="community" className="space-y-4 mt-4">
            <CommunityGuide />
          </TabsContent>
        </Tabs>
        
        <AdditionalFeatures />
        <MobileExperience />
        <SupportInfo />
        <GuideFooter />
      </div>
    </div>
  );
}
