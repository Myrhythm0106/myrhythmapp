
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
import { Timer, Coffee, Users, Target } from "lucide-react";
import { useDailyActions } from "@/contexts/DailyActionsContext";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { ContextualNextButton } from "@/components/navigation/ContextualNextButton";
import { OverviewMenu } from "@/components/navigation/OverviewMenu";
import { UnifiedActionDropdown } from "@/components/calendar/UnifiedActionDropdown";
import { FloatingNextButton } from "@/components/navigation/FloatingNextButton";
import { useDataTransfer } from "@/hooks/useDataTransfer";
import { FloatingActionDropdown } from "@/components/ui/FloatingActionDropdown";
import { Preview3Background } from "@/components/ui/Preview3Background";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year" | "goals">("month");
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
      setView('goals');
    }
  }, [searchParams, date, updateTransferData]);

  const handleSaveDreamPlan = (dreamPlan: any) => {
    console.log("Dream plan saved:", dreamPlan);
    setShowPlanMyDreams(false);
    navigate("/calendar?view=goals");
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
      setView("goals");
      
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
    <PomodoroProvider>
      <Preview3Background>
        <div className="min-h-screen">{/* Remove duplicate background */}
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="container mx-auto px-4 py-6 space-y-6">
            
            {/* Enhanced Navigation Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <BreadcrumbNav />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                  My Daily Rhythm
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <OverviewMenu />
              </div>
            </div>

            {/* Unified Action Center */}
            <div className="flex justify-center items-center">
              <UnifiedActionDropdown
                onQuickAction={() => {
                  const now = new Date();
                  updateTransferData({ 
                    selectedDate: date, // Use the actually selected date
                    selectedTime: now.toTimeString().slice(0, 5)
                  });
                  setShowQuickAction(true);
                }}
                onNewGoal={() => setShowNewGoal(true)}
                onPlanDreams={() => setShowPlanMyDreams(true)}
                onFocusTimer={() => setShowEnhancedPomodoro(true)}
                onScheduleFamily={() => {
                  const now = new Date();
                  updateTransferData({ 
                    actionType: 'family',
                    selectedDate: date, // Use the actually selected date
                    selectedTime: now.toTimeString().slice(0, 5)
                  });
                  setShowQuickAction(true);
                }}
                onPlanBreak={() => {
                  const now = new Date();
                  updateTransferData({ 
                    actionType: 'break',
                    selectedDate: date, // Use the actually selected date
                    selectedTime: now.toTimeString().slice(0, 5)
                  });
                  setShowQuickAction(true);
                }}
                selectedDate={date}
              />
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
                Create Action
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)]">
              <GuidedActionWizard 
                onSuccess={handleQuickActionSave} 
                onUpgradeClick={handleUpgradeClick}
                preFilledData={prefillForm('action')}
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

        {/* Floating Action Dropdown */}
        <FloatingActionDropdown
          onQuickAction={() => {
            const now = new Date();
            updateTransferData({ 
              selectedDate: date, // Use the actually selected date
              selectedTime: now.toTimeString().slice(0, 5)
            });
            setShowQuickAction(true);
          }}
          onNewGoal={() => setShowNewGoal(true)}
          onPlanDreams={() => setShowPlanMyDreams(true)}
          onFocusTimer={() => setShowEnhancedPomodoro(true)}
          onScheduleFamily={() => {
            const now = new Date();
            updateTransferData({ 
              actionType: 'family',
              selectedDate: date, // Use the actually selected date
              selectedTime: now.toTimeString().slice(0, 5)
            });
            setShowQuickAction(true);
          }}
          onPlanBreak={() => {
            const now = new Date();
            updateTransferData({ 
              actionType: 'break',
              selectedDate: date, // Use the actually selected date
              selectedTime: now.toTimeString().slice(0, 5)
            });
            setShowQuickAction(true);
          }}
        />
        </div>
      </Preview3Background>
    </PomodoroProvider>
  );
};

export default Calendar;
