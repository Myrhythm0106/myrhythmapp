
import React, { useState } from "react";
import { BrainFriendlyGoalCreator } from "@/components/goals/BrainFriendlyGoalCreator";
import { GuidedActionWizard } from "@/components/calendar/forms/GuidedActionWizard";
import { PlanMyDreams } from "@/components/plan-dreams/PlanMyDreams";
import { EnhancedPomodoroTimer } from "@/components/pomodoro/EnhancedPomodoroTimer";
import { CommandCenterHeader } from "@/components/calendar/CommandCenterHeader";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { WeeklyGoalProvider } from "@/contexts/WeeklyGoalContext";
import { EmpowermentProvider } from "@/contexts/EmpowermentContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { useDataTransfer } from "@/hooks/useDataTransfer";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month");
  const [showPlanMyDreams, setShowPlanMyDreams] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showEnhancedPomodoro, setShowEnhancedPomodoro] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createAction, createGoal } = useDailyActions();
  const { updateTransferData, prefillForm } = useDataTransfer();

  // Check URL parameters for different actions and update transfer data
  React.useEffect(() => {
    // Update transfer data with current date selection
    updateTransferData({ selectedDate: date });
    
    if (searchParams.get('planMyDreams') === 'true') {
      setShowPlanMyDreams(true);
    }
    if (searchParams.get('addAction') === 'true') {
      setShowQuickAction(true);
      // Pre-fill action type from URL
      const actionType = searchParams.get('type') || 'regular';
      updateTransferData({ actionType });
    }
    if (searchParams.get('newGoal') === 'true') {
      setShowNewGoal(true);
    }
    if (searchParams.get('view') === 'goals') {
      navigate("/goals");
    }
  }, [searchParams, date, updateTransferData]);

  const handleSaveDreamPlan = (dreamPlan: any) => {
    console.log("Dream plan saved:", dreamPlan);
    setShowPlanMyDreams(false);
    navigate("/goals");
  };

  const handleQuickActionSave = async (actionData: any) => {
    try {
      await createAction({
        title: actionData.title,
        description: actionData.description,
        action_type: 'regular',
        date: actionData.date,
        start_time: actionData.time,
        duration_minutes: parseInt(actionData.duration),
        is_daily_win: false,
        difficulty_level: parseInt(actionData.difficulty),
        focus_area: actionData.category as any,
        status: 'pending'
      });
      setShowQuickAction(false);
      toast.success("🎯 Action Created!", {
        description: "Your brain-friendly action has been added to your calendar and saved!",
        duration: 4000
      });
    } catch (error) {
      console.error('Error saving action:', error);
      toast.error("Failed to save action. Please try again.");
    }
  };

  const handleNewGoalSave = async (goalData: any) => {
    try {
      await createGoal({
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        target_date: goalData.target_date,
        status: 'active',
        progress_percentage: 0
      });
      setShowNewGoal(false);
      navigate("/goals");
      
      toast.success("🧠 Goal Created Successfully!", {
        description: "Your new goal is ready and saved to your dashboard!",
        duration: 4000
      });
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error("Failed to save goal. Please try again.");
    }
  };

  const handleUpgradeClick = () => {
    navigate("/in-app-purchase");
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
    <EmpowermentProvider>
      <WeeklyGoalProvider>
        <PomodoroProvider>
          <DashboardProvider>
            <div className="min-h-screen bg-background">
              
              {/* Unified Command Center Header */}
              <CommandCenterHeader
                selectedDate={date}
                onDateChange={setDate}
                currentView={view}
                onViewChange={setView}
                onActionClick={() => {
                  const now = new Date();
                  updateTransferData({ 
                    selectedDate: date,
                    selectedTime: now.toTimeString().slice(0, 5)
                  });
                  setShowQuickAction(true);
                }}
              />

              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="container mx-auto px-4 py-6">
                  <DashboardGrid />
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
                    Create Action
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-120px)]">
                  <GuidedActionWizard 
                    onSuccess={handleQuickActionSave} 
                    onUpgradeClick={handleUpgradeClick}
                    preFilledData={prefillForm('action')}
                    onClose={() => setShowQuickAction(false)}
                  />
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
          </DashboardProvider>
        </PomodoroProvider>
      </WeeklyGoalProvider>
    </EmpowermentProvider>
  );
};

export default Calendar;
