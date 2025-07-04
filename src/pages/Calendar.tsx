import React, { useState } from "react";
import { BrainHealthCalendarHeader } from "@/components/calendar/BrainHealthCalendarHeader";
import { BrainHealthCalendarView } from "@/components/calendar/BrainHealthCalendarView";
import { BrainHealthSidebar } from "@/components/calendar/BrainHealthSidebar";
import { BrainFriendlyGoalCreator } from "@/components/goals/BrainFriendlyGoalCreator";
import { QuickActionCreator } from "@/components/calendar/QuickActionCreator";
import { PlanMyDreams } from "@/components/plan-dreams/PlanMyDreams";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "@/components/calendar/EventForm";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { MedicationReminders } from "@/components/calendar/MedicationReminders";
import { DayView } from "@/components/calendar/views/DayView";
import { WeekView } from "@/components/calendar/views/WeekView";
import { GoalsView } from "@/components/calendar/views/GoalsView";
import { MyGoalPlan } from "@/components/calendar/goals/MyGoalPlan";
import { GoalDefinitionGuide } from "@/components/goals/GoalDefinitionGuide";
import { MotivationalReminders } from "@/components/calendar/MotivationalReminders";
import { Plus, CalendarIcon, Clock, HeartPulse, Target, Heart, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroButton } from "@/components/pomodoro/PomodoroButton";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SetNewGoalDialog } from "@/components/goals/SetNewGoalDialog";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "goals">("month");
  const [showPlanMyDreams, setShowPlanMyDreams] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check URL parameters for different actions
  React.useEffect(() => {
    if (searchParams.get('planMyDreams') === 'true') {
      setShowPlanMyDreams(true);
    }
    if (searchParams.get('addAction') === 'true') {
      setShowQuickAction(true);
    }
    if (searchParams.get('newGoal') === 'true') {
      setShowNewGoal(true);
    }
  }, [searchParams]);

  const handleSaveDreamPlan = (dreamPlan: any) => {
    console.log("Dream plan saved:", dreamPlan);
    setShowPlanMyDreams(false);
    navigate("/calendar?view=goals");
  };

  const handleQuickActionSave = (actionData: any) => {
    console.log("Quick action saved:", actionData);
    setShowQuickAction(false);
    
    toast.success("🎯 Action Added!", {
      description: `"${actionData.title}" has been added to your brain-friendly schedule!`,
      duration: 4000
    });
  };

  const handleNewGoalSave = (goalData: any) => {
    console.log("New goal created:", goalData);
    setShowNewGoal(false);
    setView("goals");
    
    toast.success("🧠 Goal Created Successfully!", {
      description: "Your new goal is ready! Let's break it into brain-friendly steps.",
      duration: 4000
    });
  };

  if (showPlanMyDreams) {
    return (
      <PlanMyDreams 
        onClose={() => {
          setShowPlanMyDreams(false);
          navigate("/calendar");
        }}
        onSave={handleSaveDreamPlan}
      />
    );
  }

  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-white to-clarity-teal-50/30">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="container mx-auto px-4 py-6 space-y-6">
            
            {/* Brain-Health Header */}
            <BrainHealthCalendarHeader
              onQuickAction={() => setShowQuickAction(true)}
              onNewGoal={() => setShowNewGoal(true)}
              onPlanDreams={() => setShowPlanMyDreams(true)}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <BrainHealthCalendarView
                  view={view}
                  onViewChange={setView}
                  date={date}
                  onDateSelect={setDate}
                  onNewGoal={() => setShowNewGoal(true)}
                />
              </div>
              
              {/* Brain-Health Sidebar */}
              <div className="lg:col-span-1">
                <BrainHealthSidebar date={date} />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Dialogs */}
        <BrainFriendlyGoalCreator
          open={showNewGoal}
          onOpenChange={setShowNewGoal}
          onGoalCreated={handleNewGoalSave}
        />

        <Dialog open={showQuickAction} onOpenChange={setShowQuickAction}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-brain-lg bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
                Add Brain-Friendly Action
              </DialogTitle>
            </DialogHeader>
            <QuickActionCreator onSave={handleQuickActionSave} />
          </DialogContent>
        </Dialog>
      </div>
    </PomodoroProvider>
  );
};

export default Calendar;
