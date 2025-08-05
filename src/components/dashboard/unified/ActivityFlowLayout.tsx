import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ChevronRight, 
  Plus, 
  Clock,
  Target,
  TrendingUp,
  Star
} from "lucide-react";
import { TodayQuadrant } from "./quadrants/TodayQuadrant";
import { ThisWeekQuadrant } from "./quadrants/ThisWeekQuadrant";
import { ThisMonthQuadrant } from "./quadrants/ThisMonthQuadrant";
import { ThisYearQuadrant } from "./quadrants/ThisYearQuadrant";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function ActivityFlowLayout() {
  const [isWeekExpanded, setIsWeekExpanded] = useState(false);
  const [isMonthExpanded, setIsMonthExpanded] = useState(false);
  const [isYearExpanded, setIsYearExpanded] = useState(false);
  const navigate = useNavigate();
  const { data: metrics } = useDashboardMetrics();

  // Auto-expand week if today's tasks are mostly complete
  const todayCompletionRate = 0; // Will be calculated by TodayQuadrant component
  const shouldExpandWeek = todayCompletionRate > 70;

  const handleViewCalendar = (timeframe?: string) => {
    navigate("/calendar", { state: { focus: timeframe } });
  };

  const handleSchedulePACT = (timeframe: string) => {
    navigate("/pacts", { state: { action: "schedule", timeframe } });
  };

  return (
    <div className="space-y-6">
      {/* Today Section - Always Expanded */}
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-800">Today</span>
              <Badge className="bg-blue-100 text-blue-700">Active</Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewCalendar("today")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </Button>
              <Button 
                size="sm"
                onClick={() => handleSchedulePACT("today")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add PACT
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodayQuadrant />
        </CardContent>
      </Card>

      {/* This Week Section */}
      <Collapsible open={isWeekExpanded || shouldExpandWeek} onOpenChange={setIsWeekExpanded}>
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50/80 to-emerald-50/60 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-green-50/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  <span className="text-xl font-bold text-green-800">This Week</span>
                  {shouldExpandWeek && (
                    <Badge className="bg-amber-100 text-amber-700">
                      Ready for Weekly Goals!
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCalendar("week");
                    }}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    View Week
                  </Button>
                  <ChevronRight className={`h-5 w-5 text-green-600 transition-transform ${(isWeekExpanded || shouldExpandWeek) ? 'rotate-90' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <ThisWeekQuadrant />
              <div className="mt-4 pt-4 border-t border-green-200">
                <Button 
                  onClick={() => handleSchedulePACT("week")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Weekly PACT
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* This Month Section */}
      <Collapsible open={isMonthExpanded} onOpenChange={setIsMonthExpanded}>
        <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50/80 to-cyan-50/60 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-teal-50/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-teal-600" />
                  <span className="text-xl font-bold text-teal-800">This Month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCalendar("month");
                    }}
                    className="border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    View Month
                  </Button>
                  <ChevronRight className={`h-5 w-5 text-teal-600 transition-transform ${isMonthExpanded ? 'rotate-90' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <ThisMonthQuadrant />
              <div className="mt-4 pt-4 border-t border-teal-200">
                <Button 
                  onClick={() => handleSchedulePACT("month")}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Monthly PACT
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* This Year Section */}
      <Collapsible open={isYearExpanded} onOpenChange={setIsYearExpanded}>
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50/80 to-yellow-50/60 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-amber-50/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-amber-600" />
                  <span className="text-xl font-bold text-amber-800">This Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCalendar("year");
                    }}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    View Year
                  </Button>
                  <ChevronRight className={`h-5 w-5 text-amber-600 transition-transform ${isYearExpanded ? 'rotate-90' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <ThisYearQuadrant />
              <div className="mt-4 pt-4 border-t border-amber-200">
                <Button 
                  onClick={() => handleSchedulePACT("year")}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Yearly PACT
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quick Calendar Navigation */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Quick Calendar Access</span>
            </div>
            <Button 
              onClick={() => handleViewCalendar()}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View Full Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click on any day in the calendar to edit activities. Changes sync back to your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}