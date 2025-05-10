
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

interface NextEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  location?: string;
  isCompleted: boolean;
  description?: string;
  image?: string;
}

export function ImmediateFocus() {
  const navigate = useNavigate();
  
  // Mock data - in a real app, fetch from an API or context
  const nextEvent: NextEvent = {
    id: "1",
    title: "Doctor's Appointment",
    date: new Date(),
    startTime: "3:30 PM",
    location: "Memorial Hospital, Room 302",
    isCompleted: false,
    description: "Neurology follow-up with Dr. Johnson",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=900"
  };
  
  const handleViewDetails = () => {
    navigate(`/calendar?event=${nextEvent.id}`);
  };
  
  const handleMarkComplete = () => {
    toast.success("Event marked as complete!");
    // In a real app, update state or make API call
  };
  
  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="text-primary font-bold">What's Next</span>
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
            {nextEvent.startTime}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-2xl font-medium">{nextEvent.title}</h3>
          
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{format(nextEvent.date, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>{nextEvent.startTime}</span>
            </div>
            {nextEvent.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{nextEvent.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Image attachment if available */}
        {nextEvent.image && (
          <div className="w-full overflow-hidden rounded-md h-40 mt-2">
            <img
              src={nextEvent.image}
              alt="Event related image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-3 pt-0">
        <Button 
          variant="default" 
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-green-500 hover:bg-green-50 text-green-700"
          onClick={handleMarkComplete}
        >
          <Check className="h-4 w-4" />
          Complete
        </Button>
      </CardFooter>
    </Card>
  );
}
