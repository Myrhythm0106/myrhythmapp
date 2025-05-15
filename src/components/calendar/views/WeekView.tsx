
import React, { useState } from "react";
import { startOfWeek, addDays } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { GridView } from "./week-view/GridView";
import { TimelineView } from "./week-view/TimelineView";
import { WeekHeader } from "./week-view/WeekHeader";
import { 
  getEventsForDay, 
  getEnergyLevel, 
  getRoutineStatus, 
  generateTimeSlots 
} from "./week-view/weekViewUtils";

interface WeekViewProps {
  date: Date;
  events?: any[]; // In a real app, we'd type this properly
}

type ViewType = "grid" | "timeline";

export function WeekView({ date, events = [] }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [showEnergyOverlay, setShowEnergyOverlay] = useState(false);
  const navigate = useNavigate();
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const timeSlots = generateTimeSlots();
  
  // Handle event click for details
  const handleEventClick = (event: any) => {
    navigate(`/calendar?eventId=${event.id}`);
    toast.info(`Opening details for: ${event.title}`);
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
    </div>
  );
}
