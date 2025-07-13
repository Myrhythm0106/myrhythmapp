
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Target, Sparkles } from "lucide-react";
import { AssessmentResult } from "@/utils/rhythmAnalysis";

interface CompletionSummaryProps {
  assessmentResult: AssessmentResult;
  selectedBreaks: string[];
  calendarEvents: any[];
  pomodoroSettings: any;
  onComplete: () => void;
}

export function CompletionSummary({ 
  assessmentResult, 
  selectedBreaks, 
  calendarEvents, 
  pomodoroSettings, 
  onComplete 
}: CompletionSummaryProps) {
  return (
    <Card className="p-8 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-semibold mb-4">
        <Sparkles className="inline h-8 w-8 text-yellow-500 mr-2" />
        Your Personalized Life System is Ready!
      </h2>
      
      <p className="text-lg text-muted-foreground mb-8">
        Your {assessmentResult.focusArea} journey is now fully customized and ready to begin.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg">
          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Break Suggestions</h3>
          <p className="text-2xl font-bold text-blue-600">{selectedBreaks.length}</p>
          <p className="text-sm text-muted-foreground">personalized breaks</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg">
          <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Calendar Events</h3>
          <p className="text-2xl font-bold text-green-600">{calendarEvents.length}</p>
          <p className="text-sm text-muted-foreground">activities scheduled</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg">
          <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Focus Timer</h3>
          <p className="text-2xl font-bold text-purple-600">{pomodoroSettings?.workMinutes || 25}m</p>
          <p className="text-sm text-muted-foreground">optimized sessions</p>
        </div>
      </div>

      <Button 
        onClick={onComplete} 
        size="lg" 
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
      >
        Start My Journey
        <Sparkles className="ml-2 h-5 w-5" />
      </Button>
    </Card>
  );
}
