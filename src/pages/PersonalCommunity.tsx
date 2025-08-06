
import React from "react";
import { PageLayout } from "@/components/shared/PageLayout";
import { PowerOfConnectionSection } from "@/components/connection/PowerOfConnectionSection";
import { ConnectionDashboard } from "@/components/connection/ConnectionDashboard";
import { MutualBenefitMessaging } from "@/components/connection/MutualBenefitMessaging";
import { YoureNotAloneHub } from "@/components/connection/YoureNotAloneHub";
import { SupportCircleMessages } from "@/components/personal-community/SupportCircleMessages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PersonalCommunity() {
  return (
    <PageLayout 
      title="Your Personal Community" 
      description="Building connections that strengthen everyone involved"
    >
      <div className="space-y-8">
        {/* Hero Section - Power of Connection */}
        <PowerOfConnectionSection />
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Connection Health</TabsTrigger>
            <TabsTrigger value="circle">Support Circle</TabsTrigger>
            <TabsTrigger value="community">Community Hub</TabsTrigger>
            <TabsTrigger value="insights">Your Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ConnectionDashboard 
              supportCircleSize={3}
              recentInteractions={12}
              connectionStrength={85}
              mutualBenefitScore={78}
            />
          </TabsContent>

          <TabsContent value="circle" className="space-y-6">
            <SupportCircleMessages />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <YoureNotAloneHub />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <MutualBenefitMessaging />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
