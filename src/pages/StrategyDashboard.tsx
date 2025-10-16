
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp, Users, DollarSign, Clock, BookOpen, Zap } from "lucide-react";
import { MarketingStrategyView } from "@/components/strategy/MarketingStrategyView";
import { QuoteGeneratorView } from "@/components/strategy/QuoteGeneratorView";
import { RevenueTrackerView } from "@/components/strategy/RevenueTrackerView";
import { MilestoneTrackerView } from "@/components/strategy/MilestoneTrackerView";

export default function StrategyDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate current progress (mock data for demo)
  const currentRevenue = 15000; // £15K current
  const targetRevenue = 500000; // £500K target
  const revenueProgress = (currentRevenue / targetRevenue) * 100;

  const currentDate = new Date();
  const targetDate = new Date('2025-12-31');
  const daysRemaining = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-heading-xl font-bold text-gray-900 mb-2">MyRhythm Strategy Command Center</h1>
              <p className="text-lg text-gray-600">Your private dashboard to achieve £500K by December 31, 2025</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {daysRemaining} days remaining
            </Badge>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Progress</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="mobile-heading-md font-bold text-green-600">£{currentRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">of £500,000 target</p>
              <Progress value={revenueProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="mobile-heading-md font-bold text-blue-600">450</div>
              <p className="text-xs text-muted-foreground">of 2,800 target</p>
              <Progress value={16} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinical Partners</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="mobile-heading-md font-bold text-purple-600">3</div>
              <p className="text-xs text-muted-foreground">of 57 target</p>
              <Progress value={5} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="mobile-heading-md font-bold text-orange-600">+12%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
              <div className="text-green-600 text-sm mt-1">↗ On track</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-5 bg-white shadow-lg gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2 flex-shrink-0">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing Strategy</span>
              <span className="sm:hidden">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Quote Generator</span>
              <span className="sm:hidden">Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2 flex-shrink-0">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue Tracker</span>
              <span className="sm:hidden">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2 flex-shrink-0">
              <Target className="w-4 h-4" />
              <span>Milestones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    This Week's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Clinical partnership outreach</span>
                      <Badge variant="outline">5 calls scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Blog content creation</span>
                      <Badge variant="outline">3 posts planned</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Social media campaign</span>
                      <Badge variant="outline">Daily quotes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Next Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium">1,000 Subscribers</div>
                        <div className="text-sm text-gray-600">550 to go</div>
                      </div>
                      <Badge variant="secondary">Q1 2025</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div>
                        <div className="font-medium">10 Clinical Partners</div>
                        <div className="text-sm text-gray-600">7 to go</div>
                      </div>
                      <Badge variant="secondary">Q2 2025</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">£100K Revenue</div>
                        <div className="text-sm text-gray-600">£85K to go</div>
                      </div>
                      <Badge variant="secondary">Q2 2025</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <MarketingStrategyView />
          </TabsContent>

          <TabsContent value="quotes" className="mt-6">
            <QuoteGeneratorView />
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <RevenueTrackerView />
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <MilestoneTrackerView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
