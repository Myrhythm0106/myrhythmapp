import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TodayQuadrant } from "./quadrants/TodayQuadrant";
import { ThisWeekQuadrant } from "./quadrants/ThisWeekQuadrant";
import { ThisMonthQuadrant } from "./quadrants/ThisMonthQuadrant";
import { ThisYearQuadrant } from "./quadrants/ThisYearQuadrant";
import { GoalsOverview } from "./GoalsOverview";
import { Calendar, Target, TrendingUp, Star, ChevronDown } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";

export function CommandCenterLayout() {
  const { refetch } = useDashboardMetrics();

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="space-y-8">
      {/* Time Horizons Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4 p-2 bg-white/80 rounded-full border-2 border-purple-200/50 shadow-lg">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Calendar className="h-4 w-4" />
            TODAY
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Target className="h-4 w-4" />
            THIS WEEK
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <TrendingUp className="h-4 w-4" />
            THIS MONTH
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Star className="h-4 w-4" />
            THIS YEAR
          </Badge>
        </div>
      </div>

      {/* Four-Quadrant Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today Quadrant */}
        <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TODAY
              </span>
              <Badge variant="secondary" className="ml-auto">Right Now</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodayQuadrant />
          </CardContent>
        </Card>

        {/* This Week Quadrant */}
        <Card className="bg-gradient-to-br from-purple-50/60 to-violet-50/60 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                THIS WEEK
              </span>
              <Badge variant="secondary" className="ml-auto">7 Days</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThisWeekQuadrant />
          </CardContent>
        </Card>

        {/* This Month Quadrant - Collapsible */}
        <Collapsible defaultOpen={false}>
          <Card className="bg-gradient-to-br from-teal-50/60 to-emerald-50/60 border-2 border-teal-200/50 shadow-lg hover:shadow-xl transition-all">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-teal-50/40 transition-colors">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    THIS MONTH
                  </span>
                  <Badge variant="secondary" className="ml-auto mr-2">30 Days</Badge>
                  <ChevronDown className="h-4 w-4 text-teal-600 transition-transform duration-200" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ThisMonthQuadrant />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* This Year Quadrant - Collapsible */}
        <Collapsible defaultOpen={false}>
          <Card className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-amber-50/40 transition-colors">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    THIS YEAR
                  </span>
                  <Badge variant="secondary" className="ml-auto mr-2">365 Days</Badge>
                  <ChevronDown className="h-4 w-4 text-amber-600 transition-transform duration-200" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <ThisYearQuadrant />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Goals Overview */}
      <GoalsOverview />
    </div>
  );
}