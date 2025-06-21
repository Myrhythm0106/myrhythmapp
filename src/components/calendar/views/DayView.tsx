
import React, { useState } from "react";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, RotateCcw, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Action } from "../ActionItem";

interface DayViewProps {
  date: Date;
  events?: Action[];
  onEventClick?: (event: Action) => void;
}

export function DayView({ date, events = [], onEventClick }: DayViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const isMobile = useIsMobile();

  const handlePreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
    if (isMobile) {
      toast.success("Previous day", { duration: 1000 });
    }
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
    if (isMobile) {
      toast.success("Next day", { duration: 1000 });
    }
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Day view refreshed", { duration: 2000 });
  };

  // Get events for the current date
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), currentDate)
  );

  // Group events by time
  const groupedEvents = dayEvents.reduce((acc, event) => {
    const timeKey = event.time || "All day";
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(event);
    return acc;
  }, {} as Record<string, Action[]>);

  return (
    <div className="space-y-4">
      {/* Day header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "EEEE, MMMM d")}
          </h2>
          {isToday(currentDate) && (
            <Badge variant="default" className="mt-1">Today</Badge>
          )}
        </div>
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced swipeable day content */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        enablePullToRefresh={isMobile}
        onSwipeLeft={{
          label: "Next Day",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNextDay
        }}
        onSwipeRight={{
          label: "Previous Day",
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePreviousDay
        }}
        onPullToRefresh={handleRefresh}
        className="min-h-[400px]"
      >
        <div className="space-y-4">
          {Object.keys(groupedEvents).length > 0 ? (
            Object.entries(groupedEvents).map(([time, timeEvents]) => (
              <Card key={time}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {time}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {timeEvents.map(event => (
                      <SwipeableContainer
                        key={event.id}
                        enableHorizontalSwipe={isMobile}
                        onSwipeLeft={{
                          label: "Complete",
                          icon: <ChevronRight className="h-4 w-4" />,
                          color: "#22c55e",
                          action: () => toast.success(`Completed: ${event.title}`)
                        }}
                        onSwipeRight={{
                          label: "Edit",
                          icon: <ChevronLeft className="h-4 w-4" />,
                          color: "#3b82f6",
                          action: () => toast.info(`Edit: ${event.title}`)
                        }}
                      >
                        <div
                          className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => onEventClick?.(event)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                            <Badge variant={event.status === 'completed' ? 'default' : 'secondary'}>
                              {event.status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      </SwipeableContainer>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No events scheduled for this day</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SwipeableContainer>

      {/* Mobile swipe hints */}
      {isMobile && (
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to navigate days • Pull down to refresh
          </p>
          {dayEvents.length > 0 && (
            <p className="text-xs text-muted-foreground">
            📱 Swipe events left to complete, right to edit
            </p>
          )}
        </div>
      )}
    </div>
  );
}
