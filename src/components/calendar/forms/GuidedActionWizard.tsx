
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, HelpCircle, Lightbulb } from "lucide-react";
import { ActionBasicsStep } from "./wizard-steps/ActionBasicsStep";
import { ActionDetailsStep } from "./wizard-steps/ActionDetailsStep";
import { WatchersStep } from "./wizard-steps/WatchersStep";
import { ReviewStep } from "./wizard-steps/ReviewStep";
import { actionFormSchema, ActionFormValues, defaultActionValues } from "./actionFormSchema";
import { useDailyActions } from "@/hooks/use-daily-actions";
import { format } from "date-fns";

interface GuidedActionWizardProps {
  defaultTime?: string;
  goalId?: string;
  onSuccess?: () => void;
}

const WIZARD_STEPS = [
  { id: 1, title: "What & When", description: "Define your action and timing" },
  { id: 2, title: "Details & Goals", description: "Add context and link to goals" },
  { id: 3, title: "Support Team", description: "Choose who will support you" },
  { id: 4, title: "Review", description: "Confirm everything looks good" }
];

export function GuidedActionWizard({ defaultTime, goalId, onSuccess }: GuidedActionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { createAction, createGoal } = useDailyActions();
  
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      ...defaultActionValues,
      startTime: defaultTime || defaultActionValues.startTime,
      goalId: goalId || "none",
    },
  });

  const progress = (currentStep / WIZARD_STEPS.length) * 100;

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 1:
        return values.title && values.type && values.date && values.startTime;
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      case 4:
        return true;
      default:
        return false;
    }
  };

  async function onSubmit(values: ActionFormValues) {
    try {
      if (values.isGoal) {
        const goalCategory = values.type === 'therapy' ? 'health' : 
                           values.type === 'activity' ? 'personal' : 
                           values.type === 'cognitive' ? 'cognitive' :
                           values.type === 'social' ? 'social' :
                           values.type === 'mobility' ? 'mobility' : 'health';
                           
        await createGoal({
          title: values.title,
          description: values.notes || undefined,
          category: goalCategory,
          target_date: values.date ? new Date(values.date).toISOString().split('T')[0] : undefined
        });
      } else {
        const actionData = {
          title: values.title,
          description: values.notes || undefined,
          action_type: values.type === 'daily_win' ? 'daily_win' as const : 
                      values.goalId && values.goalId !== "none" ? 'goal_linked' as const : 
                      'regular' as const,
          date: values.date ? format(new Date(values.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          start_time: values.startTime || undefined,
          end_time: values.endTime || undefined,
          duration_minutes: values.duration || undefined,
          location: values.location || undefined,
          is_daily_win: values.type === 'daily_win',
          goal_id: values.goalId && values.goalId !== "none" ? values.goalId : undefined,
          difficulty_level: values.type === 'daily_win' ? 1 : 2,
          focus_area: values.type === 'daily_win' ? 'emotional' as const : undefined,
          watchers: values.watchers || [],
          recurrence_pattern: values.recurrencePattern !== 'none' ? values.recurrencePattern : undefined,
          recurrence_interval: values.recurrencePattern !== 'none' ? values.recurrenceInterval : undefined,
          recurrence_end_date: values.recurrenceEndDate || undefined,
          recurrence_count: values.recurrenceCount || undefined,
          recurrence_days_of_week: values.recurrenceDaysOfWeek?.length ? values.recurrenceDaysOfWeek : undefined
        };

        await createAction(actionData);
      }

      form.reset();
      
      if (values.recurrencePattern !== 'none' && !values.isGoal) {
        toast.success("Recurring Action Created! 🔄", {
          description: `"${values.title}" will repeat ${values.recurrencePattern}. Your support team will be notified.`,
          duration: 4000
        });
      } else {
        toast.success(values.isGoal ? "🎯 Goal Created!" : "✅ Action Scheduled!", {
          description: values.isGoal 
            ? `"${values.title}" is now part of your journey.`
            : `"${values.title}" has been added to your calendar. Your watchers will be notified.`,
          duration: 4000
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating action/goal:', error);
      toast.error('Failed to create action/goal');
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ActionBasicsStep />;
      case 2:
        return <ActionDetailsStep preselectedGoalId={goalId} />;
      case 3:
        return <WatchersStep />;
      case 4:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brain-base">
                  {WIZARD_STEPS[currentStep - 1].title}
                </h3>
                <p className="text-sm text-gray-600">
                  {WIZARD_STEPS[currentStep - 1].description}
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                Step {currentStep} of {WIZARD_STEPS.length}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between text-xs text-gray-500">
              {WIZARD_STEPS.map((step, index) => (
                <span 
                  key={step.id}
                  className={`${currentStep >= step.id ? 'text-memory-emerald-600 font-medium' : ''}`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-memory-emerald-200/50">
            <CardHeader className="bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 border-b border-memory-emerald-200/30">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-memory-emerald-600" />
                <CardTitle className="text-memory-emerald-800">
                  Let's make this brain-friendly
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < WIZARD_STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !canProceed()}
                className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600"
              >
                {form.formState.isSubmitting ? "Creating..." : "Create Action"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
