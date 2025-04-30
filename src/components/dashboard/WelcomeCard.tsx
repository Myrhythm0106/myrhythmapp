
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface WelcomeCardProps {
  name?: string;
  userType?: "tbi" | "abi" | "mental-health" | "caregiver" | "new";
}

export function WelcomeCard({ name = "there", userType = "new" }: WelcomeCardProps) {
  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMessage = () => {
    switch (userType) {
      case "tbi":
        return "Track your recovery progress and find resources to help with your journey.";
      case "abi":
        return "Monitor your healing journey and discover specialized support for your needs.";
      case "mental-health":
        return "Check in with your wellness today and explore tools to support your mental health.";
      case "caregiver":
        return "Find support for yourself while caring for your loved one, and access resources to help both of you.";
      default:
        return "Welcome to Dallas Brain Beacon. Get started by customizing your profile and exploring resources.";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-beacon-600 to-beacon-800 p-6 text-white">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Brain size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold">
            {greetingTime()}, {name}
          </h2>
          <p className="mt-2 max-w-xl">{getMessage()}</p>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="rounded-full bg-beacon-100 p-2 text-beacon-700">
              <Brain size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">Daily Check-in</p>
              <p className="text-xs text-muted-foreground">Record how you're feeling today</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="rounded-full bg-healing-100 p-2 text-healing-700">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">Next Appointment</p>
              <p className="text-xs text-muted-foreground">May 10, 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="rounded-full bg-comfort-100 p-2 text-comfort-700">
              <Book size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">New Resources</p>
              <p className="text-xs text-muted-foreground">3 new articles added</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Calendar } from "lucide-react";
