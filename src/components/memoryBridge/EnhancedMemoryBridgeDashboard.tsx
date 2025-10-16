import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ActsReviewTable } from "./ActsReviewTable";
import { MemoryBridgeMetrics } from "./MemoryBridgeMetrics";
import { ShareSummaryV2 } from "@/components/ui/ShareSummaryV2";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { SwipeHint } from "@/components/gratitude/journal/components/SwipeHint";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useEmpowerment } from '@/contexts/EmpowermentContext';
import { DailyBriefTab } from './tabs/DailyBriefTab';
import { SharedMemoriesTab } from './tabs/SharedMemoriesTab';
import { MemoryReportsTab } from './tabs/MemoryReportsTab';
import { PeopleConnectionsTab } from './tabs/PeopleConnectionsTab';
import { InsightsAnalyticsTab } from './tabs/InsightsAnalyticsTab';
import { WatchOutsTab } from './tabs/WatchOutsTab';
import { toast } from '@/hooks/use-toast';

export function EnhancedMemoryBridgeDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("brief");
  const { setAction } = useEmpowerment();

  const tabs = ["brief", "shared", "people", "insights", "watch-outs", "acts", "reports"];
  const currentTabIndex = tabs.indexOf(activeTab);

  const handleSwipeLeft = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
      toast({ title: "Next tab" });
    }
  };

  const handleSwipeRight = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
      toast({ title: "Previous tab" });
    }
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mobile-heading-xl md:text-4xl font-bold text-foreground mb-2">Memory Bridge</h1>
          <p className="mobile-label text-muted-foreground">Your central hub for memories, actions, and insights</p>
        </div>
        <ShareSummaryV2 />
      </div>

      <MemoryBridgeMetrics />

      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        onSwipeLeft={currentTabIndex < tabs.length - 1 ? {
          label: "Next",
          icon: <ChevronRight />,
          color: "hsl(var(--primary))",
          action: handleSwipeLeft
        } : undefined}
        onSwipeRight={currentTabIndex > 0 ? {
          label: "Back",
          icon: <ChevronLeft />,
          color: "hsl(var(--primary))",
          action: handleSwipeRight
        } : undefined}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-7 gap-1 mb-6">
            <TabsTrigger value="brief" className="flex-shrink-0">Daily Brief</TabsTrigger>
            <TabsTrigger value="shared" className="flex-shrink-0">Shared</TabsTrigger>
            <TabsTrigger value="people" className="flex-shrink-0">People</TabsTrigger>
            <TabsTrigger value="insights" className="flex-shrink-0">Insights</TabsTrigger>
            <TabsTrigger value="watch-outs" className="flex-shrink-0">Watch Outs</TabsTrigger>
            <TabsTrigger value="acts" className="flex-shrink-0">Acts</TabsTrigger>
            <TabsTrigger value="reports" className="flex-shrink-0">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="brief">
            <DailyBriefTab />
          </TabsContent>

          <TabsContent value="shared">
            <SharedMemoriesTab />
          </TabsContent>

          <TabsContent value="people">
            <PeopleConnectionsTab />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsAnalyticsTab />
          </TabsContent>

          <TabsContent value="watch-outs">
            <WatchOutsTab />
          </TabsContent>

          <TabsContent value="acts">
            <Card>
              <CardContent className="pt-6">
                <ActsReviewTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <MemoryReportsTab />
          </TabsContent>
        </Tabs>
      </SwipeableContainer>

      <SwipeHint isMobile={isMobile} />
    </div>
  );
}
