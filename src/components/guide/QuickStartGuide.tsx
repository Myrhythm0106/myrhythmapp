import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Calendar, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickStartStep {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  route?: string;
}

const quickStartSteps: QuickStartStep[] = [
  {
    number: "1",
    title: "Set Your First Goal",
    description: "Define what you want to achieve with MyRhythm - whether it's memory improvement, stress management, or cognitive enhancement.",
    icon: Target,
    action: "Set Goal",
    route: "/goals"
  },
  {
    number: "2", 
    title: "Complete Your Assessment",
    description: "Take our brief cognitive assessment to personalize your experience and track your progress over time.",
    icon: Brain,
    action: "Start Assessment",
    route: "/assessment"
  },
  {
    number: "3",
    title: "Plan Your Schedule", 
    description: "Set up your daily routine with brain training sessions, mindfulness breaks, and progress reviews.",
    icon: Calendar,
    action: "View Calendar",
    route: "/calendar"
  },
  {
    number: "4",
    title: "Connect & Share",
    description: "Build your support network by connecting with family members, caregivers, or your healthcare team.",
    icon: Users,
    action: "Invite Support",
    route: "/support"
  }
];

export function QuickStartGuide() {
  const navigate = useNavigate();

  const handleStepAction = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          Quick Start Guide
        </CardTitle>
        <p className="text-muted-foreground">
          Get started with MyRhythm in just 5 minutes. Follow these essential steps to begin your cognitive empowerment journey.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickStartSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">{step.number}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStepAction(step.route)}
                  className="text-xs"
                >
                  {step.action}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50/50 to-brain-health-50/50 rounded-lg border border-emerald-200/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Pro Tip</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete all 4 steps in your first session to unlock personalized recommendations and advanced features.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}