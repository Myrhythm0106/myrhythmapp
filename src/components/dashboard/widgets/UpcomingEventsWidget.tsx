
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpcomingEventsWidget() {
  const navigate = useNavigate();
  
  // Mock upcoming event data
  const nextEvent = {
    title: "Doctor Appointment",
    time: "2:30 PM",
    date: "Today",
    location: "Downtown Medical Center"
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-500" />
          What's Coming Up
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{nextEvent.title}</h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {nextEvent.date}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {nextEvent.time}
              </div>
              <span>{nextEvent.location}</span>
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/calendar")}
          className="w-full justify-between"
        >
          See Your Schedule
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
