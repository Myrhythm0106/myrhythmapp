import React, { useState } from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Clock, Brain, Zap, Settings } from "lucide-react";
import { GoalsView } from "./views/GoalsView";
import { DayView } from "./views/DayView";
import { WeekView } from "./views/WeekView";
import { YearView } from "./views/YearView";
import { InteractiveCalendarActions } from "./InteractiveCalendarActions";
import { BrainEnergyIndicator, type BrainEnergyLevel } from "./BrainEnergyIndicator";
import { NeuralProgressTracker } from "./NeuralProgressTracker";
import { FocusMode } from "./FocusMode";

interface BrainHealthCalendarViewProps {
  view: "day" | "week" | "month" | "year" | "goals";
  onViewChange: (view: "day" | "week" | "month" | "year" | "goals") => void;
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onNewGoal: () => void;
}

export function BrainHealthCalendarView({
  view,
  onViewChange,
  date,
  onDateSelect,
  onNewGoal
}: BrainHealthCalendarViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [selectedTime, setSelectedTime] = React.useState<string>();
  const [brainEnergy, setBrainEnergy] = useState<BrainEnergyLevel>("medium");
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showCognitiveControls, setShowCognitiveControls] = useState(false);
  
  // Mock data for progress tracking
  const [progressData, setProgressData] = useState({
    completedActions: 3,
    totalActions: 8,
    streakDays: 5,
    weeklyGoals: 4,
    completedWeeklyGoals: 2
  });

  const handleMonthClick = (monthDate: Date) => {
    onDateSelect(monthDate);
    onViewChange("month");
  };

  const handleDateClick = (clickedDate: Date | undefined) => {
    setSelectedDate(clickedDate);
    onDateSelect(clickedDate);
  };

  const handleActionCreate = (actionData: any) => {
    console.log("New action created:", actionData);
    // TODO: Integrate with action creation system
  };

  return (
    <MemoryEffectsContainer nodeCount={8} className="relative" variant="brain-focus">
      <div className="space-y-6">
        {/* TEST: New Brain Health Banner */}
        <div className="p-4 bg-gradient-to-r from-brain-health-400 to-clarity-teal-400 text-white rounded-lg text-center">
          <h2 className="text-xl font-bold">🧠 Enhanced Brain-Health Calendar is Active! 🚀</h2>
          <p className="text-sm opacity-90">New cognitive features and brain-health colors are now loaded</p>
        </div>
        {/* Brain Energy & Cognitive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="calendar-command-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                      Your Brain-Health Command Center
                    </h2>
                    <p className="text-sm text-brain-health-600 mt-1">
                      Plan with cognitive awareness • Build neural pathways • Achieve with intention
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCognitiveControls(!showCognitiveControls)}
                    className="neural-pathway-effect"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showCognitiveControls ? "Hide" : "Show"} Controls
                  </Button>
                </div>

                {/* Cognitive Controls Panel */}
                {showCognitiveControls && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg border border-brain-health-200/50 animate-fade-in">
                    <BrainEnergyIndicator
                      level={brainEnergy}
                      onLevelChange={setBrainEnergy}
                      className="mb-4"
                    />
                  </div>
                )}

                {/* Enhanced View Selector */}
                <div className="mb-6 flex justify-center">
                  <div className="flex bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border border-brain-health-200 rounded-lg p-1 shadow-sm">
                    {[
                      { key: "day", icon: Clock, label: "Today" },
                      { key: "week", icon: Calendar, label: "Week" },
                      { key: "month", icon: Calendar, label: "Month" },
                      { key: "year", icon: Calendar, label: "Year" },
                      { key: "goals", icon: Target, label: "Goals" }
                    ].map(({ key, icon: Icon, label }) => (
                      <Button
                        key={key}
                        variant={view === key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewChange(key as any)}
                        className={`
                          flex items-center gap-2 transition-all duration-300 neural-pathway-effect
                          ${view === key 
                            ? "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white shadow-md hover:shadow-lg" 
                            : "hover:bg-brain-health-100/50"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Interactive Calendar Actions for all calendar views */}
                {view !== "goals" && (
                  <div className="mt-6 space-y-4">
                    <InteractiveCalendarActions
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onActionCreate={handleActionCreate}
                      view={view}
                    />
                    
                    {/* Enhanced Day View with Event Details and Watchers */}
                    {view === "day" && selectedDate && (
                      <div className="p-4 calendar-command-center rounded-lg animate-fade-in">
                        <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                          Neural Planning - {selectedDate.toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-brain-health-600 mb-4">
                          What neural pathways will you strengthen today? Plan your future activities with cognitive intention.
                        </p>
                        
                        {/* Brain-Focused Quick Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleActionCreate({ 
                              type: 'event', 
                              date: selectedDate,
                              watchers: [],
                              brainEnergy 
                            })}
                            className="neural-pathway-effect flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Plan Cognitive Event
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleActionCreate({ 
                              type: 'reminder', 
                              date: selectedDate,
                              watchers: [],
                              brainEnergy 
                            })}
                            className="neural-pathway-effect flex items-center gap-2"
                          >
                            <Brain className="h-4 w-4" />
                            Memory Anchor
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleActionCreate({ 
                              type: 'task', 
                              date: selectedDate,
                              watchers: [],
                              brainEnergy 
                            })}
                            className="neural-pathway-effect flex items-center gap-2"
                          >
                            <Zap className="h-4 w-4" />
                            Brain-Building Task
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar with Cognitive Tools */}
          <div className="space-y-6">
            <NeuralProgressTracker
              completedActions={progressData.completedActions}
              totalActions={progressData.totalActions}
              streakDays={progressData.streakDays}
              weeklyGoals={progressData.weeklyGoals}
              completedWeeklyGoals={progressData.completedWeeklyGoals}
            />
            
            <FocusMode
              isActive={focusModeActive}
              onToggle={setFocusModeActive}
            />
          </div>
        </div>
      </div>
    </MemoryEffectsContainer>
  );
}