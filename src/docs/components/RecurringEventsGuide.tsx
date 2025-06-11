
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Repeat, Calendar, Clock, AlertCircle } from "lucide-react";

export function RecurringEventsGuide() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Repeat className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-medium text-foreground">Recurring Events Guide</h3>
        <Badge variant="secondary">New Feature!</Badge>
      </div>
      
      <p className="text-foreground">
        Recurring events help you establish consistent routines essential for brain health recovery. 
        Set up repeating appointments, therapy sessions, and daily activities with ease.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Perfect for TBI Recovery
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700 space-y-2">
            <p className="font-medium">Ideal recurring events:</p>
            <ul className="text-sm space-y-1">
              <li>• Weekly physical therapy sessions</li>
              <li>• Daily medication reminders</li>
              <li>• Monthly neurologist appointments</li>
              <li>• Regular cognitive training sessions</li>
              <li>• Support group meetings</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Flexible Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 space-y-2">
            <p className="font-medium">Choose from:</p>
            <ul className="text-sm space-y-1">
              <li>• <strong>Daily:</strong> Medications, exercises</li>
              <li>• <strong>Weekly:</strong> Therapy, support groups</li>
              <li>• <strong>Monthly:</strong> Doctor visits, assessments</li>
              <li>• <strong>Custom:</strong> Every 2 weeks, specific days</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">Step-by-Step: Creating Your First Recurring Event</h4>
        
        <div className="space-y-4">
          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">1</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Fill in Event Details</h5>
              <p className="text-sm text-muted-foreground">
                Add your event title (e.g., "Physical Therapy"), set the date and time, 
                and include any location or notes that will help you remember.
              </p>
              <div className="text-xs bg-blue-50 p-2 rounded border-blue-200 border">
                <strong>Example:</strong> "Physical Therapy" at Sunshine Rehab Center, Tuesdays at 2:00 PM
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">2</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Choose Repeat Pattern</h5>
              <p className="text-sm text-muted-foreground">
                Click on "Repeat Event" and select your pattern. For therapy, choose "Weekly". 
                You can set it to repeat every 1 week, 2 weeks, or any custom interval.
              </p>
              <div className="text-xs bg-green-50 p-2 rounded border-green-200 border">
                <strong>Tip:</strong> For medical appointments, weekly or monthly patterns work best
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">3</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Set End Date (Optional)</h5>
              <p className="text-sm text-muted-foreground">
                You can set an end date for the recurring series, or leave it blank to continue indefinitely. 
                For a 12-week therapy program, set an end date 12 weeks from now.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
            <Badge variant="outline" className="mt-1 shrink-0">4</Badge>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">Preview & Save</h5>
              <p className="text-sm text-muted-foreground">
                Review the preview showing your next 3 upcoming appointments. 
                Once you're happy with the schedule, click "Create Event" to save the entire series.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Managing Recurring Events
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 space-y-3">
          <div>
            <p className="font-medium">Editing Options:</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>• <strong>Edit This Event:</strong> Change just one occurrence</li>
              <li>• <strong>Edit Series:</strong> Update all future occurrences</li>
              <li>• <strong>Delete This Event:</strong> Remove just one appointment</li>
              <li>• <strong>Delete Series:</strong> Cancel all future appointments</li>
            </ul>
          </div>
          <div className="text-xs bg-amber-100 p-2 rounded border-amber-300 border">
            <strong>Smart Feature:</strong> MyRhythm will ask which option you prefer when you edit a recurring event
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-medium mb-3 text-foreground">🌟 Success Stories: How Recurring Events Help</h4>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="bg-white/50 p-3 rounded border">
            <p className="font-medium text-blue-900">"Never Miss Therapy Again"</p>
            <p className="text-blue-700">
              "Setting up my weekly PT sessions as recurring events means I never have to remember to schedule them. 
              My phone reminds me, and my family can see my schedule too."
            </p>
          </div>
          <div className="bg-white/50 p-3 rounded border">
            <p className="font-medium text-purple-900">"Medication Routine Made Easy"</p>
            <p className="text-purple-700">
              "Daily medication reminders help me stay consistent. I can check off when I've taken them, 
              and my care team can see my adherence patterns."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
