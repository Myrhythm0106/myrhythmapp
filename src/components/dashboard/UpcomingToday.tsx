
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight, Pill, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: "appointment" | "medication" | "activity";
  date: Date;
}

export function UpcomingToday() {
  const navigate = useNavigate();
  const today = new Date();
  
  // Sample events - in a real app, these would be fetched from an API or context
  const events: Event[] = [
    {
      id: "1",
      title: "Neurology Appointment",
      time: "2:30 PM",
      location: "Dallas Medical Center, Room 302",
      type: "appointment",
      date: today
    },
    {
      id: "2",
      title: "Take Medication",
      time: "12:00 PM",
      type: "medication",
      date: today
    }
  ];
  
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(`1970/01/01 ${a.time}`).getTime() - new Date(`1970/01/01 ${b.time}`).getTime();
  });

  const getEventIcon = (type: string) => {
    switch(type) {
      case "appointment":
        return <Stethoscope className="h-4 w-4 text-blue-500" />;
      case "medication":
        return <Pill className="h-4 w-4 text-amber-500" />;
      case "activity":
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  const handleViewSchedule = () => {
    navigate("/calendar");
  };

  return (
    <Card className="border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5 text-blue-500" />
          Upcoming Today
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming events for today</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sortedEvents.map(event => (
              <li key={event.id} className="border-b pb-2 last:border-0">
                <div className="flex items-start gap-2">
                  <div className="mt-1.5">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <Badge variant="outline">{event.time}</Badge>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between" 
          onClick={handleViewSchedule}
        >
          <span>View Full Schedule</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
