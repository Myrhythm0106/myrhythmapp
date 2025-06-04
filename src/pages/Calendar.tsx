import React, { useState } from "react";
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
import { PlanMyDreams } from "@/components/plan-dreams/PlanMyDreams";
import { GoalDefinitionGuide } from "@/components/goals/GoalDefinitionGuide";
import { MotivationalReminders } from "@/components/calendar/MotivationalReminders";
import { QuickActionCreator } from "@/components/calendar/QuickActionCreator";
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
  const [showGoalGuide, setShowGoalGuide] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // Check if we're in goal plan view
  const isGoalPlanView = window.location.pathname.includes('/calendar/goal/');
  
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
    
    // Enhanced feedback with goal linking
    if (actionData.goalId) {
      toast.success("Action Added to Goal! 🎯", {
        description: `"${actionData.title}" linked to your goal and scheduled! Great planning!`,
        duration: 4000
      });
    } else {
      toast.success("Action Added Successfully! 📅", {
        description: "Your action has been added to your calendar with motivational reminders!",
        duration: 3000
      });
    }
  };

  const handleNewGoalSave = (goalData: any) => {
    console.log("New goal created:", goalData);
    setShowNewGoal(false);
    navigate("/calendar?view=goals");
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

  if (isGoalPlanView) {
    return <MyGoalPlan />;
  }

  return (
    <PomodoroProvider>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="space-y-6 p-4">
          <PageHeader 
            title="Calendar & Goals" 
            subtitle="Manage your goals, actions, and daily routines with motivational support"
          >
            <div className="flex gap-2 flex-wrap">
              {/* Enhanced Quick Action Button */}
              <Dialog open={showQuickAction} onOpenChange={setShowQuickAction}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-sm hover:shadow-md transition-all">
                    <Plus className="mr-1 h-4 w-4" />
                    Quick Action
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Quick Add Action</DialogTitle>
                  </DialogHeader>
                  <QuickActionCreator onSave={handleQuickActionSave} />
                </DialogContent>
              </Dialog>

              {/* New Goal Button */}
              <Button 
                onClick={() => setShowNewGoal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Target className="mr-1 h-4 w-4" />
                New Goal
              </Button>

              {/* Full Action Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    Full Action
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add Detailed Action</DialogTitle>
                  </DialogHeader>
                  <EventForm />
                </DialogContent>
              </Dialog>
              
              {/* Plan My Dreams Button */}
              <Button 
                onClick={() => setShowPlanMyDreams(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Heart className="mr-1 h-4 w-4" />
                Plan Dreams
              </Button>

              {/* Goal Guide Button */}
              <Dialog open={showGoalGuide} onOpenChange={setShowGoalGuide}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    <Target className="mr-1 h-4 w-4" />
                    Goal Guide
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Goal & Action Guide</DialogTitle>
                  </DialogHeader>
                  <GoalDefinitionGuide />
                </DialogContent>
              </Dialog>
              
              <PomodoroButton title="Focus Timer" variant="secondary" />
            </div>
          </PageHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-between items-center">
                    <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month" | "goals")}>
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="goals">
                          <Target className="h-4 w-4 mr-1" />
                          Goal Board
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {view === "goals" && (
                      <Button 
                        size="sm"
                        onClick={() => setShowNewGoal(true)}
                        className="bg-gradient-to-r from-primary to-primary/80"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Goal
                      </Button>
                    )}
                  </div>
                  
                  {view === "month" && (
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  )}
                  
                  {view === "day" && date && (
                    <DayView date={date} events={[]} />
                  )}
                  
                  {view === "week" && date && (
                    <WeekView date={date} events={[]} />
                  )}

                  {view === "goals" && (
                    <GoalsView />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Enhanced Smart Reminders */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-orange-500" />
                      Smart Motivational Reminders
                    </h3>
                  </div>
                  <MotivationalReminders date={date} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Upcoming Actions
                    </h3>
                    <PomodoroButton title="Focus Timer" variant="outline" size="sm" />
                  </div>
                  <UpcomingEvents date={date} />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <HeartPulse className="mr-2 h-5 w-5" />
                      Medication Reminders
                    </h3>
                  </div>
                  <MedicationReminders />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <SetNewGoalDialog
          open={showNewGoal}
          onOpenChange={setShowNewGoal}
          onGoalCreated={handleNewGoalSave}
        />
      </ScrollArea>
    </PomodoroProvider>
  );
};

export default Calendar;
