
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const GettingStartedGuide = () => {
  const navigate = useNavigate();
  
  const steps: StepItem[] = [
    {
      number: "1",
      title: "Complete Your Daily Check-in",
      description: "Start each day with a mood check-in to track patterns and improve self-awareness."
    },
    {
      number: "2",
      title: "Set Your Top Priorities",
      description: "Identify 1-3 key tasks that align with your goals to maintain focus throughout the day."
    },
    {
      number: "3",
      title: "Schedule Focus Sessions",
      description: "Use the Pomodoro timer for dedicated work periods followed by short breaks."
    },
    {
      number: "4",
      title: "Track Your Symptoms",
      description: "Log how you feel to identify patterns and improve your wellbeing over time."
    },
    {
      number: "5",
      title: "Review Your Calendar",
      description: "Plan your week ahead with the calendar view to maintain balance and avoid overwhelm."
    },
    {
      number: "6",
      title: "Connect with Community",
      description: "Share experiences and find support from others on similar journeys."
    },
    {
      number: "7",
      title: "Celebrate Your Wins",
      description: "Document and acknowledge your daily achievements, no matter how small."
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">7-Step Cheat Sheet: Getting Started with MyRhythm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Follow these seven simple steps to establish your daily rhythm and start seeing benefits right away.
          </p>
          
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full mt-4 gap-2"
              onClick={() => navigate("/dashboard")}
            >
              Start Using MyRhythm <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStartedGuide;
