
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CalendarEvent } from "@/components/calendar/types/calendarTypes";
import { format, isToday } from "date-fns";

export function UpcomingEvent() {
  const [upcomingEvent, setUpcomingEvent] = useState<CalendarEvent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would fetch the next event from an API
    // For now, we'll use sample data from the calendar
    import("@/components/calendar/types/calendarTypes").then(({ sampleEvents }) => {
      // Find the next upcoming event (first one for demo)
      if (sampleEvents && sampleEvents.length > 0) {
        setUpcomingEvent(sampleEvents[0]);
      }
    });
  }, []);

  const handleViewDetails = () => {
    // Navigate to calendar with the specific event
    navigate("/calendar");
  };

  if (!upcomingEvent) {
    return (
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardHeader>
          <CardTitle>What's Happening Next</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">No upcoming events</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewDetails}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>What's Happening Next</span>
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
            {upcomingEvent.startTime}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-medium">{upcomingEvent.title}</h3>
          
          <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(upcomingEvent.date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{upcomingEvent.startTime}{upcomingEvent.endTime ? ` - ${upcomingEvent.endTime}` : ""}</span>
            </div>
            {upcomingEvent.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{upcomingEvent.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Rich media display */}
        {upcomingEvent.media && upcomingEvent.media.length > 0 && upcomingEvent.media[0].type === 'image' && (
          <div className="w-full aspect-video overflow-hidden rounded-md">
            <img
              src={upcomingEvent.media[0].url}
              alt={upcomingEvent.media[0].caption || "Event image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-between">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
