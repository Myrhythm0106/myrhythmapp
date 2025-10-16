import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareSummaryV2 } from "@/components/ui/ShareSummaryV2";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { SwipeHint } from "@/components/gratitude/journal/components/SwipeHint";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, Calendar, Users, TrendingUp, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function MemoryBridgeSimple() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("brief");

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

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="mobile-caption text-muted-foreground">Today's Actions</p>
            </div>
            <p className="mobile-heading-md font-bold">8 / 12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-brand-orange-600" />
              <p className="mobile-caption text-muted-foreground">Streak</p>
            </div>
            <p className="mobile-heading-md font-bold">7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="mobile-caption text-muted-foreground">This Week</p>
            </div>
            <p className="mobile-heading-md font-bold">24 actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-clarity-teal-600" />
              <p className="mobile-caption text-muted-foreground">People</p>
            </div>
            <p className="mobile-heading-md font-bold">5 active</p>
          </CardContent>
        </Card>
      </div>

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
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">Daily Brief</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Your daily summary will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">Shared Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Shared content will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">People & Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Your connections will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">Insights & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Your insights will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watch-outs">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Watch Outs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Important reminders will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acts">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">Actions Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mobile-body text-muted-foreground">Your actions will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="mobile-heading-lg">Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareSummaryV2 />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SwipeableContainer>

      <SwipeHint isMobile={isMobile} />
    </div>
  );
}
