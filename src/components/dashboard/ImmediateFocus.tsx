
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Check, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NextEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  location?: string;
  isCompleted: boolean;
  description?: string;
  image?: string;
  linkedGoal?: {
    id: string;
    title: string;
    category: "mobility" | "cognitive" | "health" | "other";
    icon: "Walking" | "Book" | "Target";
  }
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
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=900",
    linkedGoal: {
      id: "goal1",
      title: "Follow medical plan",
      category: "health",
      icon: "Target"
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/calendar?event=${nextEvent.id}`);
  };
  
  const handleMarkComplete = () => {
    toast.success("Event marked as complete!");
    // In a real app, update state or make API call
  };

  const getGoalBadgeColor = (category: string) => {
    switch(category) {
      case "mobility": return "bg-blue-100 text-blue-800 border-blue-300";
      case "cognitive": return "bg-purple-100 text-purple-800 border-purple-300";
      case "health": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
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
            
            {/* Goal connection indicator */}
            {nextEvent.linkedGoal && (
              <div className="flex items-center mt-1">
                <Target className="h-4 w-4 mr-2 text-primary" />
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-normal", 
                    getGoalBadgeColor(nextEvent.linkedGoal.category)
                  )}
                >
                  Goal: {nextEvent.linkedGoal.title}
                </Badge>
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
