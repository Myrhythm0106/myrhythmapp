import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFrame } from "@/hooks/useDateRanges";

interface CapturesActsCompactProps {
  timeFrame: TimeFrame;
}

export function CapturesActsCompact({ timeFrame }: CapturesActsCompactProps) {
  const navigate = useNavigate();

  // Mock data - would come from your data hooks
  const capturesCount = 12;
  const actsCount = 8;
  const wellnessScore = 85;

  return (
    <Card className="bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardTitle className="text-lg font-bold text-gray-900">
          <span className="text-orange-500 text-sm font-medium uppercase tracking-wider block mb-1">
            WELLNESS TRACKING
          </span>
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="text-2xl font-bold text-blue-700 mb-1">{capturesCount}</div>
            <div className="text-sm text-blue-600 font-medium">Captures</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-green-50 border border-green-100">
            <div className="text-2xl font-bold text-green-700 mb-1">{actsCount}</div>
            <div className="text-sm text-green-600 font-medium">ACTs</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-orange-600" />
            <span className="text-base font-medium text-gray-800">Wellness Score</span>
          </div>
          <span className="text-xl font-bold text-orange-600">{wellnessScore}%</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/calendar")}
          className="w-full text-orange-700 border-orange-200 hover:bg-orange-50 mt-4 rounded-xl py-3 font-medium"
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Full Details
        </Button>
      </CardContent>
    </Card>
  );
}