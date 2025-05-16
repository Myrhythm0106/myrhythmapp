
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CalendarGuide() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">Calendar Features</h3>
      <p className="text-foreground">
        The Calendar helps you organize your schedule, set reminders, and manage your time effectively.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Week View</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>See your whole week at a glance with color-coded events and appointments.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Day View</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Detailed hourly breakdown of your day's schedule and commitments.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Goals View</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Track your progress on short and long-term goals with visual indicators.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Storyboard</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Visualize your journey with a timeline of key events and milestones.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="border p-4 rounded-lg bg-muted/30">
        <h4 className="font-medium mb-2 text-foreground">Gesture Controls</h4>
        <p className="text-foreground">On touchscreen devices, swipe left and right to navigate between days or weeks. Pinch to zoom in and out of different calendar views.</p>
      </div>
    </div>
  );
}
