
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Repeat, Target, Clock } from "lucide-react";

export function CalendarGuide() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-foreground flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        Calendar Features
      </h3>
      <p className="text-foreground">
        Your Calendar is designed specifically for brain health recovery, helping you organize your schedule, 
        set up recurring appointments, and manage your time effectively while supporting your healing journey.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Week & Day Views
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground space-y-2">
            <p>See your whole week at a glance with color-coded events and appointments.</p>
            <p className="text-sm text-muted-foreground">
              • Detailed hourly breakdown of your day's schedule
              • Visual indicators for different event types
              • Easy navigation between days and weeks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Events <Badge variant="secondary" className="ml-2">New!</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground space-y-2">
            <p>Set up repeating appointments and activities with ease.</p>
            <p className="text-sm text-muted-foreground">
              • Weekly therapy sessions
              • Daily medication reminders
              • Monthly doctor appointments
              • Custom patterns for any routine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground space-y-2">
            <p>Link calendar events to your recovery goals and track progress.</p>
            <p className="text-sm text-muted-foreground">
              • Connect therapy sessions to mobility goals
              • Track cognitive exercise completion
              • Visual progress indicators
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Smart Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="text-foreground space-y-2">
            <p>Never miss important appointments or activities.</p>
            <p className="text-sm text-muted-foreground">
              • Customizable reminder times
              • Support circle notifications
              • Energy level considerations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">How to Create Recurring Events</h4>
        <div className="border p-4 rounded-lg bg-muted/30 space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1">1</Badge>
            <div>
              <p className="font-medium text-foreground">Create Your Event</p>
              <p className="text-sm text-muted-foreground">Fill in the basic event details like title, time, and location.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1">2</Badge>
            <div>
              <p className="font-medium text-foreground">Choose Repeat Pattern</p>
              <p className="text-sm text-muted-foreground">Select from daily, weekly, monthly, or yearly patterns.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1">3</Badge>
            <div>
              <p className="font-medium text-foreground">Preview & Confirm</p>
              <p className="text-sm text-muted-foreground">See a preview of upcoming occurrences before saving.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
        <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Pro Tips for TBI Recovery
        </h4>
        <ul className="text-foreground space-y-1 text-sm">
          <li>• Set recurring therapy appointments to build consistent routines</li>
          <li>• Use color coding to distinguish between medical, personal, and recovery activities</li>
          <li>• Link calendar events to your goals to track progress automatically</li>
          <li>• Share your schedule with your support circle for better coordination</li>
          <li>• Set reminders 30-60 minutes before important appointments</li>
        </ul>
      </div>
    </div>
  );
}
