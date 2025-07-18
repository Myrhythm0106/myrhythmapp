import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  HelpCircle, 
  Home, 
  Settings, 
  Target,
  Calendar,
  Clock,
  Users
} from "lucide-react";

interface NextStepsWidgetProps {
  currentStep: string;
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
      case 'assessment_complete':
        return {
          title: 'Start Your Life Operating Model Setup',
          description: 'Set up calendar, focus time, and support network (15 min)',
          icon: Settings,
          actionText: 'Begin Setup',
          nextSteps: ['Calendar integration', 'Focus timer', 'Support circle']
        };
      case 'calendar_setup':
        return {
          title: 'Configure Your Focus Timer',
          description: 'Personalized Pomodoro settings based on your assessment',
          icon: Clock,
          actionText: 'Set Focus Timer',
          nextSteps: ['Work sessions', 'Break intervals', 'Daily cycles']
        };
      case 'pomodoro_setup':
        return {
          title: 'Connect Your Support Circle',
          description: 'Add family and healthcare team for gentle accountability',
          icon: Users,
          actionText: 'Add Support Network',
          nextSteps: ['Family members', 'Healthcare team', 'Trusted friends']
        };
      case 'support_setup':
        return {
          title: 'Setup Complete! Start Living MYRHYTHM',
          description: 'Access your dashboard and begin your daily routine',
          icon: Target,
          actionText: 'Go to Dashboard',
          nextSteps: ['Daily actions', 'Goal setting', 'Progress tracking']
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

  return (
    <Card className="sticky bottom-4 border-primary/20 bg-primary/5 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon and Progress */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center relative">
              <Icon className="h-6 w-6 text-primary" />
              {completionPercentage > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="default" className="text-xs px-1 py-0">
                    {completionPercentage}%
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">
              {stepInfo.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {stepInfo.description}
            </p>
            
            {stepInfo.nextSteps.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {stepInfo.nextSteps.map((step, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {step}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onGetHelp && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onGetHelp}
                className="text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            )}
            
            {onGoHome && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onGoHome}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
              </Button>
            )}

            <Button 
              onClick={onNextAction}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              {stepInfo.actionText}
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {completionPercentage > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Setup Progress</span>
              <span>{completionPercentage}% complete</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}