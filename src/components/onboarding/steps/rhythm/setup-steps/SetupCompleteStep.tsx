
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Target, Users, LayoutDashboard, Sparkles } from "lucide-react";

interface SetupCompleteStepProps {
  onComplete: () => void;
  setupData: any;
  assessmentResult: any;
}

export function SetupCompleteStep({ onComplete, setupData, assessmentResult }: SetupCompleteStepProps) {
  const getSetupSummary = () => {
    const summary = [];
    
    if (setupData.calendarRoutine?.recurringAppointments?.length > 0) {
      summary.push(`${setupData.calendarRoutine.recurringAppointments.length} recurring appointments`);
    }
    
    if (setupData.goalFramework?.primaryGoal) {
      summary.push("Primary goal defined");
    }
    
    if (setupData.supportIntegration?.supportCircle?.length > 0) {
      summary.push(`${setupData.supportIntegration.supportCircle.length} support circle members`);
    }
    
    if (setupData.dashboardLayout?.priorityWidgets?.length > 0) {
      summary.push(`${setupData.dashboardLayout.priorityWidgets.length} priority widgets selected`);
    }
    
    return summary;
  };

  const summary = getSetupSummary();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary">Your Life Management Foundation is Ready! 🎉</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Congratulations! You've successfully set up your personalized MyRhythm system. 
          Everything is now configured and ready to support your journey.
        </p>
      </div>

      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sparkles className="h-5 w-5" />
            What You've Accomplished
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Personal Preferences Set</h4>
                <p className="text-sm text-green-700">
                  Rhythm type, notifications, and accessibility needs configured
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Calendar Foundation Ready</h4>
                <p className="text-sm text-green-700">
                  {setupData.calendarRoutine?.recurringAppointments?.length > 0 
                    ? `${setupData.calendarRoutine.recurringAppointments.length} recurring appointments scheduled`
                    : "Basic routine framework established"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Goal Framework Established</h4>
                <p className="text-sm text-green-700">
                  {setupData.goalFramework?.primaryGoal 
                    ? "Primary goal defined with progress tracking"
                    : "Goal structure ready for your journey"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Support Circle Connected</h4>
                <p className="text-sm text-green-700">
                  {setupData.supportIntegration?.supportCircle?.length > 0
                    ? `${setupData.supportIntegration.supportCircle.length} support members added`
                    : "Privacy preferences and emergency contacts set"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 md:col-span-2">
              <LayoutDashboard className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Dashboard Personalized</h4>
                <p className="text-sm text-green-700">
                  Layout optimized for your preferences with {setupData.dashboardLayout?.priorityWidgets?.length || 0} priority widgets
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center mt-0.5">1</div>
              <div>
                <h4 className="font-medium">Immediate Access</h4>
                <p className="text-sm text-muted-foreground">
                  Your dashboard is now configured with your preferences and ready to use immediately.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center mt-0.5">2</div>
              <div>
                <h4 className="font-medium">Start Using Your System</h4>
                <p className="text-sm text-muted-foreground">
                  Begin with your daily check-in, review your calendar, and start working toward your goals.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center mt-0.5">3</div>
              <div>
                <h4 className="font-medium">Refine as You Go</h4>
                <p className="text-sm text-muted-foreground">
                  You can always adjust your settings, add more goals, or modify your support circle as your needs evolve.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button onClick={onComplete} size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80">
          <Sparkles className="mr-2 h-5 w-5" />
          Launch My MyRhythm Dashboard
        </Button>
        <p className="text-sm text-muted-foreground">
          Welcome to your personalized life management system! You're all set to begin your journey.
        </p>
      </div>
    </div>
  );
}
