import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, CheckCircle, Clock, Target, Brain, Heart, Users, Sparkles } from "lucide-react";
import { UserType } from "@/types/user";

interface FlowStepRendererProps {
  step: any;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  assessmentResult: any;
}

export function FlowStepRenderer({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrevious,
  assessmentResult
}: FlowStepRendererProps) {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step.icon === "brain" && <Brain className="h-5 w-5" />}
          {step.icon === "clock" && <Clock className="h-5 w-5" />}
          {step.icon === "target" && <Target className="h-5 w-5" />}
          {step.icon === "heart" && <Heart className="h-5 w-5" />}
          {step.icon === "users" && <Users className="h-5 w-5" />}
          {step.icon === "sparkles" && <Sparkles className="h-5 w-5" />}
          {step.title}
          {step.badge && (
            <Badge variant="secondary" className="ml-2">
              {step.badge}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
        {step.content}
      </CardContent>
      <div className="flex items-center justify-between p-4 border-t">
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={isFirstStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={isLastStep}>
          {isLastStep ? (
            <>
              All Done!
              <CheckCircle className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
