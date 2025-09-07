import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, FileText, CheckSquare, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCapturesSummary } from "@/hooks/useCapturesSummary";
import { useActsSummary } from "@/hooks/useActsSummary";
import { TimeFrame } from "@/hooks/useDateRanges";

interface CapturesActsCompactProps {
  timeFrame: TimeFrame;
}

export function CapturesActsCompact({ timeFrame }: CapturesActsCompactProps) {
  const navigate = useNavigate();
  const { summary: capturesSummary, isLoading: capturesLoading } = useCapturesSummary(timeFrame);
  const { summary: actsSummary, isLoading: actsLoading } = useActsSummary(timeFrame);

  const handleViewInCalendar = () => {
    navigate(`/calendar?view=${timeFrame}`);
  };

  const isLoading = capturesLoading || actsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-brain-health-600" />
            Captures & ACTs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-brain-health-100 rounded"></div>
            <div className="h-4 bg-brain-health-100 rounded w-3/4"></div>
            <div className="h-4 bg-brain-health-100 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-4 w-4 text-brain-health-600" />
          Captures & ACTs
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Captures Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-brain-health-600 uppercase tracking-wide">
            Captures Today
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded bg-memory-emerald-50">
              <Mic className="h-4 w-4 text-memory-emerald-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-brain-health-800">
                {capturesSummary.voiceRecordings}
              </div>
              <div className="text-xs text-brain-health-600">Voice</div>
            </div>
            <div className="text-center p-2 rounded bg-brain-health-50">
              <FileText className="h-4 w-4 text-brain-health-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-brain-health-800">
                {capturesSummary.memoryEntries}
              </div>
              <div className="text-xs text-brain-health-600">Notes</div>
            </div>
            <div className="text-center p-2 rounded bg-clarity-teal-50">
              <CheckSquare className="h-4 w-4 text-clarity-teal-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-brain-health-800">
                {capturesSummary.extractedActs}
              </div>
              <div className="text-xs text-brain-health-600">ACTs</div>
            </div>
          </div>
        </div>

        {/* ACTs Status */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-brain-health-600 uppercase tracking-wide">
            ACTs Status
          </h4>
          <div className="flex items-center justify-between p-2 rounded bg-gradient-to-r from-brain-health-50 to-clarity-teal-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-memory-emerald-500"></div>
              <span className="text-sm text-brain-health-700">
                {actsSummary.statusDistribution.completed} completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sunrise-amber-500"></div>
              <span className="text-sm text-brain-health-700">
                {actsSummary.statusDistribution.open + actsSummary.statusDistribution.inProgress} pending
              </span>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-brain-health-600">Completion Rate</span>
              <span className="text-brain-health-800 font-medium">
                {Math.round(actsSummary.completionRate)}%
              </span>
            </div>
            <div className="w-full bg-brain-health-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${actsSummary.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-brain-health-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewInCalendar}
            className="w-full text-brain-health-600 border-brain-health-200 hover:bg-brain-health-50"
          >
            <Calendar className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}