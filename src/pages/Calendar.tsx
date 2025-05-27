
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
import { PlanMyDreams } from "@/components/plan-dreams/PlanMyDreams";
import { Plus, CalendarIcon, Clock, HeartPulse, Target, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroButton } from "@/components/pomodoro/PomodoroButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "goals">("month");
  const [showPlanMyDreams, setShowPlanMyDreams] = useState(false);
  const navigate = useNavigate();

  const handleSaveDreamPlan = (dreamPlan: any) => {
    console.log("Dream plan saved:", dreamPlan);
    // Here you would typically save to your backend or state management
    setShowPlanMyDreams(false);
  };

  if (showPlanMyDreams) {
    return (
      <PlanMyDreams 
        onClose={() => setShowPlanMyDreams(false)}
        onSave={handleSaveDreamPlan}
      />
    );
  }

  return (
    <PomodoroProvider>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="space-y-6 p-4">
          <PageHeader 
            title="Calendar" 
            subtitle="Manage your actions, medications, and daily routines"
          >
            <div className="flex gap-2">
              <PomodoroButton title="Focus Timer" variant="secondary" />
              
              <Button 
                onClick={() => setShowPlanMyDreams(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Heart className="mr-1 h-4 w-4" />
                Plan My Dreams
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-sm hover:shadow-md transition-all">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Action
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Action</DialogTitle>
                  </DialogHeader>
                  <EventForm />
                </DialogContent>
              </Dialog>
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
                          Goals
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
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
      </ScrollArea>
    </PomodoroProvider>
  );
};

export default Calendar;
