
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function IntroSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
      <p className="text-foreground">
        Welcome to MyRhythm, your personal wellness and productivity companion. 
        This guide will walk you through all the features and tools available in 
        the application to help you organize your life, track your health, and
        improve your overall wellbeing.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground">
          <p><strong>1.</strong> Access your Dashboard to see your daily overview</p>
          <p><strong>2.</strong> Use the Calendar to manage your events and appointments</p>
          <p><strong>3.</strong> Track your health metrics in the Health Tracking section</p>
          <p><strong>4.</strong> Explore brain recovery tools for cognitive wellness</p>
          <p><strong>5.</strong> Connect with others in the Community section</p>
        </CardContent>
      </Card>
    </section>
  );
}
