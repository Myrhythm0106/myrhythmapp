
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Clock, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  estimatedTime?: string;
  isOptional?: boolean;
}

interface ProgressMapProps {
  steps: ProgressStep[];
  currentStepId: string;
  onStepClick?: (stepId: string) => void;
  showEstimatedTime?: boolean;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressMap({
  steps,
  currentStepId,
  onStepClick,
  showEstimatedTime = true,
  className,
  isOpen,
  onClose
}: ProgressMapProps) {
  if (!isOpen) return null;

  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-2xl max-h-[80vh] overflow-auto", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Your Journey Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedSteps} of {totalSteps} steps completed ({Math.round(progress)}%)
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCurrent = step.id === currentStepId;
              const isClickable = step.status !== 'locked' && onStepClick;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-all",
                    isCurrent && "border-primary bg-primary/5",
                    step.status === 'completed' && "border-green-200 bg-green-50",
                    step.status === 'locked' && "opacity-50",
                    isClickable && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => isClickable && onStepClick(step.id)}
                >
                  {/* Step icon */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    step.status === 'completed' && "bg-green-500 text-white",
                    step.status === 'current' && "bg-primary text-white",
                    step.status === 'upcoming' && "bg-muted text-muted-foreground",
                    step.status === 'locked' && "bg-muted text-muted-foreground"
                  )}>
                    {step.status === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : step.status === 'current' ? (
                      <Circle className="h-4 w-4 fill-current" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium",
                        isCurrent && "text-primary"
                      )}>
                        {step.title}
                      </h4>
                      {step.isOptional && (
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      )}
                      {showEstimatedTime && step.estimatedTime && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Look for the 🔍 search icon to find any feature quickly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
