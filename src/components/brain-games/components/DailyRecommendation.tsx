
import React from "react";
import { Calendar, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DailyRecommendationProps {
  onStartSession: (gameId: string) => void;
}

export function DailyRecommendation({ onStartSession }: DailyRecommendationProps) {
  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-muted/50 to-card shadow-md">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1">Today's Recommended Session</h3>
          <p className="text-muted-foreground mb-3">
            Pattern Recall (Visual Memory) - Continue your progress from yesterday
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>15 min session</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>3 day streak</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-3 md:mt-0 w-full md:w-auto">
          <Button 
            className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-sm"
            onClick={() => onStartSession("visual-memory")}
          >
            Play Today's Session
          </Button>
          <Button 
            variant="link" 
            className="w-full md:w-auto mt-2 md:mt-2 text-sm"
            onClick={() => {}}
          >
            Set Reminder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
