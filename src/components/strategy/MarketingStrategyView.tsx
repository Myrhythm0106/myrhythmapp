
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Target, 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  Globe,
  Phone,
  FileText,
  Zap,
  CheckCircle2
} from "lucide-react";

export function MarketingStrategyView() {
  const [activePhase, setActivePhase] = useState("current");

  const marketingChannels = [
    { name: "Content Marketing", budget: "£60K", roi: "300%", status: "active", icon: FileText },
    { name: "Paid Advertising", budget: "£80K", roi: "250%", status: "active", icon: Globe },
    { name: "Clinical Sales", budget: "£100K", roi: "500%", status: "scaling", icon: Phone },
    { name: "Email Marketing", budget: "£15K", roi: "400%", status: "optimizing", icon: Mail },
  ];

  const currentPhase = {
    name: "Phase 2: Launch & Initial Growth",
    period: "July - September 2025",
    objectives: [
      "Execute comprehensive launch campaign",
      "Begin free trial conversions",
      "Launch healthcare provider pilots",
      "Scale successful advertising campaigns"
    ],
    kpis: [
      { metric: "New Subscribers", target: "1,000+", current: "450", progress: 45 },
      { metric: "Clinical Partnerships", target: "15", current: "3", progress: 20 },
      { metric: "Monthly Revenue", target: "£35K", current: "£15K", progress: 43 },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Phase Overview */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">{currentPhase.name}</CardTitle>
          <p className="text-blue-100">{currentPhase.period}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentPhase.kpis.map((kpi, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="text-lg font-semibold">{kpi.metric}</div>
                <div className="text-2xl font-bold">{kpi.current}</div>
                <div className="text-sm text-blue-100">of {kpi.target}</div>
                <Progress value={kpi.progress} className="mt-2 bg-white/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Phase</TabsTrigger>
          <TabsTrigger value="channels">Marketing Channels</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Phase Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPhase.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Clinical Partner Outreach</h4>
                    <p className="text-sm text-gray-600">Contact 10 potential healthcare providers</p>
                  </div>
                  <Badge variant="secondary">Mon-Wed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Content Creation</h4>
                    <p className="text-sm text-gray-600">3 blog posts + social media content</p>
                  </div>
                  <Badge variant="secondary">Thu-Fri</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Campaign</h4>
                    <p className="text-sm text-gray-600">Weekly newsletter + nurture sequence</p>
                  </div>
                  <Badge variant="secondary">Weekend</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {channel.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget Allocated:</span>
                        <span className="font-semibold">{channel.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected ROI:</span>
                        <span className="font-semibold text-green-600">{channel.roi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={channel.status === 'active' ? 'default' : 'secondary'}>
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Content Planning Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">This Week</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Blog: "Brain Plasticity Myths Debunked"</li>
                    <li>• Social: Daily recovery quotes</li>
                    <li>• Email: Weekly brain health tips</li>
                    <li>• Podcast: 2 guest appearances</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Next Week</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Blog: "MyRhythm Success Stories"</li>
                    <li>• Webinar: "Digital Tools for TBI"</li>
                    <li>• LinkedIn: Thought leadership post</li>
                    <li>• Newsletter: Product updates</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">Month Ahead</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Conference presentation prep</li>
                    <li>• Video testimonial collection</li>
                    <li>• Partner co-marketing content</li>
                    <li>• Holiday campaign planning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Digital Marketing (40%)</span>
                    <span className="font-semibold">£200,000</span>
                  </div>
                  <Progress value={40} />
                  
                  <div className="flex justify-between items-center">
                    <span>Sales & Partnerships (35%)</span>
                    <span className="font-semibold">£175,000</span>
                  </div>
                  <Progress value={35} />
                  
                  <div className="flex justify-between items-center">
                    <span>Brand & Community (15%)</span>
                    <span className="font-semibold">£75,000</span>
                  </div>
                  <Progress value={15} />
                  
                  <div className="flex justify-between items-center">
                    <span>Operations (10%)</span>
                    <span className="font-semibold">£50,000</span>
                  </div>
                  <Progress value={10} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total Marketing Investment</span>
                      <span className="font-bold">£500,000</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Projected Revenue</span>
                      <span className="font-bold text-green-600">£500,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Marketing ROI</span>
                      <span className="font-bold text-green-600">185%</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Detailed ROI Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
