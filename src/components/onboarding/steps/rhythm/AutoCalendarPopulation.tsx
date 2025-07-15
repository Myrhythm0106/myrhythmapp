import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Check } from "lucide-react";
import { UserType } from "@/types/user";

interface AutoCalendarPopulationProps {
  onComplete: () => void;
}

export function AutoCalendarPopulation({ onComplete }: AutoCalendarPopulationProps) {
  const [calendarIntegration, setCalendarIntegration] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState(false);

  const handleComplete = () => {
    // Placeholder for actual integration logic
    console.log("Calendar Integration:", calendarIntegration);
    console.log("Smart Suggestions:", smartSuggestions);
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Automatically populate your calendar with recommended activities and
          appointments based on your Rhythm assessment.
        </p>

        <div className="space-y-2">
          <label
            htmlFor="calendar-integration"
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id="calendar-integration"
              className="h-5 w-5"
              checked={calendarIntegration}
              onChange={(e) => setCalendarIntegration(e.target.checked)}
            />
            <span>Enable Calendar Integration</span>
          </label>
          <p className="text-sm text-muted-foreground pl-7">
            Sync your calendar to automatically add recommended activities and
            appointments.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="smart-suggestions"
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id="smart-suggestions"
              className="h-5 w-5"
              checked={smartSuggestions}
              onChange={(e) => setSmartSuggestions(e.target.checked)}
            />
            <span>Enable Smart Suggestions</span>
          </label>
          <p className="text-sm text-muted-foreground pl-7">
            Receive smart suggestions for activities and appointments based on
            your assessment results.
          </p>
        </div>

        <Button onClick={handleComplete} className="w-full">
          Continue to Encouragement
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
