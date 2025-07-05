
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Trophy,
  Rocket,
  Users,
  DollarSign,
  Star,
  Flag,
  TrendingUp
} from "lucide-react";

export function MilestoneTrackerView() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

  const milestones = {
    Q1: [
      {
        id: 1,
        title: "Email List: 8,000+ Subscribers",
        description: "Build qualified email list for pre-launch marketing",
        target: 8000,
        current: 3500,
        dueDate: "2025-03-31",
        status: "in-progress",
        priority: "high",
        category: "marketing"
      },
      {
        id: 2,
        title: "Healthcare Partnerships: 5+ Pilot Commitments",
        description: "Secure clinical pilot partners for validation",
        target: 5,
        current: 2,
        dueDate: "2025-03-31",
        status: "in-progress",
        priority: "critical",
        category: "partnerships"
      },
      {
        id: 3,
        title: "Beta Users: 100+ Active Testers",
        description: "Engaged beta community for product feedback",
        target: 100,
        current: 45,
        dueDate: "2025-03-31",
        status: "in-progress",
        priority: "medium",
        category: "product"
      },
      {
        id: 4,
        title: "Revenue: £37,500 (7.5% of annual)",
        description: "Q1 revenue milestone toward £500K goal",
        target: 37500,
        current: 15000,
        dueDate: "2025-03-31",
        status: "behind",
        priority: "critical",
        category: "revenue"
      }
    ],
    Q2: [
      {
        id: 5,
        title: "App Launch: July 25, 2025",
        description: "Official MyRhythm app launch on schedule",
        target: 1,
        current: 0,
        dueDate: "2025-07-25",
        status: "planned",
        priority: "critical",
        category: "product"
      },
      {
        id: 6,
        title: "Subscribers: 500+ Across All Plans",
        description: "Initial subscriber base post-launch",
        target: 500,
        current: 0,
        dueDate: "2025-06-30",
        status: "planned",
        priority: "high",
        category: "revenue"
      }
    ],
    Q3: [
      {
        id: 7,
        title: "Subscribers: 1,500+ Total",
        description: "Rapid growth phase subscriber target",
        target: 1500,
        current: 0,
        dueDate: "2025-09-30",
        status: "planned",
        priority: "high",
        category: "revenue"
      }
    ],
    Q4: [
      {
        id: 8,
        title: "£500,000 Annual Revenue Target",
        description: "Achieve primary business objective",
        target: 500000,
        current: 15000,
        dueDate: "2025-12-31",
        status: "planned",
        priority: "critical",
        category: "revenue"
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'behind': return <AlertTriangle className="w-4 h-4" />;
      case 'planned': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'marketing': return <TrendingUp className="w-4 h-4" />;
      case 'partnerships': return <Users className="w-4 h-4" />;
      case 'product': return <Rocket className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const currentMilestones = milestones[selectedQuarter] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Milestone Achievement Tracker
          </CardTitle>
          <p className="text-indigo-100">Track progress toward your £500K revenue goal</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-xs text-muted-foreground">milestones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4</div>
                <p className="text-xs text-muted-foreground">milestones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Behind Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">1</div>
                <p className="text-xs text-muted-foreground">milestones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Planned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">3</div>
                <p className="text-xs text-muted-foreference">milestones</p>
              </CardContent>
            </Card>
          </div>

          {/* Critical Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                Critical Milestones Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMilestones
                  .filter(m => m.priority === 'critical' && m.status !== 'completed')
                  .map((milestone) => (
                    <div key={milestone.id} className="p-4 border rounded-lg bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(milestone.category)}
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge className={getStatusColor(milestone.status)}>
                              {getStatusIcon(milestone.status)}
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}</span>
                              </div>
                              <Progress value={calculateProgress(milestone.current, milestone.target)} />
                            </div>
                            <div className="text-sm text-gray-600">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-6">
          {/* Quarter Selector */}
          <div className="flex justify-center gap-2">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
              <Button
                key={quarter}
                variant={selectedQuarter === quarter ? "default" : "outline"}
                onClick={() => setSelectedQuarter(quarter)}
              >
                {quarter} 2025
              </Button>
            ))}
          </div>

          {/* Quarter Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentMilestones.map((milestone) => (
              <Card key={milestone.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(milestone.category)}
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(milestone.status)}>
                      {getStatusIcon(milestone.status)}
                      {milestone.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{milestone.description}</p>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={calculateProgress(milestone.current, milestone.target)} />
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateProgress(milestone.current, milestone.target).toFixed(1)}% complete
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-gray-600">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                    <Badge variant={milestone.priority === 'critical' ? 'destructive' : 
                                  milestone.priority === 'high' ? 'default' : 'secondary'}>
                      {milestone.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                2025 Milestone Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                  <div key={quarter} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {quarter}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{quarter} 2025</h3>
                        <p className="text-gray-600">{milestones[quarter]?.length || 0} milestones</p>
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-3">
                      {(milestones[quarter] || []).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {getCategoryIcon(milestone.category)}
                          <div className="flex-1">
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-gray-600">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    {quarter !== 'Q4' && (
                      <div className="absolute left-8 top-20 w-0.5 h-6 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Achievement Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Achievements Yet</h3>
                <p className="text-gray-500">Complete your first milestone to unlock achievements!</p>
                <Button className="mt-4">
                  View All Milestones
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Rewards System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-bronze rounded-full mx-auto mb-2 flex items-center justify-center">
                    🥉
                  </div>
                  <h4 className="font-medium">Bronze Level</h4>
                  <p className="text-sm text-gray-600">Complete 1-3 milestones</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-silver rounded-full mx-auto mb-2 flex items-center justify-center">
                    🥈
                  </div>
                  <h4 className="font-medium">Silver Level</h4>
                  <p className="text-sm text-gray-600">Complete 4-6 milestones</p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-gold rounded-full mx-auto mb-2 flex items-center justify-center">
                    🥇
                  </div>
                  <h4 className="font-medium">Gold Level</h4>
                  <p className="text-sm text-gray-600">Achieve £500K target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
