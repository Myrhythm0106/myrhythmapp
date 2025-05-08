
import React from "react";
import { format, formatTime } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Image, Headphones, Video } from "lucide-react";

interface RichMedia {
  type: "image" | "audio" | "video";
  url: string;
  caption?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: "appointment" | "therapy" | "medication" | "activity" | "personal" | "other";
  watchers?: string[];
  media?: RichMedia[];
  description?: string;
}

interface StoryboardViewProps {
  date: Date;
  events: CalendarEvent[];
}

// Sample data
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Neurology Appointment",
    date: "2023-05-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    location: "Dallas Neuro Center",
    type: "appointment",
    watchers: ["Dr. Smith"],
    media: [
      { 
        type: "image", 
        url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
        caption: "Dr. Johnson's office"
      }
    ],
    description: "Annual checkup with neurologist"
  },
  {
    id: "2",
    title: "Cognitive Therapy",
    date: "2023-05-20",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    location: "Healing Minds Clinic",
    type: "therapy",
    media: [
      { 
        type: "image", 
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        caption: "Therapy room"
      },
      {
        type: "audio",
        url: "/sample-audio.mp3",
        caption: "Pre-session relaxation"
      }
    ],
    description: "Weekly cognitive behavioral therapy session"
  },
  {
    id: "3",
    title: "Support Group Meeting",
    date: "2023-05-20",
    startTime: "6:00 PM",
    endTime: "7:30 PM",
    location: "Community Center",
    type: "activity",
    watchers: ["Sarah", "Michael"],
    media: [
      {
        type: "video",
        url: "/sample-video.mp4",
        caption: "Directions to the community center"
      }
    ],
    description: "Monthly support group for TBI survivors"
  }
];

export function StoryboardView({ date, events = [] }: StoryboardViewProps) {
  // For demo purposes, using sample data
  const displayEvents = events.length > 0 ? events : sampleEvents;
  
  const getEventTypeStyles = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
      case "therapy":
        return "bg-purple-100 text-purple-800 border-l-4 border-purple-500";
      case "medication":
        return "bg-red-100 text-red-800 border-l-4 border-red-500";
      case "activity":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      case "personal":
        return "bg-orange-100 text-orange-800 border-l-4 border-orange-500";
      default:
        return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
    }
  };
  
  const getMediaIcon = (mediaType: RichMedia["type"]) => {
    switch (mediaType) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/20 py-2 px-4 border-b">
        <h3 className="font-medium">{format(date, "EEEE, MMMM d, yyyy")} - My Day Storyboard</h3>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="relative p-4">
          {/* Timeline connector */}
          <div className="absolute left-[25px] top-0 bottom-0 w-1 bg-muted-foreground/20" />
          
          <div className="space-y-8">
            {displayEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4 relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Timeline node */}
                <div className="rounded-full h-[12px] w-[12px] bg-primary mt-6 z-10 relative left-[20px]" />
                
                <Card className={cn(
                  "flex-1 overflow-hidden hover-scale transition-all ml-8",
                  getEventTypeStyles(event.type)
                )}>
                  <div className="flex md:flex-row flex-col">
                    {/* Media section */}
                    {event.media && event.media.length > 0 && event.media[0].type === 'image' && (
                      <div className="md:w-1/3 h-auto bg-muted/20">
                        <img
                          src={event.media[0].url}
                          alt={event.media[0].caption || "Event image"}
                          className="w-full h-full object-cover aspect-square md:aspect-auto"
                        />
                      </div>
                    )}
                    
                    {/* Content section */}
                    <CardContent className={cn(
                      "flex flex-col p-4", 
                      event.media && event.media.length > 0 && event.media[0].type === 'image' ? "md:w-2/3" : "w-full"
                    )}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-lg">{event.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted/80">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      
                      <div className="mt-3 space-y-1.5 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.watchers && event.watchers.length > 0 && (
                          <div className="flex items-center text-muted-foreground">
                            <User className="h-3.5 w-3.5 mr-1.5" />
                            <div className="flex gap-1 flex-wrap">
                              {event.watchers.map((watcher, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {watcher}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Media badges */}
                        {event.media && event.media.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {event.media.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-xs bg-background/80 px-2 py-1 rounded-full">
                                {getMediaIcon(item.type)}
                                <span>{item.caption || item.type}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
