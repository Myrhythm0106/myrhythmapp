import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, Clock, AlertCircle, CheckCircle2, 
  TrendingUp, Users, FileText, ArrowRight,
  Mail, Download, Share2
} from "lucide-react";

interface ExecutiveAction {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  impact: string;
  nextStep: string;
  stakeholders?: string[];
}

interface ExecutiveReportProps {
  actions?: ExecutiveAction[];
  metrics?: {
    totalActions: number;
    completedThisWeek: number;
    highPriority: number;
    dueToday: number;
  };
  dateRange?: string;
}

export function ExecutiveReport({ actions, metrics, dateRange }: ExecutiveReportProps) {
  const defaultMetrics = metrics || {
    totalActions: 24,
    completedThisWeek: 12,
    highPriority: 5,
    dueToday: 3
  };

  const defaultActions: ExecutiveAction[] = actions || [
    {
      id: "1",
      title: "Board Meeting Preparation",
      priority: "high",
      dueDate: "Today 2:00 PM",
      status: "in-progress",
      impact: "Strategic decision on Q1 launch timeline",
      nextStep: "Review financial projections with CFO",
      stakeholders: ["Board", "CFO", "Product Lead"]
    },
    {
      id: "2",
      title: "Q2 Budget Approval",
      priority: "high",
      dueDate: "Tomorrow",
      status: "pending",
      impact: "Enables hiring and marketing spend",
      nextStep: "Schedule review with Finance team",
      stakeholders: ["Finance", "HR"]
    },
    {
      id: "3",
      title: "Team Performance Reviews",
      priority: "medium",
      dueDate: "This Week",
      status: "in-progress",
      impact: "Team morale and development planning",
      nextStep: "Complete Sarah's review draft",
      stakeholders: ["HR", "Direct Reports"]
    },
    {
      id: "4",
      title: "Client Presentation Deck",
      priority: "high",
      dueDate: "Friday 10:00 AM",
      status: "pending",
      impact: "$500K deal renewal decision",
      nextStep: "Incorporate latest product features",
      stakeholders: ["Sales", "Product"]
    },
    {
      id: "5",
      title: "Strategic Planning Workshop",
      priority: "medium",
      dueDate: "Next Week",
      status: "pending",
      impact: "Q3-Q4 roadmap alignment",
      nextStep: "Send calendar invite to leadership team",
      stakeholders: ["Leadership Team"]
    }
  ];

  const completionRate = Math.round((defaultMetrics.completedThisWeek / defaultMetrics.totalActions) * 100);

  const priorityColors = {
    high: "destructive",
    medium: "default",
    low: "secondary"
  } as const;

  const priorityIcons = {
    high: <AlertCircle className="h-4 w-4" />,
    medium: <Clock className="h-4 w-4" />,
    low: <CheckCircle2 className="h-4 w-4" />
  };

  const topActions = defaultActions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <Card className="shadow-lg border-l-4 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="mobile-heading-lg">Executive Dashboard</CardTitle>
            <Badge variant="outline">{dateRange || "This Week"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <p className="mobile-caption text-muted-foreground">Total Actions</p>
              <p className="mobile-heading-md font-bold">{defaultMetrics.totalActions}</p>
            </div>
            <div className="space-y-1">
              <p className="mobile-caption text-muted-foreground">Completed</p>
              <div className="flex items-center gap-2">
                <p className="mobile-heading-md font-bold text-emerald-600">
                  {defaultMetrics.completedThisWeek}
                </p>
                <Badge variant="outline" className="text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {completionRate}%
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="mobile-caption text-muted-foreground">High Priority</p>
              <p className="mobile-heading-md font-bold text-destructive">
                {defaultMetrics.highPriority}
              </p>
            </div>
            <div className="space-y-1">
              <p className="mobile-caption text-muted-foreground">Due Today</p>
              <p className="mobile-heading-md font-bold text-amber-600">
                {defaultMetrics.dueToday}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="mobile-label">Week Progress</p>
              <p className="mobile-caption text-muted-foreground">
                {defaultMetrics.completedThisWeek} of {defaultMetrics.totalActions}
              </p>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Priority Actions List */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="mobile-heading-md">Priority Actions</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topActions.map((action) => (
              <Card key={action.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {/* Priority Badge & Due Date */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={priorityColors[action.priority]} className="gap-1">
                      {priorityIcons[action.priority]}
                      {action.priority.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <p className="mobile-caption">{action.dueDate}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="mobile-body font-semibold mb-2">{action.title}</h4>

                  {/* Impact */}
                  <div className="mb-3">
                    <p className="mobile-caption text-muted-foreground mb-1">Impact:</p>
                    <p className="mobile-label">{action.impact}</p>
                  </div>

                  {/* Next Step */}
                  <div className="mb-3 p-3 bg-primary/5 rounded-md border-l-2 border-primary">
                    <p className="mobile-caption text-muted-foreground mb-1">Next Step:</p>
                    <p className="mobile-label">{action.nextStep}</p>
                  </div>

                  {/* Stakeholders */}
                  {action.stakeholders && action.stakeholders.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {action.stakeholders.map((stakeholder, index) => (
                        <Badge key={index} variant="outline" className="mobile-caption">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="mobile-heading-md flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Share & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex-1 min-w-[140px] touch-target">
              <Mail className="h-4 w-4 mr-2" />
              Email to Team
            </Button>
            <Button variant="outline" className="flex-1 min-w-[140px] touch-target">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1 min-w-[140px] touch-target">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
