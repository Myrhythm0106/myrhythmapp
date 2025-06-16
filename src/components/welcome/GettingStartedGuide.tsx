
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
      title: "Check In With Yourself",
      description: "Start each day by letting us know how you're feeling - it helps us support you better."
    },
    {
      number: "2",
      title: "Pick Your Top Priorities",
      description: "Choose 1-3 things that matter most today to keep your focus clear and manageable."
    },
    {
      number: "3",
      title: "Use Focus Time",
      description: "Try our timer for dedicated work periods - even 15 minutes counts as a win!"
    },
    {
      number: "4",
      title: "Notice How You Feel",
      description: "Track your energy and mood to discover patterns that help you thrive."
    },
    {
      number: "5",
      title: "Plan Your Week",
      description: "Use the calendar to organize your time without feeling overwhelmed."
    },
    {
      number: "6",
      title: "Connect with Others",
      description: "Share your journey and find encouragement from people who understand."
    },
    {
      number: "7",
      title: "Celebrate Every Win",
      description: "Acknowledge your daily progress - every small step forward matters!"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your 7-Step Guide to Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Here's how to make MyRhythm work for you - take it at your own pace, there's no rush.
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
              I'm Ready to Start <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStartedGuide;
