
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "../types/calendarTypes";
import { getEventTypeStyles } from "../utils/storyboardUtils";
import { MediaBadges } from "./MediaBadges";

interface EventCardProps {
  event: CalendarEvent;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <div className="flex gap-4 relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
      {/* Timeline node */}
      <div className="rounded-full h-[12px] w-[12px] bg-primary mt-6 z-10 relative left-[20px]" />
      
      <Card className={cn(
        "flex-1 overflow-hidden hover-scale transition-all ml-8",
        getEventTypeStyles(event.type, event.isGoal)
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
                {event.isGoal || event.type === "goal" ? "Goal" : event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
              {event.media && <MediaBadges media={event.media} />}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
