
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
import { Plus, CalendarIcon, Clock, HeartPulse } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="space-y-6 p-4">
        <PageHeader 
          title="Calendar" 
          subtitle="Manage your actions, medications, and daily routines"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
                    <TabsList>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
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
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Clock className="mr-2 h-5 w-5" />
                  Upcoming Actions
                </h3>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1 h-3 w-3" />
                        Add Medication
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Add Medication Reminder</DialogTitle>
                      </DialogHeader>
                      {/* Add a medication form component here */}
                      <div className="p-4">
                        <p className="text-muted-foreground">Medication form would go here.</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <MedicationReminders />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Calendar;
