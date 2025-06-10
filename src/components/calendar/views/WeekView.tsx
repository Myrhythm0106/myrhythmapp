
import React, { useState } from "react";
import { startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { GridView } from "./week-view/GridView";
import { TimelineView } from "./week-view/TimelineView";
import { WeekHeader } from "./week-view/WeekHeader";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { 
  getEventsForDay, 
  getEnergyLevel,
  getEnergyLevelColor,
  getEnergyLevelEmoji,
  getRoutineStatus, 
  generateTimeSlots 
} from "./week-view/weekViewUtils";
import { Action } from "../ActionItem";

interface WeekViewProps {
  date: Date;
  events?: any[];
}

type ViewType = "grid" | "timeline";

export function WeekView({ date, events = [] }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [showEnergyOverlay, setShowEnergyOverlay] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const timeSlots = generateTimeSlots();
  
  const handleEventClick = (event: Action) => {
    navigate(`/calendar?actionId=${event.id}`);
    toast.info(`Opening details for: ${event.title}`, {
      description: `${event.date} at ${event.time}`,
      action: {
        label: "View",
        onClick: () => navigate(`/calendar?actionId=${event.id}`),
      },
    });
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
    if (isMobile) {
      toast.success("Previous week", { duration: 1000 });
    }
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
    if (isMobile) {
      toast.success("Next week", { duration: 1000 });
    }
  };

  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Calendar refreshed", { duration: 2000 });
  };

  return (
    <div className="space-y-4">
      {/* Week navigation and controls */}
      <WeekHeader 
        currentDate={currentDate}
        startDate={startDate}
        viewType={viewType}
        showEnergyOverlay={showEnergyOverlay}
        setCurrentDate={setCurrentDate}
        setViewType={setViewType}
        setShowEnergyOverlay={setShowEnergyOverlay}
      />
      
      {/* Enhanced swipeable calendar content */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        enablePullToRefresh={isMobile}
        onSwipeLeft={{
          label: "Next Week",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNextWeek
        }}
        onSwipeRight={{
          label: "Previous Week", 
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePreviousWeek
        }}
        onPullToRefresh={handleRefresh}
        className="min-h-[400px]"
      >
        {/* Grid View */}
        {viewType === "grid" && (
          <GridView 
            weekDays={weekDays}
            timeSlots={timeSlots}
            showEnergyOverlay={showEnergyOverlay}
            getEventsForDay={getEventsForDay}
            getEnergyLevel={getEnergyLevel}
            getRoutineStatus={getRoutineStatus}
            handleEventClick={handleEventClick}
          />
        )}
        
        {/* Timeline View */}
        {viewType === "timeline" && (
          <TimelineView 
            weekDays={weekDays}
            showEnergyOverlay={showEnergyOverlay}
            getEventsForDay={getEventsForDay}
            getRoutineStatus={getRoutineStatus}
            handleEventClick={handleEventClick}
          />
        )}
      </SwipeableContainer>

      {/* Mobile navigation hints */}
      {isMobile && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to navigate weeks • Pull down to refresh
          </p>
        </div>
      )}
    </div>
  );
}
