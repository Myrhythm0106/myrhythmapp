import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExecutiveReport } from "@/components/memoryBridge/ExecutiveReport";
import {
  Target,
  Calendar,
  Brain,
  Users,
  Activity,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Home,
  TrendingUp,
} from "lucide-react";

interface NextStepsWidgetProps {
  currentStep: number;
  onNextAction: () => void;
  onGetHelp?: () => void;
  onGoHome?: () => void;
  completionPercentage?: number;
}

export function NextStepsWidget({ 
  currentStep, 
  onNextAction, 
  onGetHelp, 
  onGoHome,
  completionPercentage = 0 
}: NextStepsWidgetProps) {
  
  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Understanding Your Rhythm',
          description: 'Complete the assessment to personalize your experience',
          icon: Brain,
          actionText: 'Start Assessment',
          nextSteps: ['Energy patterns', 'Focus preferences', 'Support needs']
        };
      case 2:
        return {
          title: 'Set Up Your Calendar',
          description: 'Connect your calendar for seamless scheduling',
          icon: Calendar,
          actionText: 'Connect Calendar',
          nextSteps: ['Sync events', 'Set focus blocks', 'Add routines']
        };
      case 3:
        return {
          title: 'Build Your Support Circle',
          description: 'Add family and healthcare team for accountability',
          icon: Users,
          actionText: 'Add Support Network',
          nextSteps: ['Family members', 'Healthcare team', 'Trusted friends']
        };
      case 4:
        return {
          title: 'Configure Your Focus Timer',
          description: 'Personalized Pomodoro based on your assessment',
          icon: Activity,
          actionText: 'Set Focus Timer',
          nextSteps: ['Work sessions', 'Break intervals', 'Daily cycles']
        };
      case 5:
        return {
          title: 'Your Executive Dashboard',
          description: 'Review your actions and progress',
          icon: Target,
          actionText: 'View Dashboard',
          nextSteps: ['Track actions', 'Monitor progress', 'Share updates']
        };
      default:
        return {
          title: 'Continue Your Journey',
          description: 'Take the next step in building your MYRHYTHM',
          icon: ArrowRight,
          actionText: 'Continue',
          nextSteps: []
        };
    }
  };

  const stepInfo = getStepInfo();
  const Icon = stepInfo.icon;

  if (currentStep === 5) {
    return <ExecutiveReport />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="mobile-heading-lg md:text-2xl">{stepInfo.title}</CardTitle>
              <p className="mobile-label text-muted-foreground mt-1">
                {stepInfo.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="mobile-heading-md font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Next Steps
          </h3>
          <div className="flex flex-wrap gap-2">
            {stepInfo.nextSteps.map((step, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="py-2 px-3 mobile-label"
              >
                {index + 1}. {step}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onNextAction}
            size="lg"
            className="flex-1 mobile-body py-6 touch-target"
          >
            {stepInfo.actionText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {onGetHelp && (
            <Button
              onClick={onGetHelp}
              variant="outline"
              size="lg"
              className="sm:w-auto touch-target"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Get Help
            </Button>
          )}
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              size="lg"
              className="sm:w-auto touch-target"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          )}
        </div>

        {completionPercentage > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between mobile-label text-muted-foreground">
              <span>Setup Progress</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {completionPercentage}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
