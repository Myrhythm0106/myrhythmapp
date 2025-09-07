import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFrame } from "@/hooks/useDateRanges";

interface CapturesActsCompactProps {
  timeFrame: TimeFrame;
}

export function CapturesActsCompact({ timeFrame }: CapturesActsCompactProps) {
  const navigate = useNavigate();

  // Mock data - replace with real data from hooks
  const captures = 12;
  const acts = 8;
  const wellnessScore = 85;

  return (
    <Card className="bg-gradient-to-br from-white to-brand-teal-50/30 border-brand-teal-200/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-brand-teal-800">
              Wellness Tracking
            </CardTitle>
            <p className="text-xs text-brand-orange-600 uppercase tracking-wider">
              CAPTURES & ACTS
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/calendar')}
            className="border-brand-teal-300 text-brand-teal-600 hover:bg-brand-teal-50"
          >
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Camera className="w-3 h-3 text-brand-blue-500" />
              <span className="text-xs text-gray-600">Captures</span>
            </div>
            <p className="text-lg font-bold text-brand-blue-700">{captures}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-brand-emerald-500" />
              <span className="text-xs text-gray-600">ACTs</span>
            </div>
            <p className="text-lg font-bold text-brand-emerald-700">{acts}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-brand-teal-500" />
              <span className="text-xs text-gray-600">Wellness</span>
            </div>
            <p className="text-lg font-bold text-brand-teal-700">{wellnessScore}%</p>
          </div>
        </div>
        <div className="pt-2 border-t border-brand-teal-100">
          <p className="text-xs text-center text-brand-teal-600">
            You're building strength every day! 💪
          </p>
        </div>
      </CardContent>
    </Card>
  );
}