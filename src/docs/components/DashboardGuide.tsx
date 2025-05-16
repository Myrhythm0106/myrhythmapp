
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardGuide() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">Dashboard Features</h3>
      <p className="text-foreground">
        The Dashboard is your central hub that provides an overview of your day.
        Here you can find important information at a glance and quickly access
        key features.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Daily Check-in</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Record your daily mood, energy level, and thoughts. Tracking these metrics helps you understand patterns in your wellbeing over time.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Symptom Tracker</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Monitor health symptoms and see how they correlate with your activities, sleep, and other factors.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Community Updates</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Stay connected with your support network and see the latest posts and activities.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Gratitude Practice</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Take a moment for daily reflection with guided gratitude prompts that help improve mental wellbeing.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Focus Goals</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>View your current goals and track your progress toward achieving them.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>See what's coming up on your calendar so you're always prepared for the day ahead.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="border p-4 rounded-lg bg-muted/30">
        <h4 className="font-medium mb-2 text-foreground">Mobile Tips</h4>
        <p className="text-foreground">On mobile devices, your dashboard features are available in a swipeable carousel. Simply swipe left or right to navigate through the different cards.</p>
      </div>
    </div>
  );
}
