
import React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyRecommendationProps {
  onStartSession: (gameId: string) => void;
}

export function DailyRecommendation({ onStartSession }: DailyRecommendationProps) {
  return (
    <div className="bg-muted/10 rounded-lg p-4 mt-6 border">
      <div className="flex items-center gap-3 mb-3">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Daily Practice Recommendation</h3>
      </div>
      <p className="text-muted-foreground text-sm">
        For optimal cognitive benefits, aim for 15 minutes of daily brain games practice. 
        Your personalized selection will automatically adapt to your performance level.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="outline" size="sm">Set Reminder</Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onStartSession("visual-memory")}
        >
          Start Today's Session
        </Button>
      </div>
    </div>
  );
}
