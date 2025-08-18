import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Activity, Heart } from 'lucide-react';
import { BasicAssessmentResult } from '@/types/assessmentTypes';

interface PreviewResultsProps {
  result: BasicAssessmentResult;
}

export function PreviewResults({ result }: PreviewResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500';
    if (score >= 60) return 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500';
    if (score >= 40) return 'bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500';
    return 'bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500';
  };

  const getACTSBreakdown = () => {
    // Mock ACTS breakdown for preview
    return [
      { letter: 'A', title: 'Acknowledge', icon: Brain, preview: 'Your current cognitive patterns show...' },
      { letter: 'C', title: 'Capture', icon: Calendar, preview: 'Memory enhancement strategies include...' },
      { letter: 'T', title: 'Transform', icon: Activity, preview: 'Daily routine optimization suggests...' },
      { letter: 'S', title: 'Support', icon: Heart, preview: 'Your support system can be strengthened by...' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-brain-health-200">
        <CardHeader className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${getScoreColor(result.overallScore)} text-white text-2xl font-bold`}>
            {result.overallScore}
          </div>
          <CardTitle className="text-xl text-brain-health-900">Your MyRhythm Score</CardTitle>
          <Badge variant="secondary" className="mx-auto">
            {result.primaryRhythm}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-center text-brain-health-700">
            {result.primaryFocus}
          </p>
        </CardContent>
      </Card>

      {/* A.C.T.S. Preview */}
      <Card className="border-brain-health-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brain-health-900">
            <Brain className="h-5 w-5" />
            Your A.C.T.S. Summary Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {getACTSBreakdown().map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {item.letter}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="h-4 w-4 text-brain-health-600" />
                  <h4 className="font-semibold text-brain-health-800">{item.title}</h4>
                </div>
                <p className="text-sm text-brain-health-600">{item.preview}</p>
                <div className="mt-2 text-xs text-brain-health-500 bg-white/50 rounded px-2 py-1 inline-block">
                  Preview • Full insights available with upgrade
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Recommendations */}
      <Card className="border-brain-health-200">
        <CardHeader>
          <CardTitle className="text-brain-health-900">Quick Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {result.keyInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-memory-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-brain-health-700">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}