
import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface MonthViewProps {
  date: Date;
  events?: any[];
  onDateSelect?: (date: Date) => void;
}

export function MonthView({ date, events = [], onDateSelect }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const isMobile = useIsMobile();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    if (isMobile) {
      toast.success("Previous month", { duration: 1000 });
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    if (isMobile) {
      toast.success("Next month", { duration: 1000 });
    }
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Calendar refreshed", { duration: 2000 });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (checkDate: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), checkDate)
    );
  };

  return (
    <div className="space-y-4">
      {/* Month header with navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
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

      {/* Enhanced swipeable calendar */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        enablePullToRefresh={isMobile}
        onSwipeLeft={{
          label: "Next Month",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNextMonth
        }}
        onSwipeRight={{
          label: "Previous Month",
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePreviousMonth
        }}
        onPullToRefresh={handleRefresh}
        className="min-h-[400px]"
      >
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="w-full"
              components={{
                Day: ({ date: dayDate, ...props }) => {
                  const dayEvents = getEventsForDate(dayDate);
                  const hasEvents = dayEvents.length > 0;
                  
                  return (
                    <div className="relative">
                      <button
                        {...props}
                        className={`
                          relative w-full h-full p-1 text-sm rounded-md
                          ${isToday(dayDate) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                          ${!isSameMonth(dayDate, currentDate) ? 'text-muted-foreground opacity-50' : ''}
                          hover:bg-accent hover:text-accent-foreground
                          focus:bg-accent focus:text-accent-foreground
                        `}
                      >
                        <span>{format(dayDate, 'd')}</span>
                        {hasEvents && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {dayEvents.length}
                            </Badge>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
      </SwipeableContainer>

      {/* Mobile swipe hints */}
      {isMobile && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to navigate months • Pull down to refresh
          </p>
        </div>
      )}
    </div>
  );
}
