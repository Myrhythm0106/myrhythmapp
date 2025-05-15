
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Info, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: "appointment" | "medication" | "task" | "exercise";
  notes?: string;
  completed?: boolean;
}

export function UpcomingToday() {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Event[]>([
    { 
      id: "1", 
      title: "Doctor Appointment", 
      time: "2:30 PM", 
      location: "Memorial Hospital",
      type: "appointment",
      notes: "Bring medication list and recent test results"
    },
    { 
      id: "2", 
      title: "Evening Medication", 
      time: "8:00 PM",
      type: "medication",
      notes: "Take with food and water"
    },
    { 
      id: "3", 
      title: "Physical Therapy Exercises", 
      time: "5:00 PM",
      type: "exercise",
      completed: false,
      notes: "Focus on balance exercises today"
    }
  ]);
  
  const handleViewDetails = (event: Event) => {
    // For now, just show a toast with the notes
    if (event.notes) {
      toast.info(`Notes for ${event.title}`, {
        description: event.notes
      });
    }
  };
  
  const markEventCompleted = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
    
    const event = events.find(e => e.id === id);
    if (event) {
      toast.success(`${event.completed ? 'Unmarked' : 'Marked'} "${event.title}" as ${event.completed ? 'incomplete' : 'complete'}`);
    }
  };

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "appointment": return "bg-blue-100 text-blue-800";
      case "medication": return "bg-purple-100 text-purple-800";
      case "task": return "bg-amber-100 text-amber-800";
      case "exercise": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
        <ul className="space-y-3">
          {events.map(event => (
            <li 
              key={event.id}
              className={`p-3 border rounded-md ${event.completed ? 'bg-muted/30 border-dashed' : 'bg-white'} hover:bg-muted/10 transition-colors`}
            >
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={!!event.completed} 
                  onChange={() => markEventCompleted(event.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className={`flex-1 ${event.completed ? 'text-muted-foreground line-through' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium">{event.title}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                <Badge className={`text-xs ${getEventTypeColor(event.type)}`} variant="outline">
                  {event.type}
                </Badge>
                
                {event.notes && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-muted-foreground"
                    onClick={() => handleViewDetails(event)}
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">View notes</span>
                  </Button>
                )}
              </div>
              
              {/* Show notes preview if available */}
              {event.notes && (
                <div className="mt-2 ml-6 text-xs text-muted-foreground bg-muted/20 p-1.5 rounded">
                  <p className="line-clamp-1">{event.notes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => navigate("/calendar")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </CardFooter>
    </Card>
  );
}
