
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HealthTrackingGuide() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-foreground">Health Tracking Features</h3>
      <p className="text-foreground">
        Monitor your symptoms, medications, and health metrics to better understand your body and mind.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Symptom Log</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Record symptoms as they occur, noting intensity, duration, and possible triggers.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Symptom History</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Review your symptom history with visualizations to identify patterns over time.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Symptom Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Receive personalized insights about potential correlations between symptoms and lifestyle factors.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Medication Reminders</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Set up reminders for medications and track adherence to prescribed schedules.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
