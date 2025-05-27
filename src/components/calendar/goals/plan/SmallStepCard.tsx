
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyDoAction } from "./DailyDoAction";

interface SmallStepCardProps {
  step: {
    id: string;
    title: string;
    progress: number;
    status: string;
    actions: any[];
  };
  stepIndex: number;
  onCompleteAction: (stepId: string, actionId: string) => void;
  onEditAction: (actionId: string) => void;
  onAddDailyDo: (stepId: string) => void;
}

const getStepStatusIcon = (status: string, progress: number) => {
  if (progress === 100) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (progress > 0) return <Circle className="h-5 w-5 text-amber-500 fill-amber-100" />;
  return <Circle className="h-5 w-5 text-gray-400" />;
};

const getProgressColor = (progress: number) => {
  if (progress >= 70) return "bg-green-500";
  if (progress >= 40) return "bg-amber-500"; 
  return "bg-blue-500";
};

export function SmallStepCard({ 
  step, 
  stepIndex, 
  onCompleteAction, 
  onEditAction, 
  onAddDailyDo 
}: SmallStepCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          {getStepStatusIcon(step.status, step.progress)}
          <span>Smaller Part {stepIndex + 1}: {step.title}</span>
          <Badge variant="outline" className="ml-auto">
            {step.progress}% Complete
          </Badge>
        </CardTitle>
        {step.progress > 0 && (
          <Progress 
            value={step.progress} 
            className="h-2"
            indicatorClassName={cn(getProgressColor(step.progress))}
          />
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Daily Do Actions */}
        {step.actions.length > 0 ? (
          <div className="space-y-3">
            {step.actions.map((action) => (
              <DailyDoAction
                key={action.id}
                action={action}
                onComplete={() => onCompleteAction(step.id, action.id)}
                onEdit={() => onEditAction(action.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No daily actions planned yet for this part</p>
          </div>
        )}
        
        {/* Add Daily Do Button */}
        <Button
          variant="outline"
          onClick={() => onAddDailyDo(step.id)}
          className="w-full border-dashed border-2 text-primary hover:bg-primary/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Daily Do
        </Button>
      </CardContent>
    </Card>
  );
}
