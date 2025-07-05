
import React, { useState } from "react";
import { BrainHealthCalendarHeader } from "@/components/calendar/BrainHealthCalendarHeader";
import { BrainHealthCalendarView } from "@/components/calendar/BrainHealthCalendarView";
import { BrainHealthSidebar } from "@/components/calendar/BrainHealthSidebar";
import { BrainFriendlyGoalCreator } from "@/components/goals/BrainFriendlyGoalCreator";
import { GuidedActionWizard } from "@/components/calendar/forms/GuidedActionWizard";
import { PlanMyDreams } from "@/components/plan-dreams/PlanMyDreams";
import { EnhancedPomodoroTimer } from "@/components/pomodoro/EnhancedPomodoroTimer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Timer, Coffee, Users } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "goals">("month");
  const [showPlanMyDreams, setShowPlanMyDreams] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showEnhancedPomodoro, setShowEnhancedPomodoro] = useState(false);
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

  const handleQuickActionSave = () => {
    setShowQuickAction(false);
    toast.success("🎯 Action Created!", {
      description: "Your brain-friendly action has been added to your calendar. Your support team has been notified!",
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

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => setShowEnhancedPomodoro(true)}
                className="bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 hover:from-clarity-teal-600 hover:to-memory-emerald-600 flex items-center gap-2"
              >
                <Timer className="h-4 w-4" />
                Focus Timer & Breaks
              </Button>
              <Button
                onClick={() => setShowQuickAction(true)}
                variant="outline"
                className="border-heart-300 hover:bg-heart-50 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Schedule Family Time
              </Button>
              <Button
                onClick={() => setShowQuickAction(true)}
                variant="outline"
                className="border-clarity-teal-300 hover:bg-clarity-teal-50 flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                Plan Break Time
              </Button>
            </div>

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
              
              {/* Enhanced Brain-Health Sidebar with Break & Family Features */}
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
                Create Brain-Friendly Action
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)]">
              <GuidedActionWizard onSuccess={handleQuickActionSave} />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={showEnhancedPomodoro} onOpenChange={setShowEnhancedPomodoro}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-clarity-teal-600 to-memory-emerald-600 bg-clip-text text-transparent">
                Focus Timer, Breaks & Family Time
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)]">
              <EnhancedPomodoroTimer 
                onClose={() => setShowEnhancedPomodoro(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </PomodoroProvider>
  );
};

export default Calendar;
