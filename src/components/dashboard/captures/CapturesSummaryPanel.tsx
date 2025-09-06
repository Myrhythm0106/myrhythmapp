import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  FileText, 
  Zap, 
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useCapturesSummary } from '@/hooks/useCapturesSummary';
import { TimeFrame } from '@/hooks/useDateRanges';
import { useNavigate } from 'react-router-dom';

interface CapturesSummaryPanelProps {
  timeFrame: TimeFrame;
}

export function CapturesSummaryPanel({ timeFrame }: CapturesSummaryPanelProps) {
  const { summary, isLoading } = useCapturesSummary(timeFrame);
  const navigate = useNavigate();

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'Today';
    }
  };

  const handleViewInCalendar = () => {
    navigate(`/calendar?view=${timeFrame}&filter=captures`);
  };

  return (
    <Card className="bg-gradient-to-br from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold gradient-text-brand flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Captures Summary
        </CardTitle>
        <p className="text-sm text-brain-health-600">{getTimeFrameLabel()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-brain-health-100 rounded"></div>
            <div className="h-8 bg-brain-health-100 rounded"></div>
            <div className="h-8 bg-brain-health-100 rounded"></div>
          </div>
        ) : (
          <>
            {/* Capture Stats Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-memory-emerald-200">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-sm font-medium text-memory-emerald-800">Voice Recordings</span>
                </div>
                <Badge variant="secondary" className="bg-memory-emerald-100 text-memory-emerald-800">
                  {summary.voiceRecordings}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-brain-health-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brain-health-600" />
                  <span className="text-sm font-medium text-brain-health-800">Memory Notes</span>
                </div>
                <Badge variant="secondary" className="bg-brain-health-100 text-brain-health-800">
                  {summary.memoryEntries}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-sunrise-amber-200">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-sunrise-amber-600" />
                  <span className="text-sm font-medium text-sunrise-amber-800">Extracted ACTs</span>
                </div>
                <Badge variant="secondary" className="bg-sunrise-amber-100 text-sunrise-amber-800">
                  {summary.extractedActs}
                </Badge>
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3 bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 rounded-lg border border-memory-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brain-health-800">Total Captures</span>
                <span className="text-lg font-bold text-memory-emerald-700">{summary.totalCaptures}</span>
              </div>
              <div className="text-xs text-brain-health-600">
                {summary.extractedActs > 0 && (
                  <span className="text-sunrise-amber-600 font-medium">
                    {summary.extractedActs} action{summary.extractedActs !== 1 ? 's' : ''} identified
                  </span>
                )}
              </div>
            </div>

            {/* Encouraging Message */}
            <div className="text-center p-3 text-brain-health-600">
              <p className="text-xs">
                {summary.totalCaptures === 0 ? 
                  "Ready to capture your thoughts? 🎯" : 
                  summary.totalCaptures >= 5 ? 
                    "Excellent capture momentum! 🌟" : 
                    "Building your memory vault! 💪"
                }
              </p>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white/80 hover:bg-white border-memory-emerald-200"
              onClick={handleViewInCalendar}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Captures in Calendar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}